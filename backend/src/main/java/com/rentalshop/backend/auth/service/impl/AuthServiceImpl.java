package com.rentalshop.backend.auth.service.impl;

import com.rentalshop.backend.auth.service.AuthService;

import com.rentalshop.backend.auth.dto.request.LoginRequest;
import com.rentalshop.backend.auth.dto.response.LoginResponse;
import com.rentalshop.backend.auth.dto.request.RefreshRequest;
import com.rentalshop.backend.auth.entity.User;
import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.auth.repository.UserRepository;
import com.rentalshop.backend.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Tài khoản không tồn tại"));

        if (!user.getIsActive()) {
            throw new BadRequestException("Tài khoản đã bị khóa");
        }

        String accessToken = tokenProvider.generateAccessToken(user.getUsername());
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userInfo(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }

    public LoginResponse refresh(RefreshRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new BadRequestException("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        String username = tokenProvider.getUsernameFromJWT(request.getRefreshToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Tài khoản không tồn tại"));

        if (!user.getIsActive()) {
            throw new BadRequestException("Tài khoản đã bị khóa");
        }

        String newAccessToken = tokenProvider.generateAccessToken(user.getUsername());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userInfo(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }
}
