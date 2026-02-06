package com.university.clubmanager.repository;

import com.university.clubmanager.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {

    // 1. Basic status search (Uses String now)
    List<Club> findByStatus(String status);

    List<Club> findByAdminEmail(String email);

    boolean existsByName(String name);

    List<Club> findByMembersEmail(String email);

    // 2. SMART SEARCH: This finds clubs by name AND status
    // FIX: Using String for status instead of the Enum
    List<Club> findByNameContainingIgnoreCaseAndStatus(String name, String status);
}