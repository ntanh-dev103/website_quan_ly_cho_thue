package com.rentalshop.backend.product.repository;

import com.rentalshop.backend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByFeaturedTrue();
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByMerchantId(Long merchantId);
    Long countByMerchantId(Long merchantId);
}

