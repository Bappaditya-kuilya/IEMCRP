package com.iemcrp.controller;

import com.iemcrp.model.CourseSection;
import com.iemcrp.model.Enrollment;
import com.iemcrp.model.Student;
import com.iemcrp.repository.*;
import com.iemcrp.security.JwtUserDetails;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/student/enroll")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public EnrollmentController(EnrollmentRepository enrollmentRepository,
                                CourseSectionRepository courseSectionRepository,
                                StudentRepository studentRepository,
                                UserRepository userRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseSectionRepository = courseSectionRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    private JwtUserDetails getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (JwtUserDetails) auth.getPrincipal();
    }

    private Student getStudentByUserId(UUID userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
    }

    private boolean isStaffOrAdmin(JwtUserDetails details) {
        String role = details.getRole();
        return "STAFF".equals(role) || "ADMIN".equals(role);
    }

    @PostMapping("/{sectionId}")
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> enroll(@PathVariable UUID sectionId) {
        JwtUserDetails details = getUserDetails();
        Student student = getStudentByUserId(details.getUserId());

        return courseSectionRepository.findById(sectionId)
                .filter(s -> s.getCollegeId().equals(details.getCollegeId()))
                .map(section -> {
                    if (!"OPEN".equals(section.getStatus())) {
                        return (ResponseEntity<?>) ResponseEntity.status(400).body(Map.of("error", "Section is not open for enrollment"));
                    }
                    if (section.getCurrentEnrollment() >= section.getMaxCapacity()) {
                        return (ResponseEntity<?>) ResponseEntity.status(400).body(Map.of("error", "Section is full"));
                    }
                    if (enrollmentRepository.existsByStudentIdAndSectionId(student.getId(), sectionId)) {
                        return (ResponseEntity<?>) ResponseEntity.status(409).body(Map.of("error", "Already enrolled in this section"));
                    }

                    Enrollment enrollment = new Enrollment();
                    enrollment.setStudent(student);
                    enrollment.setSection(section);
                    enrollment.setCollegeId(details.getCollegeId());
                    enrollment.setStatus("ENROLLED");

                    section.setCurrentEnrollment(section.getCurrentEnrollment() + 1);
                    courseSectionRepository.save(section);
                    enrollmentRepository.save(enrollment);

                    return (ResponseEntity<?>) ResponseEntity.status(201).body(enrollment);
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Section not found")));
    }

    @DeleteMapping("/{sectionId}")
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> drop(@PathVariable UUID sectionId) {
        JwtUserDetails details = getUserDetails();
        Student student = getStudentByUserId(details.getUserId());

        var enrollment = enrollmentRepository.findByStudentId(student.getId()).stream()
                .filter(e -> e.getSection().getId().equals(sectionId) && "ENROLLED".equals(e.getStatus()))
                .findFirst();

        if (enrollment.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Active enrollment not found"));
        }

        Enrollment e = enrollment.get();
        e.setStatus("DROPPED");
        e.setDroppedAt(LocalDateTime.now());
        enrollmentRepository.save(e);

        CourseSection section = e.getSection();
        section.setCurrentEnrollment(Math.max(0, section.getCurrentEnrollment() - 1));
        courseSectionRepository.save(section);

        return ResponseEntity.ok(Map.of("message", "Successfully dropped"));
    }

    @GetMapping
    @RateLimiter(name = "api")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> myEnrollments() {
        JwtUserDetails details = getUserDetails();
        Student student = getStudentByUserId(details.getUserId());
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        return ResponseEntity.ok(enrollments.stream().map(e -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", e.getId());
            map.put("status", e.getStatus());
            map.put("enrolledAt", e.getEnrolledAt());
            map.put("sectionId", e.getSection().getId());
            map.put("courseCode", e.getSection().getCourse().getCode());
            map.put("courseName", e.getSection().getCourse().getName());
            map.put("semester", e.getSection().getSemester());
            map.put("academicYear", e.getSection().getAcademicYear());
            return map;
        }).toList());
    }

    @GetMapping("/all")
    @RateLimiter(name = "api")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> allEnrollments() {
        JwtUserDetails details = getUserDetails();
        if (!isStaffOrAdmin(details)) {
            return ResponseEntity.status(403).body(List.of());
        }
        List<Enrollment> enrollments = enrollmentRepository.findByCollegeId(details.getCollegeId());
        return ResponseEntity.ok(enrollments.stream().map(e -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", e.getId());
            map.put("status", e.getStatus());
            map.put("enrolledAt", e.getEnrolledAt());
            map.put("studentName", e.getStudent().getUser().getFirstName() + " " + e.getStudent().getUser().getLastName());
            map.put("rollNumber", e.getStudent().getRollNumber());
            map.put("courseCode", e.getSection().getCourse().getCode());
            map.put("courseName", e.getSection().getCourse().getName());
            return map;
        }).toList());
    }
}
