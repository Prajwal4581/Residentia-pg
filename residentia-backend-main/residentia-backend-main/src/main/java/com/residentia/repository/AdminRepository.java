package com.residentia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.residentia.entity.Admin;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
     
    // Find admin by email (used for login)
    Optional<Admin> findByEmail(String email);

    // Find admin by mobile number
    Optional<Admin> findByMobileNumber(String mobileNumber);

    // Check if email already exists
    boolean existsByEmail(String email);

    // Check if mobile number already exists
    boolean existsByMobileNumber(String mobileNumber);

    // Find only active admin by email
    Optional<Admin> findByEmailAndIsActiveTrue(String email);

    // Find admin by email or mobile number (login flexibility)
    Optional<Admin> findByEmailOrMobileNumber(String email, String mobileNumber);
}
