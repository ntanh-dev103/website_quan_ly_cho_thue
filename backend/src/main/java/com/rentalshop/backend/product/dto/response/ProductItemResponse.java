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
    private String skuCode;
    private ItemStatus status;
    private String notes;
}
