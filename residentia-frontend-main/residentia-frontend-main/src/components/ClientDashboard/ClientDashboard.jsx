import React, { useState, useEffect } from "react";
import ProfileContent from "./ProfileContent";
import SearchSection from "./SearchSection";
import Listings from "./Listings";
import MyBookings from "./MyBookings";
import styles from "./ClientDashboard.module.css";
import { getAuthUser, logout } from "../../utils/frontAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pgListings, setPgListings] = useState([]);
  const [userName, setUserName] = useState("Client");

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [foodIncluded, setFoodIncluded] = useState(true);

  useEffect(() => {
    const auth = getAuthUser();
    if (auth?.user?.name) setUserName(auth.user.name);
    else if (auth?.name) setUserName(auth.name);
  }, []);

  useEffect(() => {
    const fetchProperties = () => {
      fetch("http://localhost:8888/api/client/properties")
        .then(res => res.json())
        .then(setPgListings)
        .catch(() => toast.error("Failed to load properties"));
    };
    
    fetchProperties();
    
    // Refresh on window focus
    const handleFocus = () => {
      console.log("Window focused, refreshing properties...");
      fetchProperties();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className={styles.appWrapper}>
      {/* HEADER */}
      <header className={styles.headerNav}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.logoEmoji}>🏠</span>
            <h1 className={styles.appTitle}>PG Finder</h1>
          </div>

          <div className={styles.headerRight}>
            <span className={styles.welcomeText}>
              Welcome, <strong>{userName}</strong>
            </span>
            <button
              className={styles.logoutBtn}
              onClick={() => {
                logout();
                toast.info("Logged out");
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className={styles.tabsWrapper}>
        <button
          className={`${styles.tabItem} ${activeTab === "dashboard" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Explore
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === "mybookings" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("mybookings")}
        >
          My Bookings
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === "profile" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
      </div>

      {/* CONTENT */}
      <main className={styles.mainContent}>
        {activeTab === "dashboard" && (
          <>
            <SearchSection
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedBudget={selectedBudget}
              setSelectedBudget={setSelectedBudget}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              foodIncluded={foodIncluded}
              setFoodIncluded={setFoodIncluded}
            />

            <h2 className={styles.sectionTitle}>Available PGs</h2>

            <Listings
              pgListings={pgListings}
              filter={{ selectedCity, selectedBudget, selectedType, foodIncluded }}
            />
          </>
        )}

        {activeTab === "mybookings" && <MyBookings />}
        {activeTab === "profile" && <ProfileContent />}
      </main>

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
              <h4 style={{ color: "#6366F1", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>🏠 Find Your PG</h4>
              <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Browse properties</p>
              <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Easy booking</p>
              <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Secure payments</p>
            </div>
            <div>
              <h4 style={{ color: "#6366F1", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>📚 Help Center</h4>
              <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>How to book</p>
              <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>FAQs</p>
              <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>Booking policies</p>
            </div>
            <div>
              <h4 style={{ color: "#6366F1", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>📞 Support</h4>
              <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>support@pgfinder.com</p>
              <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>+91 98765 43210</p>
              <p style={{ fontSize: "12px", margin: "4px 0", color: "#6B7280" }}>24/7 Customer Support</p>
            </div>
          </div>
          <div style={{ paddingTop: "16px", borderTop: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", margin: 0, color: "#9CA3AF" }}>&copy; 2026 PG Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientDashboard;
