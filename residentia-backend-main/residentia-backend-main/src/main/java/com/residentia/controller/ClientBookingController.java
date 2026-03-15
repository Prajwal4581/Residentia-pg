package com.residentia.controller;

import com.residentia.dto.BookingDTO;
import com.residentia.entity.Booking;
import com.residentia.entity.RegularUser;
import com.residentia.logging.ActionLogger;
import com.residentia.repository.RegularUserRepository;
import com.residentia.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/client")
@Tag(name = "Client Booking", description = "APIs for clients to create bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ClientBookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RegularUserRepository regularUserRepository;

    @Autowired
    private ActionLogger actionLogger;

    @PostMapping("/properties/{propertyId}/bookings")
    @Operation(summary = "Create booking for a property")
    public ResponseEntity<?> createBooking(@PathVariable Long propertyId,
                                           @RequestBody BookingDTO bookingDTO,
                                           HttpServletRequest request) {
        String email = (String) request.getAttribute("email");
        try {
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
            }

            RegularUser user = regularUserRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));


            // Fill tenant info from logged-in user if not provided
            if (bookingDTO.getTenantName() == null) bookingDTO.setTenantName(user.getName());
            if (bookingDTO.getTenantEmail() == null) bookingDTO.setTenantEmail(user.getEmail());
            if (bookingDTO.getTenantPhone() == null) bookingDTO.setTenantPhone(user.getMobileNumber());
            log.info("📝 Creating booking for user: {} ({})", user.getName(), user.getEmail());

            Booking booking = bookingService.createBooking(propertyId, bookingDTO);

            // Log client booking action
            actionLogger.logClientAction(
                user.getId(),
                user.getEmail(),
                "CREATE_BOOKING",
                String.format("PropertyID: %d, BookingID: %d, CheckIn: %s, CheckOut: %s",
                    propertyId, booking.getId(), bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate())
            );


            BookingDTO response = bookingService.getBookingById(booking.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            actionLogger.logError("CLIENT", email != null ? email : "UNKNOWN", "CREATE_BOOKING", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @GetMapping("/bookings")
    public ResponseEntity<?> getClientBookings(HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("email");
            log.info("🔐 Client bookings request. Email from token: {}", email);
            if (email == null) {
                log.warn("⚠️ No email found in request attributes");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
            }
            List<BookingDTO> bookings = bookingService.getBookingsByClientEmail(email);
            log.info("📋 Returning {} bookings for {}", bookings.size(), email);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            log.error("❌ Error fetching client bookings: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
