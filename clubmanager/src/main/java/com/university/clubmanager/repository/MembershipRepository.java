package com.university.clubmanager.repository;

import com.university.clubmanager.entity.Club;
import com.university.clubmanager.entity.Membership;
import com.university.clubmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    // --- EXISTING CORE METHODS ---

    /** Check if a specific user has any membership status (PENDING/APPROVED) in a club */
    Optional<Membership> findByUserAndClub(User user, Club club);

    /** Find all clubs a specific user is involved with (used for 'My Clubs' dashboard) */
    List<Membership> findByUser(User user);

    /** Find all join requests for a club with a specific status (e.g., 'PENDING') */
    List<Membership> findByClubAndStatus(Club club, String status);

    /** Find every single membership record for a club regardless of status */
    List<Membership> findByClub(Club club);


    // --- NEW MEMBER MANAGEMENT METHODS ---

    /** Fetch all members of a club who have a specific status (used for Member Management Table) */
    List<Membership> findByClubIdAndStatus(Long clubId, String status);

    /** Find a membership record by raw IDs (useful for existence checks) */
    Optional<Membership> findByClubIdAndUserId(Long clubId, Long userId);

    /** * Delete a single member from a club (The 'Kick' function)
     * Note: Requires @Transactional in the calling Service or Controller
     */
    void deleteByClubIdAndUserId(Long clubId, Long userId);


    // --- SUPER ADMIN UTILITIES ---

    /** * Delete EVERY membership associated with a club
     * Crucial for deleting clubs that have history/members to avoid Foreign Key errors.
     */
    void deleteByClub(Club club);
}