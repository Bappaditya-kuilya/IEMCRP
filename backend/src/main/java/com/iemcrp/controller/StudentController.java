package com.iemcrp.controller;

import com.iemcrp.dto.ResultResponse;
import com.iemcrp.dto.StudentDashboardResponse;
import com.iemcrp.dto.AttendanceResponse;
import com.iemcrp.model.*;
import com.iemcrp.repository.*;
import com.iemcrp.security.JwtUserDetails;
import com.iemcrp.service.AuditService;
import com.iemcrp.service.ResultCacheService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final StudentRepository studentRepository;
    private final ResultRepository resultRepository;
    private final AttendanceRepository attendanceRepository;
    private final NoticeRepository noticeRepository;
    private final ExamRepository examRepository;
    private final AuditService auditService;
    private final ResultCacheService resultCacheService;
    private final ObjectMapper objectMapper;

    public StudentController(StudentRepository studentRepository,
                             ResultRepository resultRepository,
                             AttendanceRepository attendanceRepository,
                             NoticeRepository noticeRepository,
                             ExamRepository examRepository,
                             AuditService auditService,
                             ResultCacheService resultCacheService,
                             ObjectMapper objectMapper) {
        this.studentRepository = studentRepository;
        this.resultRepository = resultRepository;
        this.attendanceRepository = attendanceRepository;
        this.noticeRepository = noticeRepository;
        this.examRepository = examRepository;
        this.auditService = auditService;
        this.resultCacheService = resultCacheService;
        this.objectMapper = objectMapper;
    }

    private JwtUserDetails getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (JwtUserDetails) auth.getPrincipal();
    }

    private Student getStudentByUserId(UUID userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
    }

    @GetMapping("/dashboard")
    @RateLimiter(name = "api")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<StudentDashboardResponse> dashboard() {
        JwtUserDetails userDetails = getUserDetails();
        Student student = getStudentByUserId(userDetails.getUserId());

        StudentDashboardResponse response = new StudentDashboardResponse();

        StudentDashboardResponse.StudentInfo info = new StudentDashboardResponse.StudentInfo();
        info.setId(student.getId());
        String firstName = student.getUser().getFirstName();
        String lastName = student.getUser().getLastName();
        info.setName((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : ""));
        info.setRollNumber(student.getRollNumber());
        info.setDepartment(student.getDepartment());
        info.setSemester(student.getSemester());
        response.setStudent(info);

        List<Exam> collegeExams = examRepository.findByCollegeId(userDetails.getCollegeId());
        List<Exam> studentExams = collegeExams.stream()
                .filter(e -> e.getSemester() == student.getSemester())
                .sorted(Comparator.comparing(Exam::getCreatedAt).reversed())
                .limit(3)
                .toList();

        List<StudentDashboardResponse.ExamResult> examResults = new ArrayList<>();
        for (Exam exam : studentExams) {
            List<Result> results = resultRepository.findByStudentIdAndExamId(student.getId(), exam.getId());
            if (!results.isEmpty()) {
                int total = results.stream().mapToInt(Result::getMarksObtained).sum();
                int maxTotal = results.stream().mapToInt(Result::getMaxMarks).sum();
                StudentDashboardResponse.ExamResult er = new StudentDashboardResponse.ExamResult();
                er.setExamId(exam.getId());
                er.setExamName(exam.getName());
                er.setTotalMarks(total);
                er.setMaxTotalMarks(maxTotal);
                er.setPercentage(maxTotal > 0 ? Math.round(total * 100.0 / maxTotal * 100.0) / 100.0 : 0);
                examResults.add(er);
            }
        }
        response.setLatestResults(examResults);

        LocalDate today = LocalDate.now();
        List<Attendance> attendance = attendanceRepository.findByStudentIdAndDateBetween(
                student.getId(), today.minusDays(365), today);
        int present = (int) attendance.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT).count();
        int total = attendance.size();
        StudentDashboardResponse.AttendanceSummary attSummary = new StudentDashboardResponse.AttendanceSummary();
        attSummary.setPresent(present);
        attSummary.setTotal(total);
        attSummary.setPercentage(total > 0 ? Math.round(present * 100.0 / total * 100.0) / 100.0 : 0);
        response.setAttendanceSummary(attSummary);

        List<Notice> notices = noticeRepository.findByCollegeIdAndIsActiveTrue(userDetails.getCollegeId());
        List<StudentDashboardResponse.NoticeSummary> recentNotices = notices.stream()
                .sorted(Comparator.comparing(Notice::getCreatedAt).reversed())
                .limit(5)
                .map(n -> {
                    StudentDashboardResponse.NoticeSummary ns = new StudentDashboardResponse.NoticeSummary();
                    ns.setId(n.getId());
                    ns.setTitle(n.getTitle());
                    ns.setContent(n.getContent());
                    return ns;
                })
                .toList();
        response.setRecentNotices(recentNotices);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/results")
    @RateLimiter(name = "api")
    @CircuitBreaker(name = "redis", fallbackMethod = "resultsFallback")
    public ResponseEntity<List<ResultResponse>> results(HttpServletRequest httpRequest) {
        JwtUserDetails userDetails = getUserDetails();
        Student student = getStudentByUserId(userDetails.getUserId());
        auditService.logResultAccess(userDetails.getUserId(), student.getId(), httpRequest.getRemoteAddr());
        List<Result> results = resultRepository.findByStudentId(student.getId());
        return ResponseEntity.ok(results.stream().map(this::toResultResponse).toList());
    }

    @GetMapping("/results/{examId}")
    @RateLimiter(name = "api")
    @CircuitBreaker(name = "redis", fallbackMethod = "resultsByExamFallback")
    public ResponseEntity<List<ResultResponse>> resultsByExam(@PathVariable UUID examId, HttpServletRequest httpRequest) {
        JwtUserDetails userDetails = getUserDetails();
        Student student = getStudentByUserId(userDetails.getUserId());
        auditService.logResultAccess(userDetails.getUserId(), student.getId(), httpRequest.getRemoteAddr());

        String cached = resultCacheService.getCachedResult(student.getId(), examId);
        if (cached != null) {
            try {
                JsonNode node = objectMapper.readTree(cached);
                ResultResponse resp = new ResultResponse();
                resp.setSubjectCode(node.get("subjectCode").asText());
                resp.setSubjectName(node.get("subjectName").asText());
                resp.setMarksObtained(node.get("marks").asInt());
                resp.setMaxMarks(node.get("maxMarks").asInt());
                resp.setGrade(node.get("grade").asText());
                return ResponseEntity.ok(List.of(resp));
            } catch (Exception ignored) {
            }
        }

        List<Result> results = resultRepository.findByStudentIdAndExamId(student.getId(), examId);
        return ResponseEntity.ok(results.stream().map(this::toResultResponse).toList());
    }

    @GetMapping("/attendance")
    @RateLimiter(name = "api")
    public ResponseEntity<List<AttendanceResponse>> attendance(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to) {
        JwtUserDetails userDetails = getUserDetails();
        Student student = getStudentByUserId(userDetails.getUserId());
        LocalDate startDate = from != null ? from : LocalDate.now().minusDays(30);
        LocalDate endDate = to != null ? to : LocalDate.now();
        List<Attendance> records = attendanceRepository.findByStudentIdAndDateBetween(
                student.getId(), startDate, endDate);
        return ResponseEntity.ok(records.stream().map(a -> {
            AttendanceResponse ar = new AttendanceResponse();
            ar.setDate(a.getDate());
            ar.setStatus(a.getStatus().name());
            return ar;
        }).toList());
    }

    public ResponseEntity<List<ResultResponse>> resultsByExamFallback(UUID examId, HttpServletRequest httpRequest, Throwable t) {
        JwtUserDetails userDetails = getUserDetails();
        Student student = getStudentByUserId(userDetails.getUserId());
        List<Result> results = resultRepository.findByStudentIdAndExamId(student.getId(), examId);
        return ResponseEntity.ok(results.stream().map(this::toResultResponse).toList());
    }

    public ResponseEntity<List<ResultResponse>> resultsFallback(HttpServletRequest httpRequest, Throwable t) {
        JwtUserDetails userDetails = getUserDetails();
        Student student = getStudentByUserId(userDetails.getUserId());
        List<Result> results = resultRepository.findByStudentId(student.getId());
        return ResponseEntity.ok(results.stream().map(this::toResultResponse).toList());
    }

    private ResultResponse toResultResponse(Result r) {
        ResultResponse resp = new ResultResponse();
        resp.setId(r.getId());
        resp.setSubjectCode(r.getSubjectCode());
        resp.setSubjectName(r.getSubjectName());
        resp.setMarksObtained(r.getMarksObtained());
        resp.setMaxMarks(r.getMaxMarks());
        resp.setGrade(r.getGrade());
        resp.setExamName(r.getExam().getName());
        resp.setExamType(r.getExam().getExamType().name());
        resp.setCreatedAt(r.getCreatedAt());
        return resp;
    }
}
