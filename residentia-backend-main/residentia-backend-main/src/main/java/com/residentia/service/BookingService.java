package com.residentia.service;

import com.residentia.dto.BookingDTO;
import com.residentia.entity.Booking;
import com.residentia.entity.Property;
import com.residentia.exception.ResourceNotFoundException;
import com.residentia.repository.BookingRepository;
import com.residentia.repository.PropertyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public Booking createBooking(Long propertyId, BookingDTO bookingDTO) {
        log.info("Creating booking for property: {}", propertyId);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        Booking booking = new Booking();
        booking.setProperty(property);

        // Tenant info
        booking.setTenantName(bookingDTO.getTenantName());
        booking.setTenantEmail(bookingDTO.getTenantEmail());
        booking.setTenantPhone(bookingDTO.getTenantPhone());

        // Dates & amount
        if (bookingDTO.getCheckInDate() != null) booking.setCheckInDate(bookingDTO.getCheckInDate());
        if (bookingDTO.getCheckOutDate() != null) booking.setCheckOutDate(bookingDTO.getCheckOutDate());
        
        // Use property's rent amount if booking amount not provided
        Double amount = bookingDTO.getAmount();
        if (amount == null || amount == 0.0) {
            amount = property.getRentAmount() != null ? property.getRentAmount().doubleValue() : 0.0;
        }
        booking.setAmount(amount);
        booking.setNotes(bookingDTO.getNotes());

        booking.setStatus(bookingDTO.getStatus() != null ? bookingDTO.getStatus() : "PENDING");
        booking.setPaymentStatus("PENDING"); // Initialize payment status

        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long bookingId, BookingDTO bookingDTO) {
        log.info("Updating booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (bookingDTO.getStatus() != null) booking.setStatus(bookingDTO.getStatus());
        if (bookingDTO.getCheckInDate() != null) booking.setCheckInDate(bookingDTO.getCheckInDate());
        if (bookingDTO.getCheckOutDate() != null) booking.setCheckOutDate(bookingDTO.getCheckOutDate());
        if (bookingDTO.getAmount() != null) booking.setAmount(bookingDTO.getAmount());
        if (bookingDTO.getNotes() != null) booking.setNotes(bookingDTO.getNotes());

        return bookingRepository.save(booking);
    }

    public List<BookingDTO> getBookingsByClientEmail(String email) {
        log.info("🔍 Fetching bookings for client email: {}", email);
        
        // Debug: Show ALL bookings in database
        List<Booking> allBookings = bookingRepository.findAll();
        log.info("📊 Total bookings in DB: {}", allBookings.size());
        for (Booking b : allBookings) {
            log.info("  📋 Booking #{}: tenantEmail='{}', propertyName='{}'", 
                b.getId(), b.getTenantEmail(), b.getProperty() != null ? b.getProperty().getPropertyName() : "null");
        }
        
        // Try case-insensitive search
        List<Booking> bookings = bookingRepository.findByTenantEmailIgnoreCase(email);
        log.info("✅ Found {} bookings for {} (case-insensitive)", bookings.size(), email);
        
        return bookings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public BookingDTO getBookingById(Long bookingId) {
        log.info("Fetching booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        return convertToDTO(booking);
    }

    public List<BookingDTO> getOwnerBookings(Long ownerId) {
        log.info("Fetching bookings for owner: {}", ownerId);

        List<Booking> bookings = bookingRepository.findByPropertyOwnerId(ownerId);
        return bookings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<BookingDTO> getPropertyBookings(Long propertyId) {
        log.info("Fetching bookings for property: {}", propertyId);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        List<Booking> bookings = bookingRepository.findByProperty(property);
        return bookings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public void deleteBooking(Long bookingId) {
        log.info("Deleting booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        bookingRepository.delete(booking);
    }

    public List<BookingDTO> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Booking cancelBooking(Long bookingId) {
        log.info("Cancelling booking: {}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    public Booking restoreBooking(Long bookingId) {
        log.info("Restoring booking: {}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        booking.setStatus("APPROVED");
        // Keep payment status as PENDING - client needs to pay after owner approval
        booking.setPaymentStatus("PENDING");
        return bookingRepository.save(booking);
    }

    // ✅ UPDATED: Enhanced convertToDTO with canReview logic and payment fields
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setBookingId(booking.getId());
        
        if (booking.getProperty() != null) {
            dto.setPropertyId(booking.getProperty().getId());
            dto.setPropertyName(booking.getProperty().getPropertyName());
        }
        
        dto.setTenantName(booking.getTenantName());
        dto.setTenantEmail(booking.getTenantEmail());
        dto.setTenantPhone(booking.getTenantPhone());
        dto.setBookingDate(booking.getBookingDate());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setAmount(booking.getAmount());
        dto.setStatus(booking.getStatus());
        dto.setNotes(booking.getNotes());
        
        // Payment fields
        dto.setRazorpayOrderId(booking.getRazorpayOrderId());
        dto.setRazorpayPaymentId(booking.getRazorpayPaymentId());
        dto.setRazorpaySignature(booking.getRazorpaySignature());
        dto.setPaymentStatus(booking.getPaymentStatus());
        
        // ✅ Set canReview flag
        // Logic: Can review if:
        // 1. Payment status is PAID, OR
        // 2. Booking is CONFIRMED and checkout date has passed
        boolean canReview = false;
        if ("PAID".equals(booking.getPaymentStatus())) {
            // Allow review once payment is completed
            canReview = true;
        } else if ("CONFIRMED".equals(booking.getStatus()) && booking.getCheckOutDate() != null) {
            // Also allow review if booking is confirmed and checkout date has passed
            canReview = booking.getCheckOutDate().isBefore(LocalDateTime.now());
        }
        dto.setCanReview(canReview);
        
        // ✅ Set canPay flag
        // Logic: Can pay if booking is APPROVED by owner and payment is PENDING
        boolean canPay = "APPROVED".equals(booking.getStatus()) && "PENDING".equals(booking.getPaymentStatus());
        dto.setCanPay(canPay);
        
        return dto;
    }
}