package com.residentia.controller;

import com.residentia.dto.AuthResponseDTO;
import com.residentia.entity.RegularUser;
import com.residentia.repository.RegularUserRepository;
import com.residentia.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/legacy/auth")
@CrossOrigin(origins = "*")
@Deprecated
public class ClientAuthController {

    @Autowired
    private RegularUserRepository regularUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register/client")
    public ResponseEntity<?> registerClient(@RequestBody java.util.Map<String,String> dto) {
        // Deprecated: use /api/auth/register/client
        return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY)
                .header("Location", "/api/auth/register/client")
                .body("Client registration moved to /api/auth/register/client");
    }
}