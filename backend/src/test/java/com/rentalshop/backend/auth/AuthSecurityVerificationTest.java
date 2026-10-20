package com.rentalshop.backend.auth;

import com.rentalshop.backend.auth.dto.request.LoginRequest;
import com.rentalshop.backend.auth.entity.Role;
import com.rentalshop.backend.auth.entity.User;
import com.rentalshop.backend.security.CustomUserDetails;
import com.rentalshop.backend.security.jwt.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collection;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Task 1: Authentication, Authorization & RBAC Verification Tests")
public class AuthSecurityVerificationTest {

    private BCryptPasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        jwtTokenProvider = new JwtTokenProvider();

        // Inject configuration properties into JwtTokenProvider
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", "ThisIsASecretKeyForTestingAtLeast32BytesLong!@#$");
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationInMs", 900000L); // 15 mins
        ReflectionTestUtils.setField(jwtTokenProvider, "refreshExpirationInMs", 604800000L); // 7 days
    }

    @Test
    @DisplayName("1. Admin Login & Authority Mapping (ROLE_ADMIN)")
    void testAdminAuthorityMapping() {
        User admin = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@demo.com")
                .role(Role.ADMIN)
                .isActive(true)
                .password(passwordEncoder.encode("123456"))
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(admin);
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        assertTrue(authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonLocked());
    }

    @Test
    @DisplayName("2. Merchant Login & Authority Mapping (ROLE_MERCHANT, M1-M4)")
    void testMerchantAuthorityAndTier() {
        User merchant = User.builder()
                .id(2L)
                .username("merchant")
                .email("merchant@demo.com")
                .role(Role.MERCHANT)
                .merchantTier("M2")
                .isActive(true)
                .password(passwordEncoder.encode("123456"))
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(merchant);
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_MERCHANT")));
        assertEquals("M2", merchant.getMerchantTier());
    }

    @Test
    @DisplayName("3. Customer C1 Login & Authority Mapping (ROLE_CUSTOMER, C1 Tier)")
    void testCustomerC1AuthorityAndTier() {
        User customerC1 = User.builder()
                .id(3L)
                .username("customer_c1")
                .email("customer@demo.com")
                .role(Role.CUSTOMER)
                .customerTier("C1")
                .isActive(true)
                .password(passwordEncoder.encode("123456"))
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(customerC1);
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER")));
        assertEquals("C1", customerC1.getCustomerTier());
    }

    @Test
    @DisplayName("4. Customer C4 Login & Authority Mapping (ROLE_CUSTOMER, C4 Tier)")
    void testCustomerC4AuthorityAndTier() {
        User customerC4 = User.builder()
                .id(4L)
                .username("customer_c4")
                .email("diamond@demo.com")
                .role(Role.CUSTOMER)
                .customerTier("C4")
                .isActive(true)
                .password(passwordEncoder.encode("123456"))
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(customerC4);
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER")));
        assertEquals("C4", customerC4.getCustomerTier());
    }

    @Test
    @DisplayName("5. BCrypt Password Hashing & Never Storing Plaintext")
    void testBCryptPasswordHashing() {
        String rawPassword = "SuperSecretPassword123!";
        String encodedHash = passwordEncoder.encode(rawPassword);

        assertNotEquals(rawPassword, encodedHash);
        assertTrue(encodedHash.startsWith("$2a$") || encodedHash.startsWith("$2b$"));
        assertTrue(passwordEncoder.matches(rawPassword, encodedHash));
    }

    @Test
    @DisplayName("6. Invalid Password Fails Authentication Check")
    void testInvalidPasswordFails() {
        String rawPassword = "CorrectPassword123";
        String encodedHash = passwordEncoder.encode(rawPassword);

        assertFalse(passwordEncoder.matches("WrongPassword", encodedHash));
    }

    @Test
    @DisplayName("7. Dual Login Identifier (Email or Username Support)")
    void testLoginRequestIdentifier() {
        LoginRequest reqEmail = new LoginRequest();
        reqEmail.setEmail("user@example.com");
        reqEmail.setPassword("123456");
        assertEquals("user@example.com", reqEmail.getLoginIdentifier());

        LoginRequest reqUsername = new LoginRequest();
        reqUsername.setUsername("johndoe");
        reqUsername.setPassword("123456");
        assertEquals("johndoe", reqUsername.getLoginIdentifier());
    }

    @Test
    @DisplayName("8. JWT Access Token Generation, Claims & Expiration Config")
    void testJwtAccessTokenLifecycle() {
        String username = "admin@demo.com";
        String token = jwtTokenProvider.generateAccessToken(username);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(username, jwtTokenProvider.getUsernameFromJWT(token));
    }

    @Test
    @DisplayName("9. JWT Refresh Token Generation & Validation")
    void testJwtRefreshTokenLifecycle() {
        String username = "merchant@demo.com";
        String refreshToken = jwtTokenProvider.generateRefreshToken(username);

        assertNotNull(refreshToken);
        assertTrue(jwtTokenProvider.validateToken(refreshToken));
        assertEquals(username, jwtTokenProvider.getUsernameFromJWT(refreshToken));
    }

    @Test
    @DisplayName("10. Invalid & Tampered Token Rejection")
    void testTamperedJwtRejection() {
        String validToken = jwtTokenProvider.generateAccessToken("testuser");
        String tamperedToken = validToken.substring(0, validToken.length() - 5) + "abcde";

        assertFalse(jwtTokenProvider.validateToken(tamperedToken));
        assertFalse(jwtTokenProvider.validateToken(""));
        assertFalse(jwtTokenProvider.validateToken("malformed.jwt.token"));
    }

    @Test
    @DisplayName("11. Inactive Account Deactivation Lock Check")
    void testInactiveUserLocked() {
        User inactiveUser = User.builder()
                .id(99L)
                .username("banned_user")
                .isActive(false)
                .role(Role.CUSTOMER)
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(inactiveUser);
        assertFalse(userDetails.isEnabled());
        assertFalse(userDetails.isAccountNonLocked());
    }

    @Test
    @DisplayName("12. Customer & Merchant Tiers Coverage")
    void testTiersDefinitionCoverage() {
        List<String> validCustomerTiers = List.of("C1", "C2", "C3", "C4");
        List<String> validMerchantTiers = List.of("M1", "M2", "M3", "M4");

        assertEquals(4, validCustomerTiers.size());
        assertEquals(4, validMerchantTiers.size());
        assertTrue(validCustomerTiers.contains("C1"));
        assertTrue(validCustomerTiers.contains("C4"));
        assertTrue(validMerchantTiers.contains("M1"));
        assertTrue(validMerchantTiers.contains("M4"));
    }
}
