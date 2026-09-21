package com.rentalshop.backend.maintenance.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendMaintenanceRequest {
    @NotNull(message = "ID vật phẩm không được để trống")
    private Long itemId;
    
    private String description;
}
