# 🏠 Residentia — PG Finder Platform

A full-stack web application that connects PG seekers with property owners. Clients can browse and book PG accommodations, owners can list and manage their properties, and admins oversee the entire platform.

---

## 🚀 Live Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Frontend | React 19, Axios, React Router DOM |
| Database | MySQL |
| Auth | JWT (Access Token + Refresh Token) |
| File Storage | Cloudinary (property images) |
| Payments | Razorpay |
| Build Tool | Maven |

---

## 👥 User Roles

### 🔵 CLIENT
- Register/Login
- Browse available PG listings
- Search and filter properties
- Book a PG room
- Make payments via Razorpay
- View booking history

### 🟠 OWNER
- Register/Login
- Add and manage property listings
- Upload property images (Cloudinary)
- View and manage bookings on their properties
- Track revenue

### 🔴 ADMIN
- Full platform oversight
- Manage users (clients & owners)
- Approve/reject property listings
- Monitor all bookings and payments

---

## 📁 Project Structure

```
Residentia-pg/
│
├── backend/                        # Spring Boot Application
│   └── src/main/java/com/residentia/
│       ├── controller/             # REST Controllers
│       ├── service/                # Business Logic
│       ├── repository/             # Spring Data JPA Repositories
│       ├── model/                  # JPA Entities
│       ├── dto/                    # Data Transfer Objects
│       ├── config/                 # Security, JWT, Cloudinary Config
│       └── exception/              # Global Exception Handling
│
└── frontend/                       # React Application
    └── src/
        ├── components/             # Reusable UI Components
        ├── pages/                  # Route-level Pages
        ├── context/                # Auth Context
        ├── api/                    # Axios API Calls
        └── utils/                  # Helpers & Constants
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

---

### 🔧 Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/Prajwal4581/Residentia-pg.git
cd Residentia-pg/backend
```

**2. Configure `application.properties`**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/residentia_db
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.secret=YOUR_JWT_SECRET
app.jwt.expiration=86400000

# Cloudinary
cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET

# Razorpay
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_SECRET
```

**3. Create the database**
```sql
CREATE DATABASE residentia_db;
```

**4. Run the backend**
```bash
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

---

### 🎨 Frontend Setup

```bash
cd ../frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

---

## 🔐 Authentication Flow

- JWT-based stateless authentication
- Access token stored in `localStorage`
- Refresh token mechanism for session persistence
- Role-based route protection on both frontend (React Router) and backend (Spring Security)

---

## 📡 Key API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| POST | `/api/auth/refresh` | Refresh access token |

### Properties
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/properties` | Get all listings |
| GET | `/api/properties/{id}` | Get property by ID |
| POST | `/api/properties` | Add new property (OWNER) |
| PUT | `/api/properties/{id}` | Update property (OWNER) |
| DELETE | `/api/properties/{id}` | Delete property (OWNER/ADMIN) |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create a booking (CLIENT) |
| GET | `/api/bookings/my` | Get user's bookings |
| PUT | `/api/bookings/{id}/status` | Update booking status |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |

---

## 🖼️ Features at a Glance

- ✅ Multi-role authentication with JWT
- ✅ Property listing with image upload (Cloudinary)
- ✅ Search & filter PG listings
- ✅ Booking management system
- ✅ Razorpay payment integration
- ✅ Admin dashboard for platform control
- ✅ Responsive React frontend

---

## 🛠️ Known Improvements (Planned)

- [ ] Deploy to AWS / Railway / Render
- [ ] Add email notifications on booking confirmation
- [ ] Implement review & rating system
- [ ] Add map-based property search

---

## 👨‍💻 Developer

**Prajwal Santosh Jadhav**  
PG-DAC, Sunbeam Institute | Aug 2025 Batch  
[GitHub](https://github.com/Prajwal4581)

---
