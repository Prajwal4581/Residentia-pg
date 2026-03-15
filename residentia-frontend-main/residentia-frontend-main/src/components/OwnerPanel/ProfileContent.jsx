import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import styles from "./Owner.module.css";

const ProfileContent = () => {
  const [owner, setOwner] = useState({
    id: "",
    name: "",
    email: "",
    mobileNumber: "",
    businessName: "",
    address: "",
    alternateContact: "",
    verificationStatus: "",
    isActive: false,
  });

  const [loading, setLoading] = useState(true);
  const [mobileError, setMobileError] = useState("");
  const [alternateError, setAlternateError] = useState("");

  // Mobile validation function
  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/owner/profile");
      setOwner(res.data);
    } catch (err) {
      toast.error(
        "Failed to load profile: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    // Validate mobile number
    if (owner.mobileNumber && !validateMobile(owner.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      setMobileError("Invalid mobile number format");
      return;
    }

    // Validate alternate contact if provided
    if (owner.alternateContact && !validateMobile(owner.alternateContact)) {
      toast.error("Please enter a valid 10-digit alternate contact number");
      setAlternateError("Invalid mobile number format");
      return;
    }

    try {
      await API.put("/api/owner/profile", owner);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(
        "Update failed: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>Profile Settings</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Full Name</label>
        <input
          className="form-control"
          value={owner.name || ""}
          onChange={(e) =>
            setOwner({ ...owner, name: e.target.value })
          }
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Email</label>
        <input
          className="form-control"
          value={owner.email || ""}
          disabled
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Mobile Number</label>
        <input
          className={`form-control ${mobileError && owner.mobileNumber ? 'is-invalid' : ''}`}
          value={owner.mobileNumber || ""}
          onChange={(e) => {
            const value = e.target.value;
            setOwner({ ...owner, mobileNumber: value });
            if (value && !validateMobile(value)) {
              setMobileError("Enter a valid 10-digit mobile number");
            } else {
              setMobileError("");
            }
          }}
        />
        {mobileError && owner.mobileNumber && (
          <div className="invalid-feedback d-block">{mobileError}</div>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Business Name</label>
        <input
          className="form-control"
          value={owner.businessName || ""}
          onChange={(e) =>
            setOwner({ ...owner, businessName: e.target.value })
          }
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Address</label>
        <input
          className="form-control"
          value={owner.address || ""}
          onChange={(e) =>
            setOwner({ ...owner, address: e.target.value })
          }
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Alternate Contact</label>
        <input
          className={`form-control ${alternateError && owner.alternateContact ? 'is-invalid' : ''}`}
          value={owner.alternateContact || ""}
          onChange={(e) => {
            const value = e.target.value;
            setOwner({ ...owner, alternateContact: value });
            if (value && !validateMobile(value)) {
              setAlternateError("Enter a valid 10-digit mobile number");
            } else {
              setAlternateError("");
            }
          }}
        />
        {alternateError && owner.alternateContact && (
          <div className="invalid-feedback d-block">{alternateError}</div>
        )}
      </div>

      <button className="btn btn-primary" onClick={updateProfile}>
        Update Profile
      </button>
    </div>
  );
};

export default ProfileContent;
