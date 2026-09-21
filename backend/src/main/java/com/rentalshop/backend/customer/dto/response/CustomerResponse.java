package com.rentalshop.backend.customer.dto.response;

import com.rentalshop.backend.customer.enums.CustomerTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String email;
    private String cccd;
    private String address;
    private Double totalSpent;
    private CustomerTier tier;
    private LocalDateTime createdAt;
}
