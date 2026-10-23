package com.rentalshop.backend.auth.service.impl;

import com.rentalshop.backend.auth.dto.request.LoginRequest;
import com.rentalshop.backend.auth.dto.request.RegisterRequest;
import com.rentalshop.backend.auth.dto.request.RefreshRequest;
import com.rentalshop.backend.auth.dto.response.LoginResponse;
import com.rentalshop.backend.auth.entity.Role;
import com.rentalshop.backend.auth.entity.User;
import com.rentalshop.backend.auth.repository.UserRepository;
import com.rentalshop.backend.auth.service.AuthService;
import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.ConflictException;
import com.rentalshop.backend.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        String loginId = request.getLoginIdentifier();
        if (loginId.isBlank()) {
            throw new BadRequestException("Vui lòng cung cấp email hoặc tên đăng nhập");
        }

        User user = userRepository.findByUsernameOrEmail(loginId)
                .orElseThrow(() -> new BadRequestException("Tài khoản hoặc mật khẩu không chính xác"));

        if (!user.getIsActive()) {
            throw new BadRequestException("Tài khoản đã bị tạm khóa");
        }

        // Authenticate with user's actual username (which Spring Security recognizes)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        String accessToken = tokenProvider.generateAccessToken(user.getUsername());
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userInfo(buildUserInfo(user))
                .build();
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        
        if (userRepository.existsByEmail(email) || userRepository.existsByUsername(email)) {
            throw new ConflictException("Email này đã được sử dụng trên hệ thống");
        }

        Role role = Role.CUSTOMER;
        if ("MERCHANT".equalsIgnoreCase(request.getRole())) {
            role = Role.MERCHANT;
        }

        User newUser = User.builder()
                .username(email)
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .role(role)
                .phone(request.getPhone())
                .address(request.getAddress())
                .customerTier("C1")
                .merchantTier(role == Role.MERCHANT ? "M1" : "M1")
                .companyName(request.getCompanyName())
                .taxCode(request.getTaxCode())
                .businessLicense(request.getBusinessLicense())
                .verifiedIdentity(false)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(newUser);

        String accessToken = tokenProvider.generateAccessToken(savedUser.getUsername());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getUsername());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userInfo(buildUserInfo(savedUser))
                .build();
    }

    public LoginResponse refresh(RefreshRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new BadRequestException("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        }

        String username = tokenProvider.getUsernameFromJWT(request.getRefreshToken());
        User user = userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new BadRequestException("Tài khoản không tồn tại"));

        if (!user.getIsActive()) {
            throw new BadRequestException("Tài khoản đã bị tạm khóa");
        }

        String newAccessToken = tokenProvider.generateAccessToken(user.getUsername());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userInfo(buildUserInfo(user))
                .build();
    }

    private LoginResponse.UserInfo buildUserInfo(User user) {
        return LoginResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail() != null ? user.getEmail() : user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .address(user.getAddress())
                .customerTier(user.getCustomerTier())
                .merchantTier(user.getMerchantTier())
                .companyName(user.getCompanyName())
                .taxCode(user.getTaxCode())
                .verifiedIdentity(user.getVerifiedIdentity())
                .build();
    }
}
