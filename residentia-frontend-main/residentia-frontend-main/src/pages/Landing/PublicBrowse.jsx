import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import propertyApi from "../../api/propertyApi";
import "./PublicBrowse.css";

export default function PublicBrowse() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyApi.getAllProperties();
      console.log("Fetched properties:", data);
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      // Don't show error toast, just show empty state
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) =>
    searchCity
      ? property.city?.toLowerCase().includes(searchCity.toLowerCase())
      : true
  );

  const handlePropertyClick = (id) => {
    navigate(`/property/${id}`);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleRoleSelect = (role) => {
    setShowLoginModal(false);
    if (role === "ADMIN") {
      navigate("/admin-login");
    } else if (role === "OWNER") {
      navigate("/register-owner");
    } else {
      navigate("/register-client");
    }
  };

  return (
    <div className="public-browse">
      {/* Header */}
      <nav className="browse-navbar">
        <div className="navbar-content">
          <a className="brand" href="/">
            <span className="brand-icon">🏠</span>
            <span className="brand-text">
              PG <span className="brand-highlight">Finder</span>
            </span>
          </a>
          <div className="nav-links">
            <a href="/about-us" className="nav-link">
              About Us
            </a>
            <a href="/contact-us" className="nav-link">
              Contact Us
            </a>
            <a href="/help" className="nav-link">
              Help
            </a>
            <button className="login-btn" onClick={handleLoginClick}>
              Login / Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Live in comfort. Book in minutes.
          </div>
          <h1 className="hero-title">
            Find your next <span className="highlight">home away from home</span>
          </h1>
          <p className="hero-subtitle">
            Discover verified PGs in your city, connect with trusted owners, and
            move into a space that feels just right.
          </p>
          <div className="hero-tags">
            <span className="tag">✅ Verified Listings</span>
            <span className="tag">🧹 Clean & Safe</span>
            <span className="tag">📍 City-Based Search</span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <h2 className="search-title">Browse Available PGs</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍 Search</button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="properties-section">
        <div className="properties-container">
          {loading ? (
            <div className="loading">Loading properties...</div>
          ) : filteredProperties.length === 0 ? (
            <div className="no-results">
              <h3>No properties found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="properties-grid">
              {filteredProperties.map((property) => (
                <div
                  key={property.propertyId || property.id}
                  className="property-card"
                  onClick={() => handlePropertyClick(property.propertyId || property.id)}
                >
                  <div className="property-image">
                    <div className="property-placeholder">🏢</div>
                    {(property.imageUrl || property.imageName) && (
                      <img
                        src={
                          property.imageUrl 
                            ? (property.imageUrl.startsWith('http') ? property.imageUrl : `http://localhost:8888${property.imageUrl}`)
                            : `http://localhost:8888/api/files/images/${property.imageName}`
                        }
                        alt={property.propertyName || property.name}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                        onLoad={(e) => {
                          e.target.previousSibling.style.display = 'none';
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          console.log('Image failed to load:', e.target.src);
                        }}
                      />
                    )}
                  </div>
                  <div className="property-body">
                    <h3 className="property-name">{property.propertyName || property.name || 'Property'}</h3>
                    <p className="property-location">
                      📍 {property.address || ''}, {property.city || ''}
                    </p>
                    <div className="property-details">
                      <span>🛏️ {property.roomType || property.sharingType || 'N/A'}</span>
                      <span>👥 {property.occupancy || property.availableBeds || 0} persons</span>
                    </div>
                    <div className="property-footer">
                      <span className="property-price">
                        ₹{property.rent || property.rentAmount || 0}/month
                      </span>
                      <button className="view-btn">View Details →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
            <h2 className="modal-title">Login or Sign Up</h2>
            <p className="modal-subtitle">Choose your account type</p>
            <div className="role-buttons">
              <button
                className="role-btn"
                onClick={() => handleRoleSelect("CLIENT")}
              >
                <div className="role-icon">👤</div>
                <div className="role-name">Client</div>
                <div className="role-desc">Find and book PGs</div>
              </button>
              <button
                className="role-btn"
                onClick={() => handleRoleSelect("OWNER")}
              >
                <div className="role-icon">🏢</div>
                <div className="role-name">Owner</div>
                <div className="role-desc">List your properties</div>
              </button>
              <button
                className="role-btn"
                onClick={() => handleRoleSelect("ADMIN")}
              >
                <div className="role-icon">⚙️</div>
                <div className="role-name">Admin</div>
                <div className="role-desc">Manage platform</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">PG Finder</h3>
            <p className="footer-desc">
              Your trusted platform for finding the perfect paying guest accommodation. 
              We connect students and professionals with verified PG owners across India.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">📘</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">📸</a>
              <a href="#" className="social-icon">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/help">Help Center</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">For Owners</h4>
            <ul className="footer-links">
              <li><a href="/register-owner">List Your Property</a></li>
              <li><a href="#">Owner Dashboard</a></li>
              <li><a href="#">Pricing Plans</a></li>
              <li><a href="#">Success Stories</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-links">
              <li>📧 support@pgfinder.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Mumbai, Maharashtra, India</li>
              <li>🕐 Mon - Sat: 9 AM - 6 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 PG Finder. All rights reserved.</p>
          <p>Made with 💜 for students and professionals</p>
        </div>
      </footer>
    </div>
  );
}
