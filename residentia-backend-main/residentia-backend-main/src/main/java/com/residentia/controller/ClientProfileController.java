package com.residentia.controller;

import com.residentia.entity.RegularUser;
import com.residentia.repository.RegularUserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/client/profile")
@Tag(name = "Client Profile", description = "APIs for client profile retrieval and update")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClientProfileController {

    private final RegularUserRepository regularUserRepository;

    public ClientProfileController(RegularUserRepository regularUserRepository) {
        this.regularUserRepository = regularUserRepository;
    }

    @GetMapping
    @Operation(summary = "Get logged-in client's profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("email");
            if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

            RegularUser user = regularUserRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> resp = new HashMap<>();
            resp.put("id", user.getId());
            resp.put("name", user.getName());
            resp.put("email", user.getEmail());
            resp.put("mobileNumber", user.getMobileNumber());
            resp.put("isActive", user.getIsActive());

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            log.error("Failed to fetch profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping
    @Operation(summary = "Update logged-in client's profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("email");
            if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

            RegularUser user = regularUserRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String newName = payload.get("name");
            String newMobile = payload.get("mobileNumber");

            if (newMobile != null && !newMobile.equals(user.getMobileNumber())) {
                // Check uniqueness
                if (regularUserRepository.findByMobileNumber(newMobile).isPresent()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Mobile number already in use");
                }
                user.setMobileNumber(newMobile);
            }

            if (newName != null) user.setName(newName);

            regularUserRepository.save(user);

            Map<String, Object> resp = new HashMap<>();
            resp.put("id", user.getId());
            resp.put("name", user.getName());
            resp.put("email", user.getEmail());
            resp.put("mobileNumber", user.getMobileNumber());

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            log.error("Failed to update profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
