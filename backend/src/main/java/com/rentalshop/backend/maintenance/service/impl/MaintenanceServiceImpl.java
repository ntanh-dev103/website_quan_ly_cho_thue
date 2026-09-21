package com.rentalshop.backend.maintenance.service.impl;

import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.maintenance.dto.request.CompleteMaintenanceRequest;
import com.rentalshop.backend.maintenance.dto.request.SendMaintenanceRequest;
import com.rentalshop.backend.maintenance.dto.response.MaintenanceLogResponse;
import com.rentalshop.backend.maintenance.entity.MaintenanceLog;
import com.rentalshop.backend.maintenance.enums.MaintenanceStatus;
import com.rentalshop.backend.maintenance.repository.MaintenanceLogRepository;
import com.rentalshop.backend.maintenance.service.MaintenanceService;
import com.rentalshop.backend.product.entity.ProductItem;
import com.rentalshop.backend.product.enums.ItemStatus;
import com.rentalshop.backend.product.repository.ProductItemRepository;
import com.rentalshop.backend.product.service.ProductItemStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final ProductItemRepository productItemRepository;
    private final ProductItemStateService stateService;

    @Override
    @Transactional
    public MaintenanceLogResponse sendToMaintenance(SendMaintenanceRequest request) {
        ProductItem item = productItemRepository.findById(request.getItemId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy vật phẩm"));

        if (item.getStatus() != ItemStatus.AVAILABLE && item.getStatus() != ItemStatus.DAMAGED) {
            throw new BadRequestException("Chỉ vật phẩm AVAILABLE hoặc DAMAGED mới có thể đem đi bảo trì");
        }

        stateService.transitionStatus(item.getId(), ItemStatus.MAINTENANCE);

        MaintenanceLog log = MaintenanceLog.builder()
                .productItem(item)
                .sentDate(LocalDateTime.now())
                .description(request.getDescription())
                .status(MaintenanceStatus.PENDING)
                .cost(0.0)
                .build();

        return mapToResponse(maintenanceLogRepository.save(log));
    }

    @Override
    @Transactional
    public MaintenanceLogResponse completeMaintenance(Long logId, CompleteMaintenanceRequest request) {
        MaintenanceLog log = maintenanceLogRepository.findById(logId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy phiếu bảo trì"));

        if (log.getStatus() == MaintenanceStatus.COMPLETED) {
            throw new BadRequestException("Phiếu bảo trì này đã hoàn tất rồi");
        }

        log.setCompletedDate(LocalDateTime.now());
        log.setCost(request.getCost() != null ? request.getCost() : 0.0);
        log.setNote(request.getNote());
        log.setStatus(MaintenanceStatus.COMPLETED);

        ItemStatus nextStatus = request.getIsSuccess() ? ItemStatus.AVAILABLE : ItemStatus.DAMAGED;
        stateService.transitionStatus(log.getProductItem().getId(), nextStatus);

        return mapToResponse(maintenanceLogRepository.save(log));
    }

    @Override
    public Page<MaintenanceLogResponse> getAllLogs(Pageable pageable) {
        return maintenanceLogRepository.findAll(pageable).map(this::mapToResponse);
    }

    private MaintenanceLogResponse mapToResponse(MaintenanceLog log) {
        return MaintenanceLogResponse.builder()
                .id(log.getId())
                .itemId(log.getProductItem().getId())
                .skuCode(log.getProductItem().getSkuCode())
                .sentDate(log.getSentDate())
                .completedDate(log.getCompletedDate())
                .cost(log.getCost())
                .description(log.getDescription())
                .note(log.getNote())
                .status(log.getStatus())
                .build();
    }
}
