package com.rentalshop.backend.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TierConfigResponse {
    private String id;
    private String name;
    private String type; // "CUSTOMER" or "MERCHANT"
    private Double rate; // deposit rate % or commission rate %
    private String maxLimits;
    private Integer priorityScore;
}
