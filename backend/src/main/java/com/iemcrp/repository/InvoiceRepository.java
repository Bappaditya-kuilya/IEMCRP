package com.iemcrp.repository;

import com.iemcrp.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByStudentId(UUID studentId);
    List<Invoice> findByStudentIdAndStatus(UUID studentId, String status);
    List<Invoice> findByCollegeId(UUID collegeId);
    List<Invoice> findByCollegeIdAndStatus(UUID collegeId, String status);
    List<Invoice> findByStudentIdAndFeeStructureId(UUID studentId, UUID feeStructureId);
}
