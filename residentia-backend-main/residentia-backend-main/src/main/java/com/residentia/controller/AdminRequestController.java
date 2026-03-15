package com.residentia.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

import com.residentia.entity.Request;
import com.residentia.repository.RequestRepository;
import com.residentia.service.AdminRequestService;

@Slf4j
@RestController
@RequestMapping("/api/admin/change-requests")
@CrossOrigin(origins="*")
public class AdminRequestController {

	private final AdminRequestService service;
    private final RequestRepository repo;

    public AdminRequestController(AdminRequestService service,RequestRepository repo) {
        this.repo = repo;
        this.service = service;
    }

    //getting all requests
    @GetMapping
    public ResponseEntity<List<Request>> getAll() { 
        return ResponseEntity.ok(repo.findAll());
    }

    //Approve request
    @PutMapping("/{id}/approve")
    public ResponseEntity<Request> approve(@PathVariable Integer id) { 
        log.info("Approving change request: {}", id);
        try {
            Request approvedRequest = service.approveChangeRequest(id);
            log.info("Change request {} approved successfully. Property changes applied.", id);
            return ResponseEntity.ok(approvedRequest);
        } catch (Exception e) {
            log.error("Error approving request: {}", e.getMessage(), e);
            throw e;
        }
    }

    //Reject request
    @PutMapping("/{id}/reject")
    public ResponseEntity<Request> reject(@PathVariable Integer id) { 
        Request r = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        r.setStatus("REJECTED");
        return ResponseEntity.ok(repo.save(r));
    }
}
