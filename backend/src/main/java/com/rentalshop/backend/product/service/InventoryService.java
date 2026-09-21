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
import java.util.List;
import java.util.stream.Collectors;

public interface InventoryService {
    List<ProductItemResponse> getItemsByProductId(Long productId);
    ProductItemResponse createProductItem(Long productId, ProductItemResponse itemDto);
    List<CheckAvailabilityResponse> checkAvailability(CheckAvailabilityRequest request);
}
