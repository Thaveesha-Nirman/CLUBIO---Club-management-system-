package com.university.clubmanager.repository;

/**
 * * Member 04 : origin/feature/social-engine-lead-fullstack-36672
 * * Repository for Post entity, including custom queries for deep deletion.
 */

import com.university.clubmanager.entity.Club;
import com.university.clubmanager.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByClub(Club club);

    void deleteByClub(Club club);

    // This creates a custom SQL command to wipe the "shared" record from the hidden
    // table
    @Modifying
    @Query(value = "DELETE FROM user_shared_posts WHERE post_id = :postId", nativeQuery = true)
    void deleteShareReferences(@Param("postId") Long postId);
}