package com.university.clubmanager.dto;

import lombok.Data;

/**
 * Data Transfer Object for Authentication Response.
 * This class carries the user's identity and profile details
 * from the backend to the frontend upon successful login.
 */
@Data
public class AuthResponse {
    // --- IDENTITY & SECURITY ---
    private Long id;              // Unique database ID (Critical for Profile loading)
    private String username;      // Display name (First Name)
    private String email;         // User's login email
    private String role;          // ROLE_STUDENT, ROLE_ADMIN, or ROLE_SUPERADMIN
    private String token;         // JWT Bearer Token
    private String message;       // Success/Error message

    // --- ACADEMIC & PROFILE DETAILS ---
    private String studentId;     // University Registration Number
    private String faculty;       // Faculty of the student/lecturer
    private String department;    // Department of the user
    private String batch;         // Academic intake batch
    private String profileImage;  // URL/Path to the profile picture
}