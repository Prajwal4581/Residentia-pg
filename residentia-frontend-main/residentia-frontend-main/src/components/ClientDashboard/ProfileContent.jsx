import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import styles from "./ClientDashboard.module.css";

const ProfileContent = ({ onProfileUpdate }) => {
  const [client, setClient] = useState({
    name: "",
    email: "",
    mobileNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/client/profile");
      setClient(res.data);
    } catch (err) {
      toast.error("Failed to load profile: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const res = await API.put("/api/client/profile", client);
      toast.success("Profile updated successfully!");
      // Update localStorage with new name
      const auth = JSON.parse(localStorage.getItem("pg_auth"));
      if (auth && auth.user) {
        auth.user.name = res.data?.name || client.name;
        localStorage.setItem("pg_auth", JSON.stringify(auth));
      }
      if (onProfileUpdate) onProfileUpdate();
      await loadProfile(); // Reload profile so new name is shown
    } catch (err) {
      toast.error("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <h2 className={styles.sectionTitle}>Profile Settings</h2>
      <div style={{ marginBottom: "20px" }}>
        <label>Full Name</label>
        <input className="form-control" value={client.name || ""} onChange={e => setClient({ ...client, name: e.target.value })} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>Email</label>
        <input className="form-control" value={client.email || ""} disabled />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label>Mobile Number</label>
        <input className="form-control" value={client.mobileNumber || ""} onChange={e => setClient({ ...client, mobileNumber: e.target.value })} />
      </div>
      <button className="btn btn-primary" onClick={updateProfile} disabled={saving}>{saving ? "Saving..." : "Update Profile"}</button>
    </div>
  );
};

export default ProfileContent;
