package com.rentalshop.backend.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueChartResponse {
    private String date; // Format YYYY-MM-DD
    private Double actualRevenue;
    private Double debt;
}
