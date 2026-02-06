package com.university.clubmanager.controller;

import com.university.clubmanager.entity.*;
import com.university.clubmanager.repository.*;
import com.university.clubmanager.service.FriendshipService; // Imported for Suggestions
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder; // FIX: Added missing import
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "http://localhost:3000")
public class FriendshipController {

    @Autowired private FriendshipRepository friendshipRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private FriendshipService friendshipService; // FIX: Added service injection

    // --- 1. GET FRIEND SUGGESTIONS BRO 👇 ---
    @GetMapping("/suggestions")
    public ResponseEntity<List<User>> getFriendSuggestions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        // This calls the service logic we created to filter non-friends
        List<User> suggestions = friendshipService.getSuggestionsForUser(email);
        return ResponseEntity.ok(suggestions);
    }

    // 2. SEND FRIEND REQUEST
    @PostMapping("/send/{targetId}")
    public ResponseEntity<?> sendRequest(@PathVariable Long targetId, Authentication auth) {
        User me = userRepository.findByEmail(auth.getName()).get();
        User target = userRepository.findById(targetId).orElseThrow();

        if (friendshipRepository.findRelationBetween(me, target).isPresent()) {
            return ResponseEntity.badRequest().body("Relation already exists");
        }

        Friendship f = new Friendship();
        f.setRequester(me);
        f.setAddressee(target);
        f.setStatus(FriendshipStatus.PENDING);
        return ResponseEntity.ok(friendshipRepository.save(f));
    }

    // 3. ACCEPT REQUEST
    @PutMapping("/accept/{requestId}")
    public ResponseEntity<?> acceptRequest(@PathVariable Long requestId) {
        return friendshipRepository.findById(requestId).map(f -> {
            f.setStatus(FriendshipStatus.ACCEPTED);
            return ResponseEntity.ok(friendshipRepository.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. REJECT / DELETE FRIENDSHIP
    @DeleteMapping("/remove/{requestId}")
    public ResponseEntity<?> removeFriendship(@PathVariable Long requestId) {
        friendshipRepository.deleteById(requestId);
        return ResponseEntity.ok("Removed");
    }

    // 5. GET MY FRIENDS LIST
    @GetMapping("/list")
    public ResponseEntity<?> getFriends(Authentication auth) {
        User me = userRepository.findByEmail(auth.getName()).get();
        List<Friendship> friendships = friendshipRepository.findAllAccepted(me);

        return ResponseEntity.ok(friendships.stream().map(f -> {
            User friendInfo = f.getRequester().getId().equals(me.getId()) ? f.getAddressee() : f.getRequester();
            return new FriendResponse(f.getId(), friendInfo);
        }).collect(Collectors.toList()));
    }

    // 6. GET RECEIVED PENDING REQUESTS
    @GetMapping("/requests/received")
    public ResponseEntity<?> getReceived(Authentication auth) {
        User me = userRepository.findByEmail(auth.getName()).get();
        return ResponseEntity.ok(friendshipRepository.findByAddresseeAndStatus(me, FriendshipStatus.PENDING));
    }

    // 7. GET SENT REQUESTS
    @GetMapping("/requests/sent")
    public ResponseEntity<?> getSent(Authentication auth) {
        User me = userRepository.findByEmail(auth.getName()).get();
        return ResponseEntity.ok(friendshipRepository.findByRequesterAndStatus(me, FriendshipStatus.PENDING));
    }

    // 8. SMART STATUS CHECK (For Profile Page)
    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getStatus(@PathVariable Long userId, Authentication auth) {
        User me = userRepository.findByEmail(auth.getName()).get();
        User target = userRepository.findById(userId).orElseThrow();

        return friendshipRepository.findRelationBetween(me, target)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok().build());
    }

    // Helper class for clean JSON response
    private static class FriendResponse {
        public Long id;
        public User friend;
        public FriendResponse(Long id, User friend) { this.id = id; this.friend = friend; }
    }
}