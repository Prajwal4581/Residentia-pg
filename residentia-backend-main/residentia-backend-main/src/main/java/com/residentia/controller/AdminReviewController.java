package com.residentia.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

import com.residentia.entity.Review;
import com.residentia.repository.ReviewRepository;

@Slf4j
@RestController
@RequestMapping("/api/admin/reviews")
@CrossOrigin(origins="*")
public class AdminReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    /**
     * Get all reviews with full details
     */
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        log.info("GET /api/admin/reviews - Fetching all reviews");
        try {
            List<Review> reviews = reviewRepository.findAllWithPropertyAndUser();
            log.info("Retrieved {} reviews", reviews.size());
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            log.error("Error fetching reviews: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Get review by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Integer id) {
        log.info("GET /api/admin/reviews/{} - Fetching review", id);
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            log.error("Error fetching review {}: {}", id, e.getMessage());
            throw e;
        }
    }

    /**
     * Approve a review
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<Review> approveReview(@PathVariable Integer id) {
        log.info("PUT /api/admin/reviews/{}/approve - Approving review", id);
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            review.setStatus("APPROVED");
            Review saved = reviewRepository.save(review);
            log.info("Review {} approved", id);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Error approving review {}: {}", id, e.getMessage());
            throw e;
        }
    }

    /**
     * Reject a review
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<Review> rejectReview(@PathVariable Integer id) {
        log.info("PUT /api/admin/reviews/{}/reject - Rejecting review", id);
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            review.setStatus("REJECTED");
            Review saved = reviewRepository.save(review);
            log.info("Review {} rejected", id);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Error rejecting review {}: {}", id, e.getMessage());
            throw e;
        }
    }

    /**
     * Delete a review
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer id) {
        log.info("DELETE /api/admin/reviews/{} - Deleting review", id);
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Review not found"));
            reviewRepository.delete(review);
            log.info("Review {} deleted", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting review {}: {}", id, e.getMessage());
            throw e;
        }
    }
}