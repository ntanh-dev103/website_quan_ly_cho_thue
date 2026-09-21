package com.rentalshop.backend.product.service.impl;

import com.rentalshop.backend.product.service.InventoryService;

import com.rentalshop.backend.product.dto.request.CheckAvailabilityRequest;
import com.rentalshop.backend.product.dto.response.CheckAvailabilityResponse;
import com.rentalshop.backend.product.dto.response.ProductItemResponse;
import com.rentalshop.backend.product.enums.ItemStatus;
import com.rentalshop.backend.product.entity.Product;
import com.rentalshop.backend.product.entity.ProductItem;
import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.product.repository.ProductItemRepository;
import com.rentalshop.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {
    
    private final ProductItemRepository productItemRepository;
    private final ProductRepository productRepository;

    public List<ProductItemResponse> getItemsByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new NotFoundException("Không tìm thấy sản phẩm với ID: " + productId);
        }
        return productItemRepository.findByProductId(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductItemResponse createProductItem(Long productId, ProductItemResponse itemDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + productId));
                
        ProductItem item = ProductItem.builder()
                .product(product)
                .skuCode(itemDto.getSkuCode())
                .status(ItemStatus.AVAILABLE) // Mặc định khi nhập kho
                .notes(itemDto.getNotes())
                .build();
                
        return mapToDto(productItemRepository.save(item));
    }

    public List<CheckAvailabilityResponse> checkAvailability(CheckAvailabilityRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Ngày bắt đầu phải trước ngày kết thúc");
        }
        
        List<ProductItem> availableItems = productItemRepository.findAvailableItemsForRent(
                request.getProductId(),
                request.getStartDate(),
                request.getEndDate()
        );
        
        return availableItems.stream()
                .map(item -> CheckAvailabilityResponse.builder()
                        .itemId(item.getId())
                        .skuCode(item.getSkuCode())
                        .build())
                .collect(Collectors.toList());
    }

    private ProductItemResponse mapToDto(ProductItem item) {
        return ProductItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .skuCode(item.getSkuCode())
                .status(item.getStatus())
                .notes(item.getNotes())
                .build();
    }
}
