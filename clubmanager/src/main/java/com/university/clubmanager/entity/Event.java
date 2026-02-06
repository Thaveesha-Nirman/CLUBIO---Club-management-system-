package com.university.clubmanager.entity;

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

    @Column(length = 2000) // Allow longer text
    private String description; // <--- NEW

    private String location;

    private LocalDate date;
    private LocalTime time;

    private String ticketPrice;    // <--- NEW
    private String targetAudience; // <--- NEW

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    @JsonIgnoreProperties({"posts", "events", "members", "admin"})
    private Club club;
}