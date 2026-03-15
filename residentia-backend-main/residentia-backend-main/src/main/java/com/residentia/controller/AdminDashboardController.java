package com.residentia.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.residentia.dto.DashboardResponse;
import com.residentia.service.AdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

	private final AdminDashboardService service;
	public AdminDashboardController(AdminDashboardService service) {
	    this.service = service;
	}
	
	@GetMapping
	public DashboardResponse getDashboard()
	{
		return service.getDashboardData();
	}
}
