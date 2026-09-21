package com.rentalshop.backend.product.service;

import com.rentalshop.backend.product.dto.response.ProductResponse;
import com.rentalshop.backend.product.entity.Category;
import com.rentalshop.backend.product.entity.Product;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.product.repository.CategoryRepository;
import com.rentalshop.backend.product.repository.ProductRepository;
import java.util.List;
import java.util.stream.Collectors;

public interface ProductService {
    List<ProductResponse> getAllProducts();
    ProductResponse getProductById(Long id);
    ProductResponse createProduct(ProductResponse productDto);
    ProductResponse updateProduct(Long id, ProductResponse productDto);
    void deleteProduct(Long id);
}
