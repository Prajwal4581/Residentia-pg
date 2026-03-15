package com.residentia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDTO {
    private Long propertyId;
    private Long ownerId;
    private String propertyName;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Double rentAmount;
    private String sharingType;
    private Integer maxCapacity;
    private Integer availableBeds;
    private Boolean foodIncluded;
    private String description;
    private String status;
    private String mapLink;
    private String imageUrl;
    private Double rating;
    private Integer reviews;
    private String amenities;
}
