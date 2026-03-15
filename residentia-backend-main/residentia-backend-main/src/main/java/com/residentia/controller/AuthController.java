package com.residentia.controller;

import com.residentia.dto.AuthResponseDTO;
import com.residentia.dto.LoginRequest;
import com.residentia.entity.Admin;
import com.residentia.entity.Owner;
import com.residentia.entity.RegularUser;
import com.residentia.repository.AdminRepository;
import com.residentia.repository.OwnerRepository;
import com.residentia.repository.RegularUserRepository;
import com.residentia.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private RegularUserRepository regularUserRepository;
    
    @Autowired
    private OwnerRepository ownerRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.residentia.service.OwnerService ownerService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        log.info("Login attempt - Role: {}, Email: {}", loginRequest.getRole(), loginRequest.getEmail());
        
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        String role = loginRequest.getRole();
        
        Map<String, Object> response = new HashMap<>();
        
        // If role provided, prefer role-based auth, otherwise try all roles (ADMIN -> OWNER -> CLIENT)
        if (role != null && !role.isBlank()) {
            // CLIENT LOGIN
            if ("CLIENT".equalsIgnoreCase(role)) {
                Optional<RegularUser> user = regularUserRepository.findByEmail(email);
                if (user.isPresent() && passwordEncoder.matches(password, user.get().getPasswordHash())) {
                    RegularUser regularUser = user.get();
                    
                    if (!regularUser.getIsActive()) {
                        log.warn("Inactive client attempted login: {}", email);
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("success", false, "message", "Account is deactivated"));
                    }
                    
                    String token = jwtTokenProvider.generateToken(
                        regularUser.getId().longValue(), 
                        email, 
                        "CLIENT"
                    );
                    
                    AuthResponseDTO authResponse = new AuthResponseDTO();
                    authResponse.setUserId(regularUser.getId().longValue());
                    authResponse.setEmail(regularUser.getEmail());
                    authResponse.setName(regularUser.getName());
                    authResponse.setToken(token);
                    authResponse.setMessage("Client login successful!");
                    
                    log.info("Client login successful: {}", email);
                    return ResponseEntity.ok(authResponse);
                }
            } 
            // OWNER LOGIN
            else if ("OWNER".equalsIgnoreCase(role)) {
                Optional<Owner> owner = ownerRepository.findByEmail(email);
                if (owner.isPresent() && passwordEncoder.matches(password, owner.get().getPasswordHash())) {
                    Owner ownerEntity = owner.get();
                    
                    if (!ownerEntity.getIsActive()) {
                        log.warn("Inactive owner attempted login: {}", email);
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(Map.of("success", false, "message", "Account is deactivated"));
                    }
                    
                    String token = jwtTokenProvider.generateToken(
                        ownerEntity.getId().longValue(), 
                        email, 
                        "OWNER"
                    );
                    
                    AuthResponseDTO authResponse = new AuthResponseDTO();
                    authResponse.setOwnerId(ownerEntity.getId().longValue());
                    authResponse.setEmail(ownerEntity.getEmail());
                    authResponse.setName(ownerEntity.getName());
                    authResponse.setToken(token);
                    authResponse.setMessage("Owner login successful!");
                    
                    log.info("Owner login successful: {}", email);
                    return ResponseEntity.ok(authResponse);
                }
            } 
            // ADMIN LOGIN
            else if ("ADMIN".equalsIgnoreCase(role)) {
                // Check against hardcoded admin credentials
                if ("admin@residentia.com".equals(email) && "Admin@123".equals(password)) {
                    String token = jwtTokenProvider.generateToken(1L, email, "ADMIN");
                    
                    AuthResponseDTO authResponse = new AuthResponseDTO();
                    authResponse.setAdminId(1L);
                    authResponse.setEmail(email);
                    authResponse.setName("System Admin");
                    authResponse.setToken(token);
                    authResponse.setMessage("Admin login successful!");
                    
                    log.info("Admin login successful: {}", email);
                    return ResponseEntity.ok(authResponse);
                }
            }
        } else {
            // No role provided: try ADMIN -> OWNER -> CLIENT
            Optional<Admin> admin = adminRepository.findByEmail(email);
            if (admin.isPresent() && passwordEncoder.matches(password, admin.get().getPasswordHash())) {
                Admin adminEntity = admin.get();
                if (!adminEntity.getIsActive()) {
                    log.warn("Inactive admin attempted login: {}", email);
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("success", false, "message", "Admin account is deactivated"));
                }
                String token = jwtTokenProvider.generateToken(adminEntity.getId().longValue(), email, "ADMIN");
                AuthResponseDTO authResponse = new AuthResponseDTO();
                authResponse.setAdminId(adminEntity.getId().longValue());
                authResponse.setEmail(adminEntity.getEmail());
                authResponse.setName(adminEntity.getName());
                authResponse.setToken(token);
                authResponse.setMessage("Admin login successful!");
                log.info("Admin login successful (no role provided): {}", email);
                return ResponseEntity.ok(authResponse);
            }

            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isPresent() && passwordEncoder.matches(password, owner.get().getPasswordHash())) {
                Owner ownerEntity = owner.get();
                if (!ownerEntity.getIsActive()) {
                    log.warn("Inactive owner attempted login: {}", email);
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("success", false, "message", "Account is deactivated"));
                }
                String token = jwtTokenProvider.generateToken(ownerEntity.getId().longValue(), email, "OWNER");
                AuthResponseDTO authResponse = new AuthResponseDTO();
                authResponse.setOwnerId(ownerEntity.getId().longValue());
                authResponse.setEmail(ownerEntity.getEmail());
                authResponse.setName(ownerEntity.getName());
                authResponse.setToken(token);
                authResponse.setMessage("Owner login successful!");
                log.info("Owner login successful (no role provided): {}", email);
                return ResponseEntity.ok(authResponse);
            }

            Optional<RegularUser> user = regularUserRepository.findByEmail(email);
            if (user.isPresent() && passwordEncoder.matches(password, user.get().getPasswordHash())) {
                RegularUser regularUser = user.get();
                if (!regularUser.getIsActive()) {
                    log.warn("Inactive client attempted login: {}", email);
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("success", false, "message", "Account is deactivated"));
                }
                String token = jwtTokenProvider.generateToken(regularUser.getId().longValue(), email, "CLIENT");
                AuthResponseDTO authResponse = new AuthResponseDTO();
                authResponse.setUserId(regularUser.getId().longValue());
                authResponse.setEmail(regularUser.getEmail());
                authResponse.setName(regularUser.getName());
                authResponse.setToken(token);
                authResponse.setMessage("Client login successful!");
                log.info("Client login successful (no role provided): {}", email);
                return ResponseEntity.ok(authResponse);
            }
        }
        
        log.warn("Login failed for email: {} with role: {}", email, role);
        response.put("success", false);
        response.put("message", "Invalid email, password, or role");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/register/owner")
    public ResponseEntity<?> registerOwner(@RequestBody com.residentia.dto.OwnerRegistrationDTO registrationDTO) {
        log.info("Auth register owner request: {}", registrationDTO.getEmail());

        // reuse OwnerService for validation and saving
        com.residentia.entity.Owner owner = ownerService.registerOwner(registrationDTO);
        String token = jwtTokenProvider.generateToken(owner.getId(), owner.getEmail(), "OWNER");

        com.residentia.dto.AuthResponseDTO response = new com.residentia.dto.AuthResponseDTO();
        response.setOwnerId(owner.getId().longValue());
        response.setName(owner.getName());
        response.setEmail(owner.getEmail());
        response.setToken(token);
        response.setMessage("Owner registered successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/register/client")
    public ResponseEntity<?> registerClient(@RequestBody java.util.Map<String, String> dto) {
        log.info("Auth register client request (map): {}", dto.get("email"));

        String email = dto.get("email");
        String name = dto.get("name");
        String mobileNumber = dto.get("mobileNumber");
        String password = dto.get("password");

        if (email == null || password == null || mobileNumber == null || email.isBlank() || password.isBlank() || mobileNumber.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing required fields: email, password, or mobileNumber");
        }

        if (regularUserRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Client already exists");
        }

        if (regularUserRepository.findByMobileNumber(mobileNumber).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Mobile number already in use");
        }

        com.residentia.entity.RegularUser user = new com.residentia.entity.RegularUser();
        user.setName(name != null ? name : "");
        user.setEmail(email);
        user.setMobileNumber(mobileNumber);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setIsActive(true);

        com.residentia.entity.RegularUser saved = regularUserRepository.save(user);

        String token = jwtTokenProvider.generateToken(saved.getId().longValue(), saved.getEmail(), "CLIENT");

        com.residentia.dto.AuthResponseDTO authResponse = new com.residentia.dto.AuthResponseDTO();
        authResponse.setUserId(saved.getId().longValue());
        authResponse.setEmail(saved.getEmail());
        authResponse.setName(saved.getName());
        authResponse.setToken(token);
        authResponse.setMessage("Client registered successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }
}