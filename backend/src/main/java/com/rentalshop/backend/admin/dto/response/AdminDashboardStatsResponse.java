package com.rentalshop.backend.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsResponse {
    private Long totalUsersCount;
    private Long customerCount;
    private Long merchantCount;
    private Long totalProductsCount;
    private Long totalActiveContractsCount;
    private Double totalPlatformRevenue;
    private Long pendingMerchantApplicationsCount;
    private Double occupancyRate;
}
