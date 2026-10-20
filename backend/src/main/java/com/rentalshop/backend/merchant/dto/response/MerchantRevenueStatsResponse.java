package com.rentalshop.backend.merchant.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MerchantRevenueStatsResponse {
    private Double grossRevenue;
    private Double platformCommission;
    private Double netRevenue;
    private Integer activeRentalsCount;
    private Integer totalItemsCount;
    private Integer availableItemsCount;
    private Integer maintenanceItemsCount;
    private Double occupancyRate;
    private String merchantTier; // M1, M2, M3, M4
    private Double commissionRate; // 0.15, 0.10, 0.05, 0.02
    private Integer productCount;
    private Integer productLimit; // e.g. 20 for M1, -1 for unlimited
}
