package com.residentia.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Centralized logger for tracking user actions across the application.
 * Provides structured logging with user context for Client, Owner, and Admin actions.
 */
@Component
public class ActionLogger {

    private static final Logger CLIENT_LOGGER = LoggerFactory.getLogger("CLIENT_LOGGER");
    private static final Logger OWNER_LOGGER = LoggerFactory.getLogger("OWNER_LOGGER");
    private static final Logger ADMIN_LOGGER = LoggerFactory.getLogger("ADMIN_LOGGER");
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Log client action with user context
     * @param userId Client user ID
     * @param email Client email
     * @param action Action description
     * @param details Additional details
     */
    public void logClientAction(Integer userId, String email, String action, String details) {
        try {
            MDC.put("userId", String.valueOf(userId));
            MDC.put("userEmail", email);
            CLIENT_LOGGER.info("{} | Details: {}", action, details);
        } finally {
            MDC.clear();
        }
    }

    /**
     * Log client action with minimal info (when user context is not available)
     */
    public void logClientAction(String email, String action) {
        logClientAction(null, email, action, "N/A");
    }

    /**
     * Log owner action with owner context
     * @param ownerId Owner ID
     * @param email Owner email
     * @param action Action description
     * @param details Additional details
     */
    public void logOwnerAction(Long ownerId, String email, String action, String details) {
        try {
            MDC.put("ownerId", String.valueOf(ownerId));
            MDC.put("ownerEmail", email);
            OWNER_LOGGER.info("{} | Details: {}", action, details);
        } finally {
            MDC.clear();
        }
    }

    /**
     * Log owner action with minimal info
     */
    public void logOwnerAction(String email, String action) {
        logOwnerAction(null, email, action, "N/A");
    }

    /**
     * Log admin action with admin context
     * @param adminId Admin ID
     * @param email Admin email
     * @param action Action description
     * @param targetEntity Target entity affected
     * @param targetId Target entity ID
     */
    public void logAdminAction(Integer adminId, String email, String action, String targetEntity, String targetId) {
        try {
            MDC.put("adminId", String.valueOf(adminId));
            MDC.put("adminEmail", email);
            ADMIN_LOGGER.info("{} | Target: {} (ID: {})", action, targetEntity, targetId);
        } finally {
            MDC.clear();
        }
    }

    /**
     * Log admin action with minimal info
     */
    public void logAdminAction(String email, String action, String details) {
        try {
            MDC.put("adminEmail", email);
            ADMIN_LOGGER.info("{} | {}", action, details);
        } finally {
            MDC.clear();
        }
    }

    /**
     * Log error with full context
     */
    public void logError(String userType, String email, String action, Exception e) {
        String errorMessage = String.format("ERROR in %s | User: %s | Action: %s | Error: %s",
                userType, email, action, e.getMessage());
        
        switch (userType.toUpperCase()) {
            case "CLIENT":
                CLIENT_LOGGER.error(errorMessage, e);
                break;
            case "OWNER":
                OWNER_LOGGER.error(errorMessage, e);
                break;
            case "ADMIN":
                ADMIN_LOGGER.error(errorMessage, e);
                break;
            default:
                CLIENT_LOGGER.error(errorMessage, e);
        }
    }

    /**
     * Log INFO level message
     */
    public static void info(String userType, String message) {
        switch (userType.toUpperCase()) {
            case "CLIENT":
                CLIENT_LOGGER.info(message);
                break;
            case "OWNER":
                OWNER_LOGGER.info(message);
                break;
            case "ADMIN":
                ADMIN_LOGGER.info(message);
                break;
        }
    }

    /**
     * Log DEBUG level message
     */
    public static void debug(String userType, String message) {
        switch (userType.toUpperCase()) {
            case "CLIENT":
                CLIENT_LOGGER.debug(message);
                break;
            case "OWNER":
                OWNER_LOGGER.debug(message);
                break;
            case "ADMIN":
                ADMIN_LOGGER.debug(message);
                break;
        }
    }

    /**
     * Log ERROR level message
     */
    public static void error(String userType, String message, Throwable throwable) {
        switch (userType.toUpperCase()) {
            case "CLIENT":
                CLIENT_LOGGER.error(message, throwable);
                break;
            case "OWNER":
                OWNER_LOGGER.error(message, throwable);
                break;
            case "ADMIN":
                ADMIN_LOGGER.error(message, throwable);
                break;
        }
    }
}
