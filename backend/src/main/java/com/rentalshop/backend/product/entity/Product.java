package com.rentalshop.backend.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "rent_price", nullable = false)
    private Double rentPrice;

    @Column(name = "deposit_price", nullable = false)
    private Double depositPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "attributes", columnDefinition = "nvarchar(max)")
    private String attributes;

    // V2.0 Rule 3: PERSISTED computed columns for JSON indexing.
    // These are created by SQL migration, not Hibernate DDL.
    @Column(name = "attr_ram", insertable = false, updatable = false)
    private String attrRam;

    @Column(name = "attr_size", insertable = false, updatable = false)
    private String attrSize;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductItem> items;
}
