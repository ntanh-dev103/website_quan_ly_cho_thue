package com.rentalshop.backend.contract.entity;
import com.rentalshop.backend.contract.enums.PaymentType;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;

@Entity
@Immutable
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(name = "transaction_id", nullable = false)
    private String transactionId;

    @Column(name = "account_id", nullable = false)
    private String accountId;

    @Column(name = "debit_amount", nullable = false)
    @Builder.Default
    private Double debitAmount = 0.0;

    @Column(name = "credit_amount", nullable = false)
    @Builder.Default
    private Double creditAmount = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false)
    private PaymentType paymentType;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        throw new UnsupportedOperationException("Payment ledger rows are APPEND-ONLY. Updates are forbidden.");
    }

    @PreRemove
    protected void onRemove() {
        throw new UnsupportedOperationException("Payment ledger rows are APPEND-ONLY. Deletes are forbidden.");
    }
}
