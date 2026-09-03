package com.iemcrp.repository;

import com.iemcrp.model.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, UUID> {
    List<CourseSection> findByCourseId(UUID courseId);
    List<CourseSection> findByCollegeId(UUID collegeId);
    List<CourseSection> findByInstructorId(UUID instructorId);
    List<CourseSection> findByCollegeIdAndSemesterAndAcademicYear(UUID collegeId, int semester, int academicYear);
    List<CourseSection> findByCourseIdAndSemesterAndAcademicYear(UUID courseId, int semester, int academicYear);
}
