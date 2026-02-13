package com.university.clubmanager.repository;

/**
 * * Member 07 : Management Lead
 * * Repository extensions for search and filtering.
 */

import com.university.clubmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    long countByRole(String role);

    boolean existsByStudentId(String studentId);

    // It searches both names and ignores if they are CAPS or lowercase
    /**
     * * Member 07 : Custom query for case-insensitive name search.
     */
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    /**
     * * Member 07 : Filtering by department and batch.
     */
    List<User> findByDepartment(String department);

    List<User> findByBatch(String batch);
}