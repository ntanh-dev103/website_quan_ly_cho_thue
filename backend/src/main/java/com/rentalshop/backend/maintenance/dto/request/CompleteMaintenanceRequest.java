package com.rentalshop.backend.maintenance.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompleteMaintenanceRequest {
    @NotNull(message = "Phải chỉ định kết quả bảo trì")
    private Boolean isSuccess;

    private Double cost;
    
    private String note;
}
