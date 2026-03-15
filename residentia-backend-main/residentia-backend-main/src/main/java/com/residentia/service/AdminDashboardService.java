package com.residentia.service;

import com.residentia.dto.DashboardResponse;
import com.residentia.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {
    
    @Autowired
    private RegularUserRepository regularUserRepository;
    
    @Autowired
    private OwnerRepository ownerRepository;
    
    @Autowired
    private PropertyRepository propertyRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    public DashboardResponse getDashboardData() {
        DashboardResponse response = new DashboardResponse();
        response.setTotalUsers(regularUserRepository.count());
        response.setTotalOwners(ownerRepository.count());
        response.setTotalProperties(propertyRepository.count());
        response.setTotalBookings(bookingRepository.count());
        response.setMessage("Dashboard data retrieved successfully");
        return response;
    }
}
