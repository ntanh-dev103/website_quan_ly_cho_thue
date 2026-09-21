package com.rentalshop.backend.product.controller;

import com.rentalshop.backend.common.response.ApiResponse;
import com.rentalshop.backend.product.dto.request.CheckAvailabilityRequest;
import com.rentalshop.backend.product.dto.response.CheckAvailabilityResponse;
import com.rentalshop.backend.product.dto.response.ProductItemResponse;
import com.rentalshop.backend.product.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/products/{id}/items")
    public ResponseEntity<ApiResponse<List<ProductItemResponse>>> getItemsByProductId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getItemsByProductId(id)));
    }

    @PostMapping("/products/{id}/items")
    public ResponseEntity<ApiResponse<ProductItemResponse>> createProductItem(@PathVariable Long id, @RequestBody ProductItemResponse itemDto) {
        return ResponseEntity.status(201).body(ApiResponse.created(inventoryService.createProductItem(id, itemDto)));
    }

    @PostMapping("/product-items/check-availability")
    public ResponseEntity<ApiResponse<List<CheckAvailabilityResponse>>> checkAvailability(
            @Valid @RequestBody CheckAvailabilityRequest request) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.checkAvailability(request)));
    }
}
