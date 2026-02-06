package com.university.clubmanager.repository;

import com.university.clubmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 1. Core Auth: Find user by email for login/token logic
    Optional<User> findByEmail(String email);
    long countByRole(String role);

    // 2. Registration: Prevent duplicate Student IDs
    boolean existsByStudentId(String studentId);

    // 3. SMART SEARCH: The magic for your search bar
    // It searches both names and ignores if they are CAPS or lowercase
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    // 4. EXTRA: Helpful for "Find people in my batch" or "My Department"
    List<User> findByDepartment(String department);
    List<User> findByBatch(String batch);
}