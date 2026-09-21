package com.rentalshop.backend.product.service;

import com.rentalshop.backend.product.enums.ItemStatus;
import com.rentalshop.backend.product.entity.ProductItem;
import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.product.repository.ProductItemRepository;
import java.util.List;
import java.util.Map;

public interface ProductItemStateService {
    ProductItem transitionStatus(Long itemId, ItemStatus targetStatus);
}
