package com.iemcrp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final StringRedisTemplate redisTemplate;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, StringRedisTemplate redisTemplate) {
        this.tokenProvider = tokenProvider;
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + token))) {
                    filterChain.doFilter(request, response);
                    return;
                }

                UUID userId = tokenProvider.extractUserId(token);
                UUID collegeId = tokenProvider.extractCollegeId(token);
                String role = tokenProvider.extractRole(token);

                if (!tokenProvider.isTokenExpired(token)) {
                    var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                    var userDetails = new JwtUserDetails(userId, collegeId, role);
                    var auth = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

                    var details = new WebAuthenticationDetailsSource().buildDetails(request);
                    auth.setDetails(details);

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
