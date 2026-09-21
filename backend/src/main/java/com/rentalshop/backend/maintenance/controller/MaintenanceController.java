package com.rentalshop.backend.maintenance.controller;

import com.rentalshop.backend.common.response.ApiResponse;
import com.rentalshop.backend.common.response.PaginationResponse;
import com.rentalshop.backend.maintenance.dto.request.CompleteMaintenanceRequest;
import com.rentalshop.backend.maintenance.dto.request.SendMaintenanceRequest;
import com.rentalshop.backend.maintenance.dto.response.MaintenanceLogResponse;
import com.rentalshop.backend.maintenance.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<MaintenanceLogResponse>> sendToMaintenance(
            @Valid @RequestBody SendMaintenanceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đã gửi vật phẩm đi bảo trì", maintenanceService.sendToMaintenance(request)));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<MaintenanceLogResponse>> completeMaintenance(
            @PathVariable Long id,
            @Valid @RequestBody CompleteMaintenanceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đã hoàn tất bảo trì", maintenanceService.completeMaintenance(id, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<MaintenanceLogResponse>>> getAllLogs(Pageable pageable) {
        Page<MaintenanceLogResponse> page = maintenanceService.getAllLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", PaginationResponse.from(page)));
    }
}
