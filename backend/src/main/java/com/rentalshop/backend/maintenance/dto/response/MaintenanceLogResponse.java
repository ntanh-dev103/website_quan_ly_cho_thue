package com.rentalshop.backend.maintenance.dto.response;

import com.rentalshop.backend.maintenance.enums.MaintenanceStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MaintenanceLogResponse {
    private Long id;
    private Long itemId;
    private String skuCode;
    private LocalDateTime sentDate;
    private LocalDateTime completedDate;
    private Double cost;
    private String description;
    private String note;
    private MaintenanceStatus status;
}
