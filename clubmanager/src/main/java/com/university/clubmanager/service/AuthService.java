package com.university.clubmanager.service;

/**
 * * Member 01 : feature/auth-fullstack-36682
 * * Service class containing business logic for user registration and authentication.
 */

import com.university.clubmanager.entity.User;
import com.university.clubmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        /**
         * * Member 01 : Encodes the password and saves the new user to the database.
         */
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set default role if missing
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_STUDENT");
        }

        return userRepository.save(user);
    }
}