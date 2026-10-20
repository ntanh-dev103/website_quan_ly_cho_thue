package com.rentalshop.backend.merchant.service.impl;

import com.rentalshop.backend.auth.entity.User;
import com.rentalshop.backend.auth.repository.UserRepository;
import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.contract.dto.response.ContractResponse;
import com.rentalshop.backend.contract.entity.Contract;
import com.rentalshop.backend.contract.entity.ContractDetail;
import com.rentalshop.backend.contract.enums.ContractStatus;
import com.rentalshop.backend.contract.enums.EscrowStatus;
import com.rentalshop.backend.contract.repository.ContractRepository;
import com.rentalshop.backend.merchant.dto.response.MerchantRevenueStatsResponse;
import com.rentalshop.backend.merchant.service.MerchantPortalService;
import com.rentalshop.backend.product.entity.ProductItem;
import com.rentalshop.backend.product.enums.ItemStatus;
import com.rentalshop.backend.product.repository.ProductItemRepository;
import com.rentalshop.backend.product.repository.ProductRepository;
import com.rentalshop.backend.product.service.ProductItemStateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MerchantPortalServiceImpl implements MerchantPortalService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductItemRepository productItemRepository;
    private final ContractRepository contractRepository;
    private final ProductItemStateService stateService;

    @Override
    public MerchantRevenueStatsResponse getMerchantStats(Long merchantId) {
        String tier = "M1";
        if (merchantId != null) {
            User merchant = userRepository.findById(merchantId).orElse(null);
            if (merchant != null && merchant.getMerchantTier() != null) {
                tier = merchant.getMerchantTier().toUpperCase();
            }
        }

        double commissionRate;
        int productLimit;
        switch (tier) {
            case "M4":
                commissionRate = 0.02;
                productLimit = -1;
                break;
            case "M3":
                commissionRate = 0.05;
                productLimit = -1;
                break;
            case "M2":
                commissionRate = 0.10;
                productLimit = -1;
                break;
            case "M1":
            default:
                tier = "M1";
                commissionRate = 0.15;
                productLimit = 20;
                break;
        }

        Long totalItems = productItemRepository.countByMerchantId(merchantId);
        Long availableItems = productItemRepository.countByMerchantIdAndStatus(merchantId, ItemStatus.AVAILABLE);
        Long maintenanceItems = productItemRepository.countByMerchantIdAndStatus(merchantId, ItemStatus.MAINTENANCE);
        Long rentedItems = productItemRepository.countByMerchantIdAndStatus(merchantId, ItemStatus.RENTED);
        Long productCount = productRepository.countByMerchantId(merchantId);

        List<Contract> merchantContracts = contractRepository.findAllByMerchantId(merchantId);
        double grossRevenue = 0.0;
        int activeRentals = 0;

        for (Contract c : merchantContracts) {
            if (c.getStatus() == ContractStatus.COMPLETED || c.getStatus() == ContractStatus.ACTIVE || c.getStatus() == ContractStatus.RETURNED) {
                grossRevenue += (c.getTotalRentFee() != null ? c.getTotalRentFee() : 0.0);
            }
            if (c.getStatus() == ContractStatus.ACTIVE || c.getStatus() == ContractStatus.OVERDUE) {
                activeRentals++;
            }
        }

        double platformCommission = Math.round(grossRevenue * commissionRate);
        double netRevenue = grossRevenue - platformCommission;

        double occupancyRate = 0.0;
        if (totalItems != null && totalItems > 0 && rentedItems != null) {
            occupancyRate = Math.round(((double) rentedItems / totalItems) * 1000.0) / 10.0;
        }

        return MerchantRevenueStatsResponse.builder()
                .grossRevenue(grossRevenue)
                .platformCommission(platformCommission)
                .netRevenue(netRevenue)
                .activeRentalsCount(activeRentals)
                .totalItemsCount(totalItems != null ? totalItems.intValue() : 0)
                .availableItemsCount(availableItems != null ? availableItems.intValue() : 0)
                .maintenanceItemsCount(maintenanceItems != null ? maintenanceItems.intValue() : 0)
                .occupancyRate(occupancyRate)
                .merchantTier(tier)
                .commissionRate(commissionRate)
                .productCount(productCount != null ? productCount.intValue() : 0)
                .productLimit(productLimit)
                .build();
    }

    @Override
    public Page<ContractResponse> getMerchantContracts(Long merchantId, ContractStatus status, Pageable pageable) {
        return contractRepository.findByMerchantIdAndStatus(merchantId, status, pageable)
                .map(this::mapToContractResponse);
    }

    @Override
    @Transactional
    public ContractResponse approveContract(Long contractId, Long merchantId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng #" + contractId));

        if (contract.getStatus() != ContractStatus.PENDING_DEPOSIT && contract.getStatus() != ContractStatus.DRAFT && contract.getStatus() != ContractStatus.PENDING) {
            throw new BadRequestException("Hợp đồng này không ở trạng thái chờ duyệt");
        }

        contract.setStatus(ContractStatus.ACTIVE);
        contract.setEscrowStatus(EscrowStatus.HELD);

        if (contract.getDetails() != null) {
            for (ContractDetail detail : contract.getDetails()) {
                if (detail.getItem() != null) {
                    stateService.transitionStatus(detail.getItem().getId(), ItemStatus.RENTED);
                }
            }
        }

        return mapToContractResponse(contractRepository.save(contract));
    }

    @Override
    @Transactional
    public ContractResponse rejectContract(Long contractId, Long merchantId, String reason) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng #" + contractId));

        if (contract.getStatus() == ContractStatus.COMPLETED || contract.getStatus() == ContractStatus.CANCELED) {
            throw new BadRequestException("Không thể từ chối hợp đồng đã kết thúc");
        }

        contract.setStatus(ContractStatus.CANCELED);
        contract.setEscrowStatus(EscrowStatus.RELEASED);
        if (reason != null && !reason.isBlank()) {
            contract.setDamageAssessmentNotes("Merchant từ chối: " + reason);
        }

        if (contract.getDetails() != null) {
            for (ContractDetail detail : contract.getDetails()) {
                if (detail.getItem() != null) {
                    stateService.transitionStatus(detail.getItem().getId(), ItemStatus.AVAILABLE);
                }
            }
        }

        return mapToContractResponse(contractRepository.save(contract));
    }

    private ContractResponse mapToContractResponse(Contract contract) {
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
                .customerId(contract.getCustomer() != null ? contract.getCustomer().getId() : null)
                .customerName(contract.getCustomer() != null ? contract.getCustomer().getFullName() : "Khách hàng")
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .totalRentFee(contract.getTotalRentFee())
                .depositAmount(contract.getDepositAmount())
                .penaltyFee(contract.getPenaltyFee())
                .compensationFee(contract.getCompensationFee())
                .refundAmount(contract.getRefundAmount())
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
                .build();
    }
}
