package com.rentalshop.backend.contract.service.impl;

import com.rentalshop.backend.contract.service.ContractService;
import com.rentalshop.backend.contract.service.PaymentGatewayService;
import com.rentalshop.backend.contract.service.ThirdPartyLogisticsService;
import com.rentalshop.backend.product.service.ProductItemStateService;
import com.rentalshop.backend.product.entity.ProductItem;
import com.rentalshop.backend.contract.enums.PaymentType;
import com.rentalshop.backend.contract.enums.EscrowStatus;
import com.rentalshop.backend.contract.entity.Payment;
import com.rentalshop.backend.product.enums.ItemStatus;
import com.rentalshop.backend.customer.entity.Customer;
import com.rentalshop.backend.customer.enums.CustomerTier;
import com.rentalshop.backend.contract.enums.ContractStatus;
import com.rentalshop.backend.contract.entity.ContractDetail;
import com.rentalshop.backend.contract.entity.Contract;
import com.rentalshop.backend.contract.dto.response.ContractResponse;
import com.rentalshop.backend.contract.dto.response.ContractDetailResponse;
import com.rentalshop.backend.contract.dto.request.CreateContractRequest;
import com.rentalshop.backend.contract.dto.request.ReturnItemsRequest;

import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.contract.repository.ContractRepository;
import com.rentalshop.backend.customer.repository.CustomerRepository;
import com.rentalshop.backend.contract.repository.PaymentRepository;
import com.rentalshop.backend.product.repository.ProductItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {
    private final ContractRepository contractRepository;
    private final CustomerRepository customerRepository;
    private final ProductItemRepository productItemRepository;
    private final PaymentRepository paymentRepository;
    private final ProductItemStateService stateService;
    private final PaymentGatewayService paymentGatewayService;
    private final ThirdPartyLogisticsService logisticsService;

    @Transactional
    public ContractResponse createContract(CreateContractRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));

        List<ProductItem> items = productItemRepository.findByIdsWithLock(request.getItemIds());
        if (items.size() != request.getItemIds().size()) {
            throw new BadRequestException("Một số vật phẩm không tồn tại");
        }

        double totalRentPricePerDay = 0.0;
        for (ProductItem item : items) {
            if (item.getStatus() != ItemStatus.AVAILABLE) {
                throw new BadRequestException("Vật phẩm " + item.getSkuCode() + " không ở trạng thái AVAILABLE");
            }
            totalRentPricePerDay += item.getProduct().getRentPrice();
        }

        long days = Duration.between(request.getStartDate(), request.getEndDate()).toDays();
        if (days == 0) days = 1;

        double totalRentFee = totalRentPricePerDay * days;
        double depositAmount = totalRentFee * 0.3;

        Contract contract = Contract.builder()
                .customer(customer)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalRentFee(totalRentFee)
                .depositAmount(depositAmount)
                .penaltyFee(0.0)
                .compensationFee(0.0)
                .paymentMethod(request.getPaymentMethod())
                .status(ContractStatus.ACTIVE)
                .escrowStatus(EscrowStatus.HELD)
                .build();

        List<ContractDetail> details = items.stream()
                .map(item -> ContractDetail.builder()
                        .contract(contract)
                        .item(item)
                        .isReturned(false)
                        .isDamaged(false)
                        .build())
                .collect(Collectors.toList());

        contract.setDetails(details);
        Contract savedContract = contractRepository.save(contract);

        // --- Zero-Sum Ledger: Rent Fee ---
        String trxRent = UUID.randomUUID().toString();
        recordTransaction(savedContract, PaymentType.RENT_FEE, totalRentFee,
                "CUST_" + customer.getId(), "SYS_RENT", trxRent);

        // --- V2.0 Rule 5: Pre-Auth Fallback ---
        // VIP (C4) with duration <= 7 days → Pre-Authorization Hold
        // VIP (C4) with duration > 7 days  → Fallback to 30% cash deposit (same as C2/STANDARD)
        // All other tiers                  → 30% cash deposit
        if (customer.getTier() == CustomerTier.VIP && days <= 7) {
            String holdTrx = paymentGatewayService.authorizeHold(depositAmount);
            log.info("VIP Pre-Auth Hold created: {} for contract {}", holdTrx, savedContract.getId());
        } else {
            if (customer.getTier() == CustomerTier.VIP && days > 7) {
                log.warn("VIP customer {} rental duration {}d > 7d. Downgrading to C2 cash deposit (30%).",
                        customer.getId(), days);
            }
            String trxDeposit = UUID.randomUUID().toString();
            recordTransaction(savedContract, PaymentType.DEPOSIT, depositAmount,
                    "CUST_" + customer.getId(), "SYS_DEP", trxDeposit);
        }

        // Cập nhật trạng thái items
        for (ProductItem item : items) {
            stateService.transitionStatus(item.getId(), ItemStatus.RENTED);
        }

        return mapToDto(savedContract);
    }

    @Transactional
    public ContractResponse returnItems(Long id, ReturnItemsRequest request) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));

        if (contract.getStatus() != ContractStatus.ACTIVE && contract.getStatus() != ContractStatus.OVERDUE) {
            throw new BadRequestException("Hợp đồng không ở trạng thái có thể trả hàng");
        }

        List<Long> returnedIds = request.getReturnedItemIds() != null ? request.getReturnedItemIds() : new ArrayList<>();
        List<Long> damagedIds = request.getDamagedItemIds() != null ? request.getDamagedItemIds() : new ArrayList<>();

        long daysLate = 0;
        if (request.getActualReturnDate().isAfter(contract.getEndDate())) {
            daysLate = Duration.between(contract.getEndDate(), request.getActualReturnDate()).toDays();
            if (daysLate == 0) daysLate = 1;
        }

        double newPenalty = Math.min(contract.getTotalRentFee(), contract.getTotalRentFee() * 0.05 * daysLate);
        contract.setPenaltyFee(contract.getPenaltyFee() + newPenalty);
        
        if (request.getCompensationFee() != null) {
            contract.setCompensationFee(contract.getCompensationFee() + request.getCompensationFee());
        }

        boolean allReturned = true;

        for (ContractDetail detail : contract.getDetails()) {
            Long itemId = detail.getItem().getId();
            
            if (!detail.getIsReturned()) {
                if (damagedIds.contains(itemId)) {
                    detail.setIsReturned(true);
                    detail.setIsDamaged(true);
                    detail.setActualReturnDate(request.getActualReturnDate());
                    stateService.transitionStatus(itemId, ItemStatus.DAMAGED);
                } else if (returnedIds.contains(itemId)) {
                    detail.setIsReturned(true);
                    detail.setIsDamaged(false);
                    detail.setActualReturnDate(request.getActualReturnDate());
                    stateService.transitionStatus(itemId, ItemStatus.AVAILABLE);
                } else {
                    allReturned = false;
                }
            }
        }

        // --- V2.0 Rule 7: 3PL Fallback ---
        try {
            String trackingNumber = logisticsService.createReturnShipment(contract.getId());
            log.info("3PL return shipment created: {} for contract {}", trackingNumber, contract.getId());
        } catch (Exception e) {
            String manualCode = logisticsService.generateManualReturnCode();
            contract.setManualReturnCode(manualCode);
            log.warn("3PL API failed for contract {}. Manual return code issued: {}", contract.getId(), manualCode);
        }

        if (allReturned) {
            // --- V2.0 Rule 2: State Separation ---
            // Contract status → COMPLETED, but Escrow remains HELD.
            // Escrow release happens separately (after dispute window or admin action).
            contract.setStatus(ContractStatus.COMPLETED);
            // DO NOT set escrowStatus = RELEASED here.

            double totalDeduction = contract.getPenaltyFee() + contract.getCompensationFee();
            
            String trxRefund = UUID.randomUUID().toString();
            if (totalDeduction < contract.getDepositAmount()) {
                recordTransaction(contract, PaymentType.REFUND, contract.getDepositAmount() - totalDeduction,
                        "SYS_DEP", "CUST_" + contract.getCustomer().getId(), trxRefund);
            } else {
                recordTransaction(contract, PaymentType.DEBT, totalDeduction - contract.getDepositAmount(),
                        "CUST_" + contract.getCustomer().getId(), "SYS_DEBT", trxRefund);
            }
        }

        return mapToDto(contractRepository.save(contract));
    }

    @Transactional
    public ContractResponse cancelContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));

        if (contract.getStatus() == ContractStatus.COMPLETED || contract.getStatus() == ContractStatus.CANCELED) {
            throw new BadRequestException("Không thể hủy hợp đồng này");
        }

        if (contract.getStatus() == ContractStatus.PENDING) {
            contract.setStatus(ContractStatus.CANCELED);
            contract.setEscrowStatus(EscrowStatus.RELEASED);
            for (ContractDetail detail : contract.getDetails()) {
                stateService.transitionStatus(detail.getItem().getId(), ItemStatus.AVAILABLE);
            }
        } else if (contract.getStatus() == ContractStatus.ACTIVE) {
            contract.setStatus(ContractStatus.CANCELED);
            
            long hoursSinceCreation = Duration.between(contract.getStartDate(), LocalDateTime.now()).toHours();
            
            String trxCancel = UUID.randomUUID().toString();
            if (hoursSinceCreation >= 24) {
                recordTransaction(contract, PaymentType.REFUND, contract.getTotalRentFee() + contract.getDepositAmount(),
                        "SYS_RENT", "CUST_" + contract.getCustomer().getId(), trxCancel);
                contract.setEscrowStatus(EscrowStatus.RELEASED);
            } else {
                recordTransaction(contract, PaymentType.REFUND, contract.getTotalRentFee(),
                        "SYS_RENT", "CUST_" + contract.getCustomer().getId(), trxCancel);
                String trxPenalty = UUID.randomUUID().toString();
                recordTransaction(contract, PaymentType.PENALTY, contract.getDepositAmount(),
                        "CUST_" + contract.getCustomer().getId(), "SYS_PENALTY", trxPenalty);
                contract.setEscrowStatus(EscrowStatus.RELEASED);
            }

            for (ContractDetail detail : contract.getDetails()) {
                if (!detail.getIsReturned()) {
                    stateService.transitionStatus(detail.getItem().getId(), ItemStatus.AVAILABLE);
                }
            }
        }

        return mapToDto(contractRepository.save(contract));
    }

    public Page<ContractResponse> getContracts(Pageable pageable) {
        return contractRepository.findAll(pageable).map(this::mapToDto);
    }

    public ContractResponse getContractById(Long id) {
        return contractRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));
    }

    @Transactional
    public ContractResponse extendContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));
                
        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new BadRequestException("Hợp đồng không ở trạng thái hoạt động");
        }
        
        contract.setEndDate(contract.getEndDate().plusHours(12));
        return mapToDto(contractRepository.save(contract));
    }

    private ContractResponse mapToDto(Contract contract) {
        return ContractResponse.builder()
                .id(contract.getId())
                .customerId(contract.getCustomer().getId())
                .customerName(contract.getCustomer().getFullName())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .totalRentFee(contract.getTotalRentFee())
                .depositAmount(contract.getDepositAmount())
                .penaltyFee(contract.getPenaltyFee())
                .compensationFee(contract.getCompensationFee())
                .paymentMethod(contract.getPaymentMethod())
                .status(contract.getStatus())
                .escrowStatus(contract.getEscrowStatus())
                .manualReturnCode(contract.getManualReturnCode())
                .details(contract.getDetails() != null ? contract.getDetails().stream()
                        .map(d -> ContractDetailResponse.builder()
                                .id(d.getId())
                                .itemId(d.getItem().getId())
                                .skuCode(d.getItem().getSkuCode())
                                .actualReturnDate(d.getActualReturnDate())
                                .isReturned(d.getIsReturned())
                                .isDamaged(d.getIsDamaged())
                                .build())
                        .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }

    /**
     * Records a double-entry transaction (APPEND-ONLY).
     * After recording, validates zero-sum invariant: SUM(debit) - SUM(credit) == 0.
     */
    private void recordTransaction(Contract contract, PaymentType type, Double amount,
                                   String debitAccountId, String creditAccountId, String transactionId) {
        if (amount == null || amount <= 0) return;

        paymentRepository.save(Payment.builder()
                .contract(contract)
                .transactionId(transactionId)
                .accountId(debitAccountId)
                .paymentType(type)
                .debitAmount(amount)
                .creditAmount(0.0)
                .build());

        paymentRepository.save(Payment.builder()
                .contract(contract)
                .transactionId(transactionId)
                .accountId(creditAccountId)
                .paymentType(type)
                .debitAmount(0.0)
                .creditAmount(amount)
                .build());

        // --- V2.0 Rule 1: Enforce zero-sum invariant ---
        paymentRepository.flush();
        Double balance = paymentRepository.getTransactionBalance(transactionId);
        if (balance != null && Math.abs(balance) > 0.001) {
            throw new IllegalStateException(
                    "LEDGER VIOLATION: Transaction " + transactionId + " is not zero-sum. Balance: " + balance);
        }
    }
}
