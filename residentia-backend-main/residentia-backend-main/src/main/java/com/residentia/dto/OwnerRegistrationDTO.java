package com.residentia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerRegistrationDTO {
    private String name;
    private String email;
    private String mobile;
    private String managementCompany;
    private String address;
    private String aadharOrPan;
    private String identityDocUrl;
    private String bankAccount;
    private String ifsc;
    private String password;
    private String city;
    private String state;
    private String pincode;
}
