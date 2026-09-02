package com.iemcrp.repository;

import com.iemcrp.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, UUID> {
    List<Notice> findByCollegeIdAndIsActiveTrue(UUID collegeId);
}
