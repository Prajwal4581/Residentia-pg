import ClientProfile from "./pages/ClientProfile";
  <Route path="/client/profile" element={<ClientProfile />} />
import { Route, Routes } from "react-router-dom";
import "./App.css";

// ===== PAGES =====
import Home from "./pages/Landing/Home";
import PublicBrowse from "./pages/Landing/PublicBrowse";
import ClientRegister from "./pages/Auth/Client/ClientRegister";
import OwnerRegister from "./pages/Auth/Owner/OwnerRegister";
import AdminLogin from "./pages/Auth/Admin/AdminLogin";
import About from "./pages/staticPages/About";
import Contact from "./pages/staticPages/Contact";
import Help from "./pages/staticPages/Help";

// ===== COMPONENTS =====
import ClientDashboard from "./components/ClientDashboard/ClientDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import Owner from "./components/OwnerPanel/Owner";
import ClientView from "./components/OwnerPanel/ClientView";
import ViewProperty from "./components/OwnerPanel/ViewProperty";
import ClientPropertyView from "./components/ClientDashboard/ClientPropertyView";
import Payment from "./pages/Payment";
import ClientBookingPage from "./components/ClientDashboard/ClientBookingPage";

// ===== ROUTES =====
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<PublicBrowse />} />
      <Route path="/login" element={<Home />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/help" element={<Help />} />
      <Route path="/register-client" element={<ClientRegister />} />
      <Route path="/register-owner" element={<OwnerRegister />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      
      {/* Public property viewing - no auth required */}
      <Route path="/property/:id" element={<ClientPropertyView />} />

      {/* ===== ADMIN ROUTES ===== */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ===== CLIENT ROUTES ===== */}
      <Route
        path="/client"
        element={
          <ProtectedRoute role="CLIENT">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      {/* Protected booking routes - require authentication */}
      <Route
        path="/book/:id"
        element={
          <ProtectedRoute role="CLIENT">
            <ClientBookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:bookingId"
        element={
          <ProtectedRoute role="CLIENT">
            <Payment />
          </ProtectedRoute>
        }
      />

      {/* ===== ADMIN ROUTES (FROM V2) ===== */}
      

      {/* ===== OWNER ROUTES (FROM V1) ===== */}
      <Route
        path="/owner-dashboard"
        element={
          <ProtectedRoute role="OWNER">
            <Owner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/client/:bookingId"
        element={
          <ProtectedRoute role="OWNER">
            <ClientView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/view/:id"
        element={
          <ProtectedRoute role="OWNER">
            <ViewProperty />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<PublicBrowse />} />
    </Routes>
  );
}

export default App;