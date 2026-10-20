package com.rentalshop.backend.product.controller;

import com.rentalshop.backend.common.response.ApiResponse;
import com.rentalshop.backend.product.dto.request.CheckAvailabilityRequest;
import com.rentalshop.backend.product.dto.request.CreateProductItemRequest;
import com.rentalshop.backend.product.dto.request.UpdateItemStatusRequest;
import com.rentalshop.backend.product.dto.response.CheckAvailabilityResponse;
import com.rentalshop.backend.product.dto.response.ProductItemResponse;
import com.rentalshop.backend.product.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @GetMapping("/inventory/items")
    public ResponseEntity<ApiResponse<List<ProductItemResponse>>> getMerchantItems(
            @RequestParam(required = false) Long merchantId) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getMerchantItems(merchantId)));
    }

    @PostMapping("/products/{id}/items")
    public ResponseEntity<ApiResponse<ProductItemResponse>> createProductItem(
            @PathVariable Long id, 
            @Valid @RequestBody CreateProductItemRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(inventoryService.createProductItem(id, request)));
    }

    @PutMapping("/inventory/items/{id}/status")
    public ResponseEntity<ApiResponse<ProductItemResponse>> updateItemStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateItemStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.updateItemStatus(id, request)));
    }

    @DeleteMapping("/inventory/items/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProductItem(@PathVariable Long id) {
        inventoryService.deleteProductItem(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/product-items/check-availability")
    public ResponseEntity<ApiResponse<List<CheckAvailabilityResponse>>> checkAvailability(
            @Valid @RequestBody CheckAvailabilityRequest request) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.checkAvailability(request)));
    }
}
