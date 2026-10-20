package com.rentalshop.backend.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MerchantApplicationResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String companyName;
    private String taxCode;
    private String businessLicense;
    private String status;
    private String merchantTier;
    private Boolean verifiedIdentity;
    private String createdAt;
    private String rejectionReason;
}
