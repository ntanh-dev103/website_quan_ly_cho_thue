package com.rentalshop.backend.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverviewReportResponse {
    private Double revenueThisMonth;
    private Long activeContracts;
    private Long itemsInMaintenance;
}
