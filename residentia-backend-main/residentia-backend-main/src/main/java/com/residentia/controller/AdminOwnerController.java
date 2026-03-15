package com.residentia.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.residentia.entity.Owner;
import com.residentia.repository.OwnerRepository;
import java.util.List;

@RestController
@RequestMapping("/api/admin/owners")
@CrossOrigin(origins = "*") 
public class AdminOwnerController 
{
	private final OwnerRepository ownerRepository;
	
	public AdminOwnerController(OwnerRepository ownerRepository)
	{
		this.ownerRepository = ownerRepository;
	}
	
	//getting the owners
	@GetMapping
	public ResponseEntity<List<Owner>> getAllOwners() {
        return ResponseEntity.ok(ownerRepository.findAll());
    }
	
	//set status
	@PutMapping("/{id}/verify")
	public ResponseEntity<Owner> verifyOwner(@PathVariable Long id) { 
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        owner.setVerificationStatus("VERIFIED");
        owner.setIsActive(true);
        return ResponseEntity.ok(ownerRepository.save(owner));
    }
	
	//reject owner
	@PutMapping("/{id}/reject")
	public ResponseEntity<Owner> rejectOwner(@PathVariable Long id) { 
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        owner.setVerificationStatus("REJECTED");
        owner.setIsActive(false);
        return ResponseEntity.ok(ownerRepository.save(owner));
    }
	
	//remove owner--soft delete,because still in use
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteOwner(@PathVariable Long id) { 
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        owner.setIsActive(false);
        owner.setVerificationStatus("REJECTED");
        ownerRepository.save(owner);
        return ResponseEntity.noContent().build();
    }

	

}
