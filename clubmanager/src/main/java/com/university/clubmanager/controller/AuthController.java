package com.university.clubmanager.controller;

import com.university.clubmanager.dto.AuthResponse;
import com.university.clubmanager.dto.LoginRequest;
import com.university.clubmanager.entity.User;
import com.university.clubmanager.repository.UserRepository;
import com.university.clubmanager.service.AuthService;
import com.university.clubmanager.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // Added both ports for safety
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    // --- REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerUser(user));
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {

        // 1. Authenticate
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // 2. Get UserDetails & Generate Token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(userDetails);

        // 3. Fetch Full User Entity
        User dbUser = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 4. Build Response (NOW WITH THE CRITICAL ID)
        AuthResponse response = new AuthResponse();

        // --- THIS IS THE FIX ---
        response.setId(dbUser.getId()); // <--- SENDING THE ID TO FRONTEND

        response.setUsername(dbUser.getFirstName());
        response.setEmail(dbUser.getEmail());
        response.setRole(dbUser.getRole());
        response.setToken(jwtToken);
        response.setMessage("Login Successful");

        // --- POPULATE THE STUDENT DETAILS ---
        response.setStudentId(dbUser.getStudentId());
        response.setFaculty(dbUser.getFaculty());
        response.setDepartment(dbUser.getDepartment());
        response.setBatch(dbUser.getBatch());
        response.setProfileImage(dbUser.getProfileImage());

        return ResponseEntity.ok(response);
    }
    // AuthController.java

    @GetMapping("/count")
    public ResponseEntity<Long> getMemberCount() {
        // This uses the built-in .count() method from JpaRepository
        long count = userRepository.count();
        return ResponseEntity.ok(count);
    }
    
}