import React, { useState } from "react";
import styles from "./Owner.module.css";
import { createProperty } from "../../api/propertyApi";
import API from "../../api/axios";

const AddPropertyContent = () => {
  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    rentAmount: "",
    sharingType: "",
    maxCapacity: "",
    availableBeds: "",
    foodIncluded: false,
    description: "",
    status: "ACTIVE",
    imageUrl: "",
  });

  const [amenities, setAmenities] = useState({
    wifi: false,
    parking: false,
    gym: false,
    laundry: false,
    kitchen: false,
    ac: false,
    tv: false,
    hotWater: false,
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setUploadedImageUrls(previews);
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];

    setUploadingImages(true);

    try {
      const formData = new FormData();
      
      // Append all images to FormData
      selectedImages.forEach((image) => {
        formData.append("files", image);
      });

      const response = await API.post("/api/files/upload-multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Extract URLs from response
      const uploadedUrls = response.data.map(item => item.url);
      return uploadedUrls;
    } catch (error) {
      console.error("Failed to upload images:", error);
      alert(`Image upload failed: ${error.response?.data || error.message}`);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images first
      const imageUrls = await uploadImages();
      const imageUrlString = imageUrls.join(",");

      const amenitiesArray = Object.keys(amenities)
        .filter((key) => amenities[key])
        .map((key) => {
          const amenityNames = {
            wifi: "WiFi",
            parking: "Parking",
            gym: "Gym",
            laundry: "Laundry",
            kitchen: "Kitchen",
            ac: "AC",
            tv: "TV",
            hotWater: "Hot Water",
          };
          return amenityNames[key];
        })
        .join(",");

      const data = {
        propertyName: formData.propertyName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        rentAmount: Number(formData.rentAmount),
        sharingType: formData.sharingType,
        maxCapacity: Number(formData.maxCapacity),
        availableBeds: Number(formData.availableBeds),
        foodIncluded: formData.foodIncluded,
        description: formData.description,
        status: formData.status,
        amenities: amenitiesArray || null,
        imageUrl: imageUrlString || null,
      };

      await createProperty(data);
      alert("Property added successfully!");
      
      // Reset form
      setFormData({
        propertyName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        rentAmount: "",
        sharingType: "",
        maxCapacity: "",
        availableBeds: "",
        foodIncluded: false,
        description: "",
        status: "ACTIVE",
        imageUrl: "",
      });
      setSelectedImages([]);
      setUploadedImageUrls([]);
      setAmenities({
        wifi: false,
        parking: false,
        gym: false,
        laundry: false,
        kitchen: false,
        ac: false,
        tv: false,
        hotWater: false,
      });
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setAmenities({
      ...amenities,
      [name]: checked,
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F9FAFB",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        <h2 style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#1F2937",
          marginBottom: "8px"
        }}>Add New Property</h2>
        <p style={{
          color: "#6B7280",
          fontSize: "14px",
          marginBottom: "24px"
        }}>Fill in the details to list your property</p>

        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
          padding: "32px"
        }}>
          <form onSubmit={handleSubmit}>
            {/* Property Details Section */}
            <div style={{
              marginBottom: "32px",
              paddingBottom: "24px",
              borderBottom: "1px solid #E5E7EB"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: "20px"
              }}>📝 Property Details</h3>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px"
                  }}>Property Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#374151",
                      fontSize: "14px",
                      padding: "10px 14px",
                      transition: "border-color 0.2s"
                    }}
                    placeholder="Enter property name"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  />
                </div>

                <div className="col-md-6">
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px"
                  }}>Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#374151",
                      fontSize: "14px",
                      padding: "10px 14px"
                    }}
                    placeholder="Enter address"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px"
                  }}>City *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#374151",
                      fontSize: "14px",
                      padding: "10px 14px"
                    }}
                    placeholder="Enter city"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  />
                </div>

                <div className="col-md-3">
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px"
                  }}>State *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#374151",
                      fontSize: "14px",
                      padding: "10px 14px"
                    }}
                    placeholder="Enter state"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  />
                </div>

                <div className="col-md-3">
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px"
                  }}>Pincode *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#374151",
                      fontSize: "14px",
                      padding: "10px 14px"
                    }}
                    placeholder="Enter pincode"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  />
                </div>

                <div className="col-md-3">
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px"
                  }}>Rent Amount *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="rentAmount"
                    value={formData.rentAmount}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#374151",
                      fontSize: "14px",
                      padding: "10px 14px"
                    }}
                    placeholder="Enter rent"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px"
                  }}>Sharing Type *</label>
                  <select
                    className="form-select"
                    name="sharingType"
                    value={formData.sharingType}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#374151",
                      fontSize: "14px",
                      padding: "10px 14px"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  >
                    <option value="">Select type</option>
                    <option value="1-Sharing">1-Sharing</option>
                    <option value="2-Sharing">2-Sharing</option>
                    <option value="3-Sharing">3-Sharing</option>
                    <option value="4-Sharing">4-Sharing</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px"
                  }}>Max Capacity *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#374151",
                      fontSize: "14px",
                      padding: "10px 14px"
                    }}
                    placeholder="Enter max capacity"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  />
                </div>

                <div className="col-md-4">
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px"
                  }}>Available Beds *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="availableBeds"
                    value={formData.availableBeds}
                    onChange={handleChange}
                    required
                    style={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#374151",
                      fontSize: "14px",
                      padding: "10px 14px"
                    }}
                    placeholder="Enter available beds"
                    onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                    onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px"
                }}>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                    color: "#374151",
                    fontSize: "14px",
                    padding: "10px 14px",
                    resize: "vertical"
                  }}
                  placeholder="Enter property description"
                  onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>

              <div className="mb-3" style={{
                padding: "16px",
                backgroundColor: "#F5F3FF",
                border: "1px solid #E0E7FF",
                borderRadius: "8px"
              }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: "10px"
                }}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="foodIncluded"
                    name="foodIncluded"
                    checked={formData.foodIncluded}
                    onChange={handleChange}
                    style={{
                      borderColor: "#6366F1",
                      width: 20,
                      height: 20,
                      margin: 0
                    }}
                  />
                  <span style={{
                    color: "#6366F1",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}>🍽️ Food Included in Rent</span>
                </label>
              </div>
            </div>

            {/* Images Section */}
            <div style={{
              marginBottom: "32px",
              paddingBottom: "24px",
              borderBottom: "1px solid #E5E7EB"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: "20px"
              }}>📷 Property Images</h3>

              <input
                type="file"
                className="form-control"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px dashed #D1D5DB",
                  borderRadius: "8px",
                  color: "#374151",
                  fontSize: "14px",
                  padding: "16px",
                  cursor: "pointer"
                }}
              />
              <small style={{ 
                color: "#6B7280", 
                marginTop: "8px", 
                display: "block",
                fontSize: "13px"
              }}>
                💡 Upload multiple images (JPG, PNG, GIF) - First image will be the main photo
              </small>
              
              {uploadedImageUrls.length > 0 && (
                <div style={{ 
                  marginTop: "20px", 
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "12px"
                }}>
                  {uploadedImageUrls.map((url, index) => (
                    <div key={index} style={{ 
                      position: "relative",
                      borderRadius: "10px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}>
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover"
                        }}
                      />
                      {index === 0 && (
                        <div style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          backgroundColor: "#6366F1",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "600"
                        }}>MAIN</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities Section */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1F2937",
                marginBottom: "20px"
              }}>✨ Amenities</h3>

              <div className="row g-3">
                {[
                  { key: "wifi", label: "WiFi", icon: "📶" },
                  { key: "parking", label: "Parking", icon: "🚗" },
                  { key: "gym", label: "Gym", icon: "🏋️" },
                  { key: "laundry", label: "Laundry", icon: "🧺" },
                  { key: "kitchen", label: "Kitchen", icon: "🍳" },
                  { key: "ac", label: "AC", icon: "❄️" },
                  { key: "tv", label: "TV", icon: "📺" },
                  { key: "hotWater", label: "Hot Water", icon: "🚿" },
                ].map((amenity) => (
                  <div className="col-md-3" key={amenity.key}>
                    <label style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      backgroundColor: amenities[amenity.key] ? "#F5F3FF" : "#F9FAFB",
                      border: amenities[amenity.key] ? "2px solid #6366F1" : "2px solid #E5E7EB",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      gap: "10px"
                    }}
                    onMouseEnter={(e) => {
                      if (!amenities[amenity.key]) {
                        e.currentTarget.style.borderColor = "#D1D5DB";
                        e.currentTarget.style.backgroundColor = "#F3F4F6";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!amenities[amenity.key]) {
                        e.currentTarget.style.borderColor = "#E5E7EB";
                        e.currentTarget.style.backgroundColor = "#F9FAFB";
                      }
                    }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={amenity.key}
                        name={amenity.key}
                        checked={amenities[amenity.key]}
                        onChange={handleAmenityChange}
                        style={{
                          borderColor: "#D1D5DB",
                          width: 18,
                          height: 18,
                          margin: 0
                        }}
                      />
                      <span style={{ fontSize: "1.2rem" }}>{amenity.icon}</span>
                      <span style={{
                        color: amenities[amenity.key] ? "#6366F1" : "#374151",
                        fontSize: "14px",
                        fontWeight: amenities[amenity.key] ? "600" : "500"
                      }}>
                        {amenity.label}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploadingImages}
              style={{
                width: "100%",
                padding: "14px 24px",
                backgroundColor: (loading || uploadingImages) ? "#9CA3AF" : "#6366F1",
                background: (loading || uploadingImages) ? "#9CA3AF" : "linear-gradient(135deg, #6366F1, #8B5CF6)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: (loading || uploadingImages) ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: (loading || uploadingImages) ? "none" : "0 4px 12px rgba(99, 102, 241, 0.3)"
              }}
              onMouseEnter={(e) => {
                if (!loading && !uploadingImages) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 16px rgba(99, 102, 241, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && !uploadingImages) {
                  e.target.style.transform = "none";
                  e.target.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.3)";
                }
              }}
            >
              {uploadingImages ? "📤 Uploading Images..." : loading ? "✨ Adding Property..." : "🎉 Add Property"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyContent;
