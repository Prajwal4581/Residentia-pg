package com.residentia.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.residentia.entity.Property;
import com.residentia.repository.PropertyRepository;

@RestController
@RequestMapping("/api/admin/pgs")
@CrossOrigin(origins="*")
public class AdminPgController {

    private final PropertyRepository propertyRepository;

    public AdminPgController(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @GetMapping
    public ResponseEntity<List<Property>> getAll() { 
        return ResponseEntity.ok(propertyRepository.findAll());
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<Property> approve(@PathVariable Long id) { 
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setStatus("ACTIVE");
        return ResponseEntity.ok(propertyRepository.save(property));
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<Property> reject(@PathVariable Long id) { 
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setStatus("REJECTED");
        return ResponseEntity.ok(propertyRepository.save(property));
    }
}

