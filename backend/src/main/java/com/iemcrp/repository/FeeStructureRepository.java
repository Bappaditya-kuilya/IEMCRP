package com.iemcrp.repository;

import com.iemcrp.model.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeeStructureRepository extends JpaRepository<FeeStructure, UUID> {
    List<FeeStructure> findByCollegeId(UUID collegeId);
    List<FeeStructure> findByCollegeIdAndIsActiveTrue(UUID collegeId);
    List<FeeStructure> findByCollegeIdAndSemester(UUID collegeId, int semester);
    Optional<FeeStructure> findByIdAndCollegeId(UUID id, UUID collegeId);
}
