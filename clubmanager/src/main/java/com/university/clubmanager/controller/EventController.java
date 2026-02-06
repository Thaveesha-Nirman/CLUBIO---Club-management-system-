package com.university.clubmanager.controller;

import com.university.clubmanager.entity.Club;
import com.university.clubmanager.entity.Event;
import com.university.clubmanager.repository.ClubRepository;
import com.university.clubmanager.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ClubRepository clubRepository;

    private final String UPLOAD_DIR = "uploads/";

    // --- 1. CREATE EVENT (With Image) ---
    @PostMapping("/create/{clubId}")
    public ResponseEntity<Event> createEvent(
            @PathVariable Long clubId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("date") String date,           // String -> LocalDate
            @RequestParam("time") String time,           // String -> LocalTime
            @RequestParam("ticketPrice") String ticketPrice,
            @RequestParam("targetAudience") String targetAudience,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        try {
            Club club = clubRepository.findById(clubId)
                    .orElseThrow(() -> new RuntimeException("Club not found"));

            Event event = new Event();
            event.setTitle(title);
            event.setDescription(description);
            event.setLocation(location);
            event.setTicketPrice(ticketPrice);
            event.setTargetAudience(targetAudience);
            event.setClub(club);

            // Convert String to Date/Time
            event.setDate(LocalDate.parse(date));
            event.setTime(LocalTime.parse(time));

            // Handle Image Upload
            if (file != null && !file.isEmpty()) {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                event.setImageUrl("/uploads/" + fileName);
            }

            return ResponseEntity.ok(eventRepository.save(event));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // --- 2. GET ALL EVENTS (For Dashboard) ---
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    // Add this inside your EventController class
    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        return eventRepository.findById(eventId).map(event -> {
            eventRepository.delete(event);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}