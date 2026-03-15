import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { toast } from "react-toastify";

const ViewProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      // Add cache busting to prevent stale data
      const response = await API.get(`/api/owner/pgs/${id}?t=${Date.now()}`);
      console.log("📥 Property details fetched:", response.data);
      console.log("📷 Image URL:", response.data.imageUrl);
      setProperty(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error("Failed to load property:", error);
      toast.error("Failed to load property details");
      setTimeout(() => navigate("/owner-dashboard"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previews);
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls = [];

    try {
      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append("file", image);

        const response = await API.post("/api/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        uploadedUrls.push(response.data.url);
      }

      return uploadedUrls;
    } catch (error) {
      console.error("Failed to upload images:", error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSave = async () => {
    // Validation for field lengths
    if (editData.description && editData.description.length > 1000) {
      toast.error("Description must be less than 1000 characters. Current: " + editData.description.length);
      return;
    }
    if (editData.propertyName && editData.propertyName.length > 100) {
      toast.error("Property name must be less than 100 characters");
      return;
    }
    if (editData.address && editData.address.length > 255) {
      toast.error("Address must be less than 255 characters");
      return;
    }
    if (editData.amenities && editData.amenities.length > 500) {
      toast.error("Amenities must be less than 500 characters");
      return;
    }

    try {
      setIsSaving(true);
      
      // Upload images first if new images were selected
      let updatedImageUrl = editData.imageUrl;
      if (selectedImages.length > 0) {
        console.log("📤 Uploading new images...", selectedImages);
        const imageUrls = await uploadImages();
        updatedImageUrl = imageUrls.join(",");
        console.log("✅ Images uploaded successfully:", updatedImageUrl);
      }
      
      // Validate property data exists
      if (!property || !property.propertyId) {
        toast.error("Property data is missing. Please reload and try again.");
        return;
      }
      
      if (!property.ownerId) {
        toast.error("Owner information is missing. Please reload and try again.");
        return;
      }
      
      // Direct property update using the updated image URL
      const propertyUpdateDTO = {
        propertyName: editData.propertyName,
        address: editData.address,
        city: editData.city,
        state: editData.state,
        pincode: editData.pincode,
        rentAmount: parseInt(editData.rentAmount),
        sharingType: editData.sharingType,
        maxCapacity: parseInt(editData.maxCapacity),
        availableBeds: parseInt(editData.availableBeds),
        foodIncluded: editData.foodIncluded,
        description: editData.description,
        mapLink: editData.mapLink,
        imageUrl: updatedImageUrl,  // Use the updated image URL
        amenities: editData.amenities,
        status: editData.status || "ACTIVE"
      };
      
      console.log("🔄 Sending update to backend:", propertyUpdateDTO);
      console.log("📷 Image URL being sent:", updatedImageUrl);
      
      const response = await API.put(`/api/owner/pgs/${property.propertyId}`, propertyUpdateDTO);
      console.log("✅ Backend response:", response.data);
      console.log("📷 Updated image URL from backend:", response.data.imageUrl);
      
      // Clear image selection states
      setSelectedImages([]);
      setImagePreviewUrls([]);
      
      // Exit editing mode
      setIsEditing(false);
      
      toast.success("✅ Property updated successfully!");
      
      // Reload property data to show updated information (with cache busting)
      console.log("🔄 Reloading property data...");
      await fetchProperty();
      
      // Optional: Navigate back to My Properties after a delay
      setTimeout(() => {
        console.log("🔙 Navigating back to dashboard...");
        navigate("/owner-dashboard");
      }, 1500);
      
    } catch (error) {
      console.error("❌ Failed to update property:", error);
      console.error("Error details:", error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data || error.message || "Failed to update property";
      toast.error("❌ " + errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset editData to the current property to discard changes
    setEditData({...property});
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB"
      }}>
        <div style={{
          textAlign: "center",
          color: "#6B7280"
        }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🏠</div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB"
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>Property not found</p>
          <button
            onClick={() => navigate("/owner-dashboard")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const amenitiesList = editData?.amenities ? editData.amenities.split(",").map(a => a.trim()) : [];
  const amenityOptions = ["WiFi", "Parking", "Gym", "Laundry", "Hot Water", "AC", "Meal Plan"];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F9FAFB",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate("/owner-dashboard")}
          style={{
            marginBottom: "24px",
            padding: "10px 20px",
            backgroundColor: "#E5E7EB",
            color: "#1F2937",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "background-color 0.2s ease"
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#D1D5DB"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#E5E7EB"}
        >
          ← Back to My Properties
        </button>

        {/* Main Card */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}>
          {/* Image Section */}
          <div style={{
            width: "100%",
            height: "400px",
            backgroundColor: "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative"
          }}>
            {isEditing ? (
              <div style={{ width: "100%", height: "100%", position: "relative" }}>
                {editData?.imageUrl ? (
                  <img
                    src={editData.imageUrl.startsWith('http') ? editData.imageUrl : `http://localhost:8888${editData.imageUrl}`}
                    alt={editData.propertyName}
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
                  <div style={{ textAlign: "center", color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <div>
                      <div style={{ fontSize: "80px", marginBottom: "16px" }}>🏢</div>
                      <p style={{ fontSize: "16px" }}>No image available</p>
                    </div>
                  </div>
                )}
                <div style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  💡 Edit image URL below
                </div>
              </div>
            ) : (
              <>
                {editData?.imageUrl ? (
                  <img
                    src={editData.imageUrl.startsWith('http') ? editData.imageUrl : `http://localhost:8888${editData.imageUrl}`}
                    alt={editData.propertyName}
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
                  <div style={{ textAlign: "center", color: "#9CA3AF" }}>
                    <div style={{ fontSize: "80px", marginBottom: "16px" }}>🏢</div>
                    <p style={{ fontSize: "16px" }}>No image available</p>
                  </div>
                )}
              </>
            )}
            <div style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: editData?.status === "ACTIVE" ? "#10B981" : "#EF4444",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              {editData?.status || "ACTIVE"}
            </div>
          </div>

          {/* Content Section */}
          <div style={{ padding: "40px" }}>
            {/* Edit Button */}
            <div style={{ marginBottom: "24px", display: "flex", gap: "12px" }}>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#3B82F6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "background-color 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#2563EB"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#3B82F6"}
                >
                  ✏️ Edit Property
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: (isSaving || uploadingImages) ? "#9CA3AF" : "#10B981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: (isSaving || uploadingImages) ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "background-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => !(isSaving || uploadingImages) && (e.target.style.backgroundColor = "#059669")}
                    onMouseLeave={(e) => !(isSaving || uploadingImages) && (e.target.style.backgroundColor = "#10B981")}
                  >
                    {uploadingImages ? "📤 Uploading Images..." : isSaving ? "💾 Saving..." : "💾 Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#6B7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "background-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#4B5563"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#6B7280"}
                  >
                    ✕ Cancel
                  </button>
                </>
              )}
            </div>

            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.propertyName || ""}
                  onChange={(e) => handleEditChange("propertyName", e.target.value)}
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#1F2937",
                    marginBottom: "12px",
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "2px solid #3B82F6",
                    boxSizing: "border-box"
                  }}
                />
              ) : (
                <h1 style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#1F2937",
                  margin: "0 0 12px 0"
                }}>
                  {property?.propertyName}
                </h1>
              )}
              
              {isEditing ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px"
                }}>
                  <input
                    type="text"
                    placeholder="Address"
                    value={editData?.address || ""}
                    onChange={(e) => handleEditChange("address", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "14px"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={editData?.city || ""}
                    onChange={(e) => handleEditChange("city", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "14px"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={editData?.state || ""}
                    onChange={(e) => handleEditChange("state", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "14px"
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={editData?.pincode || ""}
                    onChange={(e) => handleEditChange("pincode", e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "14px"
                    }}
                  />
                </div>
              ) : (
                <p style={{
                  fontSize: "16px",
                  color: "#6B7280",
                  margin: "0"
                }}>
                  📍 {property?.address}, {property?.city}, {property?.state} - {property?.pincode}
                </p>
              )}
            </div>

            {/* Price and Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "20px",
              marginBottom: "32px"
            }}>
              <div style={{
                padding: "20px",
                backgroundColor: "#F0F9FF",
                borderRadius: "8px",
                border: "1px solid #BFDBFE"
              }}>
                <p style={{ color: "#6B7280", fontSize: "12px", margin: "0 0 8px 0" }}>Rent Amount</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData?.rentAmount || ""}
                    onChange={(e) => handleEditChange("rentAmount", parseInt(e.target.value) || 0)}
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#1F2937",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #BFDBFE",
                      width: "100%"
                    }}
                  />
                ) : (
                  <p style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1F2937",
                    margin: "0"
                  }}>
                    ₹{property?.rentAmount?.toLocaleString()}
                  </p>
                )}
                <p style={{ color: "#6B7280", fontSize: "12px", margin: "4px 0 0 0" }}>per month</p>
              </div>

              <div style={{
                padding: "20px",
                backgroundColor: "#F0FDF4",
                borderRadius: "8px",
                border: "1px solid #BBFEDB"
              }}>
                <p style={{ color: "#6B7280", fontSize: "12px", margin: "0 0 8px 0" }}>Available Beds</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData?.availableBeds || ""}
                    onChange={(e) => handleEditChange("availableBeds", parseInt(e.target.value) || 0)}
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#1F2937",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #BBFEDB",
                      width: "100%"
                    }}
                  />
                ) : (
                  <p style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1F2937",
                    margin: "0"
                  }}>
                    {property?.availableBeds}
                  </p>
                )}
              </div>

              <div style={{
                padding: "20px",
                backgroundColor: "#FEF3C7",
                borderRadius: "8px",
                border: "1px solid #FCD34D"
              }}>
                <p style={{ color: "#6B7280", fontSize: "12px", margin: "0 0 8px 0" }}>Max Capacity</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData?.maxCapacity || ""}
                    onChange={(e) => handleEditChange("maxCapacity", parseInt(e.target.value) || 0)}
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#1F2937",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #FCD34D",
                      width: "100%"
                    }}
                  />
                ) : (
                  <p style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1F2937",
                    margin: "0"
                  }}>
                    {property?.maxCapacity}
                  </p>
                )}
              </div>

              <div style={{
                padding: "20px",
                backgroundColor: "#FCE7F3",
                borderRadius: "8px",
                border: "1px solid #FBCFE8"
              }}>
                <p style={{ color: "#6B7280", fontSize: "12px", margin: "0 0 8px 0" }}>Sharing Type</p>
                {isEditing ? (
                  <select
                    value={editData?.sharingType || ""}
                    onChange={(e) => handleEditChange("sharingType", e.target.value)}
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1F2937",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #FBCFE8",
                      width: "100%"
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                ) : (
                  <p style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1F2937",
                    margin: "0"
                  }}>
                    {property?.sharingType || "N/A"}
                  </p>
                )}
              </div>
            </div>

            {/* Food Included */}
            {!isEditing && property?.foodIncluded && (
              <div style={{
                marginBottom: "32px",
                padding: "16px",
                backgroundColor: "#ECFDF5",
                border: "1px solid #D1FAE5",
                borderRadius: "8px"
              }}>
                <p style={{
                  color: "#047857",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: "0"
                }}>
                  ✓ Food is included in the rent
                </p>
              </div>
            )}

            {isEditing && (
              <div style={{
                marginBottom: "32px",
                padding: "16px",
                backgroundColor: "#F3F4F6",
                border: "1px solid #E5E7EB",
                borderRadius: "8px"
              }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: "10px"
                }}>
                  <input
                    type="checkbox"
                    checked={editData?.foodIncluded || false}
                    onChange={(e) => handleEditChange("foodIncluded", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span style={{ color: "#374151", fontSize: "14px", fontWeight: "600" }}>
                    Food is included in the rent
                  </span>
                </label>
              </div>
            )}

            {/* Description */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1F2937",
                margin: "0 0 12px 0"
              }}>
                Description
              </h3>
              {isEditing ? (
                <div>
                  <textarea
                    value={editData?.description || ""}
                    onChange={(e) => handleEditChange("description", e.target.value.slice(0, 1000))}
                    maxLength={1000}
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: (editData?.description?.length || 0) > 800 ? "2px solid #FCA5A5" : "1px solid #D1D5DB",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      backgroundColor: (editData?.description?.length || 0) > 900 ? "#FEF3C7" : "white"
                    }}
                  />
                  <div style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <p style={{
                      color: (editData?.description?.length || 0) > 900 ? "#D97706" : "#6B7280",
                      fontSize: "12px",
                      margin: 0
                    }}>
                      {(editData?.description?.length || 0) > 900 ? "⚠️ " : ""}
                      {editData?.description?.length || 0} / 1000 characters
                    </p>
                    {(editData?.description?.length || 0) > 1000 && (
                      <span style={{ color: "#DC2626", fontSize: "12px", fontWeight: "600" }}>
                        ❌ Exceeds limit
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p style={{
                  color: "#6B7280",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  margin: "0"
                }}>
                  {property?.description || "No description provided"}
                </p>
              )}
            </div>

            {/* Image Upload */}
            {isEditing && (
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1F2937",
                  margin: "0 0 12px 0"
                }}>
                  Property Images
                </h3>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    backgroundColor: "#ffffff"
                  }}
                />
                <small style={{ color: "#6b7280", marginTop: "5px", display: "block" }}>
                  Select new images to replace existing ones (JPG, PNG, GIF)
                </small>
                
                {imagePreviewUrls.length > 0 && (
                  <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #D1D5DB"
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Amenities */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1F2937",
                margin: "0 0 16px 0"
              }}>
                {isEditing ? "Amenities" : "What this place offers"}
              </h3>
              {isEditing ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "12px"
                }}>
                  {amenityOptions.map((amenity) => {
                    const isSelected = amenitiesList.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          gap: "8px",
                          padding: "10px 12px",
                          backgroundColor: isSelected ? "#DBEAFE" : "#F3F4F6",
                          borderRadius: "8px",
                          border: isSelected ? "2px solid #3B82F6" : "1px solid #D1D5DB"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            let newAmenities = amenitiesList.filter(a => a !== amenity);
                            if (e.target.checked) {
                              newAmenities.push(amenity);
                            }
                            handleEditChange("amenities", newAmenities.join(", "));
                          }}
                          style={{ width: "16px", height: "16px", cursor: "pointer" }}
                        />
                        <span style={{ fontSize: "14px", color: "#374151" }}>{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px"
                }}>
                  {amenitiesList.length > 0 ? amenitiesList.map((amenity, index) => {
                    const amenityLower = amenity.toLowerCase();
                    let icon = "📘";
                    if (amenityLower.includes('wifi') || amenityLower.includes('wi-fi')) icon = '📶';
                    else if (amenityLower.includes('parking')) icon = '🏎️';
                    else if (amenityLower.includes('gym')) icon = '🏋️';
                    else if (amenityLower.includes('food') || amenityLower.includes('meal')) icon = '🍽️';
                    else if (amenityLower.includes('laundry') || amenityLower.includes('washing')) icon = '🧦';
                    else if (amenityLower.includes('ac') || amenityLower.includes('air')) icon = '❄️';
                    
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px",
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#6366f1";
                          e.currentTarget.style.backgroundColor = "#f5f3ff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.backgroundColor = "#ffffff";
                        }}
                      >
                        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
                        <span>{amenity}</span>
                      </div>
                    );
                  }) : (
                    <p style={{ color: "#9CA3AF", gridColumn: "1 / -1" }}>No amenities listed</p>
                  )}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div style={{
              paddingTop: "32px",
              borderTop: "1px solid #E5E7EB"
            }}>
              <p style={{
                color: "#6B7280",
                fontSize: "12px",
                margin: "0"
              }}>
                Property ID: {property?.propertyId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProperty;
