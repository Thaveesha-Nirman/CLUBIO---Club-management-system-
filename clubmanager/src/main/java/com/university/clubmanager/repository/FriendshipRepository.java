package com.university.clubmanager.repository;

/**
 * * Member 05 : origin/feature/relationship-lead-fullstack-36704
 * * Repository for Friendship entity with custom queries for relationship status.
 */

import com.university.clubmanager.entity.Friendship;
import com.university.clubmanager.entity.FriendshipStatus;
import com.university.clubmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    List<Friendship> findByAddresseeAndStatus(User addressee, FriendshipStatus status);

    List<Friendship> findAllByRequesterOrAddressee(User requester, User addressee);

    List<Friendship> findByRequesterAndStatus(User requester, FriendshipStatus status);

    @Query("SELECT f FROM Friendship f WHERE (f.requester = :u1 AND f.addressee = :u2) OR (f.requester = :u2 AND f.addressee = :u1)")
    Optional<Friendship> findRelationBetween(@Param("u1") User u1, @Param("u2") User u2);

    @Query("SELECT f FROM Friendship f WHERE (f.requester = :user OR f.addressee = :user) AND f.status = 'ACCEPTED'")
    List<Friendship> findAllAccepted(@Param("user") User user);
}