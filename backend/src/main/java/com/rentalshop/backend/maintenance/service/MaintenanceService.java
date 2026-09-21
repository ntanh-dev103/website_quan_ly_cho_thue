package com.rentalshop.backend.maintenance.service;

import com.rentalshop.backend.maintenance.dto.request.CompleteMaintenanceRequest;
import com.rentalshop.backend.maintenance.dto.request.SendMaintenanceRequest;
import com.rentalshop.backend.maintenance.dto.response.MaintenanceLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MaintenanceService {
    MaintenanceLogResponse sendToMaintenance(SendMaintenanceRequest request);
    MaintenanceLogResponse completeMaintenance(Long logId, CompleteMaintenanceRequest request);
    Page<MaintenanceLogResponse> getAllLogs(Pageable pageable);
}
