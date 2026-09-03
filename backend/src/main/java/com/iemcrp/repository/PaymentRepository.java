package com.iemcrp.repository;

import com.iemcrp.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByInvoiceId(UUID invoiceId);
    List<Payment> findByCollegeId(UUID collegeId);
    List<Payment> findByTransactionId(String transactionId);
}
