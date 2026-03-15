import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { toast } from "react-toastify";
import styles from "./Owner.module.css";

const MyPropertiesContent = () => {
  const navigate = useNavigate();
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchProperties();
    
    // Add event listener to refresh when window regains focus
    const handleFocus = () => {
      console.log("Window focused, refreshing properties...");
      fetchProperties();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Add cache busting to prevent stale data
      const response = await API.get(`/api/owner/pgs?t=${Date.now()}`);
      console.log("📥 Properties fetched:", response.data);
      console.log("📷 Image URLs:", response.data.map(p => ({ id: p.propertyId, imageUrl: p.imageUrl })));
      setPgs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load properties:", error);
      toast.error("Failed to load properties: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to deactivate this property? You can reactivate it later.")) {
      return;
    }

    try {
      setDeletingId(propertyId);
      // Soft delete: update status to INACTIVE using PUT
      const propertyToUpdate = pgs.find(pg => (pg.propertyId || pg.id) === propertyId);
      const updatedProperty = { ...propertyToUpdate, status: "INACTIVE" };
      await API.put(`/api/owner/pgs/${propertyId}`, updatedProperty);
      toast.success("Property deactivated successfully!");
      // Update the property status in state
      setPgs(pgs.map(pg => 
        (pg.propertyId || pg.id) === propertyId 
          ? { ...pg, status: "INACTIVE" }
          : pg
      ));
    } catch (error) {
      console.error("Failed to deactivate property:", error);
      toast.error("Failed to deactivate property: " + (error.response?.data?.message || error.message));
    } finally {
      setDeletingId(null);
    }
  };

  const handleReactivate = async (propertyId) => {
    if (!window.confirm("Are you sure you want to reactivate this property?")) {
      return;
    }

    try {
      setDeletingId(propertyId);
      // Reactivate using PUT
      const propertyToUpdate = pgs.find(pg => (pg.propertyId || pg.id) === propertyId);
      const updatedProperty = { ...propertyToUpdate, status: "ACTIVE" };
      await API.put(`/api/owner/pgs/${propertyId}`, updatedProperty);
      toast.success("Property reactivated successfully!");
      // Update the property status in state
      setPgs(pgs.map(pg => 
        (pg.propertyId || pg.id) === propertyId 
          ? { ...pg, status: "ACTIVE" }
          : pg
      ));
    } catch (error) {
      console.error("Failed to reactivate property:", error);
      toast.error("Failed to reactivate property: " + (error.response?.data?.message || error.message));
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (propertyId) => {
    const property = pgs.find(pg => (pg.propertyId || pg.id) === propertyId);
    if (property) {
      localStorage.setItem("selectedProperty", JSON.stringify(property));
      navigate(`/owner/view/${propertyId}`);
    }
  };

  // Filter properties based on showInactive toggle
  const displayedProperties = showInactive 
    ? pgs 
    : pgs.filter(pg => pg.status === "ACTIVE");

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div className={styles.loadingSpinner} style={{ display: "inline-block" }}>
          <p style={{ color: "#6B7280", fontSize: "16px" }}>Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px 0" }}>
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1F2937",
            margin: 0
          }}>
            My Properties
          </h2>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            padding: "8px 16px",
            backgroundColor: showInactive ? "#DBEAFE" : "#F3F4F6",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: showInactive ? "#1E40AF" : "#6B7280",
            transition: "all 0.2s ease"
          }}>
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            Show inactive properties ({pgs.filter(p => p.status === "INACTIVE").length})
          </label>
        </div>
        <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>
          {displayedProperties.length} {displayedProperties.length === 1 ? "property" : "properties"} found
        </p>
      </div>

      {displayedProperties.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "#F3F4F6",
          borderRadius: "12px",
          border: "2px dashed #D1D5DB"
        }}>
          <p style={{ color: "#6B7280", fontSize: "16px" }}>
            {showInactive && pgs.length > 0 
              ? "No inactive properties to show" 
              : "No active properties found. Create your first property to get started!"}
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px"
        }}>
          {displayedProperties.map(pg => (
            <div
              key={pg.propertyId || pg.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                border: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Image Section */}
              <div style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative"
              }}>
                {pg.imageUrl ? (
                  <img
                    src={pg.imageUrl.startsWith('http') ? pg.imageUrl : `http://localhost:8888${pg.imageUrl}`}
                    alt={pg.propertyName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div style={{
                    textAlign: "center",
                    color: "#9CA3AF"
                  }}>
                    <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏠</div>
                    <p style={{ fontSize: "14px" }}>No image</p>
                  </div>
                )}
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: pg.status === "ACTIVE" ? "#10B981" : "#EF4444",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  {pg.status || "ACTIVE"}
                </div>
              </div>

              {/* Content Section */}
              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1F2937",
                  marginBottom: "12px",
                  margin: "0 0 12px 0"
                }}>
                  {pg.propertyName}
                </h3>

                <div style={{ marginBottom: "16px", flex: 1 }}>
                  <p style={{
                    color: "#6B7280",
                    fontSize: "14px",
                    marginBottom: "8px",
                    margin: "0 0 8px 0"
                  }}>
                    📍 {pg.city}, {pg.state} - {pg.pincode}
                  </p>
                  <p style={{
                    fontSize: "14px",
                    marginBottom: "8px",
                    margin: "0 0 8px 0"
                  }}>
                    <span style={{ color: "#1F2937", fontWeight: "600" }}>₹{pg.rentAmount?.toLocaleString()}</span>
                    <span style={{ color: "#6B7280", fontSize: "12px" }}> per month</span>
                  </p>
                  <p style={{
                    color: "#6B7280",
                    fontSize: "14px",
                    marginBottom: "4px",
                    margin: "0"
                  }}>
                    🛏️ {pg.availableBeds} beds available
                  </p>
                  {pg.amenities && (
                    <p style={{
                      color: "#6B7280",
                      fontSize: "12px",
                      marginTop: "8px",
                      marginBottom: "0"
                    }}>
                       {pg.amenities}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "16px"
                }}>
                  <button
                    onClick={() => handleView(pg.propertyId || pg.id)}
                    disabled={pg.status === "INACTIVE"}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      backgroundColor: pg.status === "INACTIVE" ? "#D1D5DB" : "#3B82F6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: pg.status === "INACTIVE" ? "not-allowed" : "pointer",
                      transition: "background-color 0.2s ease",
                      opacity: pg.status === "INACTIVE" ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (pg.status !== "INACTIVE") {
                        e.target.style.backgroundColor = "#2563EB";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pg.status !== "INACTIVE") {
                        e.target.style.backgroundColor = "#3B82F6";
                      }
                    }}
                  >
                     View
                  </button>
                  {pg.status === "ACTIVE" ? (
                    <button
                      onClick={() => handleDelete(pg.propertyId || pg.id)}
                      disabled={deletingId === (pg.propertyId || pg.id)}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        backgroundColor: deletingId === (pg.propertyId || pg.id) ? "#FCA5A5" : "#EF4444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: deletingId === (pg.propertyId || pg.id) ? "not-allowed" : "pointer",
                        transition: "background-color 0.2s ease",
                        opacity: deletingId === (pg.propertyId || pg.id) ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== (pg.propertyId || pg.id)) {
                          e.target.style.backgroundColor = "#DC2626";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingId !== (pg.propertyId || pg.id)) {
                          e.target.style.backgroundColor = "#EF4444";
                        }
                      }}
                    >
                      {deletingId === (pg.propertyId || pg.id) ? "⏳ Deactivating..." : "Deactivate"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(pg.propertyId || pg.id)}
                      disabled={deletingId === (pg.propertyId || pg.id)}
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        backgroundColor: deletingId === (pg.propertyId || pg.id) ? "#A7E957" : "#84CC16",
                        color: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: deletingId === (pg.propertyId || pg.id) ? "not-allowed" : "pointer",
                        transition: "background-color 0.2s ease",
                        opacity: deletingId === (pg.propertyId || pg.id) ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (deletingId !== (pg.propertyId || pg.id)) {
                          e.target.style.backgroundColor = "#65A30D";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deletingId !== (pg.propertyId || pg.id)) {
                          e.target.style.backgroundColor = "#84CC16";
                        }
                      }}
                    >
                      {deletingId === (pg.propertyId || pg.id) ? "⏳ Reactivating..." : "✓ Reactivate"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPropertiesContent;
