package com.rentalshop.backend.contract.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateContractRequest {
    private Long customerId;

    private Long productId;

    private Integer quantity;

    private List<Long> itemIds;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endDate;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod;

    private String deliveryAddress;

    private Double deliveryFee;

    private String customerTier;

    private String note;
}

