package com.rentalshop.backend.auth.service;

import com.rentalshop.backend.auth.dto.request.CreateUserRequest;
import com.rentalshop.backend.auth.dto.response.UserResponse;
import com.rentalshop.backend.auth.entity.Role;
import com.rentalshop.backend.auth.entity.User;
import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.ConflictException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.auth.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

public interface UserService {
    void initDefaultAdmin();
    UserResponse getMyProfile(String username);
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse createUser(CreateUserRequest request);
    UserResponse toggleUserStatus(Long id);
}
