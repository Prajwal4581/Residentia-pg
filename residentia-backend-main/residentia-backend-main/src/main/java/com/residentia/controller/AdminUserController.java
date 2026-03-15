package com.residentia.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.residentia.entity.RegularUser;
import com.residentia.logging.ActionLogger;
import com.residentia.repository.RegularUserRepository;
import lombok.extern.slf4j.Slf4j;

import jakarta.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins="*")
public class AdminUserController 
{
	private final RegularUserRepository userRepository;
	private final ActionLogger actionLogger;
	
	public AdminUserController(RegularUserRepository userRepository, ActionLogger actionLogger)
	{
		this.userRepository = userRepository;
		this.actionLogger = actionLogger;
	}
	
	//getting users
	@GetMapping
	public ResponseEntity<List<RegularUser>> getAllUsers() { 
        return ResponseEntity.ok(userRepository.findAll());
    }
	
	//deactivate user
	@PutMapping("/{id}/deactivate")
	public ResponseEntity<RegularUser> deactivateUser(@PathVariable Integer id, HttpServletRequest request) { 
        RegularUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        RegularUser saved = userRepository.save(user);
        
        // Log admin action
        String adminEmail = (String) request.getAttribute("email");
        actionLogger.logAdminAction(
            null,
            adminEmail != null ? adminEmail : "ADMIN",
            "DEACTIVATE_USER",
            "RegularUser",
            String.valueOf(id)
        );
        log.info("Admin deactivated user: {} ({})", user.getName(), user.getEmail());
        
        return ResponseEntity.ok(saved);
    }
	
	//activate user
	@PutMapping("/{id}/activate")
	public ResponseEntity<RegularUser> activateUser(@PathVariable Integer id, HttpServletRequest request) {
        RegularUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not Found"));
        user.setIsActive(true);
        RegularUser saved = userRepository.save(user);
        
        // Log admin action
        String adminEmail = (String) request.getAttribute("email");
        actionLogger.logAdminAction(
            null,
            adminEmail != null ? adminEmail : "ADMIN",
            "ACTIVATE_USER",
            "RegularUser",
            String.valueOf(id)
        );
        log.info("Admin activated user: {} ({})", user.getName(), user.getEmail());
        
        return ResponseEntity.ok(saved);
    }
	
	//soft delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable Integer id, HttpServletRequest request) { 
        RegularUser user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not Found"));
        user.setIsActive(false);
        userRepository.save(user);
        
        // Log admin action
        String adminEmail = (String) request.getAttribute("email");
        actionLogger.logAdminAction(
            null,
            adminEmail != null ? adminEmail : "ADMIN",
            "DELETE_USER",
            "RegularUser",
            String.valueOf(id)
        );
        log.info("Admin deleted user: {} ({})", user.getName(), user.getEmail());
        
        return ResponseEntity.noContent().build();
    }
	
}
 