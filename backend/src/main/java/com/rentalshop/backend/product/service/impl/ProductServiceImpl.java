package com.rentalshop.backend.product.service.impl;

import com.rentalshop.backend.product.service.ProductService;

import com.rentalshop.backend.product.dto.response.ProductResponse;
import com.rentalshop.backend.product.entity.Category;
import com.rentalshop.backend.product.entity.Product;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.product.repository.CategoryRepository;
import com.rentalshop.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        return mapToDto(product);
    }

    public ProductResponse createProduct(ProductResponse productDto) {
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục với ID: " + productDto.getCategoryId()));

        Product product = Product.builder()
                .name(productDto.getName())
                .description(productDto.getDescription())
                .rentPrice(productDto.getRentPrice())
                .depositPrice(productDto.getDepositPrice())
                .category(category)
                .build();
                
        return mapToDto(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductResponse productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + id));
                
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục với ID: " + productDto.getCategoryId()));

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setRentPrice(productDto.getRentPrice());
        product.setDepositPrice(productDto.getDepositPrice());
        product.setCategory(category);
        
        return mapToDto(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy sản phẩm với ID: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse mapToDto(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .rentPrice(product.getRentPrice())
                .depositPrice(product.getDepositPrice())
                .categoryId(product.getCategory().getId())
                .build();
    }
}
