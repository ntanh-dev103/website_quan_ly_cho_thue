package com.rentalshop.backend.contract.repository;

import com.rentalshop.backend.contract.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    
    @Query(value = "SELECT COUNT(*) FROM contracts WHERE status = 'ACTIVE'", nativeQuery = true)
    Long countActiveContracts();
}
