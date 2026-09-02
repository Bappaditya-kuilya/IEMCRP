package com.iemcrp.dto;

import java.util.List;

public class StaffDashboardResponse {
    private int totalStudents;
    private List<RecentResult> recentResults;
    private List<String> pendingTasks;

    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }
    public List<RecentResult> getRecentResults() { return recentResults; }
    public void setRecentResults(List<RecentResult> recentResults) { this.recentResults = recentResults; }
    public List<String> getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(List<String> pendingTasks) { this.pendingTasks = pendingTasks; }

    public static class RecentResult {
        private String studentName;
        private String examName;
        private String subjectName;
        private int marksObtained;
        private int maxMarks;

        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }
        public String getExamName() { return examName; }
        public void setExamName(String examName) { this.examName = examName; }
        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public int getMarksObtained() { return marksObtained; }
        public void setMarksObtained(int marksObtained) { this.marksObtained = marksObtained; }
        public int getMaxMarks() { return maxMarks; }
        public void setMaxMarks(int maxMarks) { this.maxMarks = maxMarks; }
    }
}
