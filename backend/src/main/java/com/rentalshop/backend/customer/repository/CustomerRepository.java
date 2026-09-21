package com.rentalshop.backend.customer.repository;

import com.rentalshop.backend.customer.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByPhone(String phone);
    boolean existsByCccd(String cccd);
    
    Page<Customer> findByFullNameContainingIgnoreCaseOrPhoneContaining(String name, String phone, Pageable pageable);

    @Query(value = "SELECT c.id, c.full_name, c.phone, COUNT(ct.id) as total_contracts, SUM(ct.total_rent_fee + ct.penalty_fee) as total_spent " +
                   "FROM customers c " +
                   "JOIN contracts ct ON c.id = ct.customer_id " +
                   "GROUP BY c.id, c.full_name, c.phone " +
                   "ORDER BY total_spent DESC", 
           nativeQuery = true)
    List<Object[]> findTopCustomers(Pageable pageable);
}
