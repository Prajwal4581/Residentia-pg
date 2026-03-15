package com.residentia.service;

import com.residentia.entity.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public void sendPaymentConfirmationEmail(Booking booking, String razorpayPaymentId) throws MessagingException {
        log.info("Preparing payment confirmation email for booking ID: {}", booking.getId());

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(booking.getTenantEmail());
        helper.setSubject("Payment Confirmation - Residentia PG Booking #" + booking.getId());
        helper.setFrom("hspatil222002@gmail.com");

        String emailContent = buildEmailContent(booking, razorpayPaymentId);
        helper.setText(emailContent, true);

        mailSender.send(message);
        log.info("Payment confirmation email sent successfully to: {}", booking.getTenantEmail());
    }

    private String buildEmailContent(Booking booking, String razorpayPaymentId) {
        String propertyName = booking.getProperty() != null ? booking.getProperty().getPropertyName() : "N/A";
        String clientName = booking.getTenantName();
        Double amount = booking.getAmount();
        LocalDateTime checkInDate = booking.getCheckInDate();
        LocalDateTime billDate = LocalDateTime.now();

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }" +
                "        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }" +
                "        .content { background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px; }" +
                "        .detail-row { margin: 15px 0; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #4CAF50; }" +
                "        .label { font-weight: bold; color: #555; }" +
                "        .value { color: #222; font-size: 16px; }" +
                "        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #777; font-size: 12px; }" +
                "        .amount { font-size: 24px; color: #4CAF50; font-weight: bold; }" +
                "        .success-icon { font-size: 48px; text-align: center; color: #4CAF50; margin: 20px 0; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <div class='header'>" +
                "            <h1>Payment Successful!</h1>" +
                "        </div>" +
                "        <div class='content'>" +
                "            <div class='success-icon'>✓</div>" +
                "            <p>Dear <strong>" + clientName + "</strong>,</p>" +
                "            <p>Your payment has been successfully processed. Here are the details of your booking:</p>" +
                "            " +
                "            <div class='detail-row'>" +
                "                <div class='label'>Booking ID:</div>" +
                "                <div class='value'>#" + booking.getId() + "</div>" +
                "            </div>" +
                "            " +
                "            <div class='detail-row'>" +
                "                <div class='label'>Client Name:</div>" +
                "                <div class='value'>" + clientName + "</div>" +
                "            </div>" +
                "            " +
                "            <div class='detail-row'>" +
                "                <div class='label'>PG Name:</div>" +
                "                <div class='value'>" + propertyName + "</div>" +
                "            </div>" +
                "            " +
                "            <div class='detail-row'>" +
                "                <div class='label'>Amount Paid:</div>" +
                "                <div class='amount'>₹ " + String.format("%.2f", amount) + "</div>" +
                "            </div>" +
                "            " +
                "            <div class='detail-row'>" +
                "                <div class='label'>Check-in Date:</div>" +
                "                <div class='value'>" + checkInDate.format(DATETIME_FORMATTER) + "</div>" +
                "            </div>" +
                "            " +
                "            <div class='detail-row'>" +
                "                <div class='label'>Bill Issued Date:</div>" +
                "                <div class='value'>" + billDate.format(DATETIME_FORMATTER) + "</div>" +
                "            </div>" +
                "            " +
                "            <div class='detail-row'>" +
                "                <div class='label'>Payment ID:</div>" +
                "                <div class='value'>" + razorpayPaymentId + "</div>" +
                "            </div>" +
                "            " +
                "            <p style='margin-top: 30px;'>Thank you for choosing Residentia. We look forward to providing you with excellent accommodation.</p>" +
                "            " +
                "            <p><strong>Note:</strong> Please keep this email for your records.</p>" +
                "        </div>" +
                "        " +
                "        <div class='footer'>" +
                "            <p>&copy; 2026 Residentia PG Management System</p>" +
                "            <p>For queries, contact us at: hspatil222002@gmail.com</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}
