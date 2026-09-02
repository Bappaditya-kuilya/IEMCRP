package com.iemcrp.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Integer status = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if (status == null) status = 500;
        
        String message = switch (status) {
            case 404 -> "Resource not found";
            case 403 -> "Access denied";
            case 401 -> "Unauthorized";
            default -> "An error occurred";
        };

        return ResponseEntity.status(status)
            .body(Map.of("error", message, "status", status));
    }
}
