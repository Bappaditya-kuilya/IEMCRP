package com.iemcrp.controller;

import com.iemcrp.model.*;
import com.iemcrp.repository.*;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
public class ReportController {

    private final EnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final AttendanceRepository attendanceRepository;

    public ReportController(EnrollmentRepository enrollmentRepository,
                            GradeRepository gradeRepository,
                            InvoiceRepository invoiceRepository,
                            PaymentRepository paymentRepository,
                            AttendanceRepository attendanceRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.gradeRepository = gradeRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @GetMapping("/enrollment")
    @RateLimiter(name = "api")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> enrollmentSummary() {
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        Map<String, Integer> byDepartment = new HashMap<>();
        Map<String, Integer> bySemester = new HashMap<>();

        for (Enrollment e : enrollments) {
            String dept = e.getStudent().getDepartment();
            byDepartment.merge(dept, 1, Integer::sum);
            String sem = String.valueOf(e.getSection().getSemester());
            bySemester.merge(sem, 1, Integer::sum);
        }

        return ResponseEntity.ok(Map.of(
                "totalEnrolled", enrollments.size(),
                "byDepartment", byDepartment,
                "bySemester", bySemester
        ));
    }

    @GetMapping("/grades")
    @RateLimiter(name = "api")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> gradeDistribution() {
        List<Grade> grades = gradeRepository.findAll();
        Map<String, Integer> gradeDistribution = new HashMap<>();
        BigDecimal totalMarks = BigDecimal.ZERO;
        int count = 0;

        for (Grade g : grades) {
            gradeDistribution.merge(g.getGrade(), 1, Integer::sum);
            if (g.getMarks() != null) {
                totalMarks = totalMarks.add(g.getMarks());
                count++;
            }
        }

        double averageMarks = count == 0 ? 0 :
                totalMarks.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP).doubleValue();

        return ResponseEntity.ok(Map.of(
                "gradeDistribution", gradeDistribution,
                "averageMarks", averageMarks
        ));
    }

    @GetMapping("/fees")
    @RateLimiter(name = "api")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> feeSummary() {
        List<Invoice> invoices = invoiceRepository.findAll();
        BigDecimal totalInvoiced = BigDecimal.ZERO;
        BigDecimal totalPaid = BigDecimal.ZERO;

        for (Invoice inv : invoices) {
            totalInvoiced = totalInvoiced.add(inv.getTotalAmount());
            totalPaid = totalPaid.add(inv.getPaidAmount());
        }

        BigDecimal outstanding = totalInvoiced.subtract(totalPaid);
        double collectionRate = totalInvoiced.compareTo(BigDecimal.ZERO) == 0 ? 0 :
                totalPaid.multiply(BigDecimal.valueOf(100))
                        .divide(totalInvoiced, 2, RoundingMode.HALF_UP)
                        .doubleValue();

        return ResponseEntity.ok(Map.of(
                "totalInvoiced", totalInvoiced,
                "totalPaid", totalPaid,
                "outstanding", outstanding,
                "collectionRate", collectionRate
        ));
    }

    @GetMapping("/attendance")
    @RateLimiter(name = "api")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> attendanceSummary() {
        List<Attendance> records = attendanceRepository.findAll();
        int presentCount = 0;
        int absentCount = 0;
        int lateCount = 0;

        for (Attendance a : records) {
            switch (a.getStatus()) {
                case PRESENT -> presentCount++;
                case ABSENT -> absentCount++;
                case LATE -> lateCount++;
            }
        }

        int total = records.size();
        double attendanceRate = total == 0 ? 0 :
                (presentCount + lateCount) * 100.0 / total;

        return ResponseEntity.ok(Map.of(
                "totalRecords", total,
                "presentCount", presentCount,
                "absentCount", absentCount,
                "lateCount", lateCount,
                "attendanceRate", Math.round(attendanceRate * 100.0) / 100.0
        ));
    }
}
