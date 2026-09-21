package com.rentalshop.backend.contract.controller;

import com.rentalshop.backend.common.response.ApiResponse;
import com.rentalshop.backend.contract.dto.response.ContractResponse;
import com.rentalshop.backend.contract.service.DisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class DisputeController {

    private final DisputeService disputeService;

    @PostMapping("/{id}/dispute")
    public ResponseEntity<ApiResponse<ContractResponse>> openDispute(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(disputeService.openDispute(id)));
    }

    @PostMapping("/{id}/arbitrate")
    public ResponseEntity<ApiResponse<ContractResponse>> arbitrate(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(disputeService.arbitrate(id)));
    }

    @PostMapping("/{id}/counter-appeal")
    public ResponseEntity<ApiResponse<ContractResponse>> counterAppeal(
            @PathVariable Long id,
            @RequestParam(required = false) String evidence) {
        return ResponseEntity.ok(ApiResponse.success(disputeService.counterAppeal(id, evidence)));
    }

    @PostMapping("/{id}/release-escrow")
    public ResponseEntity<ApiResponse<ContractResponse>> releaseEscrow(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(disputeService.releaseEscrow(id)));
    }
}
