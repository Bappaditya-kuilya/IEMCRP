package com.iemcrp.config;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RateLimitConfig {
    // Rate limiting is applied via annotations on controllers
}
