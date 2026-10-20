package com.rentalshop.backend.admin.service;

import com.rentalshop.backend.admin.dto.request.UpdateTierConfigRequest;
import com.rentalshop.backend.admin.dto.request.UpdateUserTierRequest;
import com.rentalshop.backend.admin.dto.response.AdminDashboardStatsResponse;
import com.rentalshop.backend.admin.dto.response.AdminUserResponse;
import com.rentalshop.backend.admin.dto.response.MerchantApplicationResponse;
import com.rentalshop.backend.admin.dto.response.TierConfigResponse;
import com.rentalshop.backend.auth.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminService {
    AdminDashboardStatsResponse getDashboardStats();
    Page<AdminUserResponse> getUsers(Role role, Boolean isActive, String search, Pageable pageable);
    AdminUserResponse toggleUserStatus(Long userId);
    AdminUserResponse updateUserTier(Long userId, UpdateUserTierRequest request);
    List<MerchantApplicationResponse> getPendingMerchantApplications();
    MerchantApplicationResponse approveMerchantApplication(Long userId, String initialTier);
    MerchantApplicationResponse rejectMerchantApplication(Long userId, String reason);
    List<TierConfigResponse> getTierConfigs();
    TierConfigResponse updateTierConfig(String tierId, UpdateTierConfigRequest request);
}
