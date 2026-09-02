package com.iemcrp.dto;

import java.util.List;

public class AdminDashboardResponse {
    private int totalStudents;
    private int totalStaff;
    private int totalNotices;
    private SystemStatus systemStatus;

    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }
    public int getTotalStaff() { return totalStaff; }
    public void setTotalStaff(int totalStaff) { this.totalStaff = totalStaff; }
    public int getTotalNotices() { return totalNotices; }
    public void setTotalNotices(int totalNotices) { this.totalNotices = totalNotices; }
    public SystemStatus getSystemStatus() { return systemStatus; }
    public void setSystemStatus(SystemStatus systemStatus) { this.systemStatus = systemStatus; }

    public static class SystemStatus {
        private String status;
        private String database;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDatabase() { return database; }
        public void setDatabase(String database) { this.database = database; }
    }
}
