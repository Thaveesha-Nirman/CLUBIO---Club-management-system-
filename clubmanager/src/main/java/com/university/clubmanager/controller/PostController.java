package com.university.clubmanager.controller;

/**
 * * Member 04 : origin/feature/social-engine-lead-fullstack-36672
 * * Controller handling social interactions, including creating posts, liking, and commenting.
 */

import com.university.clubmanager.entity.Club;
import com.university.clubmanager.entity.Comment;
import com.university.clubmanager.entity.Post;
import com.university.clubmanager.entity.User;
import com.university.clubmanager.repository.ClubRepository;
import com.university.clubmanager.repository.CommentRepository;
import com.university.clubmanager.repository.PostRepository;
import com.university.clubmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository; // <--- MUST BE HERE

    private final String UPLOAD_DIR = "uploads/";

    /**
     * * Member 04 : Handles the creation of a new post with optional multiple image
     * uploads.
     */
    @PostMapping("/create/{clubId}")
    public ResponseEntity<Post> createPost(
            @PathVariable Long clubId,
            @RequestParam("content") String content,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {
        try {
            Club club = clubRepository.findById(clubId)
                    .orElseThrow(() -> new RuntimeException("Club not found"));

            Post post = new Post();
            post.setContent(content);
            post.setClub(club);

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            if (files != null && files.length > 0) {
                List<String> savedPaths = new ArrayList<>();
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                        Path filePath = uploadPath.resolve(fileName);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        savedPaths.add("/uploads/" + fileName);
                    }
                }
                post.setImageUrls(savedPaths);
            }

            Post savedPost = postRepository.save(post);
            return ResponseEntity.ok(savedPost);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    /**
     * * Member 04 : Deletes a post and cleans up associated data like shares and
     * comments.
     */
    @DeleteMapping("/{postId}")
    @Transactional
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        return postRepository.findById(postId).map(post -> {

            // 1. FIRST: Remove the "Share" links from the database
            postRepository.deleteShareReferences(postId);

            // 2. NOW: It is safe to delete the post
            postRepository.delete(post);

            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * * Member 04 : Toggles the like status for a post by the current user.
     */
    @PutMapping("/{postId}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable Long postId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return postRepository.findById(postId).map(post -> {
            Set<String> likes = post.getLikedByUsers();
            if (likes.contains(email)) {
                likes.remove(email); // Unlike
            } else {
                likes.add(email); // Like
            }
            post.setLikedByUsers(likes);
            return ResponseEntity.ok(postRepository.save(post));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * * Member 04 : Adds a comment to a specific post.
     */
    @PostMapping("/{postId}/comment")
    public ResponseEntity<Post> addComment(@PathVariable Long postId, @RequestBody Map<String, String> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String text = payload.get("text");

        return postRepository.findById(postId).map(post -> {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Comment comment = new Comment();
            comment.setText(text);
            comment.setUser(user);
            comment.setPost(post);

            post.getComments().add(comment);

            // Saving the post saves the comment because of CascadeType.ALL
            return ResponseEntity.ok(postRepository.save(post));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long postId, @PathVariable Long commentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return commentRepository.findById(commentId).map(comment -> {
            if (!comment.getUser().getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own comments");
            }

            commentRepository.delete(comment);
            return ResponseEntity.ok().body("Deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String newText = payload.get("text");

        return commentRepository.findById(commentId).map(comment -> {
            if (!comment.getUser().getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own comments");
            }

            comment.setText(newText);
            commentRepository.save(comment);
            return ResponseEntity.ok(comment);
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @RequestParam("content") String content,
            // 1. Receive list of OLD images to KEEP 
            @RequestParam(value = "remainingImages", required = false) List<String> remainingImages,
            // 2. Receive NEW images to ADD
            @RequestParam(value = "files", required = false) MultipartFile[] newFiles) {
        return postRepository.findById(postId).map(post -> {
            post.setContent(content);

            // 1. Get current images from DB
            List<String> currentImages = post.getImageUrls();
            if (currentImages == null)
                currentImages = new ArrayList<>();

      
            List<String> imagesToKeep = (remainingImages != null) ? remainingImages : new ArrayList<>();

      
            List<String> finalImageList = new ArrayList<>(imagesToKeep);

            if (newFiles != null && newFiles.length > 0) {
                try {
                    Path uploadPath = Paths.get(UPLOAD_DIR);
                    if (!Files.exists(uploadPath))
                        Files.createDirectories(uploadPath);

                    for (MultipartFile file : newFiles) {
                        if (!file.isEmpty()) {
                            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                            Path filePath = uploadPath.resolve(fileName);
                            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                            // Add new URL to the list
                            finalImageList.add("/uploads/" + fileName);
                        }
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Error uploading new files");
                }
            }

            // Save the final list (Old Kept + New Added)
            post.setImageUrls(finalImageList);

            return ResponseEntity.ok(postRepository.save(post));

        }).orElse(ResponseEntity.notFound().build());
    }
}