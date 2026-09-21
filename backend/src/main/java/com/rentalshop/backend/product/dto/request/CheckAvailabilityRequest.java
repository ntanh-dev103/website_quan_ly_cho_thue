package com.rentalshop.backend.product.dto.request;
import com.rentalshop.backend.product.entity.Product;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckAvailabilityRequest {
    @NotNull(message = "Product ID không được để trống")
    private Long productId;
    
    @NotNull(message = "Start Date không được để trống")
    private LocalDateTime startDate;
    
    @NotNull(message = "End Date không được để trống")
    private LocalDateTime endDate;
}
