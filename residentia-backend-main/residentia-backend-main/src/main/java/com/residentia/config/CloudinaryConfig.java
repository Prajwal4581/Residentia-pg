package com.residentia.config;

import com.cloudinary.Cloudinary;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

/**
 * Configuration class for Cloudinary image storage service
 * 
 * This is OPTIONAL - the application will work without Cloudinary configuration
 * If not configured, images will be stored locally
 * 
 * To use Cloudinary, set the following environment variables:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 * 
 * Or configure them in application.yml
 */
@Slf4j
@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    @Value("${cloudinary.enabled:true}")
    private boolean enabled;

    @Bean
    public Cloudinary cloudinary() {
        // Check if Cloudinary is disabled or not configured
        if (!enabled || cloudName.isEmpty() || cloudName.equals("your-cloud-name") || 
            apiKey.isEmpty() || apiKey.equals("your-api-key") ||
            apiSecret.isEmpty() || apiSecret.equals("your-api-secret")) {
            
            log.warn("Cloudinary is not configured. Application will use local file storage.");
            log.info("To enable Cloudinary, set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET");
            
            // Return a dummy Cloudinary instance (won't be used)
            return new Cloudinary();
        }

        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", "true");

        Cloudinary cloudinary = new Cloudinary(config);
        log.info("✅ Cloudinary configured successfully for cloud: {}", cloudName);
        
        return cloudinary;
    }
}
