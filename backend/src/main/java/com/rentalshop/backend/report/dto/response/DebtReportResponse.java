package com.rentalshop.backend.report.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DebtReportResponse {
    private Long contractId;
    private String customerName;
    private String phone;
    private Double debtAmount;
}
