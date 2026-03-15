package com.residentia.controller;

import com.residentia.service.CloudinaryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controller for handling file uploads
 * - Uses ONLY Cloudinary for new uploads (no local storage)
 * - Serves existing local images for backward compatibility only
 * - All new images are stored in the cloud
 */
@Slf4j
@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileUploadController {

    @Autowired(required = false)
    private CloudinaryService cloudinaryService;

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    private final String uploadDir;
    private static final String CLOUDINARY_FOLDER = "residentia/properties";

    public FileUploadController() {
        // Setup local upload directory for fallback/legacy images
        String projectRoot = System.getProperty("user.dir");
        
        String uploadsPath;
        if (projectRoot.endsWith("residentia-backend")) {
            uploadsPath = projectRoot + "/uploads/properties";
        } else {
            uploadsPath = projectRoot + "/server/residentia-backend/uploads/properties";
        }
        this.uploadDir = uploadsPath;
        
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory: {}", uploadPath.toAbsolutePath());
            } else {
                log.info("Using upload directory: {}", uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to create upload directory", e);
        }
    }

    private boolean isCloudinaryConfigured() {
        return cloudinaryService != null && cloudinaryService.isInitialized();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            // ONLY use Cloudinary - no local storage fallback
            if (!isCloudinaryConfigured()) {
                log.error("❌ Cloudinary is not configured! Cannot upload image.");
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Cloud storage not configured. Please configure Cloudinary credentials.");
            }

            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file, CLOUDINARY_FOLDER);
            log.info("✅ File uploaded to Cloudinary with PUBLIC ACCESS");
            log.info("   URL: {}", imageUrl);
            log.info("   Accessible by: ALL USERS (owner, client, admin roles)");
            log.info("   Storage: ☁️ CLOUD ONLY (no local copy)");

            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("filename", imageUrl.substring(imageUrl.lastIndexOf("/") + 1));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to upload file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    @PostMapping("/upload-multiple")
    public ResponseEntity<?> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            List<Map<String, String>> uploadedFiles = new ArrayList<>();
            boolean usingCloudinary = isCloudinaryConfigured();

            if (usingCloudinary) {
                log.info("Using Cloudinary for multiple file upload");
            } else {
                log.info("Using local storage for multiple file upload");
            }

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    continue;
                }

                // ONLY use Cloudinary - no local storage
                if (!usingCloudinary) {
                    log.error("❌ Cloudinary not configured - skipping file");
                    continue;
                }

                String imageUrl;
                String filename;

                // Upload to Cloudinary (no fallback)
                imageUrl = cloudinaryService.uploadImage(file, CLOUDINARY_FOLDER);
                filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                log.info("☁️ File uploaded to Cloudinary: {}", imageUrl);

                Map<String, String> fileInfo = new HashMap<>();
                fileInfo.put("url", imageUrl);
                fileInfo.put("filename", filename);
                uploadedFiles.add(fileInfo);

                log.info("File uploaded: {}", imageUrl);
            }

            return ResponseEntity.ok(uploadedFiles);
        } catch (Exception e) {
            log.error("Failed to upload files", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload files: " + e.getMessage());
        }
    }

    /**
     * Serve local images for backward compatibility
     * This endpoint serves images stored in the local filesystem
     */
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            
            if (!Files.exists(filePath)) {
                log.warn("Image not found: {}", filename);
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = Files.readAllBytes(filePath);
            
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "image/jpeg";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);
        } catch (IOException e) {
            log.error("Failed to read image file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete an image
     * - Deletes from Cloudinary if URL is a Cloudinary URL
     * - Deletes from local storage if it's a local path
     */
    @DeleteMapping("/images/{filename:.+}")
    public ResponseEntity<?> deleteImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir, filename);
            
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Files.delete(filePath);
            log.info("Local image deleted: {}", filename);

            return ResponseEntity.ok().body("Image deleted successfully");
        } catch (IOException e) {
            log.error("Failed to delete image file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete image: " + e.getMessage());
        }
    }
}
