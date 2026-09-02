package com.iemcrp.controller;

import com.iemcrp.dto.AdminDashboardResponse;
import com.iemcrp.model.AuditLog;
import com.iemcrp.model.User;
import com.iemcrp.repository.AuditLogRepository;
import com.iemcrp.repository.NoticeRepository;
import com.iemcrp.repository.UserRepository;
import com.iemcrp.security.JwtUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminController(UserRepository userRepository,
                           NoticeRepository noticeRepository,
                           AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.noticeRepository = noticeRepository;
        this.auditLogRepository = auditLogRepository;
    }

    private JwtUserDetails getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (JwtUserDetails) auth.getPrincipal();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        JwtUserDetails userDetails = getUserDetails();

        AdminDashboardResponse response = new AdminDashboardResponse();

        response.setTotalStudents((int) userRepository.countByCollegeIdAndRole(userDetails.getCollegeId(), User.Role.STUDENT));
        response.setTotalStaff((int) userRepository.countByCollegeIdAndRole(userDetails.getCollegeId(), User.Role.STAFF));
        response.setTotalNotices(noticeRepository.findByCollegeIdAndIsActiveTrue(userDetails.getCollegeId()).size());

        AdminDashboardResponse.SystemStatus status = new AdminDashboardResponse.SystemStatus();
        status.setStatus("Operational");
        status.setDatabase("Connected");
        response.setSystemStatus(status);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<Page<User>> users(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        JwtUserDetails userDetails = getUserDetails();
        Page<User> users = userRepository.findByCollegeId(userDetails.getCollegeId(), PageRequest.of(page, size));
        return ResponseEntity.ok(users);
    }

    @GetMapping("/audit")
    public ResponseEntity<List<AuditLog>> audit() {
        List<AuditLog> logs = auditLogRepository.findAll().stream()
                .sorted(Comparator.comparing(AuditLog::getCreatedAt).reversed())
                .limit(50)
                .toList();
        return ResponseEntity.ok(logs);
    }
}
