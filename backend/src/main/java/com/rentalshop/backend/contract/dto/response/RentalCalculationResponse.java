package com.rentalshop.backend.contract.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalCalculationResponse {
    private Long productId;
    private String productName;
    private Double pricePerDay;
    private Long rentalDays;
    private Double rentalFee;
    private Double baseDepositAmount;
    private Double depositRate;
    private Double depositAmount;
    private Double depositDiscountAmount;
    private Double deliveryFee;
    private Double totalAmount;
    private String customerTier;
    private String tierName;
    private String tierBadge;
}
