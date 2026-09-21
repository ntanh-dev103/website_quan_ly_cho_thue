package com.rentalshop.backend.auth.service.impl;

import com.rentalshop.backend.auth.service.UserService;

import com.rentalshop.backend.auth.dto.request.CreateUserRequest;
import com.rentalshop.backend.auth.dto.response.UserResponse;
import com.rentalshop.backend.auth.entity.Role;
import com.rentalshop.backend.auth.entity.User;
import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.ConflictException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.auth.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initDefaultAdmin() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("System Administrator")
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created: admin / admin123");
        }
    }

    public UserResponse getMyProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));
        return mapToDto(user);
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToDto);
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Tên đăng nhập đã tồn tại");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .isActive(true)
                .build();
        
        return mapToDto(userRepository.save(user));
    }

    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));
        
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Không thể khóa tài khoản Admin chính");
        }
        
        user.setIsActive(!user.getIsActive());
        return mapToDto(userRepository.save(user));
    }

    private UserResponse mapToDto(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
