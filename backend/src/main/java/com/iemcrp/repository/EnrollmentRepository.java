package com.iemcrp.repository;

import com.iemcrp.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    List<Enrollment> findByStudentId(UUID studentId);
    List<Enrollment> findBySectionId(UUID sectionId);
    List<Enrollment> findByStudentIdAndStatus(UUID studentId, String status);
    List<Enrollment> findBySectionIdAndStatus(UUID sectionId, String status);
    boolean existsByStudentIdAndSectionId(UUID studentId, UUID sectionId);
    long countBySectionIdAndStatus(UUID sectionId, String status);
    List<Enrollment> findByCollegeId(UUID collegeId);
}
