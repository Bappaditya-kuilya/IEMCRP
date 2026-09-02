package com.iemcrp.dto;

import java.util.List;
import java.util.UUID;

public class StudentDashboardResponse {
    private StudentInfo student;
    private List<ExamResult> latestResults;
    private AttendanceSummary attendanceSummary;
    private List<NoticeSummary> recentNotices;

    public StudentInfo getStudent() { return student; }
    public void setStudent(StudentInfo student) { this.student = student; }
    public List<ExamResult> getLatestResults() { return latestResults; }
    public void setLatestResults(List<ExamResult> latestResults) { this.latestResults = latestResults; }
    public AttendanceSummary getAttendanceSummary() { return attendanceSummary; }
    public void setAttendanceSummary(AttendanceSummary attendanceSummary) { this.attendanceSummary = attendanceSummary; }
    public List<NoticeSummary> getRecentNotices() { return recentNotices; }
    public void setRecentNotices(List<NoticeSummary> recentNotices) { this.recentNotices = recentNotices; }

    public static class StudentInfo {
        private UUID id;
        private String name;
        private String rollNumber;
        private String department;
        private int semester;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getRollNumber() { return rollNumber; }
        public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public int getSemester() { return semester; }
        public void setSemester(int semester) { this.semester = semester; }
    }

    public static class ExamResult {
        private UUID examId;
        private String examName;
        private int totalMarks;
        private int maxTotalMarks;
        private double percentage;

        public UUID getExamId() { return examId; }
        public void setExamId(UUID examId) { this.examId = examId; }
        public String getExamName() { return examName; }
        public void setExamName(String examName) { this.examName = examName; }
        public int getTotalMarks() { return totalMarks; }
        public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }
        public int getMaxTotalMarks() { return maxTotalMarks; }
        public void setMaxTotalMarks(int maxTotalMarks) { this.maxTotalMarks = maxTotalMarks; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }

    public static class AttendanceSummary {
        private int present;
        private int total;
        private double percentage;

        public int getPresent() { return present; }
        public void setPresent(int present) { this.present = present; }
        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }

    public static class NoticeSummary {
        private UUID id;
        private String title;
        private String content;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
