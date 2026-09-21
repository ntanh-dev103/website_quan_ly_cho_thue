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
    private String fullName;
    private Role role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
