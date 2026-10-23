package com.rentalshop.backend.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double rentPrice;
    private Double depositPrice;
    private Double pricePerDay;
    private Double depositAmount;
    private Long categoryId;
    private String categoryName;
    private String thumbnail;
    private String images;
    private String city;
    private String district;
    private Boolean featured;
    private Double rating;
    private Integer totalReviews;
    private Integer totalRentals;
    private String status;
    private Long merchantId;
    private String merchantName;
    private String merchantAvatar;
    private String merchantTier;
    private String attributes;
}

