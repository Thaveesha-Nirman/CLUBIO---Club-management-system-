package com.university.clubmanager.entity;

/**
 * * Member 05 : origin/feature/relationship-lead-fullstack-36704
 * * Entity representing a bidirectional relationship between two users.
 */

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester; 

    @ManyToOne
    @JoinColumn(name = "addressee_id")
    private User addressee; 

    @Enumerated(EnumType.STRING)
    private FriendshipStatus status;

    private LocalDateTime createdAt = LocalDateTime.now();
