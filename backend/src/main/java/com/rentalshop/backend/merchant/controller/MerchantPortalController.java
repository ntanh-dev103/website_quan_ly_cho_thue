package com.rentalshop.backend.merchant.controller;

import com.rentalshop.backend.common.response.ApiResponse;
import com.rentalshop.backend.contract.dto.response.ContractResponse;
import com.rentalshop.backend.contract.enums.ContractStatus;
import com.rentalshop.backend.merchant.dto.response.MerchantRevenueStatsResponse;
import com.rentalshop.backend.merchant.service.MerchantPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/merchant")
@RequiredArgsConstructor
public class MerchantPortalController {

    private final MerchantPortalService merchantPortalService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<MerchantRevenueStatsResponse>> getStats(
            @RequestParam(required = false) Long merchantId) {
        return ResponseEntity.ok(ApiResponse.success(merchantPortalService.getMerchantStats(merchantId)));
    }

    @GetMapping("/contracts")
    public ResponseEntity<ApiResponse<Page<ContractResponse>>> getMerchantContracts(
            @RequestParam(required = false) Long merchantId,
            @RequestParam(required = false) ContractStatus status,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(merchantPortalService.getMerchantContracts(merchantId, status, pageable)));
    }

    @PutMapping("/contracts/{id}/approve")
    public ResponseEntity<ApiResponse<ContractResponse>> approveContract(
            @PathVariable Long id,
            @RequestParam(required = false) Long merchantId) {
        return ResponseEntity.ok(ApiResponse.success(merchantPortalService.approveContract(id, merchantId)));
    }

    @PutMapping("/contracts/{id}/reject")
    public ResponseEntity<ApiResponse<ContractResponse>> rejectContract(
            @PathVariable Long id,
            @RequestParam(required = false) Long merchantId,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null) ? body.get("reason") : null;
        return ResponseEntity.ok(ApiResponse.success(merchantPortalService.rejectContract(id, merchantId, reason)));
    }
}
