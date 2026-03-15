package com.residentia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ResidentialiaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResidentialiaApplication.class, args);
    }
}
