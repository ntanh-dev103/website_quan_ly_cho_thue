package com.rentalshop.backend.product.entity;
import com.rentalshop.backend.product.enums.ItemStatus;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sku_code", nullable = false, unique = true)
    private String skuCode;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "barcode")
    private String barcode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status;

    @Column(name = "condition_score")
    @Builder.Default
    private Integer conditionScore = 100;

    @Column(name = "warehouse_location")
    private String warehouseLocation;

    private String notes;
}
