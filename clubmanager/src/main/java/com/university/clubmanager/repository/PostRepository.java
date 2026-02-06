package com.university.clubmanager.repository;

import com.university.clubmanager.entity.Club;
import com.university.clubmanager.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // <--- Needed for delete queries
import org.springframework.data.jpa.repository.Query;     // <--- Needed for custom SQL
import org.springframework.data.repository.query.Param;   // <--- Needed to pass the ID
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // --- EXISTING METHODS (Do not remove) ---
    List<Post> findByClub(Club club);
    void deleteByClub(Club club);

    // --- NEW METHOD TO FIX YOUR DELETE ERROR ---
    // This creates a custom SQL command to wipe the "shared" record from the hidden table
    @Modifying
    @Query(value = "DELETE FROM user_shared_posts WHERE post_id = :postId", nativeQuery = true)
    void deleteShareReferences(@Param("postId") Long postId);
}