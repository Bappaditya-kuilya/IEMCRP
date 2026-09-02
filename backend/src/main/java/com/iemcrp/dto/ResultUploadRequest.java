package com.iemcrp.dto;

import java.util.List;
import java.util.UUID;

public class ResultUploadRequest {
    private UUID examId;
    private List<StudentResult> results;

    public UUID getExamId() { return examId; }
    public void setExamId(UUID examId) { this.examId = examId; }
    public List<StudentResult> getResults() { return results; }
    public void setResults(List<StudentResult> results) { this.results = results; }

    public static class StudentResult {
        private UUID studentId;
        private String subjectCode;
        private String subjectName;
        private int marksObtained;
        private int maxMarks;
        private String grade;

        public UUID getStudentId() { return studentId; }
        public void setStudentId(UUID studentId) { this.studentId = studentId; }
        public String getSubjectCode() { return subjectCode; }
        public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public int getMarksObtained() { return marksObtained; }
        public void setMarksObtained(int marksObtained) { this.marksObtained = marksObtained; }
        public int getMaxMarks() { return maxMarks; }
        public void setMaxMarks(int maxMarks) { this.maxMarks = maxMarks; }
        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }
    }
}
