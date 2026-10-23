package com.rentalshop.backend.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserTierRequest {
    @NotBlank(message = "Tier không được để trống")
    private String tier;

    private String type; // "CUSTOMER" or "MERCHANT"
}
