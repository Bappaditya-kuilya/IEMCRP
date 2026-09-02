package com.iemcrp.controller;

import com.iemcrp.dto.AuthResponse;
import com.iemcrp.dto.LoginRequest;
import com.iemcrp.dto.RefreshRequest;
import com.iemcrp.model.User;
import com.iemcrp.repository.UserRepository;
import com.iemcrp.security.JwtTokenProvider;
import com.iemcrp.service.AuditService;
import com.iemcrp.service.TurnstileService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final AuditService auditService;
    private final TurnstileService turnstileService;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final Duration LOCKOUT_DURATION = Duration.ofMinutes(15);

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider tokenProvider,
                          StringRedisTemplate redisTemplate,
                          AuditService auditService,
                          TurnstileService turnstileService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.redisTemplate = redisTemplate;
        this.auditService = auditService;
        this.turnstileService = turnstileService;
    }

    @PostMapping("/login")
    @RateLimiter(name = "auth")
    @CircuitBreaker(name = "db", fallbackMethod = "loginFallback")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String turnstileToken = request.getTurnstileToken();
        if (turnstileToken != null && !turnstileToken.isEmpty()) {
            if (!turnstileService.verify(turnstileToken)) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid captcha"));
            }
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            if (user != null) {
                handleFailedLogin(user);
            }
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        if (user.getLockoutUntil() != null && user.getLockoutUntil().isAfter(LocalDateTime.now())) {
            long secondsUntilUnlock = Duration.between(LocalDateTime.now(), user.getLockoutUntil()).getSeconds();
            return ResponseEntity.status(423).body(Map.of(
                    "error", "Account locked",
                    "retryAfter", secondsUntilUnlock
            ));
        }

        if (!user.isActive()) {
            return ResponseEntity.status(403).body(Map.of("error", "Account disabled"));
        }

        user.setFailedLoginAttempts(0);
        user.setLockoutUntil(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = tokenProvider.generateAccessToken(user.getId(), user.getCollegeId(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        auditService.logLogin(user.getId(), httpRequest.getRemoteAddr());
        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, tokenProvider.getAccessTokenExpiry()));
    }

    public ResponseEntity<?> loginFallback(LoginRequest request, HttpServletRequest httpRequest, Throwable t) {
        return ResponseEntity.status(503).body(Map.of("error", "Service temporarily unavailable"));
    }

    @PostMapping("/refresh")
    @RateLimiter(name = "auth")
    @CircuitBreaker(name = "db", fallbackMethod = "refreshFallback")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest request) {
        String refreshToken = request.getRefreshToken();
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh token required"));
        }

        try {
            var claims = tokenProvider.validateToken(refreshToken);
            var userId = java.util.UUID.fromString(claims.getSubject());
            User user = userRepository.findById(userId).orElse(null);

            if (user == null || !user.isActive()) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
            }

            String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getCollegeId(), user.getRole().name());
            return ResponseEntity.ok(new AuthResponse(newAccessToken, refreshToken, tokenProvider.getAccessTokenExpiry()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
        }
    }

    public ResponseEntity<?> refreshFallback(RefreshRequest request, Throwable t) {
        return ResponseEntity.status(503).body(Map.of("error", "Service temporarily unavailable"));
    }

    @PostMapping("/logout")
    @RateLimiter(name = "auth")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorization, HttpServletRequest httpRequest) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            try {
                var claims = tokenProvider.validateToken(token);
                long ttl = claims.getExpiration().getTime() - System.currentTimeMillis();
                if (ttl > 0) {
                    redisTemplate.opsForValue().set("blacklist:" + token, "1", Duration.ofMillis(ttl));
                }
                var userId = java.util.UUID.fromString(claims.getSubject());
                auditService.logLogout(userId, httpRequest.getRemoteAddr());
            } catch (Exception e) {
                // Token already invalid, nothing to blacklist
            }
        }
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    private void handleFailedLogin(User user) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
        if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
            long backoffMinutes = (long) Math.pow(2, user.getFailedLoginAttempts() - MAX_FAILED_ATTEMPTS) * 15;
            user.setLockoutUntil(LocalDateTime.now().plusMinutes(Math.min(backoffMinutes, 480)));
        }
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
}
