package com.residentia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Long totalUsers;
    private Long totalOwners;
    private Long totalProperties;
    private Long totalBookings;
    private String message;
}
