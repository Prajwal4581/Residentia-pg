package com.residentia.examples;

import com.residentia.logging.ActionLogger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Examples demonstrating different logging levels and usage patterns
 * for the Residentia application.
 * 
 * This class provides comprehensive examples of:
 * - INFO level logging for business events
 * - DEBUG level logging for troubleshooting
 * - ERROR level logging for exceptions
 * - Structured logging with user context
 */
@Slf4j
@Component
public class LoggingExamples {

    @Autowired
    private ActionLogger actionLogger;

    /**
     * EXAMPLE 1: INFO Level Logging
     * Use INFO for important business events that you always want to track
     */
    public void exampleInfoLogging() {
        // Simple INFO log
        log.info("Application started successfully");

        // INFO log with parameters
        String userName = "John Doe";
        Integer userId = 123;
        log.info("User {} logged in with ID: {}", userName, userId);

        // INFO log using ActionLogger for client action
        actionLogger.logClientAction(
            userId,
            "john.doe@example.com",
            "VIEW_PROPERTY",
            "PropertyID: 456, Duration: 30 seconds"
        );

        // INFO log using ActionLogger for owner action
        actionLogger.logOwnerAction(
            789L,
            "owner@example.com",
            "ADD_PROPERTY",
            "PropertyName: Sunshine PG, Location: Mumbai, Rooms: 10"
        );

        // INFO log using ActionLogger for admin action
        actionLogger.logAdminAction(
            1,
            "admin@residentia.com",
            "APPROVE_PROPERTY",
            "Property",
            "456"
        );
    }

    /**
     * EXAMPLE 2: DEBUG Level Logging
     * Use DEBUG for detailed information useful during development and troubleshooting
     * DEBUG logs are typically disabled in production
     */
    public void exampleDebugLogging() {
        // Simple DEBUG log
        log.debug("Entering property validation method");

        // DEBUG log with method parameters
        Long propertyId = 456L;
        String checkInDate = "2026-03-01";
        log.debug("Processing booking request: propertyId={}, checkInDate={}", propertyId, checkInDate);

        // DEBUG log for data inspection
        String jsonPayload = "{\"propertyName\":\"Test PG\",\"price\":5000}";
        log.debug("Received property data: {}", jsonPayload);

        // DEBUG log for flow control
        boolean isAvailable = true;
        log.debug("Property availability check result: {}", isAvailable);

        // DEBUG log using static method
        ActionLogger.debug("CLIENT", "Searching properties with filters: location=Mumbai, priceRange=5000-10000");
    }

    /**
     * EXAMPLE 3: ERROR Level Logging
     * Use ERROR for exceptions and critical failures that require attention
     */
    public void exampleErrorLogging() {
        String userEmail = "client@example.com";
        
        try {
            // Simulating an operation that might fail
            processBooking(123L);
        } catch (IllegalArgumentException e) {
            // ERROR log with exception
            log.error("Failed to process booking for user: {}", userEmail, e);
            
            // ERROR log using ActionLogger
            actionLogger.logError("CLIENT", userEmail, "PROCESS_BOOKING", e);
        } catch (Exception e) {
            // ERROR log with detailed context
            log.error("Critical error in booking system | User: {} | Timestamp: {} | Error: {}",
                userEmail,
                java.time.LocalDateTime.now(),
                e.getMessage(),
                e);
        }

        // ERROR log for business rule violations
        try {
            if (!validatePropertyOwnership(123L, 789L)) {
                log.error("Security violation: Owner 789 attempted to modify property 123 without permission");
                throw new SecurityException("Unauthorized property modification");
            }
        } catch (SecurityException e) {
            log.error("Security exception occurred", e);
        }
    }

    /**
     * EXAMPLE 4: Structured Logging with MDC (Mapped Diagnostic Context)
     * ActionLogger automatically uses MDC for structured logs
     */
    public void exampleStructuredLogging() {
        // When using ActionLogger, MDC is automatically populated
        actionLogger.logClientAction(
            100,
            "client@example.com",
            "CREATE_BOOKING",
            "PropertyID: 200, Amount: 15000, Duration: 6 months"
        );
        
        // This creates a log entry like:
        // 2026-02-02 10:30:45.123 | USER: 100 | EMAIL: client@example.com | ACTION: CREATE_BOOKING | Details: PropertyID: 200, Amount: 15000, Duration: 6 months
    }

