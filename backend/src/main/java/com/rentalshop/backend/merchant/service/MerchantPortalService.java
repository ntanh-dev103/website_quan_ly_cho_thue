package com.rentalshop.backend.merchant.service;

import com.rentalshop.backend.contract.dto.response.ContractResponse;
import com.rentalshop.backend.contract.enums.ContractStatus;
import com.rentalshop.backend.merchant.dto.response.MerchantRevenueStatsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MerchantPortalService {
    MerchantRevenueStatsResponse getMerchantStats(Long merchantId);
    Page<ContractResponse> getMerchantContracts(Long merchantId, ContractStatus status, Pageable pageable);
    ContractResponse approveContract(Long contractId, Long merchantId);
    ContractResponse rejectContract(Long contractId, Long merchantId, String reason);
}
