package com.iemcrp.controller;

import com.iemcrp.dto.ExamRequest;
import com.iemcrp.dto.ResultUploadRequest;
import com.iemcrp.dto.StaffDashboardResponse;
import com.iemcrp.model.College;
import com.iemcrp.model.Exam;
import com.iemcrp.model.Result;
import com.iemcrp.model.Student;
import com.iemcrp.model.User;
import com.iemcrp.repository.CollegeRepository;
import com.iemcrp.repository.ExamRepository;
import com.iemcrp.repository.ResultRepository;
import com.iemcrp.repository.StudentRepository;
import com.iemcrp.repository.UserRepository;
import com.iemcrp.security.JwtUserDetails;
import com.iemcrp.service.AuditService;
import com.iemcrp.service.ResultCacheService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final UserRepository userRepository;
    private final ResultRepository resultRepository;
    private final ExamRepository examRepository;
    private final StudentRepository studentRepository;
    private final CollegeRepository collegeRepository;
    private final AuditService auditService;
    private final ResultCacheService resultCacheService;

    public StaffController(UserRepository userRepository, ResultRepository resultRepository,
                           ExamRepository examRepository, StudentRepository studentRepository,
                           CollegeRepository collegeRepository, AuditService auditService,
                           ResultCacheService resultCacheService) {
        this.userRepository = userRepository;
        this.resultRepository = resultRepository;
        this.examRepository = examRepository;
        this.studentRepository = studentRepository;
        this.collegeRepository = collegeRepository;
        this.auditService = auditService;
        this.resultCacheService = resultCacheService;
    }

    private JwtUserDetails getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (JwtUserDetails) auth.getPrincipal();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<StaffDashboardResponse> dashboard() {
        JwtUserDetails userDetails = getUserDetails();

        StaffDashboardResponse response = new StaffDashboardResponse();

        long totalStudents = userRepository.findAll().stream()
                .filter(u -> u.getCollegeId().equals(userDetails.getCollegeId())
                        && u.getRole() == User.Role.STUDENT)
                .count();
        response.setTotalStudents((int) totalStudents);

        response.setPendingTasks(List.of(
                "Review pending result uploads",
                "Update attendance records"
        ));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/results")
    public ResponseEntity<List<StaffDashboardResponse.RecentResult>> results() {
        JwtUserDetails userDetails = getUserDetails();
        List<Result> results = resultRepository.findAll().stream()
                .filter(r -> r.getStudent().getCollege().getId().equals(userDetails.getCollegeId()))
                .toList();

        List<StaffDashboardResponse.RecentResult> mapped = results.stream()
                .map(r -> {
                    StaffDashboardResponse.RecentResult rr = new StaffDashboardResponse.RecentResult();
                    User studentUser = r.getStudent().getUser();
                    rr.setStudentName(
                            (studentUser.getFirstName() != null ? studentUser.getFirstName() : "") + " "
                            + (studentUser.getLastName() != null ? studentUser.getLastName() : ""));
                    rr.setExamName(r.getExam().getName());
                    rr.setSubjectName(r.getSubjectName());
                    rr.setMarksObtained(r.getMarksObtained());
                    rr.setMaxMarks(r.getMaxMarks());
                    return rr;
                })
                .toList();

        return ResponseEntity.ok(mapped);
    }

    @PostMapping("/results")
    public ResponseEntity<?> uploadResults(@RequestBody ResultUploadRequest request, HttpServletRequest httpRequest) {
        JwtUserDetails userDetails = getUserDetails();
        UUID collegeId = userDetails.getCollegeId();

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        if (!exam.getCollege().getId().equals(collegeId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Exam does not belong to your college"));
        }

        int savedCount = 0;
        for (ResultUploadRequest.StudentResult sr : request.getResults()) {
            Student student = studentRepository.findById(sr.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found: " + sr.getStudentId()));
            if (!student.getCollege().getId().equals(collegeId)) {
                continue;
            }
            if (sr.getMarksObtained() < 0 || sr.getMarksObtained() > sr.getMaxMarks()) {
                continue;
            }

            double pct = sr.getMaxMarks() > 0 ? (double) sr.getMarksObtained() * 100 / sr.getMaxMarks() : 0;
            String grade;
            if (pct >= 90) grade = "A+";
            else if (pct >= 80) grade = "A";
            else if (pct >= 70) grade = "B+";
            else if (pct >= 60) grade = "B";
            else if (pct >= 50) grade = "C";
            else grade = "F";

            List<Result> existing = resultRepository.findByStudentIdAndExamId(student.getId(), exam.getId());
            Result result = existing.stream()
                    .filter(r -> r.getSubjectCode().equals(sr.getSubjectCode()))
                    .findFirst()
                    .orElse(new Result());

            result.setStudent(student);
            result.setExam(exam);
            result.setSubjectCode(sr.getSubjectCode());
            result.setSubjectName(sr.getSubjectName());
            result.setMarksObtained(sr.getMarksObtained());
            result.setMaxMarks(sr.getMaxMarks());
            result.setGrade(grade);
            resultRepository.save(result);
            savedCount++;
        }

        resultCacheService.preComputeExamResults(exam.getId());
        auditService.logResultUpload(userDetails.getUserId(), exam.getId(), httpRequest.getRemoteAddr());

        return ResponseEntity.ok(Map.of("message", "Results uploaded", "count", savedCount));
    }

    @PostMapping("/exams")
    public ResponseEntity<Exam> createExam(@RequestBody ExamRequest request, HttpServletRequest httpRequest) {
        JwtUserDetails userDetails = getUserDetails();
        College college = collegeRepository.findById(userDetails.getCollegeId())
                .orElseThrow(() -> new RuntimeException("College not found"));

        Exam exam = new Exam();
        exam.setCollege(college);
        exam.setName(request.getName());
        exam.setExamType(Exam.ExamType.valueOf(request.getExamType()));
        exam.setSemester(request.getSemester());
        exam.setAcademicYear(request.getAcademicYear());

        Exam saved = examRepository.save(exam);
        auditService.log(userDetails.getUserId(), "CREATE_EXAM", "EXAM", saved.getId(), httpRequest.getRemoteAddr());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/exams")
    public ResponseEntity<List<Exam>> listExams() {
        JwtUserDetails userDetails = getUserDetails();
        return ResponseEntity.ok(examRepository.findByCollegeId(userDetails.getCollegeId()));
    }
}
