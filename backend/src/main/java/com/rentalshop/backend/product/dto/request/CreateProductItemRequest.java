package com.rentalshop.backend.product.dto.request;

import com.rentalshop.backend.product.enums.ItemStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductItemRequest {
    private String skuCode;

    @NotBlank(message = "Số Serial/IMEI không được để trống")
    private String serialNumber;

    private String barcode;

    private ItemStatus status;

    private Integer conditionScore;

    private String warehouseLocation;

    private String notes;
}
