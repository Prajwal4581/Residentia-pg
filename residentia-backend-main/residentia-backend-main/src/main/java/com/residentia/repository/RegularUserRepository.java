package com.residentia.repository;

import com.residentia.entity.RegularUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegularUserRepository extends JpaRepository<RegularUser, Integer> {
    Optional<RegularUser> findByEmail(String email);
    Optional<RegularUser> findByMobileNumber(String mobileNumber);
} 
