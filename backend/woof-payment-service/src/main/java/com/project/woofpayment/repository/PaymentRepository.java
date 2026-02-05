package com.project.woofpayment.repository;

import com.project.woofpayment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findAllByUpiId(String upiId);
    void deleteByUpiId(String upiId);
    boolean existsByUpiId(String upiId);
}
