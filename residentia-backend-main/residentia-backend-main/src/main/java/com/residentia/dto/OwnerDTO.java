package com.residentia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDTO {
    private Long id;
    private String name;
    private String email;
    private String mobileNumber;
    private String businessName;
    private String address;
    private String alternateContact;
    private String verificationStatus;
    private Boolean isActive;
}
