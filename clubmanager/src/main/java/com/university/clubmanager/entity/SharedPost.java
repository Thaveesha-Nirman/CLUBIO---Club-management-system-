package com.university.clubmanager.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SharedPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // The person who shared it

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post; // The original post being shared

    private LocalDateTime sharedAt;

    public SharedPost() {
        this.sharedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }
    public LocalDateTime getSharedAt() { return sharedAt; }
    public void setSharedAt(LocalDateTime sharedAt) { this.sharedAt = sharedAt; }
}