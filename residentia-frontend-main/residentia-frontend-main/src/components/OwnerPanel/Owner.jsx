import React, { useEffect, useState } from "react";
import styles from "./Owner.module.css";



import DashboardContent from "./DashboardContent";
import MyPropertiesContent from "./MyPropertiesContent";
import AddPropertyContent from "./AddPropertyContent";
import BookingsContent from "./BookingsContent";
import ProfileContent from "./ProfileContent";
import API from "../../api/api";

//import API from "../../api";
import { logout } from "../../utils/frontAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Owner = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [owner, setOwner] = useState(null);

  const tabs = [
    "Dashboard",
    "My Properties",
    "Add Property",
    "Bookings",
    "Profile",
  ];

  const normalize = (tab) => tab.toLowerCase().replace(/\s+/g, "-");
  const navigate = useNavigate();

  // 🔥 Load real owner from backend
  useEffect(() => {
    API.get("/api/owner/profile")
      .then((res) => {
        setOwner(res.data);
      })
      .catch((err) => {
        console.error("Failed to load owner", err);
        toast.error("Failed to load owner profile");
      });
  }, []);

  return (
    <div className={styles.appWrapper}>
      <nav className={styles.headerNav}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className={styles.logoEmoji}>🏠</span>
            <h1 className={styles.appTitle}>PG Finder - Owner Panel</h1>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className={styles.welcomeText}>
              Welcome,{" "}
              <span className={styles.ownerName}>
                {owner ? owner.name : "Loading..."}
              </span>
            </span>

            <button
              className={`btn btn-outline-light btn-sm ${styles.logoutBtn}`}
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

      <div className={styles.tabsWrapper}>
        <div className="d-flex gap-4">
          {tabs.map((tab) => {
            const id = normalize(tab);
            const isActive = activeTab === id;
            return (
              <div
                key={id}
                onClick={() => setActiveTab(id)}
                className={`${styles.tabItem} ${isActive ? styles.tabActive : ""
                  }`}
              >
                {tab}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.mainContent}>
        {activeTab === "dashboard" && <DashboardContent />}
        {activeTab === "my-properties" && <MyPropertiesContent key={Date.now()} />}
        {activeTab === "add-property" && <AddPropertyContent />}
        {activeTab === "bookings" && <BookingsContent />}
        {activeTab === "profile" && <ProfileContent />}
        
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
                <h4 style={{ color: "#6366F1", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>🏢 For Owners</h4>
                <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>List your property</p>
                <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Manage bookings</p>
                <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Track revenue</p>
              </div>
              <div>
                <h4 style={{ color: "#6366F1", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>💼 Resources</h4>
                <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Owner guidelines</p>
                <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Pricing plans</p>
                <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Success stories</p>
              </div>
              <div>
                <h4 style={{ color: "#6366F1", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>📞 Contact</h4>
                <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>owner@pgfinder.com</p>
                <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>+91 98765 43210</p>
                <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Mon-Sat: 9 AM - 6 PM</p>
              </div>
            </div>
            <div style={{ paddingTop: "16px", borderTop: "1px solid #E5E7EB" }}>
              <p style={{ fontSize: "12px", margin: 0, color: "#9CA3AF" }}>&copy; 2026 PG Finder Owner Panel. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Owner;
