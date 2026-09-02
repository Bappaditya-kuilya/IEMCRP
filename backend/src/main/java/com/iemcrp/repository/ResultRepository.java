package com.iemcrp.repository;

import com.iemcrp.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResultRepository extends JpaRepository<Result, UUID> {
    List<Result> findByStudentId(UUID studentId);
    List<Result> findByStudentIdAndExamId(UUID studentId, UUID examId);
    List<Result> findByExamId(UUID examId);
}
