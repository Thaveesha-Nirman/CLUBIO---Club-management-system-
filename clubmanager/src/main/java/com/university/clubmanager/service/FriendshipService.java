package com.university.clubmanager.service;

/**
 * * Member 05 : origin/feature/relationship-lead-fullstack-36704
 * * Service logic for filtering and suggesting new friends.
 */

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
         * Finds students who are not the current user and are not already connected
         * (friends or pending).
         */
        public List<User> getSuggestionsForUser(String email) {
                User currentUser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Friendship> myRelationships = friendshipRepository.findAllByRequesterOrAddressee(currentUser,
                                currentUser);

                List<Long> connectedIds = myRelationships.stream()
                                .map(f -> f.getRequester().getId().equals(currentUser.getId())
                                                ? f.getAddressee().getId()
                                                : f.getRequester().getId())
                                .collect(Collectors.toList());

                return userRepository.findAll().stream()
                                .filter(u -> !u.getId().equals(currentUser.getId())) // Not me
                                .filter(u -> !connectedIds.contains(u.getId())) // Not already connected
                                .limit(5)
                                .collect(Collectors.toList());
        }
}