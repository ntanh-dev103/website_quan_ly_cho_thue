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
        seedUserIfNotExists("admin@demo.com", "Admin Hệ Thống", Role.ADMIN, "C4", "M4", "123456", "0901000001", null, null);
        seedUserIfNotExists("merchant@demo.com", "AutoRent Pro HCM", Role.MERCHANT, "C1", "M2", "123456", "0902000002", "Công ty TNHH AutoRent Pro", "0309999001");
        seedUserIfNotExists("merchant3@demo.com", "Cinematic Gear Studio", Role.MERCHANT, "C1", "M3", "123456", "0902000003", "Cinematic Gear Studio VN", "0309999002");
        seedUserIfNotExists("merchant4@demo.com", "Luxury Event Group", Role.MERCHANT, "C1", "M4", "123456", "0902000004", "Tập đoàn Sự kiện Hoàng Gia", "0309999003");
        seedUserIfNotExists("vip@demo.com", "Nguyễn Hoàng VIP", Role.CUSTOMER, "C4", "M1", "123456", "0903000001", null, null);
        seedUserIfNotExists("gold@demo.com", "Trần Kim Vàng", Role.CUSTOMER, "C3", "M1", "123456", "0903000002", null, null);
        seedUserIfNotExists("silver@demo.com", "Lê Thanh Bạc", Role.CUSTOMER, "C2", "M1", "123456", "0903000003", null, null);
        seedUserIfNotExists("customer@demo.com", "Phạm Văn Thuê", Role.CUSTOMER, "C1", "M1", "123456", "0903000004", null, null);

        // Also seed @test.com accounts for frontend demo pills compatibility
        seedUserIfNotExists("admin@test.com", "Admin Quản Trị", Role.ADMIN, "C4", "M4", "123456", "0901000099", null, null);
        seedUserIfNotExists("merchant@test.com", "Shop Đối Tác", Role.MERCHANT, "C1", "M2", "123456", "0902000099", "Đối Tác Test Shop", "0309999099");
        seedUserIfNotExists("gold@test.com", "Khách VIP Gold", Role.CUSTOMER, "C3", "M1", "123456", "0903000099", null, null);
        seedUserIfNotExists("user@test.com", "Khách Thuê Cá Nhân", Role.CUSTOMER, "C1", "M1", "123456", "0903000098", null, null);
    }

    private void seedUserIfNotExists(String email, String fullName, Role role, String cTier, String mTier, String password, String phone, String company, String taxCode) {
        if (!userRepository.existsByUsername(email) && !userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .username(email)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .fullName(fullName)
                    .role(role)
                    .customerTier(cTier)
                    .merchantTier(mTier)
                    .phone(phone)
                    .companyName(company)
                    .taxCode(taxCode)
                    .verifiedIdentity(true)
                    .isActive(true)
                    .build();
            userRepository.save(user);
        }
    }

    public UserResponse getMyProfile(String username) {
        User user = userRepository.findByUsernameOrEmail(username)
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
                .email(request.getUsername().contains("@") ? request.getUsername() : null)
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
                .email(user.getEmail() != null ? user.getEmail() : user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .address(user.getAddress())
                .customerTier(user.getCustomerTier())
                .merchantTier(user.getMerchantTier())
                .companyName(user.getCompanyName())
                .taxCode(user.getTaxCode())
                .verifiedIdentity(user.getVerifiedIdentity())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
