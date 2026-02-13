package com.university.clubmanager.entity;

/**
 * * Member 04 : origin/feature/social-engine-lead-fullstack-36672
 * * Entity representing a user post, containing content, images, likes, and comments.
 */

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 5000)
    private String content;

    // Support for multiple images
    @ElementCollection
    @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    @ElementCollection
    @CollectionTable(name = "post_likes", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "user_email")
    private Set<String> likedByUsers = new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("post") // Prevents infinite loop when loading comments
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    @JsonIgnoreProperties("posts")
    private Club club;

    // Helper to get the count of likes for the frontend
    public Integer getLikeCount() {
        return likedByUsers.size();
    }
}