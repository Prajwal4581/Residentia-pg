package com.residentia.controller;

import com.residentia.dto.BookingDTO;
import com.residentia.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RestController
@RequestMapping("/api/owner")
@Tag(name = "Booking Management", description = "APIs for Booking management")
@CrossOrigin(origins = "*", maxAge = 3600)
@SecurityRequirement(name = "Bearer Authentication")
public class BookingController {
    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings of owner", description = "Retrieve all bookings for properties owned by logged-in owner")
    @ApiResponse(responseCode = "200", description = "Bookings retrieved successfully")
    public ResponseEntity<?> getOwnerBookings(HttpServletRequest request) {
        try {
            Long ownerId = (Long) request.getAttribute("ownerId");
            if (ownerId == null) {
                throw new RuntimeException("Owner ID not found in request");
            }
            List<BookingDTO> bookings = bookingService.getOwnerBookings(ownerId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Failed to fetch bookings: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/bookings/{bookingId}")
    @Operation(summary = "Get booking by ID", description = "Retrieve specific booking details")
    @ApiResponse(responseCode = "200", description = "Booking retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Booking not found")
    public ResponseEntity<?> getBookingById(@PathVariable Long bookingId) {
        try {
            BookingDTO booking = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            logger.error("Failed to fetch booking: {}", e.getMessage());
            throw e;
        }
    }

    @GetMapping("/property/{propertyId}/bookings")
    @Operation(summary = "Get bookings for a property", description = "Retrieve all bookings for a specific property")
    @ApiResponse(responseCode = "200", description = "Bookings retrieved successfully")
    public ResponseEntity<?> getPropertyBookings(@PathVariable Long propertyId) {
        try {
            List<BookingDTO> bookings = bookingService.getPropertyBookings(propertyId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Failed to fetch property bookings: {}", e.getMessage());
            throw e;
        }
    }

    @PutMapping("/bookings/{bookingId}")
    @Operation(summary = "Update booking status", description = "Update booking details or status")
    @ApiResponse(responseCode = "200", description = "Booking updated successfully")
    @ApiResponse(responseCode = "404", description = "Booking not found")
    public ResponseEntity<?> updateBooking(@PathVariable Long bookingId, @RequestBody BookingDTO bookingDTO) {
        try {
            BookingDTO response = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to update booking: {}", e.getMessage());
            throw e;
        }
    }

    @PutMapping("/bookings/{bookingId}/confirm")
    @Operation(summary = "Confirm booking", description = "Owner confirms a pending booking")
    @ApiResponse(responseCode = "200", description = "Booking confirmed successfully")
    @ApiResponse(responseCode = "404", description = "Booking not found")
    public ResponseEntity<?> confirmBooking(@PathVariable Long bookingId) {
        try {
            logger.info("Owner confirming booking: {}", bookingId);
            bookingService.restoreBooking(bookingId);
            BookingDTO response = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to confirm booking: {}", e.getMessage());
            throw e;
        }
    }

    @PutMapping("/bookings/{bookingId}/reject")
    @Operation(summary = "Reject booking", description = "Owner rejects a pending booking")
    @ApiResponse(responseCode = "200", description = "Booking rejected successfully")
    @ApiResponse(responseCode = "404", description = "Booking not found")
    public ResponseEntity<?> rejectBooking(@PathVariable Long bookingId) {
        try {
            logger.info("Owner rejecting booking: {}", bookingId);
            bookingService.cancelBooking(bookingId);
            BookingDTO response = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to reject booking: {}", e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/bookings/{bookingId}")
    @Operation(summary = "Delete booking", description = "Delete a booking record")
    @ApiResponse(responseCode = "200", description = "Booking deleted successfully")
    @ApiResponse(responseCode = "404", description = "Booking not found")
    public ResponseEntity<?> deleteBooking(@PathVariable Long bookingId) {
        try {
            bookingService.deleteBooking(bookingId);
            return ResponseEntity.ok("Booking deleted successfully");
        } catch (Exception e) {
            logger.error("Failed to delete booking: {}", e.getMessage());
            throw e;
        }
    }
}
