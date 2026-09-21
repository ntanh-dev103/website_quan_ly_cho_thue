package com.rentalshop.backend.contract.dto.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReturnItemsRequest {
    private List<Long> returnedItemIds;
    private List<Long> damagedItemIds;
    private LocalDateTime actualReturnDate;
    private Double compensationFee;
}
