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
import com.rentalshop.backend.contract.dto.request.DamageAssessmentRequest;
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
    private final com.rentalshop.backend.product.repository.ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final ProductItemStateService stateService;
    private final PaymentGatewayService paymentGatewayService;
    private final ThirdPartyLogisticsService logisticsService;

    @Transactional
    public ContractResponse createContract(CreateContractRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId()).orElse(null);
        }
        if (customer == null) {
            List<Customer> allCustomers = customerRepository.findAll();
            if (!allCustomers.isEmpty()) {
                customer = allCustomers.get(0);
            } else {
                customer = customerRepository.save(Customer.builder()
                        .fullName("Khách hàng mặc định")
                        .phone("090" + (1000000 + (int)(Math.random() * 8999999)))
                        .cccd("001202" + (100000 + (int)(Math.random() * 899999)))
                        .email("customer@rentnest.vn")
                        .address("Hà Nội, Việt Nam")
                        .tier(CustomerTier.STANDARD)
                        .totalSpent(0.0)
                        .isDeleted(false)
                        .build());
            }
        }

        List<ProductItem> items = new ArrayList<>();
        if (request.getItemIds() != null && !request.getItemIds().isEmpty()) {
            items = productItemRepository.findByIdsWithLock(request.getItemIds());
            if (items.size() != request.getItemIds().size()) {
                throw new BadRequestException("Một số vật phẩm không tồn tại");
            }
        } else if (request.getProductId() != null) {
            com.rentalshop.backend.product.entity.Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm ID: " + request.getProductId()));
            
            List<ProductItem> existingItems = productItemRepository.findByProductId(product.getId());
            if (existingItems.isEmpty()) {
                // Auto seed 3 items for this product
                for (int i = 1; i <= 3; i++) {
                    ProductItem pi = ProductItem.builder()
                            .product(product)
                            .skuCode("SKU-" + product.getId() + "-" + String.format("%03d", i))
                            .status(ItemStatus.AVAILABLE)
                            .notes("Kho sẵn sàng")
                            .build();
                    existingItems.add(productItemRepository.save(pi));
                }
            }
            int qty = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;
            List<ProductItem> availables = existingItems.stream()
                    .filter(pi -> pi.getStatus() == ItemStatus.AVAILABLE)
                    .limit(qty)
                    .collect(Collectors.toList());
            if (availables.isEmpty()) {
                // Use first item for contract
                availables.add(existingItems.get(0));
            }
            items = availables;
        } else {
            throw new BadRequestException("Vui lòng cung cấp productId hoặc itemIds");
        }

        double totalRentPricePerDay = 0.0;
        double totalItemMarketValue = 0.0;
        for (ProductItem item : items) {
            totalRentPricePerDay += item.getProduct().getRentPrice();
            double depPrice = item.getProduct().getDepositPrice() != null ? item.getProduct().getDepositPrice() : item.getProduct().getRentPrice() * 5;
            totalItemMarketValue += depPrice;
        }

        long days = Duration.between(request.getStartDate(), request.getEndDate()).toDays();
        if (days <= 0) days = 1;

        double totalRentFee = totalRentPricePerDay * days;

        // Dynamic Deposit Rate based on Customer Tier:
        // C1: 40%, C2: 30%, C3: 15%, C4: 0%
        double depositRate = 0.40;
        String tierStr = request.getCustomerTier() != null ? request.getCustomerTier().toUpperCase() : "";
        if ("C4".equals(tierStr) || customer.getTier() == CustomerTier.VIP) {
            depositRate = 0.0;
        } else if ("C3".equals(tierStr)) {
            depositRate = 0.15;
        } else if ("C2".equals(tierStr)) {
            depositRate = 0.30;
        } else {
            depositRate = 0.40;
        }

        double depositAmount = Math.round(totalItemMarketValue * depositRate);
        double deliveryFee = request.getDeliveryFee() != null ? request.getDeliveryFee() : 0.0;

        Contract contract = Contract.builder()
                .customer(customer)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalRentFee(totalRentFee)
                .depositAmount(depositAmount)
                .deliveryAddress(request.getDeliveryAddress() != null ? request.getDeliveryAddress() : customer.getAddress())
                .deliveryFee(deliveryFee)
                .penaltyFee(0.0)
                .compensationFee(0.0)
                .refundAmount(0.0)
                .paymentMethod(request.getPaymentMethod())
                .status(ContractStatus.PENDING_DEPOSIT)
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

        return mapToDto(savedContract);
    }


    @Transactional
    public ContractResponse depositContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng ID: " + id));

        if (contract.getStatus() != ContractStatus.PENDING_DEPOSIT && contract.getStatus() != ContractStatus.DRAFT && contract.getStatus() != ContractStatus.PENDING) {
            throw new BadRequestException("Hợp đồng không ở trạng thái chờ đặt cọc (hiện tại: " + contract.getStatus() + ")");
        }

        contract.setStatus(ContractStatus.ACTIVE);

        // --- Zero-Sum Ledger: Rent Fee ---
        String trxRent = UUID.randomUUID().toString();
        recordTransaction(contract, PaymentType.RENT_FEE, contract.getTotalRentFee(),
                "CUST_" + contract.getCustomer().getId(), "SYS_RENT", trxRent);

        // --- Ledger: Deposit Amount ---
        if (contract.getDepositAmount() > 0) {
            String trxDeposit = UUID.randomUUID().toString();
            recordTransaction(contract, PaymentType.DEPOSIT, contract.getDepositAmount(),
                    "CUST_" + contract.getCustomer().getId(), "SYS_DEP", trxDeposit);
        }

        // Cập nhật trạng thái các items sang RENTED
        if (contract.getDetails() != null) {
            for (ContractDetail detail : contract.getDetails()) {
                stateService.transitionStatus(detail.getItem().getId(), ItemStatus.RENTED);
            }
        }

        return mapToDto(contractRepository.save(contract));
    }

    @Transactional
    public ContractResponse handoverContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng ID: " + id));

        if (contract.getStatus() == ContractStatus.PENDING_DEPOSIT || contract.getStatus() == ContractStatus.PENDING) {
            return depositContract(id);
        }

        contract.setStatus(ContractStatus.ACTIVE);
        return mapToDto(contractRepository.save(contract));
    }

    @Transactional
    public ContractResponse returnItems(Long id, ReturnItemsRequest request) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));

        if (contract.getStatus() != ContractStatus.ACTIVE && contract.getStatus() != ContractStatus.OVERDUE) {
            throw new BadRequestException("Hợp đồng không ở trạng thái có thể trả hàng (hiện tại: " + contract.getStatus() + ")");
        }

        LocalDateTime returnDate = request.getActualReturnDate() != null ? request.getActualReturnDate() : LocalDateTime.now();

        List<Long> returnedIds = request.getReturnedItemIds() != null ? request.getReturnedItemIds() : new ArrayList<>();
        List<Long> damagedIds = request.getDamagedItemIds() != null ? request.getDamagedItemIds() : new ArrayList<>();

        if (contract.getDetails() != null) {
            for (ContractDetail detail : contract.getDetails()) {
                Long itemId = detail.getItem().getId();
                if (returnedIds.isEmpty() || returnedIds.contains(itemId) || damagedIds.contains(itemId)) {
                    detail.setIsReturned(true);
                    detail.setActualReturnDate(returnDate);
                    if (damagedIds.contains(itemId)) {
                        detail.setIsDamaged(true);
                        stateService.transitionStatus(itemId, ItemStatus.DAMAGED);
                    }
                }
            }
        }

        // Chuyển sang trạng thái RETURNED để chờ lập biên bản thẩm định hoặc hoàn tất
        contract.setStatus(ContractStatus.RETURNED);

        // --- V2.0 Rule 7: 3PL Fallback ---
        try {
            String trackingNumber = logisticsService.createReturnShipment(contract.getId());
            log.info("3PL return shipment created: {} for contract {}", trackingNumber, contract.getId());
        } catch (Exception e) {
            String manualCode = logisticsService.generateManualReturnCode();
            contract.setManualReturnCode(manualCode);
            log.warn("3PL API failed for contract {}. Manual return code issued: {}", contract.getId(), manualCode);
        }

        return mapToDto(contractRepository.save(contract));
    }

    @Transactional
    public ContractResponse assessDamage(Long id, DamageAssessmentRequest request) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));

        LocalDateTime returnDate = request.getActualReturnDate() != null ? request.getActualReturnDate() : LocalDateTime.now();

        long daysLate = 0;
        if (returnDate.isAfter(contract.getEndDate())) {
            daysLate = Duration.between(contract.getEndDate(), returnDate).toDays();
            if (daysLate == 0) daysLate = 1;
        }

        double newPenalty = Math.min(contract.getTotalRentFee(), contract.getTotalRentFee() * 0.05 * daysLate);
        contract.setPenaltyFee(contract.getPenaltyFee() + newPenalty);

        double compensation = request.getCompensationFee() != null ? request.getCompensationFee() : 0.0;
        contract.setCompensationFee(compensation);
        if (request.getNotes() != null) {
            contract.setDamageAssessmentNotes(request.getNotes());
        }

        List<Long> damagedIds = request.getDamagedItemIds() != null ? request.getDamagedItemIds() : new ArrayList<>();
        List<Long> returnedIds = request.getReturnedItemIds() != null ? request.getReturnedItemIds() : new ArrayList<>();

        if (contract.getDetails() != null) {
            for (ContractDetail detail : contract.getDetails()) {
                Long itemId = detail.getItem().getId();
                detail.setIsReturned(true);
                detail.setActualReturnDate(returnDate);
                if (damagedIds.contains(itemId)) {
                    detail.setIsDamaged(true);
                    stateService.transitionStatus(itemId, ItemStatus.DAMAGED);
                } else {
                    detail.setIsDamaged(false);
                    stateService.transitionStatus(itemId, ItemStatus.AVAILABLE);
                }
            }
        }

        // --- Settlement Invariant: Trừ tiền phạt hư hỏng từ tiền cọc của khách, hoàn trả số dư cọc còn lại ---
        double totalDeduction = contract.getPenaltyFee() + contract.getCompensationFee();
        String trxRefund = UUID.randomUUID().toString();

        if (contract.getDepositAmount() >= totalDeduction) {
            double refund = contract.getDepositAmount() - totalDeduction;
            contract.setRefundAmount(refund);
            if (refund > 0) {
                recordTransaction(contract, PaymentType.REFUND, refund,
                        "SYS_DEP", "CUST_" + contract.getCustomer().getId(), trxRefund);
            }
            if (totalDeduction > 0) {
                String trxComp = UUID.randomUUID().toString();
                recordTransaction(contract, PaymentType.PENALTY, totalDeduction,
                        "CUST_" + contract.getCustomer().getId(), "SYS_PENALTY", trxComp);
            }
        } else {
            double debt = totalDeduction - contract.getDepositAmount();
            contract.setRefundAmount(0.0);
            recordTransaction(contract, PaymentType.DEBT, debt,
                    "CUST_" + contract.getCustomer().getId(), "SYS_DEBT", trxRefund);
        }

        // --- V2.0 Rule 9: Tính toán hoa hồng sàn dựa trên Merchant Tier (M1: 15%, M2: 10%, M3: 5%, M4: 2%) ---
        String merchantTier = "M1";
        if (contract.getDetails() != null && !contract.getDetails().isEmpty()) {
            ContractDetail firstDetail = contract.getDetails().get(0);
            if (firstDetail.getItem() != null && firstDetail.getItem().getProduct() != null 
                    && firstDetail.getItem().getProduct().getMerchant() != null) {
                com.rentalshop.backend.auth.entity.User merchant = firstDetail.getItem().getProduct().getMerchant();
                if (merchant.getMerchantTier() != null) {
                    merchantTier = merchant.getMerchantTier().toUpperCase();
                }
            }
        }
        double commissionRate = switch (merchantTier) {
            case "M4" -> 0.02;
            case "M3" -> 0.05;
            case "M2" -> 0.10;
            default -> 0.15;
        };
        double commissionFee = Math.round(contract.getTotalRentFee() * commissionRate);
        double netMerchantPayout = contract.getTotalRentFee() - commissionFee;
        log.info("Contract #{} settlement completed. Merchant tier: {}, Commission rate: {}%, Platform commission: {}, Net payout: {}",
                contract.getId(), merchantTier, (commissionRate * 100), commissionFee, netMerchantPayout);

        contract.setStatus(ContractStatus.COMPLETED);
        contract.setEscrowStatus(EscrowStatus.RELEASED);

        return mapToDto(contractRepository.save(contract));
    }

    @Transactional
    public ContractResponse cancelContract(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));

        if (contract.getStatus() == ContractStatus.COMPLETED || contract.getStatus() == ContractStatus.CANCELED) {
            throw new BadRequestException("Không thể hủy hợp đồng này");
        }

        if (contract.getStatus() == ContractStatus.PENDING || contract.getStatus() == ContractStatus.PENDING_DEPOSIT || contract.getStatus() == ContractStatus.DRAFT) {
            contract.setStatus(ContractStatus.CANCELED);
            contract.setEscrowStatus(EscrowStatus.RELEASED);
            if (contract.getDetails() != null) {
                for (ContractDetail detail : contract.getDetails()) {
                    stateService.transitionStatus(detail.getItem().getId(), ItemStatus.AVAILABLE);
                }
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

            if (contract.getDetails() != null) {
                for (ContractDetail detail : contract.getDetails()) {
                    if (!detail.getIsReturned()) {
                        stateService.transitionStatus(detail.getItem().getId(), ItemStatus.AVAILABLE);
                    }
                }
            }
        }

        return mapToDto(contractRepository.save(contract));
    }

    public Page<ContractResponse> getContracts(Pageable pageable) {
        return contractRepository.findAll(pageable).map(this::mapToDto);
    }

    public Page<ContractResponse> getContracts(Long customerId, ContractStatus status, Pageable pageable) {
        return contractRepository.findByCustomerIdAndStatus(customerId, status, pageable).map(this::mapToDto);
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
        Long productId = null;
        String productName = "Thiết bị thuê";
        String productImage = null;

        if (contract.getDetails() != null && !contract.getDetails().isEmpty()) {
            ContractDetail firstDetail = contract.getDetails().get(0);
            if (firstDetail.getItem() != null && firstDetail.getItem().getProduct() != null) {
                productId = firstDetail.getItem().getProduct().getId();
                productName = firstDetail.getItem().getProduct().getName();
                productImage = firstDetail.getItem().getProduct().getThumbnail();
            }
        }

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
                .productId(productId)
                .productName(productName)
                .productImage(productImage)
                .deliveryAddress(contract.getDeliveryAddress())
                .deliveryFee(contract.getDeliveryFee())
                .damageAssessmentNotes(contract.getDamageAssessmentNotes())
                .refundAmount(contract.getRefundAmount())
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
