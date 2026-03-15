package com.residentia.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

/**
 * Service for handling file uploads to Cloudinary
 * Only initialized when cloudinary.cloud-name is properly configured
 */
@Slf4j
@Service
public class CloudinaryService {

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    private Cloudinary cloudinary;
    private boolean initialized = false;

    @PostConstruct
    public void init() {
        // Check if cloud name is properly configured
        if (cloudName == null || cloudName.trim().isEmpty() || "your-cloud-name".equals(cloudName)) {
            log.info("Cloudinary is not configured. Using local storage for file uploads.");
            initialized = false;
            return;
        }
        
        try {
            cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
            ));
            initialized = true;
            log.info("Cloudinary service initialized successfully for cloud: {}", cloudName);
        } catch (Exception e) {
            log.error("Failed to initialize Cloudinary service", e);
            initialized = false;
        }
    }
    
    public boolean isInitialized() {
        return initialized;
    }

    /**
     * Upload an image to Cloudinary with public access
     * @param file The file to upload
     * @param folder The folder path in Cloudinary
     * @return The URL of the uploaded image
     * @throws IOException If upload fails
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        try {
            Map uploadParams = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image",
                "access_mode", "public",
                "overwrite", false
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String imageUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            String resourceType = (String) uploadResult.get("resource_type");
            
            log.info("✅ Image uploaded to Cloudinary with PUBLIC access");
            log.info("   URL: {}", imageUrl);
            log.info("   Public ID: {}", publicId);
            log.info("   Access: PUBLIC (viewable by all authenticated users)");
            log.debug("   Resource Type: {}", resourceType);
            
            return imageUrl;
        } catch (IOException e) {
            log.error("❌ Failed to upload image to Cloudinary: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Delete an image from Cloudinary
     * @param publicId The public ID of the image (extracted from URL)
     * @return true if deletion was successful
     */
    public boolean deleteImage(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");
            
            boolean success = "ok".equals(resultStatus);
            if (success) {
                log.debug("Image deleted from Cloudinary: {}", publicId);
            } else {
                log.warn("Failed to delete image from Cloudinary: {} - {}", publicId, resultStatus);
            }
            return success;
        } catch (Exception e) {
            log.error("Error deleting image from Cloudinary: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extract public ID from Cloudinary URL
     * Example: https://res.cloudinary.com/demo/image/upload/v1234/folder/image.jpg
     * Returns: folder/image
     */
    public String extractPublicId(String cloudinaryUrl) {
        try {
            // Extract the path after /upload/
            int uploadIndex = cloudinaryUrl.indexOf("/upload/");
            if (uploadIndex == -1) {
                return null;
            }
            
            String pathAfterUpload = cloudinaryUrl.substring(uploadIndex + 8);
            
            // Remove version number if present (v1234567890/)
            if (pathAfterUpload.startsWith("v")) {
                int slashIndex = pathAfterUpload.indexOf("/");
                if (slashIndex != -1) {
                    pathAfterUpload = pathAfterUpload.substring(slashIndex + 1);
                }
            }
            
            // Remove file extension
            int lastDotIndex = pathAfterUpload.lastIndexOf(".");
            if (lastDotIndex != -1) {
                pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
            }
            
            return pathAfterUpload;
        } catch (Exception e) {
            log.error("Failed to extract public ID from URL: {}", cloudinaryUrl, e);
            return null;
        }
    }
}
