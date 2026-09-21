package com.rentalshop.backend.report.service;

import com.rentalshop.backend.report.dto.response.DebtReportResponse;
import com.rentalshop.backend.report.dto.response.InventoryReportResponse;
import com.rentalshop.backend.report.dto.response.OverviewReportResponse;
import com.rentalshop.backend.report.dto.response.RevenueChartResponse;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {
    OverviewReportResponse getOverviewReport();
    List<RevenueChartResponse> getRevenueChart(LocalDate fromDate, LocalDate toDate);
    List<InventoryReportResponse> getInventoryStatusReport();
    List<DebtReportResponse> getDebtList();
}
