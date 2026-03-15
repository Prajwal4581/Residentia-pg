package com.residentia.service;

import com.residentia.dto.PropertyDTO;
import com.residentia.entity.Property;
import com.residentia.repository.PropertyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ClientService {

    @Autowired
    private PropertyRepository propertyRepository;

    /**
     * Get all ACTIVE properties
     */
    public List<PropertyDTO> getAllAvailableProperties() {
        log.info("Fetching all available properties");
        List<Property> properties = propertyRepository.findAll();
        List<PropertyDTO> result = properties.stream()
                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        log.info("Retrieved {} active properties", result.size());
        return result;
    }

    /**
     * Search properties by city
     */
    public List<PropertyDTO> searchPropertiesByCity(String city) {
        log.info("Searching properties in city: {}", city);
        List<Property> properties = propertyRepository.findAll();
        List<PropertyDTO> result = properties.stream()
                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()) && 
                           p.getCity() != null && p.getCity().equalsIgnoreCase(city))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        log.info("Found {} properties in city: {}", result.size(), city);
        return result;
    }

    /**
     * Search properties by budget range
     */
    public List<PropertyDTO> searchPropertiesByBudget(Integer minBudget, Integer maxBudget) {
        log.info("Searching properties with budget: {} - {}", minBudget, maxBudget);
        List<Property> properties = propertyRepository.findAll();
        List<PropertyDTO> result = properties.stream()
                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()) &&
                           p.getRentAmount() != null &&
                           p.getRentAmount() >= minBudget &&
                           p.getRentAmount() <= maxBudget)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        log.info("Found {} properties in budget range", result.size());
        return result;
    }

    /**
     * Search properties by sharing type
     */
    public List<PropertyDTO> searchPropertiesBySharingType(String sharingType) {
        log.info("Searching properties with sharing type: {}", sharingType);
        List<Property> properties = propertyRepository.findAll();
        List<PropertyDTO> result = properties.stream()
                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()) &&
                           p.getSharingType() != null &&
                           p.getSharingType().equalsIgnoreCase(sharingType))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        log.info("Found {} properties with sharing type: {}", result.size(), sharingType);
        return result;
    }

    /**
     * Search properties by food inclusion
     */
    public List<PropertyDTO> searchPropertiesWithFood(Boolean foodIncluded) {
        log.info("Searching properties with food included: {}", foodIncluded);
        List<Property> properties = propertyRepository.findAll();
        List<PropertyDTO> result = properties.stream()
                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()) &&
                           p.getFoodIncluded() != null &&
                           p.getFoodIncluded().equals(foodIncluded))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        log.info("Found {} properties with food: {}", result.size(), foodIncluded);
        return result;
    }

    /**
     * Get single property by ID
     */
    public PropertyDTO getPropertyById(Long propertyId) {
        log.info("Fetching property: {}", propertyId);
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + propertyId));
        return convertToDTO(property);
    }

    /**
     * Convert Property to PropertyDTO
     * All property data including image URLs are accessible to clients.
     * Image URLs are public Cloudinary URLs that work for all authenticated users.
     */
    private PropertyDTO convertToDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setPropertyId(property.getId());
        
        if (property.getOwner() != null) {
            dto.setOwnerId(property.getOwner().getId());
        }
        
        dto.setPropertyName(property.getPropertyName());
        dto.setAddress(property.getAddress());
        dto.setCity(property.getCity());
        dto.setState(property.getState());
        dto.setPincode(property.getPincode());
        
        if (property.getRentAmount() != null) {
            dto.setRentAmount(Double.valueOf(property.getRentAmount()));
        }
        
        dto.setSharingType(property.getSharingType());
        dto.setMaxCapacity(property.getMaxCapacity());
        dto.setAvailableBeds(property.getAvailableBeds());
        dto.setFoodIncluded(property.getFoodIncluded());
        dto.setDescription(property.getDescription());
        dto.setStatus(property.getStatus());
        dto.setMapLink(property.getMapLink());
        dto.setImageUrl(property.getImageUrl());
        dto.setAmenities(property.getAmenities());
        
        if (property.getReviews() != null) {
            dto.setReviews(property.getReviews());
        } else {
            dto.setReviews(0);
        }
        
        return dto;
    }
}
