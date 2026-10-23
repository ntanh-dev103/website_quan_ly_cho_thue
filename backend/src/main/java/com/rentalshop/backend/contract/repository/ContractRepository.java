package com.rentalshop.backend.contract.repository;

import com.rentalshop.backend.contract.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    
    @Query(value = "SELECT COUNT(*) FROM contracts WHERE status = 'ACTIVE'", nativeQuery = true)
    Long countActiveContracts();

    @Query("SELECT DISTINCT c FROM Contract c JOIN c.details cd WHERE cd.item.product.id = :productId AND c.status IN ('ACTIVE', 'OVERDUE', 'PENDING_DEPOSIT')")
    java.util.List<Contract> findActiveContractsByProductId(@org.springframework.data.repository.query.Param("productId") Long productId);

    @Query("SELECT c FROM Contract c WHERE (:customerId IS NULL OR c.customer.id = :customerId) AND (:status IS NULL OR c.status = :status)")
    org.springframework.data.domain.Page<Contract> findByCustomerIdAndStatus(
            @org.springframework.data.repository.query.Param("customerId") Long customerId,
            @org.springframework.data.repository.query.Param("status") com.rentalshop.backend.contract.enums.ContractStatus status,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT DISTINCT c FROM Contract c JOIN c.details cd WHERE (:merchantId IS NULL OR cd.item.product.merchant.id = :merchantId) AND (:status IS NULL OR c.status = :status) ORDER BY c.createdAt DESC")
    org.springframework.data.domain.Page<Contract> findByMerchantIdAndStatus(
            @org.springframework.data.repository.query.Param("merchantId") Long merchantId,
            @org.springframework.data.repository.query.Param("status") com.rentalshop.backend.contract.enums.ContractStatus status,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT DISTINCT c FROM Contract c JOIN c.details cd WHERE (:merchantId IS NULL OR cd.item.product.merchant.id = :merchantId)")
    java.util.List<Contract> findAllByMerchantId(@org.springframework.data.repository.query.Param("merchantId") Long merchantId);
}

