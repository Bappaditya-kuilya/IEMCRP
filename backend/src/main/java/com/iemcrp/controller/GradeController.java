package com.iemcrp.controller;

import com.iemcrp.model.Enrollment;
import com.iemcrp.model.Grade;
import com.iemcrp.model.User;
import com.iemcrp.repository.*;
import com.iemcrp.security.JwtUserDetails;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff/grades")
public class GradeController {

    private final GradeRepository gradeRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final CourseSectionRepository courseSectionRepository;

    public GradeController(GradeRepository gradeRepository,
                           EnrollmentRepository enrollmentRepository,
                           StudentRepository studentRepository,
                           UserRepository userRepository,
                           CourseSectionRepository courseSectionRepository) {
        this.gradeRepository = gradeRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.courseSectionRepository = courseSectionRepository;
    }

    private JwtUserDetails getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (JwtUserDetails) auth.getPrincipal();
    }

    @PostMapping
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> submitGrades(@RequestBody GradeRequest request) {
        JwtUserDetails userDetails = getUserDetails();
        UUID collegeId = userDetails.getCollegeId();

        var section = courseSectionRepository.findById(request.sectionId())
                .orElse(null);
        if (section == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Section not found"));
        }
        if (!section.getCollegeId().equals(collegeId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Section does not belong to your college"));
        }

        User gradedBy = userRepository.findById(userDetails.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        int count = 0;
        for (GradeEntry entry : request.grades()) {
            var student = studentRepository.findById(entry.studentId()).orElse(null);
            if (student == null || !student.getCollege().getId().equals(collegeId)) {
                continue;
            }

            Enrollment enrollment = enrollmentRepository.findByStudentId(student.getId()).stream()
                    .filter(e -> e.getSection().getId().equals(section.getId()))
                    .findFirst()
                    .orElseGet(() -> {
                        Enrollment e = new Enrollment();
                        e.setStudent(student);
                        e.setSection(section);
                        e.setCollegeId(collegeId);
                        e.setStatus("ENROLLED");
                        return enrollmentRepository.save(e);
                    });

            Grade grade = new Grade();
            grade.setEnrollment(enrollment);
            grade.setStudent(student);
            grade.setSection(section);
            grade.setCollegeId(collegeId);
            grade.setGrade(entry.grade());
            grade.setMarks(BigDecimal.valueOf(entry.marks()));
            grade.setGradedBy(gradedBy);
            grade.setGradedAt(LocalDateTime.now());
            gradeRepository.save(grade);
            count++;
        }

        return ResponseEntity.ok(Map.of("message", "Grades submitted", "count", count));
    }

    @GetMapping("/section/{sectionId}")
    @RateLimiter(name = "api")
    public ResponseEntity<?> getGradesBySection(@PathVariable UUID sectionId) {
        JwtUserDetails userDetails = getUserDetails();

        var section = courseSectionRepository.findById(sectionId).orElse(null);
        if (section == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Section not found"));
        }
        if (!section.getCollegeId().equals(userDetails.getCollegeId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Section does not belong to your college"));
        }

        List<Grade> grades = gradeRepository.findBySectionId(sectionId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/student/{studentId}")
    @RateLimiter(name = "api")
    public ResponseEntity<?> getGradesByStudent(@PathVariable UUID studentId) {
        JwtUserDetails userDetails = getUserDetails();

        var student = studentRepository.findById(studentId).orElse(null);
        if (student == null || !student.getCollege().getId().equals(userDetails.getCollegeId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
        }

        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        return ResponseEntity.ok(grades);
    }

    public record GradeRequest(UUID sectionId, List<GradeEntry> grades) {}
    public record GradeEntry(UUID studentId, String grade, double marks) {}
}
