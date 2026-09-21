package com.rentalshop.backend.auth.service;

import com.rentalshop.backend.auth.dto.request.LoginRequest;
import com.rentalshop.backend.auth.dto.response.LoginResponse;
import com.rentalshop.backend.auth.dto.request.RefreshRequest;
import com.rentalshop.backend.auth.entity.User;
import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.auth.repository.UserRepository;
import com.rentalshop.backend.security.jwt.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse refresh(RefreshRequest request);
}
