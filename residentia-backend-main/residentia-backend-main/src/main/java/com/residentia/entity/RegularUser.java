	package com.residentia.entity;
	
	import java.time.LocalDateTime;
	
	import jakarta.persistence.Column;
	import jakarta.persistence.Entity;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
	import jakarta.persistence.PrePersist;
	import jakarta.persistence.PreUpdate;
	import jakarta.persistence.Table;
	import lombok.AllArgsConstructor;
	import lombok.Getter;
	import lombok.NoArgsConstructor;
	import lombok.Setter;
	
	import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
	import com.fasterxml.jackson.databind.annotation.JsonSerialize;

	@Entity
	@Table(name = "regular_users")
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@JsonSerialize(as = RegularUser.class)
	public class RegularUser {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer id;
	
	    @Column(nullable = false, length = 100)
	    private String name;
	
	    @Column(nullable = false, unique = true, length = 255)
	    private String email;
	
	    @Column(name = "mobile_number", nullable = false, unique = true)
	    private String mobileNumber;
	
	    @Column(name = "password_hash", nullable = false)
	    private String passwordHash;
	
	    @Column(name = "is_active")
	    private Boolean isActive = true;
	
	    @Column(name = "created_at", updatable = false)
	    private LocalDateTime createdAt;
	
	    @Column(name = "updated_at")
	    private LocalDateTime updatedAt;
	
	    @PrePersist
	    void onCreate() {
	        createdAt = updatedAt = LocalDateTime.now();
	    }
	
	    @PreUpdate
	    void onUpdate() {
	        updatedAt = LocalDateTime.now();
	    }
	}
