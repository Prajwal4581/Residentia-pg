package com.residentia.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long bookingId;
    private Long propertyId;
    private String propertyName;
    private String tenantName;
    private String tenantEmail;
    private String tenantPhone;
    
    // ✅ Format dates for JSON serialization
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private LocalDateTime bookingDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private LocalDateTime checkInDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private LocalDateTime checkOutDate;
    
    private Double amount;
    private String status;
    private String notes;
    
    // Razorpay payment fields
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private String paymentStatus;
    
    // ✅ Add canReview field for frontend
    private Boolean canReview;
    
    // ✅ Add canPay field to show "Pay Now" button
    private Boolean canPay;
}