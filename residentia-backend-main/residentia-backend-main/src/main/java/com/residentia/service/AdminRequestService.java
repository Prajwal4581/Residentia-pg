package com.residentia.service;

import com.residentia.entity.Request;
import com.residentia.entity.Property;
import com.residentia.repository.RequestRepository;
import com.residentia.repository.PropertyRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class AdminRequestService {
    
    @Autowired
    private RequestRepository requestRepository;
    
    @Autowired
    private PropertyRepository propertyRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }
    
    public Optional<Request> getRequestById(Integer id) {
        return requestRepository.findById(id);
    }
    
    public Request createRequest(Request request) {
        return requestRepository.save(request);
    }
    
    public Request updateRequest(Integer id, Request requestDetails) {
        return requestRepository.findById(id).map(request -> {
            if (requestDetails.getStatus() != null) {
                request.setStatus(requestDetails.getStatus());
            }
            return requestRepository.save(request);
        }).orElse(null);
    }
    
    public void deleteRequest(Integer id) {
        requestRepository.deleteById(id);
    }
    
    /**
     * Approve a change request and apply changes to the property
     */
    public Request approveChangeRequest(Integer requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        request.setStatus("APPROVED");
        
        // Apply changes based on change type
        if ("UPDATE".equalsIgnoreCase(request.getChangeType())) {
            applyChangesToProperty(request);
        } else if ("CREATE".equalsIgnoreCase(request.getChangeType())) {
            createPropertyFromRequest(request);
        }
        
        return requestRepository.save(request);
    }

    /**
     * Create a new change request with PENDING status
     */
    public Request createChangeRequest(Request request) {
        // Ensure status is set to PENDING
        request.setStatus("PENDING");
        
        // Ensure property and owner are properly loaded
        if (request.getProperty() != null) {
            Property property = propertyRepository.findById(request.getProperty().getId())
                    .orElseThrow(() -> new RuntimeException("Property not found"));
            request.setProperty(property);
        }
        
        log.info("Creating change request for property {} with status PENDING", request.getProperty().getId());
        return requestRepository.save(request);
    }
    
    /**
     * Parse changeDetails JSON and apply to Property
     */
    private void applyChangesToProperty(Request request) {
        try {
            Property property = request.getProperty();
            String changeDetailsJson = request.getChangeDetails();
            
            // Parse JSON string to Map
            Map<String, Object> changes = objectMapper.readValue(changeDetailsJson, Map.class);
            
            log.info("Applying changes to property {} : {}", property.getId(), changes);
            
            // Apply each change to the property
            for (Map.Entry<String, Object> entry : changes.entrySet()) {
                String fieldName = entry.getKey();
                Object value = entry.getValue();
                
                switch (fieldName.toLowerCase()) {
                    case "propertyname":
                        property.setPropertyName((String) value);
                        break;
                    case "address":
                        property.setAddress((String) value);
                        break;
                    case "city":
                        property.setCity((String) value);
                        break;
                    case "state":
                        property.setState((String) value);
                        break;
                    case "pincode":
                        property.setPincode((String) value);
                        break;
                    case "rentamount":
                    case "rentAmount":
                        property.setRentAmount(((Number) value).intValue());
                        break;
                    case "sharingtype":
                    case "sharingType":
                        property.setSharingType((String) value);
                        break;
                    case "maxcapacity":
                    case "maxCapacity":
                        property.setMaxCapacity(((Number) value).intValue());
                        break;
                    case "availablebeds":
                    case "availableBeds":
                        property.setAvailableBeds(((Number) value).intValue());
                        break;
                    case "foodincluded":
                    case "foodIncluded":
                        property.setFoodIncluded((Boolean) value);
                        break;
                    case "description":
                        property.setDescription((String) value);
                        break;
                    case "maplink":
                    case "mapLink":
                        property.setMapLink((String) value);
                        break;
                    case "imageurl":
                    case "imageUrl":
                        property.setImageUrl((String) value);
                        break;
                    case "amenities":
                        property.setAmenities((String) value);
                        break;
                    default:
                        log.warn("Unknown field in change request: {}", fieldName);
                }
            }
            
            // Save the updated property
            propertyRepository.save(property);
            log.info("Property {} updated successfully", property.getId());
            
        } catch (Exception e) {
            log.error("Error applying changes to property: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to apply changes to property", e);
        }
    }

    /**
     * Create a new property from CREATE request details
     */
    private void createPropertyFromRequest(Request request) {
        try {
            Property tempProperty = request.getProperty();
            String changeDetailsJson = request.getChangeDetails();
            
            // Parse JSON string to Map
            Map<String, Object> changes = objectMapper.readValue(changeDetailsJson, Map.class);
            
            log.info("Creating property from request for owner {}", request.getOwner().getId());
            
            // Update the temporary property with all details from the request
            for (Map.Entry<String, Object> entry : changes.entrySet()) {
                String fieldName = entry.getKey();
                Object value = entry.getValue();
                
                if (value == null) continue;
                
                switch (fieldName.toLowerCase()) {
                    case "propertyname":
                        tempProperty.setPropertyName((String) value);
                        break;
                    case "address":
                        tempProperty.setAddress((String) value);
                        break;
                    case "city":
                        tempProperty.setCity((String) value);
                        break;
                    case "state":
                        tempProperty.setState((String) value);
                        break;
                    case "pincode":
                        tempProperty.setPincode((String) value);
                        break;
                    case "rentamount":
                        if (value instanceof Number) {
                            tempProperty.setRentAmount(((Number) value).intValue());
                        }
                        break;
                    case "sharingtype":
                        tempProperty.setSharingType((String) value);
                        break;
                    case "maxcapacity":
                        if (value instanceof Number) {
                            tempProperty.setMaxCapacity(((Number) value).intValue());
                        }
                        break;
                    case "availablebeds":
                        if (value instanceof Number) {
                            tempProperty.setAvailableBeds(((Number) value).intValue());
                        }
                        break;
                    case "foodincluded":
                        tempProperty.setFoodIncluded((Boolean) value);
                        break;
                    case "description":
                        tempProperty.setDescription((String) value);
                        break;
                    case "maplink":
                        tempProperty.setMapLink((String) value);
                        break;
                    case "imageurl":
                        tempProperty.setImageUrl((String) value);
                        break;
                    case "amenities":
                        tempProperty.setAmenities((String) value);
                        break;
                }
            }
            
            // Set status to ACTIVE after approval
            tempProperty.setStatus("ACTIVE");
            
            // Save the fully populated property
            propertyRepository.save(tempProperty);
            log.info("Property {} created successfully after approval", tempProperty.getId());
            
        } catch (Exception e) {
            log.error("Error creating property from request: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create property from request", e);
        }
    }}