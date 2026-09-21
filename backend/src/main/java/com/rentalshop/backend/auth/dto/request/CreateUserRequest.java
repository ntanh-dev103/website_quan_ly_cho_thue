package com.rentalshop.backend.auth.dto.request;

import com.rentalshop.backend.auth.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateUserRequest {
    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Password không được để trống")
    private String password;

    @NotBlank(message = "Tên đầy đủ không được để trống")
    private String fullName;

    @NotNull(message = "Vai trò không được để trống")
    private Role role;
}
