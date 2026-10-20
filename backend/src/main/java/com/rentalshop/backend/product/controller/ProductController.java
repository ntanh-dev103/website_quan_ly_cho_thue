package com.rentalshop.backend.product.controller;

import com.rentalshop.backend.common.response.ApiResponse;
import com.rentalshop.backend.product.dto.response.ProductResponse;
import com.rentalshop.backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rentalshop.backend.common.response.PaginationResponse;
import org.springframework.data.domain.Pageable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PaginationResponse<ProductResponse>>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String merchantTier,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) String availability,
            @RequestParam Map<String, String> allParams,
            Pageable pageable
    ) {
        Map<String, String> eavFilters = new HashMap<>();
        List<String> standardKeys = List.of(
                "keyword", "categoryId", "category", "minPrice", "maxPrice",
                "city", "district", "merchantTier", "rating", "availability",
                "page", "size", "sort"
        );
        allParams.forEach((k, v) -> {
            if (!standardKeys.contains(k) && v != null && !v.trim().isEmpty()) {
                eavFilters.put(k, v);
            }
        });

        PaginationResponse<ProductResponse> result = productService.searchProducts(
                keyword, categoryId, category, minPrice, maxPrice,
                city, district, merchantTier, rating, eavFilters, pageable
        );
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.success(productService.getAllProducts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id)));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<com.rentalshop.backend.product.dto.response.ProductAvailabilityResponse>> getProductAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductAvailability(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@RequestBody ProductResponse productDto) {
        return ResponseEntity.status(201).body(ApiResponse.created(productService.createProduct(productDto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id, @RequestBody ProductResponse productDto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sản phẩm thành công", productService.updateProduct(id, productDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa sản phẩm thành công", null));
    }
}
