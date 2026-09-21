package com.rentalshop.backend.config;

import com.rentalshop.backend.common.entity.IdempotencyKey;
import com.rentalshop.backend.common.repository.IdempotencyKeyRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class IdempotencyFilter extends OncePerRequestFilter {

    private final IdempotencyKeyRepository idempotencyKeyRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
            
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String idempotencyKeyHeader = request.getHeader("Idempotency-Key");
        if (idempotencyKeyHeader == null || idempotencyKeyHeader.isEmpty()) {
            // Optional: You could reject requests that require it, but we'll let it pass or handle it in specific controllers
            filterChain.doFilter(request, response);
            return;
        }

        Optional<IdempotencyKey> existingKeyOpt = idempotencyKeyRepository.findById(idempotencyKeyHeader);
        if (existingKeyOpt.isPresent()) {
            IdempotencyKey existingKey = existingKeyOpt.get();
            response.setStatus(existingKey.getResponseStatus());
            response.setContentType("application/json");
            response.getWriter().write(existingKey.getResponseBody());
            return;
        }

        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);
        filterChain.doFilter(request, responseWrapper);

        String responseBody = new String(responseWrapper.getContentAsByteArray(), StandardCharsets.UTF_8);
        int status = responseWrapper.getStatus();

        IdempotencyKey newKey = IdempotencyKey.builder()
                .idempotencyKey(idempotencyKeyHeader)
                .responseBody(responseBody)
                .responseStatus(status)
                .build();
                
        idempotencyKeyRepository.save(newKey);
        responseWrapper.copyBodyToResponse();
    }
}
