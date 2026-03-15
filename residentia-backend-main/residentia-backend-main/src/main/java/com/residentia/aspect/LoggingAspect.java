package com.residentia.aspect;

import com.residentia.logging.ActionLogger;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;

/**
 * Aspect for automatically logging all controller actions.
 * Intercepts controller methods and logs execution details.
 */
@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Autowired
    private ActionLogger actionLogger;

    /**
     * Around advice for all controller methods
     * Logs method execution, parameters, and execution time
     */
    @Around("execution(* com.residentia.controller..*(..))")
    public Object logControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();
        
        long startTime = System.currentTimeMillis();
        
        // Get HTTP request details if available
        HttpServletRequest request = null;
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                request = attributes.getRequest();
            }
        } catch (Exception e) {
            // Request context not available
        }

        String userEmail = "UNKNOWN";
        String userType = determineUserType(className);
        
        if (request != null) {
            userEmail = (String) request.getAttribute("email");
            if (userEmail == null) {
                userEmail = "ANONYMOUS";
            }
            
            log.debug("📍 {} Request: {} {} | Method: {}.{} | User: {}",
                    userType,
                    request.getMethod(),
                    request.getRequestURI(),
                    className,
                    methodName,
                    userEmail);
        }

        Object result;
        try {
            // Proceed with method execution
            result = joinPoint.proceed();
            
            long executionTime = System.currentTimeMillis() - startTime;
            
            log.info("✅ {} Action Completed: {}.{} | User: {} | Duration: {}ms",
                    userType,
                    className,
                    methodName,
                    userEmail,
                    executionTime);
            
            return result;
            
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            
            log.error("❌ {} Action Failed: {}.{} | User: {} | Duration: {}ms | Error: {}",
                    userType,
                    className,
                    methodName,
                    userEmail,
                    executionTime,
                    e.getMessage());
            
            actionLogger.logError(userType, userEmail, className + "." + methodName, e);
            
            throw e;
        }
    }

    /**
     * Determine user type based on controller class name
     */
    private String determineUserType(String className) {
        if (className.contains("Client")) {
            return "CLIENT";
        } else if (className.contains("Owner")) {
            return "OWNER";
        } else if (className.contains("Admin")) {
            return "ADMIN";
        }
        return "SYSTEM";
    }

    /**
     * Log service layer methods for debugging
     */
    @Around("execution(* com.residentia.service..*(..))")
    public Object logServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();
        
        log.debug("🔧 Service Method: {}.{} | Args: {}",
                className,
                methodName,
                Arrays.toString(joinPoint.getArgs()));
        
        try {
            Object result = joinPoint.proceed();
            log.debug("✅ Service Method Completed: {}.{}", className, methodName);
            return result;
        } catch (Exception e) {
            log.error("❌ Service Method Failed: {}.{} | Error: {}", className, methodName, e.getMessage());
            throw e;
        }
    }
}
