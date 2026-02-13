package com.university.clubmanager.service;

/**
 * * Member 02 : origin/feature/club-join-request-36738
 * * Service layer for club-related business logic and transaction management.
 */

import com.university.clubmanager.entity.Club;
import com.university.clubmanager.entity.Event;
import com.university.clubmanager.entity.Post;
import com.university.clubmanager.entity.User;
import com.university.clubmanager.repository.ClubRepository;
import com.university.clubmanager.repository.EventRepository;
import com.university.clubmanager.repository.PostRepository;
import com.university.clubmanager.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private EventRepository eventRepository;

    //  Register
    /**
     * * Member 02 : Validates and saves a new club registration request.
     */
    public Club createClubRequest(Club clubData, String userEmail) {
        if (clubRepository.existsByName(clubData.getName())) {
            throw new RuntimeException("Club name already exists!");
        }
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        clubData.setAdmin(creator);
        clubData.setStatus("PENDING");
        return clubRepository.save(clubData);
    }

    //  Pending List
    public List<Club> getPendingClubs() {
        return clubRepository.findByStatus("PENDING");
    }

    // 3. Approve
    @Transactional
    /**
     * * Member 02 : Updates club status to ACTIVE and promotes the owner to Admin.
     */
    public void approveClub(Long clubId) {
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("Club not found"));
        club.setStatus("ACTIVE");
        clubRepository.save(club);

        User admin = club.getAdmin();
        if (!"ROLE_SUPERADMIN".equals(admin.getRole())) {
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
        }
    }

    // 4. Reject
    public void rejectClub(Long clubId) {
        clubRepository.deleteById(clubId);
    }

    // 5. Get My Active Club (For Admin Panel)
    public Club getMyClub(String email) {
        List<Club> clubs = clubRepository.findByAdminEmail(email);
        return clubs.stream()
                .filter(c -> "ACTIVE".equals(c.getStatus()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("You do not manage any ACTIVE club!"));
    }

    // 6. Create Post
    public void createPost(String email, Post post) {
        Club myClub = getMyClub(email);
        post.setClub(myClub);
        postRepository.save(post);
    }

    // 7. Create Event
    public void createEvent(String email, Event event) {
        Club myClub = getMyClub(email);
        event.setClub(myClub);
        eventRepository.save(event);
    }

    // 8. Public Feed
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    //  9 GET ALL MY CLUBS
    /**
     * * Member 02 : Returns a distinct list of clubs the user has joined or
     * manages.
     */
    public List<Club> getJoinedClubs(String userEmail) {
        List<Club> memberClubs = clubRepository.findByMembersEmail(userEmail);

        List<Club> adminClubs = clubRepository.findByAdminEmail(userEmail);

        Set<Club> distinctClubs = new HashSet<>(memberClubs);
        distinctClubs.addAll(adminClubs);

        return new ArrayList<>(distinctClubs);
    }

}