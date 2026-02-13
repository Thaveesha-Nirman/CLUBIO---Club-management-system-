package com.university.clubmanager.controller;

/**
 * * Member 06 : Mainly UI/UX
 * * Controller for handling file uploads (images, documents).
 */

import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    private static final String UPLOAD_DIR = "./uploads";

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return the URL
            String fileUrl = "http://localhost:8080/uploads/" + fileName;
            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Upload failed");
        }
    }
}