package com.rentalshop.backend.contract.controller;

import com.rentalshop.backend.common.response.ApiResponse;
import com.rentalshop.backend.contract.dto.request.RentalCalculationRequest;
import com.rentalshop.backend.contract.dto.response.RentalCalculationResponse;
import com.rentalshop.backend.contract.service.RentalCalculationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rental")
@RequiredArgsConstructor
public class RentalCalculationController {

    private final RentalCalculationService rentalCalculationService;

    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<RentalCalculationResponse>> calculateRental(
            @Valid @RequestBody RentalCalculationRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(rentalCalculationService.calculateRental(request)));
    }
}
