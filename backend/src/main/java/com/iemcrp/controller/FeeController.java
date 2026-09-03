package com.iemcrp.controller;

import com.iemcrp.model.FeeStructure;
import com.iemcrp.model.Invoice;
import com.iemcrp.model.Payment;
import com.iemcrp.model.Student;
import com.iemcrp.repository.*;
import com.iemcrp.security.JwtUserDetails;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/fees")
public class FeeController {

    private final FeeStructureRepository feeStructureRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;

    public FeeController(FeeStructureRepository feeStructureRepository,
                         InvoiceRepository invoiceRepository,
                         PaymentRepository paymentRepository,
                         StudentRepository studentRepository) {
        this.feeStructureRepository = feeStructureRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.studentRepository = studentRepository;
    }

    private JwtUserDetails getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (JwtUserDetails) auth.getPrincipal();
    }

    @PostMapping("/structures")
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> createFeeStructure(@RequestBody FeeStructureRequest request) {
        JwtUserDetails userDetails = getUserDetails();

        FeeStructure fs = new FeeStructure();
        fs.setCollegeId(userDetails.getCollegeId());
        fs.setName(request.name());
        fs.setAmount(request.amount());
        fs.setSemester(request.semester());
        fs.setAcademicYear(request.academicYear());
        fs.setDueDate(request.dueDate());
        fs.setActive(true);

        FeeStructure saved = feeStructureRepository.save(fs);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/structures")
    @RateLimiter(name = "api")
    public ResponseEntity<List<FeeStructure>> listFeeStructures() {
        JwtUserDetails userDetails = getUserDetails();
        return ResponseEntity.ok(feeStructureRepository.findByCollegeId(userDetails.getCollegeId()));
    }

    @PutMapping("/structures/{id}")
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> updateFeeStructure(@PathVariable UUID id, @RequestBody FeeStructureRequest request) {
        JwtUserDetails userDetails = getUserDetails();

        FeeStructure fs = feeStructureRepository.findByIdAndCollegeId(id, userDetails.getCollegeId()).orElse(null);
        if (fs == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fee structure not found"));
        }

        fs.setName(request.name());
        fs.setAmount(request.amount());
        fs.setSemester(request.semester());
        fs.setAcademicYear(request.academicYear());
        fs.setDueDate(request.dueDate());

        FeeStructure saved = feeStructureRepository.save(fs);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/invoices/generate")
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> generateInvoices(@RequestBody InvoiceGenerateRequest request) {
        JwtUserDetails userDetails = getUserDetails();
        UUID collegeId = userDetails.getCollegeId();

        FeeStructure fs = feeStructureRepository.findByIdAndCollegeId(request.feeStructureId(), collegeId).orElse(null);
        if (fs == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fee structure not found"));
        }

        List<Student> students = studentRepository.findAll().stream()
                .filter(s -> s.getCollege().getId().equals(collegeId))
                .toList();

        int count = 0;
        for (Student student : students) {
            List<Invoice> existing = invoiceRepository.findByStudentIdAndFeeStructureId(student.getId(), fs.getId());
            if (!existing.isEmpty()) {
                continue;
            }

            Invoice invoice = new Invoice();
            invoice.setStudent(student);
            invoice.setFeeStructure(fs);
            invoice.setCollegeId(collegeId);
            invoice.setTotalAmount(fs.getAmount());
            invoice.setPaidAmount(BigDecimal.ZERO);
            invoice.setStatus("PENDING");
            invoice.setDueDate(fs.getDueDate());
            invoiceRepository.save(invoice);
            count++;
        }

        return ResponseEntity.ok(Map.of("message", "Invoices generated", "count", count));
    }

    @GetMapping("/invoices/student/{studentId}")
    @RateLimiter(name = "api")
    public ResponseEntity<?> getStudentInvoices(@PathVariable UUID studentId) {
        JwtUserDetails userDetails = getUserDetails();

        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null || !student.getCollege().getId().equals(userDetails.getCollegeId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
        }

        List<Invoice> invoices = invoiceRepository.findByStudentId(studentId);
        return ResponseEntity.ok(invoices);
    }

    @PostMapping("/invoices/{invoiceId}/pay")
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> recordPayment(@PathVariable UUID invoiceId, @RequestBody PaymentRequest request) {
        JwtUserDetails userDetails = getUserDetails();
        UUID collegeId = userDetails.getCollegeId();

        Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);
        if (invoice == null || !invoice.getCollegeId().equals(collegeId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invoice not found"));
        }

        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setCollegeId(collegeId);
        payment.setAmount(request.amount());
        payment.setPaymentMethod(request.paymentMethod());
        payment.setTransactionId(request.transactionId());
        paymentRepository.save(payment);

        invoice.setPaidAmount(invoice.getPaidAmount().add(request.amount()));
        if (invoice.getPaidAmount().compareTo(invoice.getTotalAmount()) >= 0) {
            invoice.setStatus("PAID");
        } else {
            invoice.setStatus("PARTIAL");
        }
        invoiceRepository.save(invoice);

        return ResponseEntity.ok(Map.of("message", "Payment recorded", "invoiceId", invoiceId));
    }

    public record FeeStructureRequest(String name, BigDecimal amount, Integer semester, Integer academicYear, LocalDate dueDate) {}
    public record InvoiceGenerateRequest(UUID feeStructureId, Integer semester, Integer academicYear) {}
    public record PaymentRequest(BigDecimal amount, String paymentMethod, String transactionId) {}
}
