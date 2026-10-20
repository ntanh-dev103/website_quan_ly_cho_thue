package com.rentalshop.backend.contract.dto.response;

import com.rentalshop.backend.contract.enums.ContractStatus;
import com.rentalshop.backend.contract.enums.EscrowStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ContractResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Double totalRentFee;
    private Double depositAmount;
    private Double penaltyFee;
    private Double compensationFee;
    private String paymentMethod;
    private ContractStatus status;
    private EscrowStatus escrowStatus;
    private String manualReturnCode;
    private Long productId;
    private String productName;
    private String productImage;
    private String deliveryAddress;
    private Double deliveryFee;
    private String damageAssessmentNotes;
    private Double refundAmount;
    private List<ContractDetailResponse> details;
}
