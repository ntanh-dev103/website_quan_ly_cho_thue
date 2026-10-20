package com.rentalshop.backend.auth.repository;

import com.rentalshop.backend.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username = :login OR u.email = :login")
    Optional<User> findByUsernameOrEmail(@Param("login") String login);

    Long countByRole(com.rentalshop.backend.auth.entity.Role role);

    java.util.List<User> findByRole(com.rentalshop.backend.auth.entity.Role role);

    @Query("SELECT u FROM User u WHERE (u.companyName IS NOT NULL OR u.role = 'MERCHANT') AND (u.verifiedIdentity IS NULL OR u.verifiedIdentity = false) ORDER BY u.createdAt DESC")
    java.util.List<User> findPendingMerchantApplications();

    @Query("SELECT u FROM User u WHERE (:role IS NULL OR u.role = :role) " +
           "AND (:isActive IS NULL OR u.isActive = :isActive) " +
           "AND (:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY u.id DESC")
    org.springframework.data.domain.Page<User> findUsersFiltered(
            @Param("role") com.rentalshop.backend.auth.entity.Role role,
            @Param("isActive") Boolean isActive,
            @Param("search") String search,
            org.springframework.data.domain.Pageable pageable);
}
