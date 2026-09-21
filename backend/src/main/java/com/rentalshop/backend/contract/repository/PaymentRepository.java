package com.rentalshop.backend.contract.repository;

import com.rentalshop.backend.contract.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Zero-sum validation: SUM(debit) - SUM(credit) must equal 0 for a given transaction.
     */
    @Query(value = "SELECT COALESCE(SUM(debit_amount), 0) - COALESCE(SUM(credit_amount), 0) " +
                   "FROM payments WHERE transaction_id = :trxId",
           nativeQuery = true)
    Double getTransactionBalance(@Param("trxId") String transactionId);

    @Query(value = "SELECT CAST(created_at AS DATE) as date, " +
                   "SUM(CASE WHEN payment_type IN ('RENT_FEE', 'PENALTY', 'COMPENSATION') THEN debit_amount ELSE 0 END) as DOANH_THU_THUC_TE, " +
                   "SUM(CASE WHEN payment_type = 'DEBT' THEN debit_amount ELSE 0 END) as TIEN_NO " +
                   "FROM payments " +
                   "WHERE CAST(created_at AS DATE) BETWEEN :fromDate AND :toDate " +
                   "GROUP BY CAST(created_at AS DATE)",
           nativeQuery = true)
    List<Object[]> getRevenueChart(@Param("fromDate") LocalDate fromDate, @Param("toDate") LocalDate toDate);

    @Query(value = "SELECT COALESCE(SUM(CASE WHEN payment_type IN ('RENT_FEE', 'PENALTY', 'COMPENSATION') THEN debit_amount ELSE 0 END), 0) " +
                   "FROM payments " +
                   "WHERE YEAR(created_at) = :year AND MONTH(created_at) = :month",
           nativeQuery = true)
    Double getRevenueByMonthAndYear(@Param("year") int year, @Param("month") int month);

    @Query(value = "SELECT ct.id, c.full_name, c.phone, SUM(p.debit_amount) as debtAmount " +
                   "FROM payments p " +
                   "JOIN contracts ct ON p.contract_id = ct.id " +
                   "JOIN customers c ON ct.customer_id = c.id " +
                   "WHERE p.payment_type = 'DEBT' " +
                   "GROUP BY ct.id, c.full_name, c.phone",
           nativeQuery = true)
    List<Object[]> getDebtList();
}
