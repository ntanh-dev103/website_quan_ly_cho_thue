package com.rentalshop.backend.report.service.impl;

import com.rentalshop.backend.contract.repository.ContractRepository;
import com.rentalshop.backend.contract.repository.PaymentRepository;
import com.rentalshop.backend.product.repository.ProductItemRepository;
import com.rentalshop.backend.report.dto.response.DebtReportResponse;
import com.rentalshop.backend.report.dto.response.InventoryReportResponse;
import com.rentalshop.backend.report.dto.response.OverviewReportResponse;
import com.rentalshop.backend.report.dto.response.RevenueChartResponse;
import com.rentalshop.backend.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final PaymentRepository paymentRepository;
    private final ProductItemRepository productItemRepository;
    private final ContractRepository contractRepository;

    @Override
    @Transactional(readOnly = true)
    public OverviewReportResponse getOverviewReport() {
        LocalDate now = LocalDate.now();
        Double revenue = paymentRepository.getRevenueByMonthAndYear(now.getYear(), now.getMonthValue());
        if (revenue == null) revenue = 0.0;

        Long activeContracts = contractRepository.countActiveContracts();
        
        // Count maintenance items
        long itemsInMaintenance = 0;
        List<Object[]> inventoryStatus = productItemRepository.countItemsByStatus();
        for (Object[] row : inventoryStatus) {
            String status = row[0] != null ? row[0].toString() : "";
            if ("MAINTENANCE".equals(status)) {
                itemsInMaintenance = row[1] != null ? ((Number) row[1]).longValue() : 0;
                break;
            }
        }

        return OverviewReportResponse.builder()
                .revenueThisMonth(revenue)
                .activeContracts(activeContracts)
                .itemsInMaintenance(itemsInMaintenance)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RevenueChartResponse> getRevenueChart(LocalDate fromDate, LocalDate toDate) {
        List<Object[]> results = paymentRepository.getRevenueChart(fromDate, toDate);
        List<RevenueChartResponse> report = new ArrayList<>();

        for (Object[] row : results) {
            String dateStr = row[0] != null ? row[0].toString() : "";
            Double actualRevenue = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            Double debt = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;

            report.add(RevenueChartResponse.builder()
                    .date(dateStr)
                    .actualRevenue(actualRevenue)
                    .debt(debt)
                    .build());
        }
        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryReportResponse> getInventoryStatusReport() {
        List<Object[]> results = productItemRepository.countItemsByStatus();
        List<InventoryReportResponse> report = new ArrayList<>();
        
        for (Object[] row : results) {
            String status = row[0] != null ? row[0].toString() : "UNKNOWN";
            long count = row[1] != null ? ((Number) row[1]).longValue() : 0;
            report.add(InventoryReportResponse.builder()
                    .status(status)
                    .count(count)
                    .build());
        }
        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DebtReportResponse> getDebtList() {
        List<Object[]> results = paymentRepository.getDebtList();
        List<DebtReportResponse> report = new ArrayList<>();

        for (Object[] row : results) {
            Long contractId = row[0] != null ? ((Number) row[0]).longValue() : null;
            String name = (String) row[1];
            String phone = (String) row[2];
            Double debtAmount = row[3] != null ? ((Number) row[3]).doubleValue() : 0.0;

            report.add(DebtReportResponse.builder()
                    .contractId(contractId)
                    .customerName(name)
                    .phone(phone)
                    .debtAmount(debtAmount)
                    .build());
        }
        return report;
    }
}
