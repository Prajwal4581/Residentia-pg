package com.residentia.service;

import com.residentia.entity.Review;
import com.residentia.repository.ReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class AdminReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    /**
     * Get all reviews with full details
     */
    public List<Review> getAllReviewsWithDetails() {
        log.info("Fetching all reviews with details");
        List<Review> reviews = reviewRepository.findAll();
        log.info("Found {} reviews", reviews.size());
        return reviews;
    }

    /**
     * Get review by ID with full details
     */
    public Review getReviewById(Integer id) {
        log.info("Fetching review with id: {}", id);
        return reviewRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Review not found with id: {}", id);
                    return new RuntimeException("Review not found");
                });
    }

    /**
     * Approve a review
     */
    public Review approveReview(Integer id) {
        log.info("Approving review with id: {}", id);
        Review review = getReviewById(id);
        review.setStatus("APPROVED");
        Review saved = reviewRepository.save(review);
        log.info("Review {} approved successfully", id);
        return saved;
    }

    /**
     * Reject a review
     */
    public Review rejectReview(Integer id) {
        log.info("Rejecting review with id: {}", id);
        Review review = getReviewById(id);
        review.setStatus("REJECTED");
        Review saved = reviewRepository.save(review);
        log.info("Review {} rejected successfully", id);
        return saved;
    }

    /**
     * Delete a review
     */
    public void deleteReview(Integer id) {
        log.info("Deleting review with id: {}", id);
        Review review = getReviewById(id);
        reviewRepository.delete(review);
        log.info("Review {} deleted successfully", id);
    }
}