    /**
     * EXAMPLE 5: Conditional Logging (Performance Optimization)
     * Use log level checks for expensive operations
     */
    public void exampleConditionalLogging() {
        // Check if DEBUG is enabled before expensive operation
        if (log.isDebugEnabled()) {
            String expensiveOperation = performExpensiveDataSerialization();
            log.debug("Serialized data: {}", expensiveOperation);
        }

        // Check if INFO is enabled
        if (log.isInfoEnabled()) {
            log.info("Processing batch of {} items", getItemCount());
        }
    }

    /**
     * EXAMPLE 6: Logging with Multiple Parameters
     */
    public void exampleMultiParameterLogging() {
        String clientName = "Alice";
        String propertyName = "Sunrise PG";
        String checkIn = "2026-03-01";
        String checkOut = "2026-09-01";
        Double amount = 45000.00;

        // INFO log with multiple parameters
        log.info("Booking confirmed | Client: {} | Property: {} | CheckIn: {} | CheckOut: {} | Amount: ₹{}",
            clientName, propertyName, checkIn, checkOut, amount);

        // DEBUG log with structured data
        log.debug("Booking details - Client[name={}, email={}] Property[id={}, name={}]",
            clientName, "alice@example.com", 123, propertyName);
    }

    /**
     * EXAMPLE 7: Logging Best Practices
     */
    public void exampleBestPractices() {
        // ✅ GOOD: Use parameterized logging (avoids string concatenation cost)
        log.info("User {} created booking {}", "john@example.com", 456);

        // ❌ BAD: String concatenation (always executed even if logging disabled)
        // log.info("User " + email + " created booking " + bookingId);

        // ✅ GOOD: Log important state changes
        log.info("Property status changed from PENDING to APPROVED for property ID: {}", 789);

        // ✅ GOOD: Log with context
        try {
            // operation
        } catch (Exception e) {
            log.error("Failed to update property | PropertyID: {} | OwnerID: {} | Error: {}",
                123, 456, e.getMessage(), e);
        }

        // ✅ GOOD: Use appropriate log levels
        log.debug("Method parameters: {}", getParameters());  // Debug info
        log.info("User registered successfully: {}", "user@example.com");  // Business event
        log.warn("Property price seems unusually high: ₹{}", 50000);  // Warning
        log.error("Failed to save booking to database", new Exception());  // Error
    }

    /**
     * EXAMPLE 8: Real-world scenarios
     */
    public void exampleRealWorldScenarios() {
        // Scenario 1: Client browses properties
        log.info("Client viewing property list | Filters: location=Mumbai, price=5000-10000");
        actionLogger.logClientAction(
            101,
            "client@example.com",
            "BROWSE_PROPERTIES",
            "Filters applied: location=Mumbai, priceRange=5000-10000, results=15"
        );

        // Scenario 2: Owner adds new property
        log.info("Owner submitting new property for approval");
        actionLogger.logOwnerAction(
            202L,
            "owner@example.com",
            "SUBMIT_PROPERTY",
            "PropertyName: Lakeside PG, Location: Pune, Rooms: 8, Price: 7000/month"
        );

        // Scenario 3: Admin reviews and approves
        log.info("Admin reviewing property request");
        actionLogger.logAdminAction(
            1,
            "admin@residentia.com",
            "APPROVE_REQUEST",
            "PropertyRequest",
            "303"
        );

        // Scenario 4: Error handling in payment
        try {
            processPayment(15000.0);
        } catch (Exception e) {
            log.error("Payment processing failed | Amount: {} | Error: {}", 15000.0, e.getMessage(), e);
            actionLogger.logError("CLIENT", "client@example.com", "PROCESS_PAYMENT", e);
        }
    }

    // Helper methods for examples
    private void processBooking(Long propertyId) {
        throw new IllegalArgumentException("Property not available");
    }

    private boolean validatePropertyOwnership(Long propertyId, Long ownerId) {
        return false;
    }

    private String performExpensiveDataSerialization() {
        return "{\"data\": \"serialized\"}";
    }

    private int getItemCount() {
        return 100;
    }

    private Object getParameters() {
        return "param1=value1, param2=value2";
    }

    private void processPayment(Double amount) throws Exception {
        throw new Exception("Payment gateway timeout");
    }
}
