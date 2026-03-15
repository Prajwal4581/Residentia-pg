package com.residentia.controller;

import com.residentia.dto.BookingDTO;
import com.residentia.entity.Booking;
import com.residentia.logging.ActionLogger;
import com.residentia.repository.BookingRepository;
import com.residentia.service.BookingService;
import com.residentia.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@Tag(name = "Payment", description = "Payment Gateway APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Value("${razorpay.key.id:rzp_test_S8v64jsUOHFb42}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:0kQhTEbbiZpkAXgnOMIST0jj}")
    private String razorpayKeySecret;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ActionLogger actionLogger;

    @Autowired
    private EmailService emailService;

    @PostMapping("/create-order/{bookingId}")
    @Operation(summary = "Create Razorpay order for booking payment")
    public ResponseEntity<?> createOrder(@PathVariable Long bookingId, HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("email");
            
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Create Razorpay order
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(booking.getAmount() * 100)); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + bookingId);

            Order order = razorpayClient.orders.create(orderRequest);

            // Save order ID to booking
            booking.setRazorpayOrderId(order.get("id"));
            booking.setPaymentStatus("PENDING");
            bookingRepository.save(booking);

            log.info("Created Razorpay order: {} for booking: {}", order.get("id"), bookingId);

            // Log payment initiation
            actionLogger.logClientAction(
                bookingId.intValue(),
                email != null ? email : "UNKNOWN",
                "PAYMENT_INITIATED",
                String.format("BookingID: %d, OrderID: %s, Amount: %.2f", bookingId, order.get("id"), booking.getAmount())
            );

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", booking.getAmount());
            response.put("currency", "INR");
            response.put("keyId", razorpayKeyId);
            response.put("bookingId", bookingId);
            response.put("tenantName", booking.getTenantName());
            response.put("tenantEmail", booking.getTenantEmail());
            response.put("tenantPhone", booking.getTenantPhone());

            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            log.error("Razorpay error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create payment order: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating order: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    @Operation(summary = "Verify Razorpay payment signature")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> paymentData, HttpServletRequest request) {
        try {
            String email = (String) request.getAttribute("email");
            String razorpayOrderId = paymentData.get("razorpay_order_id");
            String razorpayPaymentId = paymentData.get("razorpay_payment_id");
            String razorpaySignature = paymentData.get("razorpay_signature");

            // Verify signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValidSignature) {
                // Find booking by order ID and update payment details
                Booking booking = bookingRepository.findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() -> new RuntimeException("Booking not found for order ID: " + razorpayOrderId));

                booking.setRazorpayPaymentId(razorpayPaymentId);
                booking.setRazorpaySignature(razorpaySignature);
                booking.setPaymentStatus("PAID");
                booking.setStatus("CONFIRMED");
                bookingRepository.save(booking);

                log.info("Payment verified successfully for booking: {}", booking.getId());

                // Log successful payment
                actionLogger.logClientAction(
                    booking.getId().intValue(),
                    email != null ? email : "UNKNOWN",
                    "PAYMENT_SUCCESS",
                    String.format("BookingID: %d, PaymentID: %s, Amount: %.2f", booking.getId(), razorpayPaymentId, booking.getAmount())
                );

                // Send payment confirmation email
                try {
                    emailService.sendPaymentConfirmationEmail(booking, razorpayPaymentId);
                    log.info("Payment confirmation email sent to: {}", booking.getTenantEmail());
                } catch (Exception emailException) {
                    log.error("Failed to send payment confirmation email: {}", emailException.getMessage());
                    // Continue - email failure should not affect payment confirmation
                }

                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment verified successfully",
                    "bookingId", booking.getId()
                ));
            } else {
                log.error("Invalid payment signature for order: {}", razorpayOrderId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("success", false, "message", "Invalid payment signature"));
            }
        } catch (Exception e) {
            log.error("Error verifying payment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/status/{bookingId}")
    @Operation(summary = "Get payment status for booking")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long bookingId) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            Map<String, Object> response = new HashMap<>();
            response.put("bookingId", bookingId);
            response.put("paymentStatus", booking.getPaymentStatus());
            response.put("amount", booking.getAmount());
            response.put("razorpayPaymentId", booking.getRazorpayPaymentId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching payment status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
