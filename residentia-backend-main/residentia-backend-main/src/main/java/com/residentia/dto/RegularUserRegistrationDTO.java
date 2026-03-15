package com.residentia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegularUserRegistrationDTO {
    private String name;
    private String email;
    private String mobileNumber;
    private String password;
}