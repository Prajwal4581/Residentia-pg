package com.residentia.controller;

import com.residentia.dto.*;
import com.residentia.entity.Owner;
import com.residentia.entity.Request;
import com.residentia.logging.ActionLogger;
import com.residentia.security.JwtTokenProvider;
import com.residentia.service.OwnerService;
import com.residentia.service.AdminRequestService;
import com.residentia.repository.PropertyRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/owner")
@Tag(name = "Owner Management", description = "APIs for Owner Registration, Login, and Profile Management")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AdminRequestService adminRequestService;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private ActionLogger actionLogger;

    @PostMapping("/register")
    @Operation(summary = "Register a new owner", description = "Create a new owner account with all required details")
    @ApiResponse(responseCode = "201", description = "Owner registered successfully")
    @ApiResponse(responseCode = "409", description = "Owner already exists")
    public ResponseEntity<?> registerOwner(@RequestBody OwnerRegistrationDTO registrationDTO) {
        log.info("Owner registration request: {}", registrationDTO.getEmail());
        try {
            Owner owner = ownerService.registerOwner(registrationDTO);
            String token = jwtTokenProvider.generateToken(owner.getId(), owner.getEmail(), "OWNER");

            // Log owner registration
            actionLogger.logOwnerAction(
                owner.getId(),
                owner.getEmail(),
                "OWNER_REGISTRATION",
                String.format("Name: %s, Phone: %s", owner.getName(), owner.getMobileNumber())
            );

            AuthResponseDTO response = new AuthResponseDTO();
            response.setOwnerId(owner.getId());
            response.setName(owner.getName());
            response.setEmail(owner.getEmail());
            response.setToken(token);
            response.setMessage("Owner registered successfully!");

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage());
            actionLogger.logError("OWNER", registrationDTO.getEmail(), "OWNER_REGISTRATION", e);
            throw e;
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Login owner", description = "Authenticate owner with email and password")
    @ApiResponse(responseCode = "200", description = "Login successful")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    public ResponseEntity<?> loginOwner(@RequestBody OwnerLoginDTO loginDTO) {
        log.info("Owner login request: {}", loginDTO.getEmail());
        try {
            String token = ownerService.loginOwner(loginDTO);
            OwnerDTO owner = ownerService.getOwnerByEmail(loginDTO.getEmail());

            // Log successful login
            actionLogger.logOwnerAction(
                owner.getId(),
                owner.getEmail(),
                "OWNER_LOGIN",
                "Login successful"
            );

            AuthResponseDTO response = new AuthResponseDTO();
            response.setOwnerId(owner.getId());
            response.setEmail(owner.getEmail());
            response.setName(owner.getName());
            response.setToken(token);
            response.setMessage("Login successful!");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            actionLogger.logError("OWNER", loginDTO.getEmail(), "OWNER_LOGIN", e);
            throw e;
        }
    }

    @GetMapping("/profile")
    @Operation(summary = "Get owner profile", description = "Retrieve logged-in owner's profile information")
    @ApiResponse(responseCode = "200", description = "Profile retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Owner not found")
    public ResponseEntity<?> getProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            OwnerDTO ownerDTO = ownerService.getOwnerByEmail(email);
            return ResponseEntity.ok(ownerDTO);
        } catch (Exception e) {
            log.error("Failed to fetch profile: {}", e.getMessage());
            throw e;
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "Update owner profile", description = "Update owner's profile information")
    @ApiResponse(responseCode = "200", description = "Profile updated successfully")
    @ApiResponse(responseCode = "404", description = "Owner not found")
    public ResponseEntity<?> updateProfile(@RequestBody OwnerDTO ownerDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            OwnerDTO currentOwner = ownerService.getOwnerByEmail(email);

            OwnerDTO updated = ownerService.updateOwnerProfile(currentOwner.getId(), ownerDTO);
            
            // Log profile update
            actionLogger.logOwnerAction(
                updated.getId(),
                email,
                "UPDATE_PROFILE",
                "Profile information updated"
            );
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Failed to update profile: {}", e.getMessage());
            actionLogger.logError("OWNER", ownerDTO.getEmail(), "UPDATE_PROFILE", e);
            throw e;
        }
    }

    @GetMapping("/{ownerId}")
    @Operation(summary = "Get owner by ID", description = "Retrieve owner information by owner ID")
    @ApiResponse(responseCode = "200", description = "Owner retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Owner not found")
    public ResponseEntity<?> getOwnerById(@PathVariable Long ownerId) {
        try {
            OwnerDTO ownerDTO = ownerService.getOwnerById(ownerId);
            return ResponseEntity.ok(ownerDTO);
        } catch (Exception e) {
            log.error("Failed to fetch owner: {}", e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{ownerId}")
    @Operation(summary = "Delete owner account", description = "Delete an owner account and all associated data")
    @ApiResponse(responseCode = "200", description = "Owner deleted successfully")
    @ApiResponse(responseCode = "404", description = "Owner not found")
    public ResponseEntity<?> deleteOwner(@PathVariable Long ownerId) {
        try {
            ownerService.deleteOwner(ownerId);
            return ResponseEntity.ok(new MessageResponse("Owner deleted successfully"));
        } catch (Exception e) {
            log.error("Failed to delete owner: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/change-request")
    @Operation(summary = "Create change request", description = "Owner creates a request to update property details (status starts as PENDING)")
    @ApiResponse(responseCode = "201", description = "Change request created successfully")
    @ApiResponse(responseCode = "404", description = "Property or owner not found")
    public ResponseEntity<?> createChangeRequest(@RequestBody Request changeRequest) {
        try {
            // Get authenticated owner
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            OwnerDTO ownerDTO = ownerService.getOwnerByEmail(email);
            
            // Ensure change type is set
            if (changeRequest.getChangeType() == null) {
                changeRequest.setChangeType("UPDATE");
            }
            
            // Create the change request with PENDING status
            // The service will reload the property with proper relationships
            Request savedRequest = adminRequestService.createChangeRequest(changeRequest);
            log.info("Change request created successfully for property {} by owner {}", 
                changeRequest.getProperty().getId(), email);
            
            // Log change request creation
            actionLogger.logOwnerAction(
                ownerDTO.getId(),
                email,
                "CREATE_CHANGE_REQUEST",
                String.format("PropertyID: %d, RequestID: %d, Type: %s",
                    changeRequest.getProperty().getId(), savedRequest.getId(), changeRequest.getChangeType())
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
        } catch (Exception e) {
            log.error("Failed to create change request: {}", e.getMessage(), e);
            throw e;
        }
    }
}
