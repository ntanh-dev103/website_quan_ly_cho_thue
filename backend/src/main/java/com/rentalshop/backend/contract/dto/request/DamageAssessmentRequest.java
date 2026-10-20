package com.rentalshop.backend.contract.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class DamageAssessmentRequest {
    private List<Long> returnedItemIds;
    private List<Long> damagedItemIds;
    private Double compensationFee;
    private String notes;
    private LocalDateTime actualReturnDate;
}
