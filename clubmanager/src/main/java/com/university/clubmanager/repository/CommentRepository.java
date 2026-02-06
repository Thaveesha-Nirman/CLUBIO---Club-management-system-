// src/main/java/com/university/clubmanager/repository/CommentRepository.java

package com.university.clubmanager.repository;

import com.university.clubmanager.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
}