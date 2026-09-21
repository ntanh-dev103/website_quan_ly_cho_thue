package com.rentalshop.backend.product.service.impl;

import com.rentalshop.backend.product.service.ProductItemStateService;

import com.rentalshop.backend.product.enums.ItemStatus;
import com.rentalshop.backend.product.entity.ProductItem;
import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.product.repository.ProductItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductItemStateServiceImpl implements ProductItemStateService {

    private final ProductItemRepository productItemRepository;

    private static final Map<ItemStatus, List<ItemStatus>> ALLOWED_TRANSITIONS = Map.of(
            ItemStatus.AVAILABLE, List.of(ItemStatus.RESERVED, ItemStatus.MAINTENANCE, ItemStatus.RETIRED),
            ItemStatus.RESERVED, List.of(ItemStatus.RENTED, ItemStatus.AVAILABLE),
            ItemStatus.RENTED, List.of(ItemStatus.AVAILABLE, ItemStatus.DAMAGED, ItemStatus.MAINTENANCE),
            ItemStatus.MAINTENANCE, List.of(ItemStatus.AVAILABLE, ItemStatus.DAMAGED, ItemStatus.RETIRED),
            ItemStatus.DAMAGED, List.of(ItemStatus.MAINTENANCE, ItemStatus.RETIRED),
            ItemStatus.RETIRED, List.of() // Cannot transition out of RETIRED
    );

    @Transactional
    public ProductItem transitionStatus(Long itemId, ItemStatus targetStatus) {
        ProductItem item = productItemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy vật phẩm với ID: " + itemId));

        ItemStatus currentStatus = item.getStatus();

        if (currentStatus == targetStatus) {
            return item; // No change needed
        }

        List<ItemStatus> allowedNextStates = ALLOWED_TRANSITIONS.get(currentStatus);
        
        if (allowedNextStates == null || !allowedNextStates.contains(targetStatus)) {
            throw new BadRequestException(
                    String.format("Không thể chuyển trạng thái vật phẩm từ %s sang %s", currentStatus, targetStatus)
            );
        }

        item.setStatus(targetStatus);
        return productItemRepository.save(item);
    }
}
