package com.rentalshop.backend.report.controller;

import com.rentalshop.backend.common.response.ApiResponse;
import com.rentalshop.backend.report.dto.response.DebtReportResponse;
import com.rentalshop.backend.report.dto.response.InventoryReportResponse;
import com.rentalshop.backend.report.dto.response.OverviewReportResponse;
import com.rentalshop.backend.report.dto.response.RevenueChartResponse;
import com.rentalshop.backend.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    public ResponseEntity<ApiResponse<OverviewReportResponse>> getOverviewReport() {
        return ResponseEntity.ok(ApiResponse.success(
                "Lấy báo cáo tổng quan thành công", 
                reportService.getOverviewReport()));
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RevenueChartResponse>>> getRevenueReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        
        return ResponseEntity.ok(ApiResponse.success(
                "Biểu đồ doanh thu từ " + fromDate + " đến " + toDate, 
                reportService.getRevenueChart(fromDate, toDate)));
    }

    @GetMapping("/inventory-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE')")
    public ResponseEntity<ApiResponse<List<InventoryReportResponse>>> getInventoryReport() {
        return ResponseEntity.ok(ApiResponse.success(
                "Báo cáo tình trạng kho", 
                reportService.getInventoryStatusReport()));
    }

    @GetMapping("/debts")
    @PreAuthorize("hasAnyRole('ADMIN', 'CASHIER')")
    public ResponseEntity<ApiResponse<List<DebtReportResponse>>> getDebts() {
        return ResponseEntity.ok(ApiResponse.success(
                "Danh sách khách hàng đang mang nợ", 
                reportService.getDebtList()));
    }
}
