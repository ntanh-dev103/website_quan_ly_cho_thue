package com.rentalshop.backend.admin.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTierConfigRequest {
    @NotNull(message = "Tỷ lệ không được để trống")
    private Double rate;

    private String name;
    private String maxLimits;
    private Integer priorityScore;
}
