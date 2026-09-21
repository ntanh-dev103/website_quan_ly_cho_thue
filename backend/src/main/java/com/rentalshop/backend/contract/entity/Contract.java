package com.rentalshop.backend.contract.entity;
import com.rentalshop.backend.customer.entity.Customer;
import com.rentalshop.backend.contract.enums.ContractStatus;
import com.rentalshop.backend.contract.enums.EscrowStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "contracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "total_rent_fee")
    @Builder.Default
    private Double totalRentFee = 0.0;

    @Column(name = "deposit_amount")
    @Builder.Default
    private Double depositAmount = 0.0;

    @Column(name = "penalty_fee")
    @Builder.Default
    private Double penaltyFee = 0.0;

    @Column(name = "compensation_fee")
    @Builder.Default
    private Double compensationFee = 0.0;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status;

    // --- V2.0: Escrow state is INDEPENDENT of contract status ---
    @Enumerated(EnumType.STRING)
    @Column(name = "escrow_status", nullable = false)
    @Builder.Default
    private EscrowStatus escrowStatus = EscrowStatus.HELD;

    @Column(name = "dispute_deadline")
    private LocalDateTime disputeDeadline;

    // --- V2.0: 3PL fallback manual return code ---
    @Column(name = "manual_return_code", length = 20)
    private String manualReturnCode;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL)
    private List<ContractDetail> details;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
