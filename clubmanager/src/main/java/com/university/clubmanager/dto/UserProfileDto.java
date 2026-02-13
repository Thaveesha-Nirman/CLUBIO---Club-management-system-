package com.university.clubmanager.dto;

/**
 * * Member 09 : Settings & System
 * * DTO for transferring user profile settings.
 */

import lombok.Data;

@Data
public class UserProfileDto {
    private String firstName;
    private String lastName;
    private String mobileNumber;

    private String bio; 
    private String profileImage;
    private String linkedinUrl;
    private String githubUrl;
}