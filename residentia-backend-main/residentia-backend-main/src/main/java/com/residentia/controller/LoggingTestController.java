package com.residentia.controller;

import com.residentia.logging.ActionLogger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Test controller to demonstrate logging functionality.
 * Use this to verify that logging is working correctly.
 * 
 * Access: http://localhost:8888/api/test/logging
 */
@Slf4j
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class LoggingTestController {

    @Autowired
    private ActionLogger actionLogger;

    /**
     * Test endpoint to verify all logging levels
     * GET http://localhost:8888/api/test/logging
     */
    @GetMapping("/logging")
    public ResponseEntity<?> testLogging() {
        log.info("🧪 Testing logging system - INFO level");
        log.debug("🔍 Testing logging system - DEBUG level");
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Logging test completed. Check log files in logs/ directory");
        response.put("timestamp", LocalDateTime.now().toString());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Test client action logging
     * POST http://localhost:8888/api/test/logging/client
     * Body: { "userId": 123, "email": "test@example.com", "action": "TEST_ACTION" }
     */
    @PostMapping("/logging/client")
    public ResponseEntity<?> testClientLogging(@RequestBody Map<String, Object> request) {
        Integer userId = (Integer) request.get("userId");
        String email = (String) request.get("email");
        String action = (String) request.get("action");
        
        log.info("Testing CLIENT logging for user: {}", email);
        
        actionLogger.logClientAction(
            userId,
            email,
            action,
            String.format("Test action at %s", LocalDateTime.now())
        );
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Client action logged successfully");
        response.put("checkFile", "logs/residentia-app-client-actions.log");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Test owner action logging
     * POST http://localhost:8888/api/test/logging/owner
     * Body: { "ownerId": 789, "email": "owner@example.com", "action": "TEST_ACTION" }
     */
    @PostMapping("/logging/owner")
    public ResponseEntity<?> testOwnerLogging(@RequestBody Map<String, Object> request) {
        Long ownerId = ((Number) request.get("ownerId")).longValue();
        String email = (String) request.get("email");
        String action = (String) request.get("action");
        
        log.info("Testing OWNER logging for owner: {}", email);
        
        actionLogger.logOwnerAction(
            ownerId,
            email,
            action,
            String.format("Test action at %s", LocalDateTime.now())
        );
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Owner action logged successfully");
        response.put("checkFile", "logs/residentia-app-owner-actions.log");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Test admin action logging
     * POST http://localhost:8888/api/test/logging/admin
     * Body: { "adminId": 1, "email": "admin@example.com", "action": "TEST_ACTION" }
     */
    @PostMapping("/logging/admin")
    public ResponseEntity<?> testAdminLogging(@RequestBody Map<String, Object> request) {
        Integer adminId = (Integer) request.get("adminId");
        String email = (String) request.get("email");
        String action = (String) request.get("action");
        
        log.info("Testing ADMIN logging for admin: {}", email);
        
        actionLogger.logAdminAction(
            adminId,
            email,
            action,
            "TestEntity",
            "12345"
        );
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Admin action logged successfully");
        response.put("checkFile", "logs/residentia-app-admin-actions.log");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Test error logging
     * GET http://localhost:8888/api/test/logging/error
     */
    @GetMapping("/logging/error")
    public ResponseEntity<?> testErrorLogging() {
        try {
            log.info("Testing error logging...");
            
            // Simulate an error
            throw new RuntimeException("This is a test exception for logging");
            
        } catch (Exception e) {
            log.error("Test ERROR log: {}", e.getMessage(), e);
            
            actionLogger.logError(
                "CLIENT",
                "test@example.com",
                "TEST_ERROR",
                e
            );
            
            Map<String, String> response = new HashMap<>();
            response.put("status", "error_logged");
            response.put("message", "Error logged successfully");
            response.put("checkFile", "logs/residentia-app-error.log");
            
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Test DEBUG logging
     * GET http://localhost:8888/api/test/logging/debug
     */
    @GetMapping("/logging/debug")
    public ResponseEntity<?> testDebugLogging() {
        log.debug("🔍 This is a DEBUG message - only visible when DEBUG level is enabled");
        log.debug("🔍 Current timestamp: {}", LocalDateTime.now());
        log.debug("🔍 Testing parameterized logging: userId={}, email={}", 123, "test@example.com");
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "DEBUG logs written (check application.yml log level settings)");
        response.put("note", "DEBUG logs only appear if logging.level.com.residentia is set to DEBUG");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get logging status and information
     * GET http://localhost:8888/api/test/logging/status
     */
    @GetMapping("/logging/status")
    public ResponseEntity<?> getLoggingStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("loggingEnabled", true);
        status.put("logLocation", "./logs");
        status.put("logFiles", new String[]{
            "residentia-app.log",
            "residentia-app-error.log",
            "residentia-app-client-actions.log",
            "residentia-app-owner-actions.log",
            "residentia-app-admin-actions.log"
        });
        status.put("logLevels", new String[]{"DEBUG", "INFO", "WARN", "ERROR"});
        status.put("features", new String[]{
            "Automatic method logging (AOP)",
            "Structured user action logging",
            "Separate log files by user type",
            "Automatic log rotation",
            "Async logging for performance"
        });
        
        log.info("Logging status requested");
        
        return ResponseEntity.ok(status);
    }

    /**
     * Test all logging levels in sequence
     * GET http://localhost:8888/api/test/logging/all
     */
    @GetMapping("/logging/all")
    public ResponseEntity<?> testAllLoggingLevels() {
        log.debug("1️⃣ DEBUG: Detailed debugging information");
        log.info("2️⃣ INFO: Informational message");
        log.warn("3️⃣ WARN: Warning message");
        log.error("4️⃣ ERROR: Error message");
        
        // Test all action loggers
        actionLogger.logClientAction(100, "client@test.com", "TEST_ALL", "Testing all levels");
        actionLogger.logOwnerAction(200L, "owner@test.com", "TEST_ALL", "Testing all levels");
        actionLogger.logAdminAction(1, "admin@test.com", "TEST_ALL", "Test", "999");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "All logging levels tested");
        response.put("loggedCount", 7);
        response.put("checkFiles", new String[]{
            "logs/residentia-app.log",
            "logs/residentia-app-client-actions.log",
            "logs/residentia-app-owner-actions.log",
            "logs/residentia-app-admin-actions.log"
        });
        
        return ResponseEntity.ok(response);
    }
}
