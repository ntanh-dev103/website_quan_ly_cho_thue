package com.rentalshop.backend.product.dto.response;

import com.rentalshop.backend.product.enums.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String skuCode;
    private String serialNumber;
    private String barcode;
    private ItemStatus status;
    private Integer conditionScore;
    private String warehouseLocation;
    private String notes;
}
