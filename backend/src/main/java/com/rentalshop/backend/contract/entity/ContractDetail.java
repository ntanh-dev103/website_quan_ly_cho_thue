package com.rentalshop.backend.contract.entity;
import com.rentalshop.backend.product.entity.ProductItem;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contract_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private ProductItem item;

    @Column(name = "actual_return_date")
    private LocalDateTime actualReturnDate;

    @Column(name = "is_returned", nullable = false)
    @Builder.Default
    private Boolean isReturned = false;

    @Column(name = "is_damaged", nullable = false)
    @Builder.Default
    private Boolean isDamaged = false;
}
