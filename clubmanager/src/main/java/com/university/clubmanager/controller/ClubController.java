package com.university.clubmanager.controller;

import com.university.clubmanager.entity.*;
import com.university.clubmanager.repository.ClubRepository;
import com.university.clubmanager.repository.EventRepository;
import com.university.clubmanager.repository.MembershipRepository;
import com.university.clubmanager.repository.PostRepository;
import com.university.clubmanager.repository.UserRepository; // Needed for User lookup
import com.university.clubmanager.service.ClubService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ClubController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper to get current logged-in user's email
    private String getEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // --- 1. REGISTER NEW CLUB ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Club club) {
        try {
            return ResponseEntity.ok(clubService.createClubRequest(club, getEmail()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 2. GET PENDING CLUBS (ADMIN) ---
    @GetMapping("/pending")
    public ResponseEntity<List<Club>> getPending() {
        return ResponseEntity.ok(clubService.getPendingClubs());
    }

    // --- 3. APPROVE CLUB (ADMIN) ---
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        clubService.approveClub(id);
        return ResponseEntity.ok("Approved");
    }

    // --- 4. REJECT CLUB (ADMIN) ---
    @DeleteMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        clubService.rejectClub(id);
        return ResponseEntity.ok("Rejected");
    }

    // --- 5. GET MY OWN CLUB ---
    @GetMapping("/my-club")
    public ResponseEntity<?> getMyClub() {
        try {
            return ResponseEntity.ok(clubService.getMyClub(getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 6. CREATE POST ---
    @PostMapping("/my-club/posts")
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        try {
            clubService.createPost(getEmail(), post);
            return ResponseEntity.ok("Posted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 7. CREATE EVENT ---
    @PostMapping("/my-club/events")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            clubService.createEvent(getEmail(), event);
            return ResponseEntity.ok("Event Created");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 8. PUBLIC FEEDS ---
    @GetMapping("/posts")
    public ResponseEntity<?> allPosts() {
        return ResponseEntity.ok(clubService.getAllPosts());
    }

    @GetMapping("/events")
    public ResponseEntity<?> allEvents() {
        return ResponseEntity.ok(clubService.getAllEvents());
    }

    // --- 9. GET JOINED CLUBS ---
    @GetMapping("/joined")
    public ResponseEntity<?> getJoinedClubs() {
        try {
            return ResponseEntity.ok(clubService.getJoinedClubs(getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 10. UPDATE CLUB SETTINGS ---
    @PutMapping(value = "/{id}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateClub(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("contactNumber") String contactNumber,
            @RequestParam("whatsappGroupLink") String whatsappGroupLink,
            @RequestParam("googleFormLink") String googleFormLink, // <--- ADDED THIS PARAMETER
            @RequestParam(value = "logo", required = false) MultipartFile logo,
            @RequestParam(value = "cover", required = false) MultipartFile cover
    ) {
        try {
            Club club = clubRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Club not found"));

            // 1. Update Text Fields
            club.setName(name);
            club.setCategory(category);
            club.setDescription(description);
            club.setContactNumber(contactNumber);
            club.setWhatsappGroupLink(whatsappGroupLink);
            club.setGoogleFormLink(googleFormLink); // <--- SAVE GOOGLE FORM LINK

            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 2. Update Logo if provided
            if (logo != null && !logo.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_logo_" + logo.getOriginalFilename();
                Files.copy(logo.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
                club.setLogoUrl("/uploads/" + fileName);
            }

            // 3. Update Cover Photo if provided
            if (cover != null && !cover.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_cover_" + cover.getOriginalFilename();
                Files.copy(cover.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
                club.setCoverUrl("/uploads/" + fileName);
            }

            Club updatedClub = clubRepository.save(club);
            return ResponseEntity.ok(updatedClub);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating club: " + e.getMessage());
        }
    }

    // --- 11. GET ALL CLUBS ---
    @GetMapping
    public ResponseEntity<List<Club>> getAllClubs() {
        return ResponseEntity.ok(clubRepository.findAll());
    }

    // --- 12. DELETE CLUB (Super Admin) ---
    // --- 12. DELETE CLUB (Super Admin) ---
    // --- 12. DELETE CLUB (Super Admin) - FIXED FOR DEEP DELETE ---
    @DeleteMapping("/{clubId}")
    @Transactional
    public ResponseEntity<?> deleteClub(@PathVariable Long clubId) {
        return clubRepository.findById(clubId).map(club -> {

            // 1. DELETE ALL POSTS SAFELY (This is the fix)
            // We must find all posts and delete their "Share" references first
            List<Post> clubPosts = postRepository.findByClub(club);
            for (Post post : clubPosts) {
                // Remove the "Shared" link from user profiles
                postRepository.deleteShareReferences(post.getId());
                // Now delete the post (Hibernate handles comments/likes via Cascade)
                postRepository.delete(post);
            }

            // 2. Delete Events
            eventRepository.deleteByClub(club);

            // 3. Delete Memberships
            membershipRepository.deleteByClub(club);

            // 4. Finally, Delete the Club
            clubRepository.delete(club);

            return ResponseEntity.ok().body("{\"message\": \"Club and all history deleted successfully\"}");
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- 13. REQUEST TO JOIN CLUB ---
    @PostMapping("/{clubId}/join")
    public ResponseEntity<?> joinClub(@PathVariable Long clubId) {
        String email = getEmail();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));

        // Check if already requested
        if (membershipRepository.findByUserAndClub(user, club).isPresent()) {
            return ResponseEntity.badRequest().body("You have already requested to join this club.");
        }

        Membership membership = new Membership(user, club, "PENDING");
        membershipRepository.save(membership);

        return ResponseEntity.ok("Request submitted successfully");
    }

    // --- 14. GET MY MEMBERSHIPS (For "My Clubs" Page) ---
    @GetMapping("/my-memberships")
    public ResponseEntity<List<Membership>> getMyMemberships() {
        String email = getEmail();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(membershipRepository.findByUser(user));
    }

    // --- 15. GET JOIN REQUESTS (For Club Admin) ---
    @GetMapping("/requests")
    public ResponseEntity<?> getJoinRequests() {
        String email = getEmail();

        // Find memberships for clubs where the current user is admin
        // Note: Ideally use a custom query in repository like: findByClub_Admin_EmailAndStatus(...)
        List<Membership> pendingRequests = membershipRepository.findAll().stream()
                .filter(m -> m.getClub().getAdmin().getEmail().equals(email))
                .filter(m -> m.getStatus().equals("PENDING"))
                .toList();

        return ResponseEntity.ok(pendingRequests);
    }

    // --- 16. APPROVE MEMBER ---
    @PutMapping("/requests/{membershipId}/approve")
    public ResponseEntity<?> approveMember(@PathVariable Long membershipId) {
        String email = getEmail();

        return membershipRepository.findById(membershipId).map(membership -> {
            // Security: Ensure logged-in user is the admin of this club
            if (!membership.getClub().getAdmin().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Not authorized");
            }

            membership.setStatus("APPROVED");
            membershipRepository.save(membership);
            return ResponseEntity.ok("Member approved");
        }).orElse(ResponseEntity.notFound().build());
    }
    // --- 17. REJECT MEMBER (DELETE REQUEST) ---
    @DeleteMapping("/requests/{membershipId}/reject")
    public ResponseEntity<?> rejectMember(@PathVariable Long membershipId) {
        String email = getEmail();
        return membershipRepository.findById(membershipId).map(membership -> {
            // Security: Ensure logged-in user is the admin of this club
            if (!membership.getClub().getAdmin().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Not authorized");
            }
            membershipRepository.delete(membership); // Simply delete the request
            return ResponseEntity.ok("Member rejected");
        }).orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/my-managed")
    public ResponseEntity<List<Club>> getMyManagedClubs() {
        String email = getEmail(); // Get logged-in user email
        return ResponseEntity.ok(clubRepository.findByAdminEmail(email));
    }
    // --- 18. GET CLUB MEMBERS (APPROVED ONLY) ---
    @GetMapping("/{clubId}/members")
    public ResponseEntity<List<User>> getClubMembers(@PathVariable Long clubId) {
        // We only want users whose status is 'APPROVED'
        List<Membership> memberships = membershipRepository.findByClubIdAndStatus(clubId, "APPROVED");

        // Extract the User objects from the memberships
        List<User> members = memberships.stream()
                .map(Membership::getUser)
                .toList();

        return ResponseEntity.ok(members);
    }

    // --- 19. REMOVE MEMBER (KICK) ---
    @DeleteMapping("/{clubId}/members/{userId}")
    @Transactional // Required for delete operations
    public ResponseEntity<?> removeMember(@PathVariable Long clubId, @PathVariable Long userId) {
        String adminEmail = getEmail();

        return clubRepository.findById(clubId).map(club -> {
            // Security Check: Only the Club Admin can remove members
            if (!club.getAdmin().getEmail().equals(adminEmail)) {
                return ResponseEntity.status(403).body("Only the club admin can remove members.");
            }

            // Delete the membership record
            membershipRepository.deleteByClubIdAndUserId(clubId, userId);
            return ResponseEntity.ok("Member removed successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }
    // --- 20. SHARE A POST ---
    @PostMapping("/posts/{postId}/share")
    @Transactional
    public ResponseEntity<?> sharePost(@PathVariable Long postId) {
        String email = getEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Add to shared list if not already there
        if (!user.getSharedPosts().contains(post)) {
            user.getSharedPosts().add(post);
            userRepository.save(user);
            return ResponseEntity.ok("{\"message\": \"Post shared to profile\"}");
        }
        return ResponseEntity.ok("{\"message\": \"Post already shared\"}");
    }

    // --- 21. GET SHARED POSTS FOR A USER ---
    @GetMapping("/users/{userId}/shared-posts")
    public ResponseEntity<List<Post>> getSharedPosts(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(user.getSharedPosts()))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- 22. GET USER MEMBERSHIPS (For Profile View) ---
    @GetMapping("/users/{userId}/memberships")
    public ResponseEntity<List<Membership>> getUserMemberships(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(membershipRepository.findByUser(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- 23. GET SPECIFIC USER DETAILS ---
    @GetMapping("/users/{userId}/details")
    public ResponseEntity<User> getUserDetails(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // --- GET CLUBS MANAGED BY A USER ---
    @GetMapping("/users/{userId}/managed-clubs")
    public ResponseEntity<List<Club>> getManagedClubs(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(clubRepository.findByAdminEmail(user.getEmail())))
                .orElse(ResponseEntity.notFound().build());
    }
    // --- ADD THIS TO ClubController.java ---

    // --- 24. UNSHARE A POST (Remove from my profile) ---
    @DeleteMapping("/posts/{postId}/share")
    @Transactional
    public ResponseEntity<?> unsharePost(@PathVariable Long postId) {
        String email = getEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Remove the post from the user's shared list
        if (user.getSharedPosts().contains(post)) {
            user.getSharedPosts().remove(post);
            userRepository.save(user);
            return ResponseEntity.ok("{\"message\": \"Post removed from profile\"}");
        } else {
            return ResponseEntity.badRequest().body("{\"message\": \"Post was not shared by you\"}");
        }
    }
    // --- SMART CLUB SEARCH ---
    // --- SMART CLUB SEARCH ---
    @GetMapping("/search")
    public ResponseEntity<List<Club>> searchClubs(@RequestParam String name) {
        // We pass "ACTIVE" as a string to match the repository change
        List<Club> results = clubRepository.findByNameContainingIgnoreCaseAndStatus(name, "ACTIVE");
        return ResponseEntity.ok(results);
    }


}