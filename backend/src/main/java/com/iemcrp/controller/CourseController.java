package com.iemcrp.controller;

import com.iemcrp.model.Course;
import com.iemcrp.model.CourseSection;
import com.iemcrp.model.User;
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
@RequestMapping("/api/staff/courses")
public class CourseController {

    private final CourseRepository courseRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public CourseController(CourseRepository courseRepository,
                            CourseSectionRepository courseSectionRepository,
                            UserRepository userRepository,
                            StudentRepository studentRepository) {
        this.courseRepository = courseRepository;
        this.courseSectionRepository = courseSectionRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    private JwtUserDetails getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (JwtUserDetails) auth.getPrincipal();
    }

    private boolean isStaffOrAdmin(JwtUserDetails details) {
        String role = details.getRole();
        return User.Role.STAFF.name().equals(role) || User.Role.ADMIN.name().equals(role);
    }

    @PostMapping
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> createCourse(@RequestBody Map<String, Object> body) {
        JwtUserDetails details = getUserDetails();
        if (!isStaffOrAdmin(details)) {
            return ResponseEntity.status(403).body(Map.of("error", "Staff or admin role required"));
        }

        String code = (String) body.get("code");
        String name = (String) body.get("name");
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Course code is required"));
        }

        var existing = courseRepository.findByCollegeIdAndCode(details.getCollegeId(), code);
        if (existing.isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "Course code already exists"));
        }

        Course course = new Course();
        course.setCollegeId(details.getCollegeId());
        course.setCode(code);
        course.setName((String) body.get("name"));
        course.setCredits(body.get("credits") != null ? (Integer) body.get("credits") : 0);
        course.setDepartment((String) body.get("department"));
        course.setDescription((String) body.get("description"));
        course.setPrerequisites((String) body.get("prerequisites"));
        course.setActive(true);

        return ResponseEntity.status(201).body(courseRepository.save(course));
    }

    @GetMapping
    @RateLimiter(name = "api")
    public ResponseEntity<List<Course>> listCourses() {
        JwtUserDetails details = getUserDetails();
        return ResponseEntity.ok(courseRepository.findByCollegeId(details.getCollegeId()));
    }

    @GetMapping("/{id}")
    @RateLimiter(name = "api")
    public ResponseEntity<?> getCourse(@PathVariable UUID id) {
        JwtUserDetails details = getUserDetails();
        return courseRepository.findByIdAndCollegeId(id, details.getCollegeId())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Course not found")));
    }

    @PutMapping("/{id}")
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> updateCourse(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        JwtUserDetails details = getUserDetails();
        if (!isStaffOrAdmin(details)) {
            return ResponseEntity.status(403).body(Map.of("error", "Staff or admin role required"));
        }

        var opt = courseRepository.findByIdAndCollegeId(id, details.getCollegeId());
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Course not found"));
        }
        Course course = opt.get();
        if (body.containsKey("name")) course.setName((String) body.get("name"));
        if (body.containsKey("credits")) course.setCredits((Integer) body.get("credits"));
        if (body.containsKey("department")) course.setDepartment((String) body.get("department"));
        if (body.containsKey("description")) course.setDescription((String) body.get("description"));
        if (body.containsKey("prerequisites")) course.setPrerequisites((String) body.get("prerequisites"));
        if (body.containsKey("isActive")) course.setActive((Boolean) body.get("isActive"));
        return ResponseEntity.ok(courseRepository.save(course));
    }

    @GetMapping("/{id}/sections")
    @RateLimiter(name = "api")
    public ResponseEntity<?> listSections(@PathVariable UUID id) {
        JwtUserDetails details = getUserDetails();
        var course = courseRepository.findByIdAndCollegeId(id, details.getCollegeId());
        if (course.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Course not found"));
        }
        return ResponseEntity.ok(courseSectionRepository.findByCourseId(id));
    }

    @PostMapping("/{id}/sections")
    @RateLimiter(name = "api")
    @Transactional
    public ResponseEntity<?> createSection(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        JwtUserDetails details = getUserDetails();
        if (!isStaffOrAdmin(details)) {
            return ResponseEntity.status(403).body(Map.of("error", "Staff or admin role required"));
        }

        var course = courseRepository.findByIdAndCollegeId(id, details.getCollegeId());
        if (course.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Course not found"));
        }

        String instructorIdStr = (String) body.get("instructorId");
        if (instructorIdStr == null || instructorIdStr.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Instructor ID is required"));
        }

        UUID instructorId = UUID.fromString(instructorIdStr);
        var instructor = userRepository.findById(instructorId);
        if (instructor.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("error", "Instructor not found"));
        }

        CourseSection section = new CourseSection();
        section.setCourse(course.get());
        section.setCollegeId(details.getCollegeId());
        section.setInstructor(instructor.get());
        section.setSemester(body.get("semester") != null ? (Integer) body.get("semester") : 1);
        section.setAcademicYear(body.get("academicYear") != null ? (Integer) body.get("academicYear") : LocalDateTime.now().getYear());
        section.setSchedule((String) body.get("schedule"));
        section.setRoom((String) body.get("room"));
        section.setMaxCapacity(body.get("maxCapacity") != null ? (Integer) body.get("maxCapacity") : 0);
        section.setCurrentEnrollment(0);
        section.setStatus("OPEN");

        return ResponseEntity.status(201).body(courseSectionRepository.save(section));
    }
}
