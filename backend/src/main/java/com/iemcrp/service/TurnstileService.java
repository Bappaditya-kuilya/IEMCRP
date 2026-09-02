package com.iemcrp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class TurnstileService {

    private static final String VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    
    private final WebClient webClient;

    @Value("${turnstile.secret-key:}")
    private String secretKey;

    public TurnstileService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public boolean verify(String token) {
        if (secretKey == null || secretKey.isEmpty()) {
            // Turnstile not configured — skip verification (dev mode)
            return true;
        }
        
        try {
            Map<String, String> body = Map.of(
                "secret", secretKey,
                "response", token
            );
            
            Map<String, Object> response = webClient.post()
                .uri(VERIFY_URL)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
            
            return response != null && Boolean.TRUE.equals(response.get("success"));
        } catch (Exception e) {
            // If Cloudflare is unreachable, fail open for availability
            // In production, you might want to fail closed
            return false;
        }
    }
}
