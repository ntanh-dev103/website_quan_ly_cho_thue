package com.rentalshop.backend.contract.service.impl;

import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.contract.dto.request.RentalCalculationRequest;
import com.rentalshop.backend.contract.dto.response.RentalCalculationResponse;
import com.rentalshop.backend.contract.service.RentalCalculationService;
import com.rentalshop.backend.product.entity.Product;
import com.rentalshop.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class RentalCalculationServiceImpl implements RentalCalculationService {

    private final ProductRepository productRepository;

    @Override
    public RentalCalculationResponse calculateRental(RentalCalculationRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + request.getProductId()));

        long days = ChronoUnit.DAYS.between(request.getStartDate().toLocalDate(), request.getEndDate().toLocalDate()) + 1;
        if (days <= 0) {
            days = 1;
        }

        double pricePerDay = product.getRentPrice() != null ? product.getRentPrice() : 0.0;
        double rentalFee = pricePerDay * days;

        double baseDeposit = product.getDepositPrice() != null ? product.getDepositPrice() : (pricePerDay * 10);

        String tier = request.getCustomerTier() != null ? request.getCustomerTier().toUpperCase().trim() : "C1";
        double depositRate;
        String tierName;
        String tierBadge;

        switch (tier) {
            case "C4":
                depositRate = 0.0;
                tierName = "Kim Cương";
                tierBadge = "💎 C4 (Miễn cọc 0đ)";
                break;
            case "C3":
                depositRate = 0.15;
                tierName = "Vàng";
                tierBadge = "👑 C3 (Cọc 15%)";
                break;
            case "C2":
                depositRate = 0.30;
                tierName = "Bạc";
                tierBadge = "🥈 C2 (Cọc 30%)";
                break;
            case "C1":
            default:
                tier = "C1";
                depositRate = 0.40;
                tierName = "Khách mới";
                tierBadge = "🔹 C1 (Cọc 40%)";
                break;
        }

        double depositAmount = baseDeposit * depositRate;
        double depositDiscountAmount = baseDeposit - depositAmount;

        double deliveryFee = 0.0;
        if (request.getDeliveryAddress() != null && !request.getDeliveryAddress().trim().isEmpty()) {
            String addr = request.getDeliveryAddress().toLowerCase();
            if (addr.contains("hồ chí minh") || addr.contains("hcm") || addr.contains("hà nội") || addr.contains("đà nẵng")) {
                deliveryFee = 30000.0;
            } else {
                deliveryFee = 50000.0;
            }
        }

        double totalAmount = rentalFee + depositAmount + deliveryFee;

        return RentalCalculationResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .pricePerDay(pricePerDay)
                .rentalDays(days)
                .rentalFee(rentalFee)
                .baseDepositAmount(baseDeposit)
                .depositRate(depositRate)
                .depositAmount(depositAmount)
                .depositDiscountAmount(depositDiscountAmount)
                .deliveryFee(deliveryFee)
                .totalAmount(totalAmount)
                .customerTier(tier)
                .tierName(tierName)
                .tierBadge(tierBadge)
                .build();
    }
}
