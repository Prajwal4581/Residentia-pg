-- Residentia Database Schema

CREATE DATABASE IF NOT EXISTS residentia_db;
USE residentia_db;

-- Owner Table
CREATE TABLE IF NOT EXISTS owner (
    owner_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    management_company VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    aadhar_or_pan VARCHAR(100),
    identity_doc_url VARCHAR(500),
    bank_account VARCHAR(100),
    ifsc VARCHAR(20),
    password_hash VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Property Table
CREATE TABLE IF NOT EXISTS property (
    property_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    owner_id BIGINT NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    sharing_type VARCHAR(100),
    max_capacity INT NOT NULL,
    available_beds INT NOT NULL,
    food_included BOOLEAN DEFAULT FALSE,
    description LONGTEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    image_url VARCHAR(500),
    rating DECIMAL(3, 1),
    reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owner(owner_id) ON DELETE CASCADE,
    INDEX idx_owner_id (owner_id),
    INDEX idx_city (city)
);

-- Booking Table
CREATE TABLE IF NOT EXISTS booking (
    booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    tenant_name VARCHAR(255) NOT NULL,
    tenant_email VARCHAR(255) NOT NULL,
    tenant_phone VARCHAR(20) NOT NULL,
    booking_date TIMESTAMP NOT NULL,
    check_in_date TIMESTAMP NOT NULL,
    check_out_date TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    notes LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES property(property_id) ON DELETE CASCADE,
    INDEX idx_property_id (property_id),
    INDEX idx_status (status)
);

-- Review Table
CREATE TABLE IF NOT EXISTS review (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    review_text LONGTEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES property(property_id) ON DELETE CASCADE,
    INDEX idx_property_id (property_id),
    INDEX idx_status (status)
);

-- Admin Table
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    permissions JSON,
    department VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_email (email)
);

-- Regular User Table (for clients)
CREATE TABLE IF NOT EXISTS regular_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Insert default admin user
-- Email: admin@residentia.com
-- Password: Admin@123
-- NOTE: Update password after first login
INSERT INTO admins (name, email, mobile_number, password_hash, department, is_active) 
VALUES ('System Admin', 'admin@residentia.com', '9999999999', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRcx3a', 'Admin', TRUE)
ON DUPLICATE KEY UPDATE email=email;
