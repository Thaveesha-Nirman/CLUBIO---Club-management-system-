package com.university.clubmanager.repository;



import com.university.clubmanager.entity.SharedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedPostRepository extends JpaRepository<SharedPost, Long> {
    // You might need this later to find posts shared by a specific user
    List<SharedPost> findByUserId(Long userId);
}