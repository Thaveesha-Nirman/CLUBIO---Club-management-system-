package com.university.clubmanager.service;

import com.university.clubmanager.entity.Friendship;
import com.university.clubmanager.entity.User;
import com.university.clubmanager.repository.FriendshipRepository;
import com.university.clubmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendshipService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    /**
     * Finds students who are not the current user and are not already connected (friends or pending).
     */
    public List<User> getSuggestionsForUser(String email) {
        // 1. Find the current user in the database
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Get all relationships where the user is involved (sender or receiver)
        List<Friendship> myRelationships = friendshipRepository.findAllByRequesterOrAddressee(currentUser, currentUser);

        // 3. Extract the IDs of people I'm already connected with
        List<Long> connectedIds = myRelationships.stream()
                .map(f -> f.getRequester().getId().equals(currentUser.getId())
                        ? f.getAddressee().getId()
                        : f.getRequester().getId())
                .collect(Collectors.toList());

        // 4. Get all users, filter out myself and my existing connections, then return 5
        return userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(currentUser.getId())) // Not me
                .filter(u -> !connectedIds.contains(u.getId()))     // Not already connected
                .limit(5)
                .collect(Collectors.toList());
    }
}