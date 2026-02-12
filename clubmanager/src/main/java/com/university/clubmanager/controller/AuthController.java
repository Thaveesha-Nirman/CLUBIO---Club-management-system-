package com.university.clubmanager.controller;

/**
 * * Member 01 : feature/auth-fullstack-36682
 * * Controller to handle user authentication, including login and registration.
 */

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
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" }) 
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    //  REGISTER 
    /**
     * * Member 01 : Registers a new user with the system.
     */
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerUser(user));
    }

    // LOGIN 
    /**
     * * Member 01 : Authenticates a user and issues a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {

        // 1. Authenticate
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        // 2. Get UserDetails & Generate Token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(userDetails);

        // 3. Fetch Full User Entity
        User dbUser = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        AuthResponse response = new AuthResponse();

        response.setId(dbUser.getId()); 
        response.setUsername(dbUser.getFirstName());
        response.setEmail(dbUser.getEmail());
        response.setRole(dbUser.getRole());
        response.setToken(jwtToken);
        response.setMessage("Login Successful");

        response.setStudentId(dbUser.getStudentId());
        response.setFaculty(dbUser.getFaculty());
        response.setDepartment(dbUser.getDepartment());
        response.setBatch(dbUser.getBatch());
        response.setProfileImage(dbUser.getProfileImage());

        return ResponseEntity.ok(response);
    }
    // AuthController.java

    @GetMapping("/count")
    /**
     * * Member 01 : Returns the total number of registered users.
     */
    public ResponseEntity<Long> getMemberCount() {
        // This uses the built-in .count() method from JpaRepository
        long count = userRepository.count();
        return ResponseEntity.ok(count);
    }

}