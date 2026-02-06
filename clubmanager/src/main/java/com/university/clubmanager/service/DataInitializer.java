package com.university.clubmanager.service;

import com.university.clubmanager.entity.Club;
import com.university.clubmanager.entity.User;
import com.university.clubmanager.repository.ClubRepository;
import com.university.clubmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create the SUPER ADMIN (The Boss)
        if (userRepository.findByEmail("boss@university.com").isEmpty()) {
            User boss = new User();
            boss.setFirstName("The");
            boss.setLastName("Boss");
            boss.setEmail("boss@university.com");
            boss.setPassword(passwordEncoder.encode("admin123"));
            boss.setUserStatus("SuperAdmin");
            boss.setRole("ROLE_SUPERADMIN");
            userRepository.save(boss);
            System.out.println(">> Super Admin created: boss@university.com / admin123");
        }

        // 2. Create a test Club Admin (Lecturer)
        if (userRepository.findByEmail("admin@club.com").isEmpty()) {
            User clubAdmin = new User();
            clubAdmin.setFirstName("Club");
            clubAdmin.setLastName("Owner");
            clubAdmin.setEmail("admin@club.com");
            clubAdmin.setPassword(passwordEncoder.encode("club123"));
            clubAdmin.setUserStatus("Lecturer");
            clubAdmin.setRole("ROLE_ADMIN");
            User savedAdmin = userRepository.save(clubAdmin);

            // 3. Create a PENDING club for testing approval logic
            if (clubRepository.count() == 0) {
                Club club = new Club();
                club.setName("Space Exploration Society");
                club.setDescription("Exploring the stars and beyond.");
                club.setCategory("Science");
                club.setStatus("PENDING");

                // ✅ FIXED LINE BELOW (setCreator -> setAdmin)
                club.setAdmin(savedAdmin);

                clubRepository.save(club);
                System.out.println(">> Sample PENDING club created for testing.");
            }
        }
    }
}