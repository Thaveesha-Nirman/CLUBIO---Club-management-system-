package com.university.clubmanager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- 1. PERSONAL INFO ---
    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String role; // ROLE_STUDENT, ROLE_ADMIN, ROLE_SUPERADMIN

    // --- 2. ACADEMIC INFO ---
    private String studentId;
    private String faculty;
    private String department;
    private String batch;
    private String degreeProgram;

    // --- 3. PROFILE DETAILS ---
    private String profileImage;
    private String mobileNumber;

    @Column(length = 1000)
    private String bio;

    // --- 4. SOCIAL LINKS ---
    private String linkedinUrl;
    private String githubUrl;

    // --- NEW: WHATSAPP LINK ---
    private String whatsappLink;

    // --- 5. SYSTEM STATUS ---
    private String userStatus = "ACTIVE";

    // --- 6. RELATIONSHIPS ---
    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_club_memberships",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "club_id")
    )
    private List<Club> joinedClubs = new ArrayList<>();

    // --- SHARED POSTS RELATIONSHIP ---
    @JsonIgnore // Prevent infinite recursion in JSON
    @ManyToMany
    @JoinTable(
            name = "user_shared_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private List<Post> sharedPosts = new ArrayList<>();
}