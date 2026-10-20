package com.rentalshop.backend.product.dto.request;

import com.rentalshop.backend.product.enums.ItemStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateItemStatusRequest {
    @NotNull(message = "Trạng thái không được để trống")
    private ItemStatus status;

    private String notes;

    private Integer conditionScore;

    private String warehouseLocation;
}
