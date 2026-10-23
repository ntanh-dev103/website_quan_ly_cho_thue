package com.rentalshop.backend.auth.dto.response;

import com.rentalshop.backend.auth.entity.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private String phone;
    private String avatar;
    private String address;
    private String customerTier;
    private String merchantTier;
    private String companyName;
    private String taxCode;
    private Boolean verifiedIdentity;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
