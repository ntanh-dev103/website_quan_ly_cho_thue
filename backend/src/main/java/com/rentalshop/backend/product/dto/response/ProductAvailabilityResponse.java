package com.rentalshop.backend.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductAvailabilityResponse {
    private Long productId;
    private String productName;
    private Integer totalItems;
    private Integer availableItems;
    private Boolean isAvailable;
    private List<DateRangeDto> bookedDateRanges;
}
