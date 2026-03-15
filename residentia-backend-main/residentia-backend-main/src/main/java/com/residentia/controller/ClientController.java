package com.residentia.controller;

import com.residentia.dto.PropertyDTO;
import com.residentia.service.ClientService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClientController {

    @Autowired
    private ClientService clientService;

    /**
     * Get all available properties
     */
    @GetMapping("/properties")
    public ResponseEntity<List<PropertyDTO>> getAllProperties() {
        log.info("GET /api/client/properties - Fetching all properties");
        try {
            List<PropertyDTO> properties = clientService.getAllAvailableProperties();
            log.info("Returning {} properties", properties.size());
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("Error fetching properties: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Search properties by city
     */
    @GetMapping("/search/city")
    public ResponseEntity<List<PropertyDTO>> searchByCity(@RequestParam String city) {
        log.info("GET /api/client/search/city?city={}", city);
        try {
            List<PropertyDTO> properties = clientService.searchPropertiesByCity(city);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("Error searching by city: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Search properties by budget
     */
    @GetMapping("/search/budget")
    public ResponseEntity<List<PropertyDTO>> searchByBudget(
            @RequestParam Integer minBudget,
            @RequestParam Integer maxBudget) {
        log.info("GET /api/client/search/budget?minBudget={}&maxBudget={}", minBudget, maxBudget);
        try {
            List<PropertyDTO> properties = clientService.searchPropertiesByBudget(minBudget, maxBudget);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("Error searching by budget: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Search properties by sharing type
     */
    @GetMapping("/search/sharing")
    public ResponseEntity<List<PropertyDTO>> searchBySharingType(@RequestParam String sharingType) {
        log.info("GET /api/client/search/sharing?sharingType={}", sharingType);
        try {
            List<PropertyDTO> properties = clientService.searchPropertiesBySharingType(sharingType);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("Error searching by sharing type: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Search properties with food included
     */
    @GetMapping("/search/food")
    public ResponseEntity<List<PropertyDTO>> searchWithFood(@RequestParam Boolean foodIncluded) {
        log.info("GET /api/client/search/food?foodIncluded={}", foodIncluded);
        try {
            List<PropertyDTO> properties = clientService.searchPropertiesWithFood(foodIncluded);
            return ResponseEntity.ok(properties);
        } catch (Exception e) {
            log.error("Error searching with food: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Get property by ID
     */
    @GetMapping("/properties/{propertyId}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long propertyId) {
        log.info("GET /api/client/properties/{}", propertyId);
        try {
            PropertyDTO property = clientService.getPropertyById(propertyId);
            return ResponseEntity.ok(property);
        } catch (Exception e) {
            log.error("Error fetching property {}: {}", propertyId, e.getMessage(), e);
            return ResponseEntity.status(404).body(null);
        }
    }
}