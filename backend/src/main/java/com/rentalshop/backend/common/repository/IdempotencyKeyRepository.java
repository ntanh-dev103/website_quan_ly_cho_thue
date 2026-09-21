package com.rentalshop.backend.common.repository;

import com.rentalshop.backend.common.entity.IdempotencyKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface IdempotencyKeyRepository extends JpaRepository<IdempotencyKey, String> {
    void deleteByCreatedAtBefore(LocalDateTime cutoff);
}
