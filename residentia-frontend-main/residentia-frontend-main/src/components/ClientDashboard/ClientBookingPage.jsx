import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { toast } from "react-toastify";
import styles from "./ClientBooking.module.css";

const ClientBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    tenantName: "",
    tenantEmail: "",
    tenantPhone: "",
    checkInDate: "",
  });

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/client/properties/${id}`);
      setProperty(res.data);
    } catch (err) {
      toast.error("Failed to load booking info");
      navigate("/client");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = async () => {
    if (!form.tenantName || !form.tenantEmail || !form.checkInDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Ensure checkInDate is in LocalDateTime format
      const payload = {
        ...form,
        checkInDate: form.checkInDate.includes('T') ? form.checkInDate : form.checkInDate + 'T00:00:00'
      };
      await API.post(`/api/client/properties/${id}/bookings`, payload);
      toast.success("Booking request submitted!");
      navigate("/client");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!property) return null;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>{property.propertyName}</h1>
        <p>📍 {property.city}, {property.state}</p>
      </div>

      <div className={styles.layout}>
        {/* LEFT */}
        <div className={styles.left}>
          <h3>Your details</h3>

          <div className={styles.field}>
            <label>Full Name *</label>
            <input name="tenantName" value={form.tenantName} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Email *</label>
            <input name="tenantEmail" value={form.tenantEmail} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Phone</label>
            <input name="tenantPhone" value={form.tenantPhone} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Check-in date *</label>
            <input type="date" name="checkInDate" value={form.checkInDate} onChange={handleChange} />
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.summaryCard}>
            <div className={styles.price}>
              ₹{property.rentAmount}
              <span>/ month</span>
            </div>

            <div className={styles.summary}>
              <div>
                <span>Sharing</span>
                <span>{property.sharingType}</span>
              </div>
              <div>
                <span>Food</span>
                <span>{property.foodIncluded ? "Included" : "Not included"}</span>
              </div>
            </div>

            <button className={styles.bookBtn} onClick={handleBooking}>
              Confirm Booking
            </button>

            <p className={styles.note}>No payment charged right now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientBooking;
