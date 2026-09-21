package com.rentalshop.backend.product.repository;
import com.rentalshop.backend.contract.entity.ContractDetail;

import com.rentalshop.backend.product.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {

    List<ProductItem> findByProductId(Long productId);

    @Query("SELECT p FROM ProductItem p WHERE p.product.id = :productId AND p.status = 'AVAILABLE' AND p.id NOT IN (" +
           "SELECT cd.item.id FROM ContractDetail cd JOIN cd.contract c " +
           "WHERE c.status IN ('ACTIVE', 'OVERDUE') AND c.startDate < :endDate AND c.endDate > :startDate)")
    List<ProductItem> findAvailableItemsForRent(
            @Param("productId") Long productId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM ProductItem p WHERE p.id IN :ids")
    List<ProductItem> findByIdsWithLock(@Param("ids") List<Long> ids);

    @Query(value = "SELECT status, COUNT(*) FROM product_items GROUP BY status", nativeQuery = true)
    List<Object[]> countItemsByStatus();
}
