import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
// ...existing code...
import styles from "./ClientProfile.module.css";

const ClientProfile = () => {
  const [profile, setProfile] = useState(null); // Used for avatar and initial data
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/client/profile");
      setProfile(res.data);
      setName(res.data.name);
      setMobile(res.data.mobileNumber);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.put("/api/client/profile", { name, mobileNumber: mobile });
      toast.success("Profile updated");

      // Update local storage auth user if present
      const auth = JSON.parse(localStorage.getItem("pg_auth"));
      if (auth && auth.user) {
        auth.user.name = res.data.name;
        auth.user.mobileNumber = res.data.mobileNumber;
        localStorage.setItem("pg_auth", JSON.stringify(auth));
      }

      setProfile(res.data);
    } catch (err) {
      const msg = err.response?.data || err.message || "Update failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading profile...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileAvatar}>
        {profile?.name ? profile.name.charAt(0).toUpperCase() : <span>👤</span>}
      </div>
      <div className={styles.profileTitle}>My Profile</div>
      <form className={styles.profileForm} onSubmit={e => {e.preventDefault(); handleSave();}}>
        <div>
          <label className={styles.profileLabel}>Name</label>
          <input className={styles.profileInput} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className={styles.profileLabel}>Mobile</label>
          <input className={styles.profileInput} value={mobile} onChange={e => setMobile(e.target.value)} />
        </div>
        <button className={styles.profileButton} type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
};

export default ClientProfile;