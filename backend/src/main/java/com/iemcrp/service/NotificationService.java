package com.iemcrp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public void sendGradeNotification(UUID studentId, String courseCode, String grade) {
        log.info("Notification: Student {} received grade {} for {}", studentId, grade, courseCode);
    }

    public void sendFeeReminder(UUID studentId, BigDecimal amount, LocalDate dueDate) {
        log.info("Notification: Student {} fee reminder - amount {}, due {}", studentId, amount, dueDate);
    }

    public void sendEnrollmentConfirmation(UUID studentId, String courseCode) {
        log.info("Notification: Student {} enrolled in {}", studentId, courseCode);
    }
}
