package com.university.clubmanager.entity;

/**
 * * Member 04 : origin/feature/social-engine-lead-fullstack-36672
 * * Entity representing a comment made by a user on a post.
 */

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "comments")
```java
/**
 * Represents a user comment on a post.
 * Contains the comment text, creation timestamp,
 * and references to the associated User and Post.
 */
```

public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email")
    private User user; 

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties("comments") 
    private Post post;
}