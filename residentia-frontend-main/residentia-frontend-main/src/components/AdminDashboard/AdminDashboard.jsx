import React, { useState } from "react";
import styles from "./AdminDashboard.module.css";

import DashboardContent from "./DashboardContent";
import UsersContent from "./UserContent";
import OwnersContent from "./OwnerContents";
import PropertiesContent from "./PropertiesContent";
import BookingsContent from "./BookingsContent";
import ReviewsContent from "./ReviewsContent";
import RequestsContent from "./RequestsContent";
import { logout } from "../../utils/frontAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "owners", icon: "🏢", label: "PG Owners" },
    { id: "properties", icon: "🏠", label: "Properties" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "reviews", icon: "⭐", label: "Reviews" },
    { id: "requests", icon: "📋", label: "Requests" },
  ];

  return (
    <div className={styles.appWrapper}>
      <nav className={styles.headerNav}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className={styles.logoEmoji}>🏠</span>
            <h1 className={styles.appTitle}>PG Finder - Admin Panel</h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className={styles.welcomeText}>
              Welcome, <span className={styles.adminName}>Admin</span>
            </span>
            <button
              className={`btn btn-sm border-danger text-danger ${styles.logoutBtn}`}
              onClick={() => {
                logout();
                toast.info("Logged out successfully");
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="d-flex" style={{ height: "calc(100vh - 73px)", overflow: "hidden" }}>
        <aside className={styles.sidebar}>
          {menuItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${styles.menuItem} ${active ? styles.menuItemActive : ""}`}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </aside>

        <main className={styles.mainContent}>
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "users" && <UsersContent />}
          {activeTab === "owners" && <OwnersContent />}
          {activeTab === "properties" && <PropertiesContent />}
          {activeTab === "bookings" && <BookingsContent />}
          {activeTab === "reviews" && <ReviewsContent />}
          {activeTab === "requests" && <RequestsContent />}
          
          {/* Footer */}
          <footer style={{
            marginTop: "auto",
            padding: "24px",
            backgroundColor: "#F9FAFB",
            color: "#374151",
            borderTop: "2px solid #E0E7FF",
            textAlign: "center"
          }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
                marginBottom: "16px",
                textAlign: "left"
              }}>
                <div>
                  <h4 style={{ color: "#6366F1", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>🛠️ Admin Tools</h4>
                  <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Manage platform</p>
                  <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Monitor activities</p>
                  <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>System reports</p>
                </div>
                <div>
                  <h4 style={{ color: "#6366F1", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>📊 Analytics</h4>
                  <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>User statistics</p>
                  <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Booking trends</p>
                  <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Revenue reports</p>
                </div>
                <div>
                  <h4 style={{ color: "#6366F1", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>📞 Support</h4>
                  <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>admin@pgfinder.com</p>
                  <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>+91 98765 43210</p>
                  <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>24/7 Admin Support</p>
                </div>
              </div>
              <div style={{ paddingTop: "16px", borderTop: "1px solid #E5E7EB" }}>
                <p style={{ fontSize: "12px", margin: 0, color: "#9CA3AF" }}>&copy; 2026 PG Finder Admin Panel. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
