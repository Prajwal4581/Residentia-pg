# Residentia Frontend - PG Finder Platform Client

A modern, responsive React application for the Residentia PG Finder platform. This comprehensive frontend provides three distinct user interfaces: Property Owners, Clients (tenants), and Administrators, all built with React 19, Vite, and modern web technologies.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [User Interfaces](#-user-interfaces)
- [API Integration](#-api-integration)
- [Routing](#-routing)
- [Styling](#-styling)
- [Development](#-development)
- [Building & Deployment](#-building--deployment)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### 🏠 Multi-Role System

**Property Owners**
- Owner registration and authentication
- Property management dashboard
- Add, edit, and delete property listings
- View and manage bookings
- Track booking status and earnings
- Profile management

**Clients (Tenants)**
- Client registration and authentication
- Browse and search available properties
- Advanced filtering (location, price, sharing type)
- Book properties with date selection
- View booking history and status
- Write reviews and ratings
- Integrated payment processing
- Profile management

**Administrators**
- Admin authentication
- Comprehensive admin dashboard
- User management (owners and clients)
- Property approval/rejection
- Booking oversight
- Review moderation
- Platform statistics and analytics
- Request management

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach, works on all devices
- **Modern UI**: Clean, intuitive interface with CSS Modules
- **Real-time Notifications**: Toast notifications for user feedback
- **Protected Routes**: Role-based access control
- **Smooth Navigation**: React Router with seamless transitions
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error messages and fallbacks

### 🔐 Security Features
- JWT token-based authentication
- Automatic token refresh
- Protected route components
- Secure API communication
- Local storage management
- Session persistence

### 📊 Data Visualization
- Interactive charts with Recharts
- Dashboard analytics
- Booking statistics
- Revenue tracking

## 🛠 Tech Stack

### Core
- **React 19.1.1** - UI library
- **Vite 7.1.7** - Build tool and dev server
- **React Router DOM 7.10.1** - Routing and navigation

### State & Data
- **Axios 1.13.2** - HTTP client
- **React Toastify 11.0.5** - Toast notifications
- **Local Storage** - Client-side data persistence

### Visualization
- **Recharts 3.7.0** - Charting library

### Development Tools
- **ESLint 9.36.0** - Code linting
- **Vite Plugin React** - Fast refresh and HMR
- **CSS Modules** - Component-scoped styling

## 📁 Project Structure

```
client/
├── public/                      # Static assets
├── src/
│   ├── api/                     # API Integration Layer
│   │   ├── axios.js            # Axios configuration with interceptors
│   │   ├── api.js              # Generic API functions
│   │   ├── ownerApi.js         # Owner-specific API calls
│   │   ├── propertyApi.js      # Property API endpoints
│   │   └── bookingApi.js       # Booking API endpoints
│   │
│   ├── components/             # React Components
│   │   ├── OwnerPanel/         # Owner Dashboard Components
│   │   │   ├── Owner.jsx
│   │   │   ├── Owner.module.css
│   │   │   ├── DashboardContent.jsx
│   │   │   ├── MyPropertiesContent.jsx
│   │   │   ├── AddPropertyContent.jsx
│   │   │   ├── BookingsContent.jsx
│   │   │   ├── ProfileContent.jsx
│   │   │   ├── ViewProperty.jsx
│   │   │   └── ClientView.jsx
│   │   │
│   │   ├── ClientDashboard/    # Client Dashboard Components
│   │   │   ├── ClientDashboard.jsx
│   │   │   ├── ClientDashboard.module.css
│   │   │   ├── Listings.jsx
│   │   │   ├── SearchSection.jsx
│   │   │   ├── PGCard.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── ProfileContent.jsx
│   │   │   ├── ClientBookingPage.jsx
│   │   │   └── ClientPropertyView.jsx
│   │   │
│   │   └── AdminDashboard/     # Admin Dashboard Components
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminDashboard.module.css
│   │       ├── DashboardContent.jsx
│   │       ├── UserContent.jsx
│   │       ├── OwnerContents.jsx
│   │       ├── PropertiesContent.jsx
│   │       ├── BookingsContent.jsx
│   │       ├── ReviewsContent.jsx
│   │       └── RequestsContent.jsx
│   │
│   ├── pages/                  # Page Components
│   │   ├── Landing/
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── PublicBrowse.jsx
│   │   │   └── PublicBrowse.css
│   │   ├── Auth/
│   │   │   ├── Owner/
│   │   │   │   ├── OwnerRegister.jsx
│   │   │   │   └── OwnerLogin.jsx
│   │   │   ├── Client/
│   │   │   │   ├── ClientRegister.jsx
│   │   │   │   └── ClientLogin.jsx
│   │   │   └── Admin/
│   │   │       └── AdminLogin.jsx
│   │   ├── staticPages/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Help.jsx
│   │   ├── ClientProfile.jsx
│   │   └── Payment.jsx
│   │
│   ├── routes/                 # Routing Components
│   │   └── ProtectedRoute.jsx  # Route guards and auth checks
│   │
│   ├── utils/                  # Utility Functions
│   │
│   ├── assets/                 # Images, fonts, etc.
│   │
│   ├── App.jsx                 # Main App component
│   ├── App.css                 # Global styles
│   ├── main.jsx                # Application entry point
│   └── index.css               # Base CSS
│
├── .eslintrc.js                # ESLint configuration
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies and scripts
├── index.html                  # HTML template
└── README.md                   # This file
```

## 📦 Prerequisites

- **Node.js** 16.0 or higher
- **npm** 8.0 or higher (or yarn/pnpm)
- **Backend API** running on port 8888 (or configured endpoint)

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
cd residentia/client/client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8888
```

### 4. Start Development Server
```bash
npm run dev
```

The application will open at [http://localhost:5173](http://localhost:5173)

### 5. Access the Application
- **Homepage**: [http://localhost:5173](http://localhost:5173)
- **Browse Properties**: [http://localhost:5173/browse](http://localhost:5173/browse)
- **Owner Login**: [http://localhost:5173/owner/login](http://localhost:5173/owner/login)
- **Client Login**: [http://localhost:5173/client/login](http://localhost:5173/client/login)
- **Admin Login**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

## ⚙️ Configuration

### Environment Variables

Create `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:8888

# Optional configurations
VITE_APP_NAME=Residentia
VITE_APP_VERSION=1.0.0
```

### Vite Configuration

The project uses a minimal Vite configuration in `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

### Axios Configuration

API client is configured in `src/api/axios.js`:
- Base URL: `http://localhost:8888`
- Automatic JWT token injection
- Response interceptors for error handling
- Token refresh mechanism

## 👥 User Interfaces

### 🏪 Owner Dashboard

**Features:**
- Dashboard overview with statistics
- Property management
  - View all properties
  - Add new property with images
  - Edit property details
  - Delete properties
- Booking management
  - View all bookings
  - Update booking status
  - Filter by property
- Profile management

**Navigation:**
```
/owner/dashboard
  ├── /dashboard (Overview)
  ├── /properties (My Properties)
  ├── /add-property (Add New Property)
  ├── /bookings (Booking Management)
  └── /profile (Profile Settings)
```

### 👤 Client Dashboard

**Features:**
- Browse available properties
- Advanced search and filters
  - Location (city/state)
  - Price range
  - Sharing type
  - Amenities
- Property details view
- Booking creation
- View booking history
- Write and manage reviews
- Payment processing
- Profile management

**Navigation:**
```
/client/dashboard
  ├── /listings (Browse Properties)
  ├── /bookings (My Bookings)
  ├── /property/:id (Property Details)
  ├── /payment (Payment Processing)
  └── /profile (Profile Settings)
```

### 🔧 Admin Dashboard

**Features:**
- Platform statistics dashboard
- User management
  - View all users
  - Activate/deactivate accounts
  - User details
- Property management
  - Approve/reject properties
  - View all properties
  - Remove listings
- Booking oversight
- Review moderation
- Request management

**Navigation:**
```
/admin/dashboard
  ├── /dashboard (Statistics Overview)
  ├── /users (User Management)
  ├── /owners (Owner Management)
  ├── /properties (Property Management)
  ├── /bookings (Booking Oversight)
  ├── /reviews (Review Moderation)
  └── /requests (Request Management)
```

## 🔌 API Integration

### Authentication

```javascript
// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8888",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - adds JWT token
API.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("pg_auth") || "{}");
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});
```

### API Modules

**Owner API** (`src/api/ownerApi.js`)
- `registerOwner(data)` - Register new owner
- `loginOwner(credentials)` - Owner login
- `getOwnerProfile()` - Get profile data
- `updateOwnerProfile(data)` - Update profile

**Property API** (`src/api/propertyApi.js`)
- `getAllProperties()` - Get all properties
- `getPropertyById(id)` - Get property details
- `createProperty(data)` - Create new property
- `updateProperty(id, data)` - Update property
- `deleteProperty(id)` - Delete property
- `searchProperties(filters)` - Search with filters

**Booking API** (`src/api/bookingApi.js`)
- `createBooking(data)` - Create new booking
- `getBookings()` - Get user bookings
- `updateBooking(id, data)` - Update booking
- `cancelBooking(id)` - Cancel booking

### Usage Example

```jsx
import { useEffect, useState } from 'react';
import { getAllProperties } from '../api/propertyApi';
import { toast } from 'react-toastify';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getAllProperties();
        setProperties(response.data);
      } catch (error) {
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // ... render logic
}
```

## 🛣 Routing

### Public Routes
- `/` - Homepage
- `/browse` - Browse properties (public)
- `/owner/register` - Owner registration
- `/owner/login` - Owner login
- `/client/register` - Client registration
- `/client/login` - Client login
- `/admin/login` - Admin login
- `/about` - About page
- `/contact` - Contact page
- `/help` - Help page

### Protected Routes (Owner)
- `/owner/dashboard` - Owner dashboard
- `/owner/properties` - Property management
- `/owner/add-property` - Add property
- `/owner/bookings` - Booking management
- `/owner/profile` - Owner profile

### Protected Routes (Client)
- `/client/dashboard` - Client dashboard
- `/client/bookings` - My bookings
- `/client/property/:id` - Property details
- `/client/payment` - Payment page
- `/client/profile` - Client profile

### Protected Routes (Admin)
- `/admin/dashboard` - Admin dashboard
- `/admin/*` - All admin routes

### Protected Route Implementation

```jsx
// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const auth = JSON.parse(localStorage.getItem("pg_auth") || "{}");
  
  if (!auth.token) {
    return <Navigate to="/" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
```

## 🎨 Styling

### CSS Modules
Component-specific styles using CSS Modules:
```jsx
// Component.jsx
import styles from './Component.module.css';

function Component() {
  return <div className={styles.container}>Content</div>;
}
```

### Global Styles
- `src/index.css` - Base styles and CSS reset
- `src/App.css` - Application-wide styles

### Responsive Design
Mobile-first approach with breakpoints:
```css
/* Mobile first */
.container { width: 100%; }

/* Tablet */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { width: 1000px; }
}
```

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Development Workflow

1. **Start Backend**: Ensure backend is running on port 8888
2. **Start Frontend**: Run `npm run dev`
3. **Hot Module Replacement**: Changes reflect instantly
4. **Browser DevTools**: Use React DevTools extension
5. **API Monitoring**: Check Network tab for API calls

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

### State Management Best Practices

- Use `useState` for component-level state
- Use `useEffect` for side effects and data fetching
- Lift state up when needed by multiple components
- Store authentication data in localStorage

## 🏗 Building & Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Output: dist/ directory
```

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

#### 1. Static Hosting (Vercel, Netlify)
```bash
# Build
npm run build

# Deploy dist/ folder
```

#### 2. Traditional Web Server (Nginx, Apache)
```bash
# Build
npm run build

# Copy dist/ contents to web server root
cp -r dist/* /var/www/html/
```

#### 3. Docker
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment-Specific Builds

```bash
# Development
VITE_API_URL=http://localhost:8888 npm run build

# Production
VITE_API_URL=https://api.residentia.com npm run build
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
**Problem**: `Port 5173 is already in use`

**Solution**:
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.js
server: { port: 3000 }
```

#### API Connection Failed
**Problem**: Cannot connect to backend API

**Solution**:
- Verify backend is running: `http://localhost:8888`
- Check `.env` file has correct `VITE_API_URL`
- Check browser console for CORS errors
- Verify backend CORS configuration allows `http://localhost:5173`

#### Token Expired / 401 Errors
**Problem**: Getting unauthorized errors

**Solution**:
- Re-login to get a fresh token
- Check token expiration (24 hours)
- Clear localStorage: `localStorage.clear()`

#### Images Not Loading
**Problem**: Property images not displaying

**Solution**:
- Check image URLs in API response
- Verify backend file serving is working
- Check Cloudinary configuration (if used)
- Check browser console for 404 errors

#### Build Errors
**Problem**: `npm run build` fails

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for dependency conflicts
npm audit

# Update dependencies
npm update
```

### Debug Mode

Enable verbose logging:
```javascript
// In axios.js
API.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});

API.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Error:', error);
    return Promise.reject(error);
  }
);
```

## 📚 Additional Resources

### React & Vite
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

### Libraries
- [Axios Documentation](https://axios-http.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [Recharts Documentation](https://recharts.org/)

### Learning Resources
- [React Hooks Guide](https://react.dev/reference/react)
- [Modern JavaScript](https://javascript.info/)
- [CSS Modules](https://github.com/css-modules/css-modules)

## 🤝 Contributing

### Development Guidelines
- Follow React best practices
- Use functional components and hooks
- Implement proper error handling
- Write clean, readable code
- Use meaningful variable names
- Comment complex logic
- Keep components small and focused

### Code Style
- Use ES6+ features
- Destructure props and state
- Use arrow functions
- Follow ESLint rules
- Use CSS Modules for styling

## 📝 Features Checklist

✅ Owner registration and authentication  
✅ Client registration and authentication  
✅ Admin authentication  
✅ Property browsing and search  
✅ Property filtering  
✅ Property details view  
✅ Booking creation  
✅ Booking management  
✅ Payment integration  
✅ Review system  
✅ Owner dashboard  
✅ Client dashboard  
✅ Admin dashboard  
✅ Profile management  
✅ Responsive design  
✅ Toast notifications  
✅ Protected routes  
✅ Auto token refresh  

## 📄 License

This project is part of the Residentia PG Finder platform.

## 👥 Support

For issues and support:
- Check this documentation
- Review backend API documentation
- Check browser console for errors
- Contact development team

---

**Built with ⚛️ React and ⚡ Vite**

**Happy Coding! 🏠**
