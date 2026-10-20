package com.rentalshop.backend.contract.service;

import com.rentalshop.backend.contract.dto.request.RentalCalculationRequest;
import com.rentalshop.backend.contract.dto.response.RentalCalculationResponse;

public interface RentalCalculationService {
    RentalCalculationResponse calculateRental(RentalCalculationRequest request);
}
