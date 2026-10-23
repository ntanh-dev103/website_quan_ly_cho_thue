package com.rentalshop.backend.product.service;

import com.rentalshop.backend.product.dto.response.ProductResponse;
import com.rentalshop.backend.product.entity.Category;
import com.rentalshop.backend.product.entity.Product;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.product.repository.CategoryRepository;
import com.rentalshop.backend.common.response.PaginationResponse;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

public interface ProductService {
    List<ProductResponse> getAllProducts();
    PaginationResponse<ProductResponse> searchProducts(
            String keyword,
            Long categoryId,
            String category,
            Double minPrice,
            Double maxPrice,
            String city,
            String district,
            String merchantTier,
            Double rating,
            Map<String, String> eavFilters,
            Pageable pageable
    );
    ProductResponse getProductById(Long id);
    com.rentalshop.backend.product.dto.response.ProductAvailabilityResponse getProductAvailability(Long id);
    ProductResponse createProduct(ProductResponse productDto);
    ProductResponse updateProduct(Long id, ProductResponse productDto);
    void deleteProduct(Long id);
}
