package com.iemcrp.dto;

public class ExamRequest {
    private String name;
    private String examType;
    private int semester;
    private String academicYear;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }
    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
