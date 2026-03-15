package com.residentia.repository;

import com.residentia.entity.Review;
import com.residentia.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByProperty(Property property);
     
    List<Review> findByPropertyAndStatus(Property property, String status);

    List<Review> findByStatus(String status);

    long countByStatus(String status);
    
    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.property LEFT JOIN FETCH r.user")
    List<Review> findAllWithPropertyAndUser();
}
