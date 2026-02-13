package com.university.clubmanager.entity;

/**
 * * Member 04 : Social Engine Lead
 * * Entity representing a shared post by a user.
 */

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SharedPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    private LocalDateTime sharedAt;

    public SharedPost() {
        this.sharedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public LocalDateTime getSharedAt() {
        return sharedAt;
    }

    public void setSharedAt(LocalDateTime sharedAt) {
        this.sharedAt = sharedAt;
    }
    /**
 * This class represents a post that was shared by a user.
 * It stores which user shared the post, which post was shared,
 * and the date and time when it was shared.
 */

}