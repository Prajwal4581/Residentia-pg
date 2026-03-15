package com.residentia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    // For all roles
    private String email;
    private String name;
    private String token;
    private String message;
    
    // For CLIENT
    private Long userId;
    
    // For OWNER
    private Long ownerId;
    
    // For ADMIN
    private Long adminId;
    
    // Optional: user object (for frontend to access full data)
    private Object user;
}