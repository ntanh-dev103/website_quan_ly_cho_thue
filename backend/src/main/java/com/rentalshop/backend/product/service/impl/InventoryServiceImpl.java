package com.rentalshop.backend.product.service.impl;

import com.rentalshop.backend.product.service.InventoryService;
import com.rentalshop.backend.product.dto.request.CheckAvailabilityRequest;
import com.rentalshop.backend.product.dto.request.CreateProductItemRequest;
import com.rentalshop.backend.product.dto.request.UpdateItemStatusRequest;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {
    
    private final ProductItemRepository productItemRepository;
    private final ProductRepository productRepository;

    @Override
    public List<ProductItemResponse> getItemsByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new NotFoundException("Không tìm thấy sản phẩm với ID: " + productId);
        }
        return productItemRepository.findByProductId(productId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductItemResponse> getMerchantItems(Long merchantId) {
        return productItemRepository.findByMerchantId(merchantId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductItemResponse createProductItem(Long productId, CreateProductItemRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + productId));

        if (request.getSerialNumber() != null && !request.getSerialNumber().isBlank()) {
            if (productItemRepository.existsBySerialNumber(request.getSerialNumber().trim())) {
                throw new BadRequestException("Số Serial/IMEI '" + request.getSerialNumber() + "' đã tồn tại trong hệ thống");
            }
        }

        if (request.getBarcode() != null && !request.getBarcode().isBlank()) {
            if (productItemRepository.existsByBarcode(request.getBarcode().trim())) {
                throw new BadRequestException("Mã vạch '" + request.getBarcode() + "' đã tồn tại trong hệ thống");
            }
        }

        String skuCode = request.getSkuCode();
        if (skuCode == null || skuCode.isBlank()) {
            skuCode = "SKU-" + product.getId() + "-" + (System.currentTimeMillis() % 1000000);
        }

        ProductItem item = ProductItem.builder()
                .product(product)
                .skuCode(skuCode)
                .serialNumber(request.getSerialNumber() != null ? request.getSerialNumber().trim() : null)
                .barcode(request.getBarcode() != null ? request.getBarcode().trim() : null)
                .status(request.getStatus() != null ? request.getStatus() : ItemStatus.AVAILABLE)
                .conditionScore(request.getConditionScore() != null ? request.getConditionScore() : 100)
                .warehouseLocation(request.getWarehouseLocation() != null ? request.getWarehouseLocation().trim() : "Kho trung tâm")
                .notes(request.getNotes())
                .build();

        return mapToDto(productItemRepository.save(item));
    }

    @Override
    @Transactional
    public ProductItemResponse createProductItem(Long productId, ProductItemResponse itemDto) {
        CreateProductItemRequest req = CreateProductItemRequest.builder()
                .skuCode(itemDto.getSkuCode())
                .serialNumber(itemDto.getSerialNumber())
                .barcode(itemDto.getBarcode())
                .status(itemDto.getStatus())
                .conditionScore(itemDto.getConditionScore())
                .warehouseLocation(itemDto.getWarehouseLocation())
                .notes(itemDto.getNotes())
                .build();
        return createProductItem(productId, req);
    }

    @Override
    @Transactional
    public ProductItemResponse updateItemStatus(Long itemId, UpdateItemStatusRequest request) {
        ProductItem item = productItemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy thiết bị vật lý với ID: " + itemId));

        if (item.getStatus() == ItemStatus.RENTED && request.getStatus() != ItemStatus.RENTED) {
            throw new BadRequestException("Không thể đổi trạng thái của thiết bị đang trong hợp đồng thuê trực tiếp");
        }

        item.setStatus(request.getStatus());
        if (request.getConditionScore() != null) {
            item.setConditionScore(request.getConditionScore());
        }
        if (request.getWarehouseLocation() != null && !request.getWarehouseLocation().isBlank()) {
            item.setWarehouseLocation(request.getWarehouseLocation().trim());
        }
        if (request.getNotes() != null) {
            item.setNotes(request.getNotes());
        }

        return mapToDto(productItemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteProductItem(Long itemId) {
        ProductItem item = productItemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy thiết bị vật lý với ID: " + itemId));

        // Delete guard invariant: Never delete an item currently rented
        if (item.getStatus() == ItemStatus.RENTED) {
            throw new BadRequestException("Không thể xóa thiết bị đang trong hợp đồng thuê");
        }

        productItemRepository.delete(item);
    }

    @Override
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
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProduct() != null ? item.getProduct().getName() : null)
                .skuCode(item.getSkuCode())
                .serialNumber(item.getSerialNumber())
                .barcode(item.getBarcode())
                .status(item.getStatus())
                .conditionScore(item.getConditionScore())
                .warehouseLocation(item.getWarehouseLocation())
                .notes(item.getNotes())
                .build();
    }
}
