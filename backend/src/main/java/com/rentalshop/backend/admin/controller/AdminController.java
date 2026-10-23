package com.rentalshop.backend.admin.controller;

import com.rentalshop.backend.admin.dto.request.UpdateTierConfigRequest;
import com.rentalshop.backend.admin.dto.request.UpdateUserTierRequest;
import com.rentalshop.backend.admin.dto.response.AdminDashboardStatsResponse;
import com.rentalshop.backend.admin.dto.response.AdminUserResponse;
import com.rentalshop.backend.admin.dto.response.MerchantApplicationResponse;
import com.rentalshop.backend.admin.dto.response.TierConfigResponse;
import com.rentalshop.backend.admin.service.AdminService;
import com.rentalshop.backend.auth.entity.Role;
import com.rentalshop.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<AdminUserResponse>>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getUsers(role, isActive, search, pageable)));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<AdminUserResponse>> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.toggleUserStatus(id)));
    }

    @PutMapping("/users/{id}/tier")
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateUserTier(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserTierRequest request) {
        return ResponseEntity.ok(ApiResponse.success(adminService.updateUserTier(id, request)));
    }

    @GetMapping("/merchants/pending")
    public ResponseEntity<ApiResponse<List<MerchantApplicationResponse>>> getPendingMerchantApplications() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getPendingMerchantApplications()));
    }

    @PutMapping("/merchants/{id}/approve")
    public ResponseEntity<ApiResponse<MerchantApplicationResponse>> approveMerchantApplication(
            @PathVariable Long id,
            @RequestParam(required = false) String initialTier) {
        return ResponseEntity.ok(ApiResponse.success(adminService.approveMerchantApplication(id, initialTier)));
    }

    @PutMapping("/merchants/{id}/reject")
    public ResponseEntity<ApiResponse<MerchantApplicationResponse>> rejectMerchantApplication(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null) ? body.get("reason") : null;
        return ResponseEntity.ok(ApiResponse.success(adminService.rejectMerchantApplication(id, reason)));
    }

    @GetMapping("/tiers")
    public ResponseEntity<ApiResponse<List<TierConfigResponse>>> getTierConfigs() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getTierConfigs()));
    }

    @PutMapping("/tiers/{tierId}")
    public ResponseEntity<ApiResponse<TierConfigResponse>> updateTierConfig(
            @PathVariable String tierId,
            @Valid @RequestBody UpdateTierConfigRequest request) {
        return ResponseEntity.ok(ApiResponse.success(adminService.updateTierConfig(tierId, request)));
    }
}
