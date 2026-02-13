package com.university.clubmanager.repository;

/**
 * * Member 02 : origin/feature/club-join-request-36738
 * * Repository interface for Club entity operations and custom queries.
 */

import com.university.clubmanager.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {

    // 1. Basic status search 
    List<Club> findByStatus(String status);

    List<Club> findByAdminEmail(String email);

    boolean existsByName(String name);

    List<Club> findByMembersEmail(String email);

    List<Club> findByNameContainingIgnoreCaseAndStatus(String name, String status);
}