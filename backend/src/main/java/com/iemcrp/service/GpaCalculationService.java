package com.iemcrp.service;

import com.iemcrp.model.Course;
import com.iemcrp.model.CourseSection;
import com.iemcrp.model.Grade;
import com.iemcrp.repository.GradeRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class GpaCalculationService {

    private static final Map<String, Double> GRADE_POINTS = Map.ofEntries(
            Map.entry("A+", 4.0),
            Map.entry("A", 4.0),
            Map.entry("A-", 3.7),
            Map.entry("B+", 3.3),
            Map.entry("B", 3.0),
            Map.entry("B-", 2.7),
            Map.entry("C+", 2.3),
            Map.entry("C", 2.0),
            Map.entry("C-", 1.7),
            Map.entry("D+", 1.3),
            Map.entry("D", 1.0),
            Map.entry("F", 0.0)
    );

    private final GradeRepository gradeRepository;

    public GpaCalculationService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    public double calculateSemesterGpa(UUID studentId, int semester, int academicYear) {
        var grades = gradeRepository.findByStudentId(studentId);
        double totalPoints = 0;
        int totalCredits = 0;
        for (Grade grade : grades) {
            CourseSection section = grade.getSection();
            if (section.getSemester() == semester && section.getAcademicYear() == academicYear) {
                int credits = grade.getSection().getCourse().getCredits();
                totalPoints += getGradePoints(grade.getGrade()) * credits;
                totalCredits += credits;
            }
        }
        return totalCredits == 0 ? 0 : totalPoints / totalCredits;
    }

    public double calculateCumulativeGpa(UUID studentId) {
        var grades = gradeRepository.findByStudentId(studentId);
        double totalPoints = 0;
        int totalCredits = 0;
        for (Grade grade : grades) {
            int credits = grade.getSection().getCourse().getCredits();
            totalPoints += getGradePoints(grade.getGrade()) * credits;
            totalCredits += credits;
        }
        return totalCredits == 0 ? 0 : totalPoints / totalCredits;
    }

    public double getGradePoints(String grade) {
        return GRADE_POINTS.getOrDefault(grade, 0.0);
    }
}
