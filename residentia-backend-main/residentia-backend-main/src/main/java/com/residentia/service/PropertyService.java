package com.residentia.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.residentia.dto.PropertyDTO;
import com.residentia.entity.Owner;
import com.residentia.entity.Property;
import com.residentia.entity.Request;
import com.residentia.exception.ResourceNotFoundException;
import com.residentia.repository.OwnerRepository;
import com.residentia.repository.PropertyRepository;
import com.residentia.repository.RequestRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private RequestRepository requestRepository;

    public Property createProperty(Long ownerId, PropertyDTO propertyDTO) {
        log.info("Creating property for owner: {}", ownerId);

        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));

        Property property = new Property();
        property.setOwner(owner);
        property.setPropertyName(propertyDTO.getPropertyName());
        property.setAddress(propertyDTO.getAddress());
        property.setCity(propertyDTO.getCity());
        property.setState(propertyDTO.getState());
        property.setPincode(propertyDTO.getPincode());
        property.setRentAmount(propertyDTO.getRentAmount().intValue());
        property.setSharingType(propertyDTO.getSharingType());
        property.setMaxCapacity(propertyDTO.getMaxCapacity());
        property.setAvailableBeds(propertyDTO.getAvailableBeds());
        property.setFoodIncluded(propertyDTO.getFoodIncluded());
        property.setDescription(propertyDTO.getDescription());
        property.setStatus(propertyDTO.getStatus() != null ? propertyDTO.getStatus() : "ACTIVE");
        property.setAmenities(propertyDTO.getAmenities());
        // Image URL is stored as public Cloudinary URL - accessible by all authenticated users (owner, client, admin)
        property.setImageUrl(propertyDTO.getImageUrl());

        return propertyRepository.save(property);
    }

    public Request createPropertyRequest(Long ownerId, PropertyDTO propertyDTO) {
        log.info("Creating property request for owner: {}", ownerId);

        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));

        // Create a temporary property object with all required fields
        Property tempProperty = new Property();
        tempProperty.setOwner(owner);
        tempProperty.setPropertyName(propertyDTO.getPropertyName());
        tempProperty.setAddress(propertyDTO.getAddress()); // Required field
        tempProperty.setCity(propertyDTO.getCity());
        tempProperty.setState(propertyDTO.getState());
        tempProperty.setPincode(propertyDTO.getPincode());
        tempProperty.setRentAmount(propertyDTO.getRentAmount() != null ? propertyDTO.getRentAmount().intValue() : 0);
        tempProperty.setSharingType(propertyDTO.getSharingType());
        tempProperty.setMaxCapacity(propertyDTO.getMaxCapacity() != null ? propertyDTO.getMaxCapacity() : 0);
        tempProperty.setAvailableBeds(propertyDTO.getAvailableBeds() != null ? propertyDTO.getAvailableBeds() : 0);
        tempProperty.setFoodIncluded(propertyDTO.getFoodIncluded() != null ? propertyDTO.getFoodIncluded() : false);
        tempProperty.setDescription(propertyDTO.getDescription());
        tempProperty.setAmenities(propertyDTO.getAmenities());
        // Image URL stored as public Cloudinary URL - viewable by all users regardless of role
        tempProperty.setImageUrl(propertyDTO.getImageUrl());
        tempProperty.setStatus("PENDING");
        tempProperty = propertyRepository.save(tempProperty);

        // Create request with property details in JSON
        Request request = new Request();
        request.setProperty(tempProperty);
        request.setOwner(owner);
        request.setChangeType("CREATE");
        request.setStatus("PENDING");

        // Store property details as JSON in changeDetails
        try {
            ObjectMapper mapper = new ObjectMapper();
            request.setChangeDetails(mapper.writeValueAsString(propertyDTO));
        } catch (Exception e) {
            log.error("Failed to serialize property details", e);
            throw new RuntimeException("Failed to create property request", e);
        }

        return requestRepository.save(request);
    }

    public Request createPropertyUpdateRequest(Long ownerId, Long propertyId, PropertyDTO propertyDTO) {
        log.info("Creating property update request for property: {} by owner: {}", propertyId, ownerId);

        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        // Verify that the property belongs to the owner
        if (!property.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Property does not belong to this owner");
        }

        // Create request with property update details in JSON
        Request request = new Request();
        request.setProperty(property);
        request.setOwner(owner);
        request.setChangeType("UPDATE");
        request.setStatus("PENDING");

        // Store property update details as JSON in changeDetails
        try {
            ObjectMapper mapper = new ObjectMapper();
            request.setChangeDetails(mapper.writeValueAsString(propertyDTO));
        } catch (Exception e) {
            log.error("Failed to serialize property update details", e);
            throw new RuntimeException("Failed to create property update request", e);
        }

        return requestRepository.save(request);
    }

    public Property updateProperty(Long propertyId, PropertyDTO propertyDTO) {
        log.info("🔄 Updating property: {}", propertyId);
        log.info("📥 Received imageUrl: {}", propertyDTO.getImageUrl());

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        log.info("📷 Current imageUrl: {}", property.getImageUrl());

        if (propertyDTO.getPropertyName() != null) property.setPropertyName(propertyDTO.getPropertyName());
        if (propertyDTO.getAddress() != null) property.setAddress(propertyDTO.getAddress());
        if (propertyDTO.getCity() != null) property.setCity(propertyDTO.getCity());
        if (propertyDTO.getState() != null) property.setState(propertyDTO.getState());
        if (propertyDTO.getPincode() != null) property.setPincode(propertyDTO.getPincode());
        if (propertyDTO.getRentAmount() != null) property.setRentAmount(propertyDTO.getRentAmount().intValue());
        if (propertyDTO.getSharingType() != null) property.setSharingType(propertyDTO.getSharingType());
        if (propertyDTO.getMaxCapacity() != null) property.setMaxCapacity(propertyDTO.getMaxCapacity());
        if (propertyDTO.getAvailableBeds() != null) property.setAvailableBeds(propertyDTO.getAvailableBeds());
        if (propertyDTO.getFoodIncluded() != null) property.setFoodIncluded(propertyDTO.getFoodIncluded());
        if (propertyDTO.getDescription() != null) property.setDescription(propertyDTO.getDescription());
        if (propertyDTO.getStatus() != null) property.setStatus(propertyDTO.getStatus());
        if (propertyDTO.getAmenities() != null) property.setAmenities(propertyDTO.getAmenities());
        if (propertyDTO.getImageUrl() != null) {
            log.info("📷 Updating imageUrl from {} to {}", property.getImageUrl(), propertyDTO.getImageUrl());
            property.setImageUrl(propertyDTO.getImageUrl());
        }

        Property savedProperty = propertyRepository.save(property);
        log.info("✅ Property saved with imageUrl: {}", savedProperty.getImageUrl());
        return savedProperty;
    }

    public PropertyDTO getPropertyById(Long propertyId) {
        log.info("Fetching property: {}", propertyId);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        return convertToDTO(property);
    }

    public List<PropertyDTO> getOwnerProperties(Long ownerId) {
        log.info("Fetching properties for owner: {}", ownerId);

        List<Property> properties = propertyRepository.findByOwnerId(ownerId);
        return properties.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public void deleteProperty(Long propertyId) {
        log.info("Deleting property: {}", propertyId);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        propertyRepository.delete(property);
    }

    private PropertyDTO convertToDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setPropertyId(property.getId());
        
        // Handle null owner - refresh the property to ensure owner is loaded
        if (property.getOwner() == null) {
            log.warn("Owner is null for property: {}. Refreshing from database.", property.getId());
            property = propertyRepository.findById(property.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        }
        
        dto.setOwnerId(property.getOwner().getId());
        dto.setPropertyName(property.getPropertyName());
        dto.setAddress(property.getAddress());
        dto.setCity(property.getCity());
        dto.setState(property.getState());
        dto.setPincode(property.getPincode());
        dto.setRentAmount(Double.valueOf(property.getRentAmount()));
        dto.setSharingType(property.getSharingType());
        dto.setMaxCapacity(property.getMaxCapacity());
        dto.setAvailableBeds(property.getAvailableBeds());
        dto.setFoodIncluded(property.getFoodIncluded());
        dto.setDescription(property.getDescription());
        dto.setStatus(property.getStatus());
        dto.setMapLink(property.getMapLink());
        dto.setAmenities(property.getAmenities());
        dto.setImageUrl(property.getImageUrl());
        return dto;
    }
}
