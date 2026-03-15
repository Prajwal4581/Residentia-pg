# Residentia Backend - PG Finder Platform

A comprehensive Spring Boot REST API backend for managing PG (Paying Guest) properties, bookings, and user interactions. This platform serves three user roles: Property Owners, Clients (tenants), and Administrators, with complete authentication, payment integration, cloud storage, and logging capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Security](#-security)
- [Additional Resources](#-additional-resources)

## ✨ Features

### 🏠 Multi-User System
- **Property Owners**: Register, manage properties, track bookings, and earnings
- **Clients (Tenants)**: Browse properties, make bookings, write reviews, process payments
- **Administrators**: Manage users, properties, approve/reject requests, monitor platform

### 🔐 Authentication & Security
- JWT-based authentication with role-based access control (RBAC)
- BCrypt password hashing
- Secure token management with 24-hour expiration
- Protected endpoints with Spring Security

### 🏨 Property Management
- Create, update, and delete property listings
- Image upload with Cloudinary integration (with local fallback)
- Property status management (ACTIVE, INACTIVE, MAINTENANCE)
- Advanced search and filtering
- Property availability tracking

### 📅 Booking Management
- Real-time booking creation and management
- Booking status workflow (PENDING → CONFIRMED → COMPLETED)
- Date validation and conflict prevention
- Tenant information tracking

### 💳 Payment Integration
- Razorpay payment gateway integration
- Secure payment processing
- Payment status tracking
- Transaction history

### ⭐ Review & Rating System
- Client reviews for properties
- Rating aggregation
- Review moderation by admins

### 📧 Email Notifications
- Automated email notifications
- Booking confirmations
- Status update alerts
- Gmail SMTP integration

### ☁️ Cloud Storage
- Cloudinary integration for image storage
- Automatic image optimization and CDN delivery
- Fallback to local file storage
- Support for multiple image uploads

### 📊 Logging & Monitoring
- Centralized logging with aspect-oriented programming (AOP)
- Optional .NET logging service integration
- Request/response logging
- Error tracking and debugging

## 🛠 Tech Stack

### Core Framework
- **Spring Boot 3.2.0** - Application framework
- **Java 17** - Programming language
- **Maven** - Dependency management

### Data & Persistence
- **Spring Data JPA** - Data access layer
- **Hibernate** - ORM framework
- **MySQL 8.0** - Relational database
- **AWS RDS** - Cloud database (production)

### Security
- **Spring Security** - Authentication & authorization
- **JWT (jjwt 0.11.5)** - Token-based authentication
- **BCrypt** - Password encryption

### API Documentation
- **SpringDoc OpenAPI 3** - Interactive API documentation
- **Swagger UI** - API testing interface

### Third-Party Integrations
- **Cloudinary** - Cloud image storage and CDN
- **Razorpay SDK** - Payment processing
- **JavaMail** - Email service

### Development Tools
- **Lombok** - Boilerplate code reduction
- **Spring Boot DevTools** - Development utilities (optional)
- **Spring AOP** - Aspect-oriented programming for logging

## 🏗 Architecture

### Project Structure
```
residentia-backend/
├── src/main/java/com/residentia/
│   ├── aspect/              # AOP Logging Aspects
│   ├── config/              # Spring Configuration
│   │   ├── SecurityConfig.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── CloudinaryConfig.java
│   │   └── SwaggerConfig.java
│   ├── controller/          # REST Controllers
│   │   ├── AuthController.java
│   │   ├── OwnerController.java
│   │   ├── ClientAuthController.java
│   │   ├── ClientController.java
│   │   ├── PropertyController.java
│   │   ├── BookingController.java
│   │   ├── PaymentController.java
│   │   ├── FileUploadController.java
│   │   └── Admin*.java
│   ├── dto/                 # Data Transfer Objects
│   ├── entity/              # JPA Entities
│   │   ├── Owner.java
│   │   ├── RegularUser.java (Client)
│   │   ├── Admin.java
│   │   ├── Property.java
│   │   ├── Booking.java
│   │   └── Review.java
│   ├── repository/          # Database Access Layer
│   ├── service/             # Business Logic
│   │   ├── OwnerService.java
│   │   ├── ClientService.java
│   │   ├── PropertyService.java
│   │   ├── BookingService.java
│   │   ├── EmailService.java
│   │   ├── CloudinaryService.java
│   │   └── Admin*.java
│   ├── security/            # JWT & Security Components
│   │   └── JwtTokenProvider.java
│   ├── exception/           # Exception Handling
│   │   ├── GlobalExceptionHandler.java
│   │   └── Custom Exceptions
│   ├── logging/             # Logging Components
│   └── ResidentialiaApplication.java
├── src/main/resources/
│   ├── application.yml      # Application Configuration
│   └── schema.sql          # Database Schema
├── uploads/
│   └── properties/          # Local image storage
├── pom.xml                 # Maven Dependencies
└── *.md                    # Documentation Files
```

## 📦 Prerequisites

- **Java 17** or higher
- **Maven 3.6+** for dependency management
- **MySQL 8.0+** or AWS RDS instance
- **IDE**: IntelliJ IDEA, Eclipse, or VS Code with Java extensions
- **Git** for version control

### Optional (for advanced features)
- **Cloudinary Account** - For cloud image storage
- **Razorpay Account** - For payment processing
- **Gmail Account** - For email notifications
- **.NET 6+ Runtime** - For optional logging service

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd residentia-backend
```

### 2. Database Setup

#### Option A: Local MySQL
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE residentia_db;

# Run schema (if available)
mysql -u root -p residentia_db < src/main/resources/schema.sql
```

#### Option B: AWS RDS
See [AWS RDS Deployment Guide](AWS_RDS_DEPLOYMENT_GUIDE.md) for detailed instructions.

### 3. Configure Application

Update [application.yml](src/main/resources/application.yml):

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/residentia_db
    username: username
    password: password
  
  mail:
    username: gmail@gmail.com
    password: app_password

jwt:
  secret: your-secure-jwt-secret-key-minimum-512-bits
  expiration: 86400000  # 24 hours

# Optional Cloudinary configuration
cloudinary:
  cloud-name: cloud_name
  api-key: api_key
  api-secret: api_secret
```

### 4. Build and Run

```bash
# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

**Alternative: Using PowerShell Scripts**
```powershell
# Standard local deployment
.\start-server.ps1

# With Cloudinary enabled
.\start-with-cloudinary.ps1

# AWS RDS deployment
.\start-app-rds.ps1
```

### 5. Verify Installation

- **API**: [http://localhost:8888](http://localhost:8888)
- **Swagger UI**: [http://localhost:8888/swagger-ui/index.html](http://localhost:8888/swagger-ui/index.html)
- **Health Check**: `GET http://localhost:8888/api/health` (if implemented)

## ⚙️ Configuration

### Application Properties

Key configuration sections in [application.yml](src/main/resources/application.yml):

#### Database Configuration
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/residentia_db
    username: admin
    password: password
  jpa:
    hibernate:
      ddl-auto: validate  # Options: none, validate, update, create, create-drop
    show-sql: false      # Set to true for SQL debugging
```

#### Server Configuration
```yaml
server:
  port: 8888
  servlet:
    context-path: /
```

#### JWT Configuration
```yaml
jwt:
  secret: your-512-bit-secret-key
  expiration: 86400000  # 24 hours in milliseconds
```

#### CORS Configuration
```yaml
spring:
  mvc:
    cors:
      allowed-origins: http://localhost:5173,http://localhost:3000
      allowed-methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
      allowed-headers: "*"
      allow-credentials: true
```

#### File Upload Configuration
```yaml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB
      max-request-size: 50MB
```

#### Email Configuration
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: email@gmail.com
    password: app_password  # Gmail App Password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

#### Cloudinary Configuration (Optional)
```yaml
cloudinary:
  cloud-name: ${CLOUDINARY_CLOUD_NAME:cloud_name}
  api-key: ${CLOUDINARY_API_KEY:api_key}
  api-secret: ${CLOUDINARY_API_SECRET:api_secret}
```

#### Logging Configuration
```yaml
logging:
  level:
    com.residentia: DEBUG
    org.springframework.web: INFO
    org.springframework.security: DEBUG
  dotnet:
    enabled: false  # Enable for .NET logging service
    url: http://localhost:5000
```

### Environment Variables

For production, use environment variables:

```bash
# Database
export DB_URL=jdbc:mysql://rds-endpoint:3306/residentia_db
export DB_USERNAME=admin
export DB_PASSWORD=password

# JWT
export JWT_SECRET=secure-jwt-secret

# Cloudinary
export CLOUDINARY_CLOUD_NAME=cloud_name
export CLOUDINARY_API_KEY=api_key
export CLOUDINARY_API_SECRET=api_secret

# Email
export MAIL_USERNAME=email@gmail.com
export MAIL_PASSWORD=app_password

# Server Port
export PORT=8888
```

## 📡 API Documentation

### Swagger UI

Interactive API documentation available at:
**[http://localhost:8888/swagger-ui/index.html](http://localhost:8888/swagger-ui/index.html)**

Features:
- 🔍 Browse all endpoints
- 🧪 Test APIs directly
- 📝 View request/response schemas
- 🔐 JWT authentication support

### API Endpoints Overview

#### 🔐 Authentication Endpoints

**Owner Authentication**
- `POST /api/owner/register` - Register new property owner
- `POST /api/owner/login` - Owner login (returns JWT token)

**Client Authentication**
- `POST /api/client/register` - Register new client
- `POST /api/client/login` - Client login (returns JWT token)

**Admin Authentication**
- `POST /api/admin/login` - Admin login (returns JWT token)

#### 👤 Owner Endpoints (Requires JWT)
- `GET /api/owner/profile` - Get owner profile
- `PUT /api/owner/profile` - Update owner profile
- `DELETE /api/owner/profile` - Delete owner account
- `GET /api/owner/{ownerId}` - Get owner details by ID

#### 🏠 Property Endpoints

**Public**
- `GET /api/properties` - List all active properties (with pagination & filters)
- `GET /api/properties/{id}` - Get property details
- `GET /api/properties/search` - Search properties by criteria

**Owner Only** (Requires JWT)
- `POST /api/owner/pgs` - Create new property
- `GET /api/owner/pgs` - Get owner's properties
- `GET /api/owner/pgs/{propertyId}` - Get specific property
- `PUT /api/owner/pgs/{propertyId}` - Update property
- `DELETE /api/owner/pgs/{propertyId}` - Delete property
- `PATCH /api/owner/pgs/{propertyId}/status` - Update property status

#### 📅 Booking Endpoints

**Client Endpoints** (Requires JWT)
- `POST /api/client/bookings` - Create new booking
- `GET /api/client/bookings` - Get client's bookings
- `GET /api/client/bookings/{bookingId}` - Get booking details
- `PUT /api/client/bookings/{bookingId}` - Update booking
- `DELETE /api/client/bookings/{bookingId}` - Cancel booking

**Owner Endpoints** (Requires JWT)
- `GET /api/owner/bookings` - Get all bookings for owner's properties
- `GET /api/owner/property/{propertyId}/bookings` - Get property-specific bookings
- `PUT /api/owner/bookings/{bookingId}/status` - Update booking status
- `GET /api/owner/bookings/stats` - Get booking statistics

#### ⭐ Review Endpoints

**Client Endpoints** (Requires JWT)
- `POST /api/client/reviews` - Create review for property
- `GET /api/client/reviews` - Get client's reviews
- `PUT /api/client/reviews/{reviewId}` - Update review
- `DELETE /api/client/reviews/{reviewId}` - Delete review

**Public**
- `GET /api/properties/{propertyId}/reviews` - Get all reviews for property

**Admin Endpoints**
- `GET /api/admin/reviews` - Get all reviews
- `DELETE /api/admin/reviews/{reviewId}` - Remove inappropriate review

#### 💳 Payment Endpoints (Requires JWT)
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment signature
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/{paymentId}` - Get payment details

#### 📤 File Upload Endpoints (Requires JWT)
- `POST /api/files/upload` - Upload single image
- `POST /api/files/upload-multiple` - Upload multiple images
- `GET /api/files/images/{filename}` - Retrieve image
- `DELETE /api/files/images/{filename}` - Delete image

#### 👨‍💼 Admin Endpoints (Requires Admin JWT)

**User Management**
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/{userId}` - Get user details
- `PUT /api/admin/users/{userId}/status` - Update user status
- `DELETE /api/admin/users/{userId}` - Delete user

**Property Management**
- `GET /api/admin/properties` - List all properties
- `PUT /api/admin/properties/{propertyId}/approve` - Approve property
- `PUT /api/admin/properties/{propertyId}/reject` - Reject property
- `DELETE /api/admin/properties/{propertyId}` - Remove property

**Dashboard**
- `GET /api/admin/dashboard/stats` - Get platform statistics
- `GET /api/admin/dashboard/revenue` - Get revenue analytics

### Sample API Requests

#### Register Owner
```bash
POST /api/owner/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "managementCompany": "JD Properties",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "password": "SecurePass123",
  "aadharOrPan": "ABCDE1234F",
  "bankAccount": "1234567890",
  "ifsc": "SBIN0001234"
}
```

#### Login Owner
```bash
POST /api/owner/login
Content-Type: application/json

{
  "email": "john@example.com",
  "passwordHash": "SecurePass123"
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "userId": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "OWNER"
}
```

#### Create Property (with JWT)
```bash
POST /api/owner/pgs
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "propertyName": "Comfort PG",
  "address": "456 Park Avenue",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400002",
  "rentAmount": 12000,
  "sharingType": "Double",
  "maxCapacity": 4,
  "availableBeds": 2,
  "foodIncluded": true,
  "description": "Well-maintained PG with all amenities",
  "amenities": ["WiFi", "AC", "Laundry", "Parking"],
  "status": "ACTIVE",
  "images": ["image1.jpg", "image2.jpg"]
}
```

#### Search Properties
```bash
GET /api/properties/search?city=Mumbai&maxRent=15000&sharingType=Double&page=0&size=10
```

## 🚀 Deployment

### Local Development
```bash
mvn spring-boot:run
```

### Production Build
```bash
# Create JAR file
mvn clean package -DskipTests

# Run JAR
java -jar target/residentia-backend-1.0.0.jar
```

### Docker Deployment (Optional)
```dockerfile
# Create Dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# Build and run
docker build -t residentia-backend .
docker run -p 8888:8888 residentia-backend
```

### AWS RDS Deployment

For detailed AWS RDS setup instructions, see:
- [AWS RDS Deployment Guide](AWS_RDS_DEPLOYMENT_GUIDE.md)
- [Safe Deploy RDS Script](SAFE_DEPLOY_RDS.ps1)

Quick setup:
```powershell
# Configure RDS connection
.\setup-rds.ps1

# Deploy to RDS
.\start-app-rds.ps1
```

### Cloudinary Setup

For cloud image storage configuration:
- [Cloudinary Setup Guide](CLOUDINARY_SETUP.md)
- [Cloudinary Quick Start](../CLOUDINARY_QUICKSTART.md)

```powershell
# Configure Cloudinary
.\setup-cloudinary.ps1

# Start with Cloudinary
.\start-with-cloudinary.ps1
```

### Key Deployment Considerations

1. **Environment Variables**: Use environment variables for sensitive data
2. **Database Migration**: Ensure schema is up-to-date
3. **CORS Configuration**: Update allowed origins for production domain
4. **SSL/HTTPS**: Enable HTTPS in production
5. **Logging**: Configure appropriate logging levels
6. **Monitoring**: Set up health checks and monitoring

## 🔒 Security

### Authentication Flow

1. **User Registration**
   - Password hashed with BCrypt (strength: 12)
   - User details stored in database
   - JWT token generated upon successful registration

2. **User Login**
   - Credentials validated against database
   - BCrypt password comparison
   - JWT token issued with 24-hour expiration

3. **Protected API Access**
   - Client sends JWT in Authorization header: `Bearer <token>`
   - `JwtAuthenticationFilter` intercepts request
   - Token validated and user context loaded
   - Request proceeds if authorized

4. **Role-Based Access Control**
   - Owner endpoints: `hasRole('OWNER')`
   - Client endpoints: `hasRole('CLIENT')`
   - Admin endpoints: `hasRole('ADMIN')`

### Security Best Practices Implemented

✅ **Password Security**
- BCrypt hashing with salt
- No plain-text password storage
- Password complexity requirements

✅ **JWT Security**
- HS512 signature algorithm
- 512-bit secret key
- Token expiration (24 hours)
- HttpOnly cookie support (optional)

✅ **API Security**
- CORS policy enforcement
- CSRF protection for state-changing operations
- Input validation with Bean Validation
- SQL injection prevention (JPA/Hibernate)

✅ **Data Protection**
- Sensitive data excluded from logs
- Secure file upload validation
- XSS prevention

### Security Configuration

Key security settings in `SecurityConfig.java`:
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/owner/register", "/api/owner/login").permitAll()
            .requestMatchers("/api/owner/**").hasRole("OWNER")
            .requestMatchers("/api/client/**").hasRole("CLIENT")
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=PropertyServiceTest

# Run with coverage
mvn test jacoco:report
```

### API Testing

#### Using Swagger UI
1. Navigate to [http://localhost:8888/swagger-ui/index.html](http://localhost:8888/swagger-ui/index.html)
2. Click "Authorize" button
3. Enter JWT token: `Bearer <your-token>`
4. Test endpoints interactively

#### Using Postman/cURL
```bash
# Get JWT token
curl -X POST http://localhost:8888/api/owner/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@test.com","passwordHash":"password123"}'

# Use token in requests
curl -X GET http://localhost:8888/api/owner/profile \
  -H "Authorization: Bearer <token>"
```

### Testing Cloudinary Integration
```powershell
# Test Cloudinary configuration
.\test-cloudinary-config.ps1
```

### Testing Logging Service
See [Logging Test Instructions](LOGGING_TEST_INSTRUCTIONS.md)

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
**Problem**: `Communications link failure` or `Access denied`

**Solutions**:
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `application.yml`
- Ensure database exists: `CREATE DATABASE residentia_db;`
- For RDS, check security group rules and VPC settings

#### Port Already in Use
**Problem**: `Port 8888 was already in use`

**Solutions**:
```bash
# Windows - Find and kill process
netstat -ano | findstr :8888
taskkill /PID <PID> /F

# Change port in application.yml
server:
  port: 9999
```

#### JWT Token Expired
**Problem**: `401 Unauthorized` after some time

**Solution**:
- Token expires after 24 hours
- Re-login to get a new token
- Implement token refresh mechanism (optional)

#### CORS Error
**Problem**: Frontend cannot access API

**Solution**:
- Add frontend URL to `allowed-origins` in `application.yml`
- Verify CORS configuration in `SecurityConfig.java`

#### File Upload Fails
**Problem**: `Maximum upload size exceeded`

**Solution**:
```yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB    # Increase if needed
      max-request-size: 50MB
```

#### Cloudinary Upload Fails
**Problem**: Images not uploading to Cloudinary

**Solutions**:
- Verify Cloudinary credentials
- Check internet connectivity
- System automatically falls back to local storage
- See [Cloudinary Implementation Guide](../CLOUDINARY_IMPLEMENTATION.md)

### Logging and Debugging

Enable detailed logging:
```yaml
logging:
  level:
    com.residentia: DEBUG
    org.springframework.web: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
```

View application logs:
```bash
# Check logs directory
cd logs

# View latest log
cat application.log

# View archived logs
cd archived
```

## 📚 Additional Resources

### Documentation Files

#### General
- [README.md](README.md) - This file
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [ERROR_ANALYSIS.md](ERROR_ANALYSIS.md) - Common error solutions

#### Cloud Services
- [AWS_RDS_DEPLOYMENT_GUIDE.md](../AWS_RDS_DEPLOYMENT_GUIDE.md) - AWS RDS setup
- [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) - Cloudinary configuration
- [CLOUDINARY_IMPLEMENTATION.md](../CLOUDINARY_IMPLEMENTATION.md) - Implementation details
- [CLOUDINARY_QUICKSTART.md](../CLOUDINARY_QUICKSTART.md) - Quick start guide
- [CLOUDINARY_ONLY_MODE.md](CLOUDINARY_ONLY_MODE.md) - Cloud-only mode

#### Logging
- [LOGGING_GUIDE.md](LOGGING_GUIDE.md) - Complete logging guide
- [LOGGING_QUICKSTART.md](LOGGING_QUICKSTART.md) - Quick start
- [LOGGING_SETUP_SUMMARY.md](LOGGING_SETUP_SUMMARY.md) - Setup summary
- [LOGGING_TEST_INSTRUCTIONS.md](LOGGING_TEST_INSTRUCTIONS.md) - Testing instructions

#### Images and Files
- [IMAGE_ACCESS_ARCHITECTURE.md](IMAGE_ACCESS_ARCHITECTURE.md) - Image access design
- [IMAGE_ACCESS_CHANGES_SUMMARY.md](IMAGE_ACCESS_CHANGES_SUMMARY.md) - Recent changes
- [IMAGE_ACCESS_TEST_GUIDE.md](IMAGE_ACCESS_TEST_GUIDE.md) - Testing guide

#### Deployment
- [DEPLOYMENT_SAFETY_CHECKLIST.md](DEPLOYMENT_SAFETY_CHECKLIST.md) - Pre-deployment checks
- [MANUAL_DEPLOYMENT_STEPS.txt](MANUAL_DEPLOYMENT_STEPS.txt) - Step-by-step guide

### Useful Scripts

#### Windows PowerShell Scripts
- `start-server.ps1` - Start local server
- `start-with-cloudinary.ps1` - Start with Cloudinary
- `start-app-rds.ps1` - Start with AWS RDS
- `setup-mysql.ps1` - Setup local MySQL
- `setup-rds.ps1` - Configure RDS connection
- `setup-cloudinary.ps1` - Configure Cloudinary
- `test-cloudinary-config.ps1` - Test Cloudinary setup
- `migrate-images-to-cloudinary.ps1` - Migrate existing images

#### SQL Scripts
- `INSERT_ADMIN.sql` - Create admin user
- `fix-missing-images.sql` - Fix image references

### External Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [JWT.io](https://jwt.io/) - JWT debugger
- [Swagger Documentation](https://swagger.io/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Razorpay API Docs](https://razorpay.com/docs/api/)

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make changes and test locally
3. Run tests: `mvn test`
4. Check code style
5. Commit with descriptive messages
6. Create pull request

### Code Style Guidelines

- Follow Java naming conventions
- Use Lombok for boilerplate reduction
- Write meaningful comments
- Keep methods focused and small
- Use DTOs for API contracts
- Handle exceptions appropriately

## 📝 Version History

- **1.0.0** - Initial release
  - Owner, Client, and Admin panels
  - JWT authentication
  - Property and booking management
  - Cloudinary integration
  - Payment integration
  - Email notifications

## 📄 License

This project is part of the Residentia PG Finder platform.

## 👥 Support & Contact

For issues, questions, or support:
- Check documentation files in the repository
- Review troubleshooting section
- Contact the development team

---

**Built with ❤️ using Spring Boot**

**Happy Coding! 🏠**
