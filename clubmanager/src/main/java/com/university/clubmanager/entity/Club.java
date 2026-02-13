package com.university.clubmanager.entity;

/**
 * * Member 02 : origin/feature/club-join-request-36738
 * * Entity class representing a Club, establishing relationships with Members, Posts, and Events.
 */

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clubs")
@Data
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 2000) 
    private String description;

    private String category;
    private String logoUrl;
    private String coverUrl;

    //  CONTACT INFO 
    @Column(name = "contact_number")
    private String contactNumber;

    @Column(length = 500)
    private String googleFormLink;

    @Column(length = 500)
    private String whatsappGroupLink;

    private String status = "PENDING";
    private LocalDateTime createdAt;


    @ManyToOne
    @JoinColumn(name = "admin_id")
    @JsonIgnoreProperties({ "joinedClubs", "password", "role" })
    private User admin;

    @JsonIgnore
    @ManyToMany(mappedBy = "joinedClubs")
    private List<User> members = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    private List<Post> posts = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL)
    private List<Event> events = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}