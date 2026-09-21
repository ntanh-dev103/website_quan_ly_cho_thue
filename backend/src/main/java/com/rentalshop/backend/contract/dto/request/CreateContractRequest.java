package com.rentalshop.backend.contract.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateContractRequest {
    @NotNull(message = "ID Khách hàng không được để trống")
    private Long customerId;

    @NotEmpty(message = "Danh sách vật phẩm không được để trống")
    private List<Long> itemIds;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endDate;

    @NotNull(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod;
}
