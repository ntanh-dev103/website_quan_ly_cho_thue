package com.rentalshop.backend.contract.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ContractDetailResponse {
    private Long id;
    private Long itemId;
    private String skuCode;
    private LocalDateTime actualReturnDate;
    private Boolean isReturned;
    private Boolean isDamaged;
}
