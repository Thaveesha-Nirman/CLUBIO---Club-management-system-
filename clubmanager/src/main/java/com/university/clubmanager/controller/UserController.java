package com.university.clubmanager.controller;

import com.university.clubmanager.entity.User;
import com.university.clubmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // --- 1. SEARCH USERS BY NAME (For Smart Search Bar) ---
    // UserController.java

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String name) {
        // This calls the query we added to UserRepository
        // It returns users where firstName OR lastName contains the search string
        List<User> results = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
        return ResponseEntity.ok(results);
    }

    // --- 2. GET USER DETAILS (For Profile Views) ---
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserDetails(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return ResponseEntity.ok(user);
    }

    // --- 3. UPDATE PROFILE LOGIC ---
    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody User updatedData) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Update basic info safely
        if (updatedData.getFirstName() != null && !updatedData.getFirstName().trim().isEmpty()) {
            currentUser.setFirstName(updatedData.getFirstName());
        }
        if (updatedData.getLastName() != null && !updatedData.getLastName().trim().isEmpty()) {
            currentUser.setLastName(updatedData.getLastName());
        }
        if (updatedData.getMobileNumber() != null && !updatedData.getMobileNumber().trim().isEmpty()) {
            currentUser.setMobileNumber(updatedData.getMobileNumber());
        }

        // Socials and Bio (allows null/empty if the user clears them)
        currentUser.setBio(updatedData.getBio());
        currentUser.setLinkedinUrl(updatedData.getLinkedinUrl());
        currentUser.setGithubUrl(updatedData.getGithubUrl());

        // Profile Image logic
        if (updatedData.getProfileImage() != null && !updatedData.getProfileImage().trim().isEmpty()) {
            currentUser.setProfileImage(updatedData.getProfileImage());
        }

        userRepository.save(currentUser);
        return ResponseEntity.ok("Profile updated successfully");
    }
    // UserController.java

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPERADMIN')") // Security check: Only Super Admins can call this!
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        return userRepository.findById(id).map(user -> {
            // Validation: Ensure the role string is valid
            if (!role.equals("ROLE_USER") && !role.equals("ROLE_SUPERADMIN") && !role.equals("ROLE_ADMIN")) {
                return ResponseEntity.badRequest().body("Invalid role type");
            }

            user.setRole(role);
            userRepository.save(user);
            return ResponseEntity.ok("Role updated to " + role);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            // Optional: Check if the user is the last Super Admin to prevent lockouts
            if (user.getRole().equals("ROLE_SUPERADMIN") && userRepository.countByRole("ROLE_SUPERADMIN") <= 1) {
                return ResponseEntity.badRequest().body("Cannot delete the only Super Admin!");
            }

            userRepository.delete(user);
            return ResponseEntity.ok("User account deleted successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }
}