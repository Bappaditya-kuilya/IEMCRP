package com.iemcrp.repository;

import com.iemcrp.model.Grade;
import com.iemcrp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GradeRepository extends JpaRepository<Grade, UUID> {
    List<Grade> findByStudentId(UUID studentId);
    List<Grade> findBySectionId(UUID sectionId);
    List<Grade> findByEnrollmentId(UUID enrollmentId);
    List<Grade> findByStudentIdAndSectionId(UUID studentId, UUID sectionId);
    List<Grade> findByCollegeId(UUID collegeId);
    List<Grade> findByGradedBy(User gradedBy);
}
