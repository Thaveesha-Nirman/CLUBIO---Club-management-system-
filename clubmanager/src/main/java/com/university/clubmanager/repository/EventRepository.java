package com.university.clubmanager.repository;

/**
 * * Member 03 : origin/feature/event-coordinator-fullstack-36681
 * * Repository for accessing Event data from the database.
 */

import com.university.clubmanager.entity.Club;
import com.university.clubmanager.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // 1. Find events by club (Useful for listing)
    List<Event> findByClub(Club club);

    // 2. Delete all events linked to a club (Crucial for Super Admin Delete)
    void deleteByClub(Club club);

    // Repository interface for Event entity to handle database operations like finding and deleting events by club.

}  