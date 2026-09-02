package com.iemcrp.repository;

import com.iemcrp.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    Page<User> findByCollegeId(UUID collegeId, Pageable pageable);
    long countByCollegeIdAndRole(UUID collegeId, User.Role role);
}
