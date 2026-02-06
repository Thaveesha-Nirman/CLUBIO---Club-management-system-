package com.university.clubmanager.repository;

import com.university.clubmanager.entity.Friendship;
import com.university.clubmanager.entity.FriendshipStatus;
import com.university.clubmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    // Find requests sent TO you that are still pending
    List<Friendship> findByAddresseeAndStatus(User addressee, FriendshipStatus status);
    // Inside FriendshipRepository.java
    List<Friendship> findAllByRequesterOrAddressee(User requester, User addressee);

    // Find requests YOU sent that are still pending
    List<Friendship> findByRequesterAndStatus(User requester, FriendshipStatus status);

    // Check if any relationship (Pending or Accepted) exists between two users
    @Query("SELECT f FROM Friendship f WHERE (f.requester = :u1 AND f.addressee = :u2) OR (f.requester = :u2 AND f.addressee = :u1)")
    Optional<Friendship> findRelationBetween(@Param("u1") User u1, @Param("u2") User u2);

    // Get all accepted friends
    @Query("SELECT f FROM Friendship f WHERE (f.requester = :user OR f.addressee = :user) AND f.status = 'ACCEPTED'")
    List<Friendship> findAllAccepted(@Param("user") User user);
}