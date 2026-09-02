package com.iemcrp.service;

import com.iemcrp.model.AuditLog;
import com.iemcrp.model.User;
import com.iemcrp.repository.AuditLogRepository;
import com.iemcrp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    public void log(UUID userId, String action, String entityType, UUID entityId, String ipAddress) {
        AuditLog entry = new AuditLog();
        entry.setAction(action);
        entry.setEntityType(entityType);
        entry.setEntityId(entityId);
        entry.setIpAddress(ipAddress);
        userRepository.findById(userId).ifPresent(entry::setUser);
        auditLogRepository.save(entry);
    }

    public void logLogin(UUID userId, String ipAddress) {
        log(userId, "LOGIN", "USER", userId, ipAddress);
    }

    public void logLogout(UUID userId, String ipAddress) {
        log(userId, "LOGOUT", "USER", userId, ipAddress);
    }

    public void logResultAccess(UUID userId, UUID studentId, String ipAddress) {
        log(userId, "VIEW_RESULT", "STUDENT", studentId, ipAddress);
    }

    public void logResultUpload(UUID userId, UUID examId, String ipAddress) {
        log(userId, "UPLOAD_RESULT", "EXAM", examId, ipAddress);
    }
}
