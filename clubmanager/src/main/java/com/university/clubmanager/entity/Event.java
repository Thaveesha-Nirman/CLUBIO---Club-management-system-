package com.university.clubmanager.entity;

/**
 * * Member 03 : origin/feature/event-coordinator-fullstack-36681
 * * Entity class representing an event organized by  clubs.
 */

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000) 
    private String description; 

    private String location;

    private LocalDate date;
    private LocalTime time;

    private String ticketPrice; 
    private String targetAudience; 

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    @JsonIgnoreProperties({ "posts", "events", "members", "admin" })
    private Club club;
}