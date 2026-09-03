package com.iemcrp.repository;

import com.iemcrp.model.CourseSection;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, UUID> {
    @EntityGraph(attributePaths = {"course", "instructor"})
    List<CourseSection> findByCourseId(UUID courseId);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<CourseSection> findByCollegeId(UUID collegeId);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<CourseSection> findByInstructorId(UUID instructorId);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<CourseSection> findByCollegeIdAndSemesterAndAcademicYear(UUID collegeId, int semester, int academicYear);

    @EntityGraph(attributePaths = {"course", "instructor"})
    List<CourseSection> findByCourseIdAndSemesterAndAcademicYear(UUID courseId, int semester, int academicYear);
}
