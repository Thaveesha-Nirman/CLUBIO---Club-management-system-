package com.university.clubmanager.controller;

/**
 * * Member 02 : origin/feature/club-join-request-36738
 * * REST Controller for managing club lifecycle, including registration, approval, and content creation.
 */

import com.university.clubmanager.entity.*;
import com.university.clubmanager.repository.ClubRepository;
import com.university.clubmanager.repository.EventRepository;
import com.university.clubmanager.repository.MembershipRepository;
import com.university.clubmanager.repository.PostRepository;
import com.university.clubmanager.repository.UserRepository;
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
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
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

    /**
     * * Member 02 : Handles the request to register a new club.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Club club) {
        try {
            return ResponseEntity.ok(clubService.createClubRequest(club, getEmail()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * * Member 02 : Retrieves a list of clubs waiting for admin approval.
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Club>> getPending() {
        return ResponseEntity.ok(clubService.getPendingClubs());
    }

    /**
     * * Member 02 : Approves a pending club and upgrades the requester to Club
     * Admin.
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        clubService.approveClub(id);
        return ResponseEntity.ok("Approved");
    }

    /**
     * * Member 02 : Rejects a club registration request.
     */
    @DeleteMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        clubService.rejectClub(id);
        return ResponseEntity.ok("Rejected");
    }

    /**
     * * Member 02 : Fetches the club managed by the currently logged-in user.
     */
    @GetMapping("/my-club")
    public ResponseEntity<?> getMyClub() {
        try {
            return ResponseEntity.ok(clubService.getMyClub(getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * * Member 02 : Allows a club admin to create a post for their club.
     */
    @PostMapping("/my-club/posts")
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        try {
            clubService.createPost(getEmail(), post);
            return ResponseEntity.ok("Posted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * * Member 02 : Allows a club admin to create an event for their club.
     */
    @PostMapping("/my-club/events")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            clubService.createEvent(getEmail(), event);
            return ResponseEntity.ok("Event Created");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/posts")
    public ResponseEntity<?> allPosts() {
        return ResponseEntity.ok(clubService.getAllPosts());
    }

    @GetMapping("/events")
    public ResponseEntity<?> allEvents() {
        return ResponseEntity.ok(clubService.getAllEvents());
    }

    @GetMapping("/joined")
    public ResponseEntity<?> getJoinedClubs() {
        try {
            return ResponseEntity.ok(clubService.getJoinedClubs(getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * * Member 02 : Updates club details and settings, including logo and cover
     * image.
     */
    @PutMapping(value = "/{id}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateClub(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("contactNumber") String contactNumber,
            @RequestParam("whatsappGroupLink") String whatsappGroupLink,
            @RequestParam("googleFormLink") String googleFormLink,
            @RequestParam(value = "logo", required = false) MultipartFile logo,
            @RequestParam(value = "cover", required = false) MultipartFile cover) {
        try {
            Club club = clubRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Club not found"));

            // 1. Update Text Fields
            club.setName(name);
            club.setCategory(category);
            club.setDescription(description);
            club.setContactNumber(contactNumber);
            club.setWhatsappGroupLink(whatsappGroupLink);
            club.setGoogleFormLink(googleFormLink);

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

    @GetMapping
    public ResponseEntity<List<Club>> getAllClubs() {
        return ResponseEntity.ok(clubRepository.findAll());
    }


    @DeleteMapping("/{clubId}")
    @Transactional
    /**
     * * Member 02 : Deletes a club and all associated data (posts, events,
     * memberships).
     */
    public ResponseEntity<?> deleteClub(@PathVariable Long clubId) {
        return clubRepository.findById(clubId).map(club -> {

            List<Post> clubPosts = postRepository.findByClub(club);
            for (Post post : clubPosts) {
                postRepository.deleteShareReferences(post.getId());
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

    /**
     * * Member 02 : Submits a request for a user to join a specific club.
     */
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

    @GetMapping("/my-memberships")
    public ResponseEntity<List<Membership>> getMyMemberships() {
        String email = getEmail();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(membershipRepository.findByUser(user));
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getJoinRequests() {
        String email = getEmail();

        
        List<Membership> pendingRequests = membershipRepository.findAll().stream()
                .filter(m -> m.getClub().getAdmin().getEmail().equals(email))
                .filter(m -> m.getStatus().equals("PENDING"))
                .toList();

        return ResponseEntity.ok(pendingRequests);
    }

    /**
     * * Member 02 : Approves a user's request to join the club.
     */
    @PutMapping("/requests/{membershipId}/approve")
    public ResponseEntity<?> approveMember(@PathVariable Long membershipId) {
        String email = getEmail();

        return membershipRepository.findById(membershipId).map(membership -> {
            if (!membership.getClub().getAdmin().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Not authorized");
            }

            membership.setStatus("APPROVED");
            membershipRepository.save(membership);
            return ResponseEntity.ok("Member approved");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/requests/{membershipId}/reject")
    public ResponseEntity<?> rejectMember(@PathVariable Long membershipId) {
        String email = getEmail();
        return membershipRepository.findById(membershipId).map(membership -> {
            if (!membership.getClub().getAdmin().getEmail().equals(email)) {
                return ResponseEntity.status(403).body("Not authorized");
            }
            membershipRepository.delete(membership); 
            return ResponseEntity.ok("Member rejected");
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-managed")
    public ResponseEntity<List<Club>> getMyManagedClubs() {
        String email = getEmail(); 
        return ResponseEntity.ok(clubRepository.findByAdminEmail(email));
    }

    @GetMapping("/{clubId}/members")
    public ResponseEntity<List<User>> getClubMembers(@PathVariable Long clubId) {
        List<Membership> memberships = membershipRepository.findByClubIdAndStatus(clubId, "APPROVED");

        List<User> members = memberships.stream()
                .map(Membership::getUser)
                .toList();

        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{clubId}/members/{userId}")
    @Transactional 
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

    //  GET SHARED POSTS FOR A USER
    @GetMapping("/users/{userId}/shared-posts")
    public ResponseEntity<List<Post>> getSharedPosts(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(user.getSharedPosts()))
                .orElse(ResponseEntity.notFound().build());
    }

    //  GET USER MEMBERSHIPS 
    @GetMapping("/users/{userId}/memberships")
    public ResponseEntity<List<Membership>> getUserMemberships(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(membershipRepository.findByUser(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    //  GET SPECIFIC USER DETAILS 
    @GetMapping("/users/{userId}/details")
    public ResponseEntity<User> getUserDetails(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //  GET CLUBS MANAGED BY A USER 
    @GetMapping("/users/{userId}/managed-clubs")
    public ResponseEntity<List<Club>> getManagedClubs(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(clubRepository.findByAdminEmail(user.getEmail())))
                .orElse(ResponseEntity.notFound().build());
    }

    //  UNSHARE A POST 
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

    @GetMapping("/search")
    public ResponseEntity<List<Club>> searchClubs(@RequestParam String name) {
        List<Club> results = clubRepository.findByNameContainingIgnoreCaseAndStatus(name, "ACTIVE");
        return ResponseEntity.ok(results);
    }

}