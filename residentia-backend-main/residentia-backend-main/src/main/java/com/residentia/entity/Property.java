
package com.residentia.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "pgs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonSerialize(as = Property.class)
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private Owner owner;

    @Column(name = "property_name")
    private String propertyName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    @Column(name = "rent_amount", nullable = false)
    private Integer rentAmount;

    @Column(name = "sharing_type")
    private String sharingType;

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity;

    @Column(name = "available_beds", nullable = false)
    private Integer availableBeds;

    @Column(name = "food_included", nullable = false)
    private Boolean foodIncluded;

    @Column(columnDefinition = "LONGTEXT")
    private String description;

    @Column(nullable = false)
    private String status;

    @Column(name = "map_link")
    private String mapLink;
    
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;
    
    @Column(columnDefinition = "VARCHAR(500)")
    private String amenities;
    
    private Integer reviews;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
