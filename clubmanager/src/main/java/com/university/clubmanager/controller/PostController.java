package com.university.clubmanager.controller;

import com.university.clubmanager.entity.Club;
import com.university.clubmanager.entity.Comment;
import com.university.clubmanager.entity.Post;
import com.university.clubmanager.entity.User;
import com.university.clubmanager.repository.ClubRepository;
import com.university.clubmanager.repository.CommentRepository; // <--- VITAL IMPORT
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
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

    // --- 1. CREATE POST ---
    @PostMapping("/create/{clubId}")
    public ResponseEntity<Post> createPost(
            @PathVariable Long clubId,
            @RequestParam("content") String content,
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) {
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

    // --- 2. GET ALL POSTS ---
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // --- 3. DELETE POST ---
    @DeleteMapping("/{postId}")
    @Transactional // <--- VITAL: Required for the custom delete to work
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        return postRepository.findById(postId).map(post -> {

            // 1. FIRST: Remove the "Share" links from the database
            postRepository.deleteShareReferences(postId);

            // 2. NOW: It is safe to delete the post
            postRepository.delete(post);

            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- 4. TOGGLE LIKE ---
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

    // --- 5. ADD COMMENT ---
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

    // --- 6. DELETE COMMENT (FIXED) ---
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long postId, @PathVariable Long commentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return commentRepository.findById(commentId).map(comment -> {
            // SECURITY: Only allow deletion if the logged-in user owns the comment
            if (!comment.getUser().getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own comments");
            }

            commentRepository.delete(comment);
            return ResponseEntity.ok().body("Deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- 7. EDIT COMMENT (FIXED FOR 403 ERROR) ---
    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> payload
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String newText = payload.get("text");

        return commentRepository.findById(commentId).map(comment -> {
            // SECURITY: Only allow edit if the logged-in user owns the comment
            if (!comment.getUser().getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own comments");
            }

            comment.setText(newText);
            commentRepository.save(comment);
            return ResponseEntity.ok(comment);
        }).orElse(ResponseEntity.notFound().build());
    }
    // --- ADD THIS TO PostController.java ---

    // --- 8. EDIT POST CONTENT ---
    // --- 8. EDIT POST (TEXT + IMAGES) ---
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @RequestParam("content") String content,
            // 1. Receive list of OLD images to KEEP (Frontend sends this)
            @RequestParam(value = "remainingImages", required = false) List<String> remainingImages,
            // 2. Receive NEW images to ADD
            @RequestParam(value = "files", required = false) MultipartFile[] newFiles
    ) {
        return postRepository.findById(postId).map(post -> {
            post.setContent(content);

            // --- A. HANDLE IMAGE DELETIONS ---
            // 1. Get current images from DB
            List<String> currentImages = post.getImageUrls();
            if (currentImages == null) currentImages = new ArrayList<>();

            // 2. Get the list of images the user wants to KEEP
            // (If null, it means user deleted everything)
            List<String> imagesToKeep = (remainingImages != null) ? remainingImages : new ArrayList<>();

            // 3. Update the post's image list to only contain the "Keep List"
            // (Hibernate will update the DB. We skip physical file deletion for safety/speed,
            // but you could add Files.delete() here if you wanted to save space)
            List<String> finalImageList = new ArrayList<>(imagesToKeep);

            // --- B. HANDLE NEW IMAGE UPLOADS ---
            if (newFiles != null && newFiles.length > 0) {
                try {
                    Path uploadPath = Paths.get(UPLOAD_DIR);
                    if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

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