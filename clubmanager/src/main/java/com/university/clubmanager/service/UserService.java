package com.university.clubmanager.service;

/**
 * * Member 08 : Student Hub Lead
 * * Service for managing user profiles and updates.
 */

import com.university.clubmanager.dto.UserProfileDto;
import com.university.clubmanager.entity.User;
import com.university.clubmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * * Member 08 : Retrieves public profile details for a user.
     */
    public UserProfileDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserProfileDto dto = new UserProfileDto();
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setMobileNumber(user.getMobileNumber());
        dto.setBio(user.getBio());
        dto.setProfileImage(user.getProfileImage());
        dto.setLinkedinUrl(user.getLinkedinUrl());
        dto.setGithubUrl(user.getGithubUrl());

        return dto;
    }

    /**
     * * Member 08 : Updates user profile information.
     */
    public User updateUserProfile(String email, UserProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Only update fields if they are sent (not null)
        if (dto.getFirstName() != null)
            user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null)
            user.setLastName(dto.getLastName());
        if (dto.getMobileNumber() != null)
            user.setMobileNumber(dto.getMobileNumber());
        if (dto.getBio() != null)
            user.setBio(dto.getBio());
        if (dto.getProfileImage() != null)
            user.setProfileImage(dto.getProfileImage());
        if (dto.getLinkedinUrl() != null)
            user.setLinkedinUrl(dto.getLinkedinUrl());
        if (dto.getGithubUrl() != null)
            user.setGithubUrl(dto.getGithubUrl());

        return userRepository.save(user);
    }
}