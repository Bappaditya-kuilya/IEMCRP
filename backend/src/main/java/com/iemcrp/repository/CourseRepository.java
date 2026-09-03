package com.iemcrp.repository;

import com.iemcrp.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    Optional<Course> findByIdAndCollegeId(UUID id, UUID collegeId);
    List<Course> findByCollegeId(UUID collegeId);
    Optional<Course> findByCollegeIdAndCode(UUID collegeId, String code);
    List<Course> findByCollegeIdAndDepartment(UUID collegeId, String department);
    List<Course> findByCollegeIdAndIsActiveTrue(UUID collegeId);
}
