package com.rentalshop.backend.product.service;

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
import com.rentalshop.backend.product.dto.request.CreateProductItemRequest;
import com.rentalshop.backend.product.dto.request.UpdateItemStatusRequest;
import java.util.List;

public interface InventoryService {
    List<ProductItemResponse> getItemsByProductId(Long productId);
    List<ProductItemResponse> getMerchantItems(Long merchantId);
    ProductItemResponse createProductItem(Long productId, CreateProductItemRequest request);
    ProductItemResponse createProductItem(Long productId, ProductItemResponse itemDto);
    ProductItemResponse updateItemStatus(Long itemId, UpdateItemStatusRequest request);
    void deleteProductItem(Long itemId);
    List<CheckAvailabilityResponse> checkAvailability(CheckAvailabilityRequest request);
}

