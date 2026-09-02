package com.iemcrp.security;

import java.util.UUID;

public class JwtUserDetails {
    private final UUID userId;
    private final UUID collegeId;
    private final String role;

    public JwtUserDetails(UUID userId, UUID collegeId, String role) {
        this.userId = userId;
        this.collegeId = collegeId;
        this.role = role;
    }

    public UUID getUserId() { return userId; }
    public UUID getCollegeId() { return collegeId; }
    public String getRole() { return role; }
}
