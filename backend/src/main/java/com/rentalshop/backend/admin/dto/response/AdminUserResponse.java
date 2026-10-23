package com.rentalshop.backend.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String phone;
    private String avatar;
    private String address;
    private String customerTier;
    private String merchantTier;
    private String companyName;
    private String taxCode;
    private Boolean verifiedIdentity;
    private Boolean isActive;
    private String createdAt;
}
