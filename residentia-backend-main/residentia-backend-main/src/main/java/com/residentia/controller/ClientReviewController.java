package com.residentia.controller;

import com.residentia.entity.Booking;
import com.residentia.entity.Property;
import com.residentia.entity.RegularUser;
import com.residentia.entity.Review;
import com.residentia.repository.BookingRepository;
import com.residentia.repository.PropertyRepository;
import com.residentia.repository.RegularUserRepository;
import com.residentia.repository.ReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClientReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private RegularUserRepository regularUserRepository;

    /**
     * Submit a review for a confirmed booking
     * POST /api/reviews/{bookingId}
     */
    @PostMapping("/reviews/{bookingId}")
    public ResponseEntity<?> submitReview(
            @PathVariable Long bookingId,
            @RequestBody Map<String, Object> reviewData) {
        
        log.info("📝 Submitting review for booking: {}", bookingId);
        
        try {
            // Get authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = auth.getName();
            log.info("👤 User email: {}", userEmail);

            // Find user
            RegularUser user = regularUserRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Find booking
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Verify booking belongs to user
            if (!booking.getTenantEmail().equals(userEmail)) {
                log.warn("⚠️ User {} trying to review booking {} that doesn't belong to them", userEmail, bookingId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You can only review your own bookings"));
            }

            // Verify booking is confirmed
            if (!"CONFIRMED".equals(booking.getStatus())) {
                log.warn("⚠️ Cannot review booking {} with status: {}", bookingId, booking.getStatus());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "You can only review confirmed bookings"));
            }

            // Find property
            Property property = booking.getProperty();
            if (property == null) {
                log.error("❌ Property not found for booking: {}", bookingId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Property not found"));
            }

            // Create review
            Review review = new Review();
            review.setUser(user);
            review.setProperty(property);
            review.setReviewText((String) reviewData.get("review"));
            
            // Set rating if provided
            if (reviewData.containsKey("rating")) {
                review.setRating(((Number) reviewData.get("rating")).intValue());
            }
            
            // Set status to PENDING for admin approval
            review.setStatus("PENDING");
            review.setIsAnonymous(false);

            // Save review
            Review savedReview = reviewRepository.save(review);
            log.info("✅ Review submitted successfully with ID: {} for property: {}", savedReview.getId(), property.getId());
            log.info("📬 Review sent to admin for approval");

            return ResponseEntity.ok(Map.of(
                    "message", "Review submitted successfully! It will be visible after admin approval.",
                    "reviewId", savedReview.getId(),
                    "status", savedReview.getStatus()
            ));

        } catch (Exception e) {
            log.error("❌ Error submitting review: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to submit review: " + e.getMessage()));
        }
    }
}
