package com.university.clubmanager.dto;

import lombok.Data;

@Data
public class UserProfileDto {
    // Basic Info
    private String firstName;
    private String lastName;
    private String mobileNumber;

    // The "Pro" Profile Details
    private String bio;           // The "About Me" section
    private String profileImage;  // URL to their photo
    private String linkedinUrl;
    private String githubUrl;
}