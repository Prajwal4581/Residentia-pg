package com.residentia.service;

import com.residentia.dto.OwnerDTO;
import com.residentia.dto.OwnerLoginDTO;
import com.residentia.dto.OwnerRegistrationDTO;
import com.residentia.entity.Owner;
import com.residentia.exception.DuplicateResourceException;
import com.residentia.exception.ResourceNotFoundException;
import com.residentia.exception.UnauthorizedException;
import com.residentia.repository.OwnerRepository;
import com.residentia.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public Owner registerOwner(OwnerRegistrationDTO registrationDTO) {
        log.info("Registering owner with email: {}", registrationDTO.getEmail());

        if (ownerRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new DuplicateResourceException("Owner with email " + registrationDTO.getEmail() + " already exists");
        }

        Owner owner = new Owner();
        owner.setName(registrationDTO.getName());
        owner.setEmail(registrationDTO.getEmail());
        owner.setMobileNumber(registrationDTO.getMobile());
        owner.setBusinessName(registrationDTO.getManagementCompany());
        owner.setAddress(registrationDTO.getAddress());
        owner.setPasswordHash(passwordEncoder.encode(registrationDTO.getPassword()));
        owner.setIsActive(true);
        owner.setVerificationStatus("PENDING");

        return ownerRepository.save(owner);
    }

    public String loginOwner(OwnerLoginDTO loginDTO) {
        log.info("Login attempt for owner email: {}", loginDTO.getEmail());

        Optional<Owner> ownerOptional = ownerRepository.findByEmail(loginDTO.getEmail());
        
        if (!ownerOptional.isPresent()) {
            log.warn("Owner not found with email: {}", loginDTO.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        }

        Owner owner = ownerOptional.get();
        log.debug("Owner found: {}", owner.getEmail());

        if (!passwordEncoder.matches(loginDTO.getPassword(), owner.getPasswordHash())) {
            log.warn("Password mismatch for owner: {}", loginDTO.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        }

        // include role so filter can pick it up and set ownerId when role==OWNER
        String token = jwtTokenProvider.generateToken(owner.getId(), owner.getEmail(), "OWNER");
        log.info("Owner login successful: {} (ID: {})", owner.getEmail(), owner.getId());
        return token;
    }

    public OwnerDTO getOwnerByEmail(String email) {
        log.info("Fetching owner with email: {}", email);
        
        Owner owner = ownerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with email: " + email));
        
        return convertToDTO(owner);
    }

    public OwnerDTO getOwnerById(Long ownerId) {
        log.info("Fetching owner with id: {}", ownerId);
        
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));
        
        return convertToDTO(owner);
    }

    public OwnerDTO updateOwnerProfile(Long ownerId, OwnerDTO ownerDTO) {
        log.info("Updating owner profile: {}", ownerId);
        
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));

        if (ownerDTO.getName() != null) owner.setName(ownerDTO.getName());
        if (ownerDTO.getMobileNumber() != null) owner.setMobileNumber(ownerDTO.getMobileNumber());
        if (ownerDTO.getBusinessName() != null) owner.setBusinessName(ownerDTO.getBusinessName());
        if (ownerDTO.getAddress() != null) owner.setAddress(ownerDTO.getAddress());
        if (ownerDTO.getAlternateContact() != null) owner.setAlternateContact(ownerDTO.getAlternateContact());
        if (ownerDTO.getVerificationStatus() != null) owner.setVerificationStatus(ownerDTO.getVerificationStatus());
        if (ownerDTO.getIsActive() != null) owner.setIsActive(ownerDTO.getIsActive());

        Owner updatedOwner = ownerRepository.save(owner);
        return convertToDTO(updatedOwner);
    }

    public void deleteOwner(Long ownerId) {
        log.info("Deleting owner with id: {}", ownerId);
        
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));
        
        ownerRepository.delete(owner);
    }

    private OwnerDTO convertToDTO(Owner owner) {
        OwnerDTO dto = new OwnerDTO();
        dto.setId(owner.getId());
        dto.setName(owner.getName());
        dto.setEmail(owner.getEmail());
        dto.setMobileNumber(owner.getMobileNumber());
        dto.setBusinessName(owner.getBusinessName());
        dto.setAddress(owner.getAddress());
        dto.setAlternateContact(owner.getAlternateContact());
        dto.setVerificationStatus(owner.getVerificationStatus());
        dto.setIsActive(owner.getIsActive());
        return dto;
    }
}
