import React, { useEffect, useState } from "react";
import styles from "./Owner.module.css";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const BookingsContent = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await API.get("/api/owner/bookings");
      setBookings(res.data);
    } catch (err) {
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id) => {
    try {
      await API.put(`/api/owner/bookings/${id}/confirm`);
      loadBookings(); // refresh list
    } catch (err) {
      alert("Confirm failed");
    }
  };

  if (loading) return <p className="text-center">Loading bookings...</p>;

  return (
    <div>
      <h2 className={styles.sectionTitle}>All Bookings</h2>

      {bookings.length === 0 ? (
        <p className={styles.emptyText}>No bookings yet</p>
      ) : (
        <div className={styles.bookingsGrid}>
          {bookings.map((b) => (
            <div key={b.bookingId} className={styles.bookingCardOwner}>
              <div className={styles.cardHeader}>
                <h3 className={styles.propertyTitle}>{b.propertyName}</h3>
                <span
                  className={
                    b.status === "CONFIRMED"
                      ? styles.confirmed
                      : styles.pending
                  }
                >
                  {b.status}
                </span>
              </div>

              <div className={styles.guestDetails}>
                <div className={styles.guestAvatar}>👤</div>
                <div>
                  <div className={styles.guestName}>{b.tenantName}</div>
                  <div className={styles.guestPhone}>📞 {b.tenantPhone}</div>
                </div>
              </div>

              <div className={styles.dateSection}>
                <div className={styles.dateBox} style={{ flex: 'none' }}>
                  <div className={styles.dateLabel}>CHECK-IN DATE</div>
                  <div className={styles.dateValue}>
                    {b.checkInDate ? new Date(b.checkInDate).toLocaleDateString('en-GB') : 'N/A'}
                  </div>
                </div>
              </div>

              <div className={styles.amountSection}>
                <span className={styles.amountLabel}>Total Amount</span>
                <span className={styles.amountValue}>₹{(b.amount || 0).toLocaleString()}</span>
              </div>

              {/* Payment Status */}
              {b.paymentStatus && (
                <div className={styles.paymentSection} style={{ 
                  marginTop: '10px', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  backgroundColor: b.paymentStatus === 'PAID' ? '#e8f5e9' : 
                                   b.paymentStatus === 'PENDING' ? '#fff3e0' : '#ffebee',
                  border: `1px solid ${b.paymentStatus === 'PAID' ? '#4CAF50' : 
                                        b.paymentStatus === 'PENDING' ? '#FF9800' : '#f44336'}`
                }}>
                  <span style={{ 
                    fontWeight: '600',
                    color: b.paymentStatus === 'PAID' ? '#2e7d32' : 
                           b.paymentStatus === 'PENDING' ? '#f57c00' : '#c62828'
                  }}>
                    Payment: {b.paymentStatus}
                    {b.paymentStatus === 'PAID' && ' ✓'}
                  </span>
                  {b.razorpayPaymentId && (
                    <div style={{ 
                      fontSize: '0.85em', 
                      marginTop: '4px',
                      color: '#666'
                    }}>
                      ID: {b.razorpayPaymentId}
                    </div>
                  )}
                </div>
              )}

              <div className={styles.cardActions}>
                <button
                  className={styles.viewBtn}
                  onClick={() => navigate(`/owner/client/${b.bookingId}`)}
                >
                  View Details
                </button>

                {b.status === "PENDING" && (
                  <button
                    className={styles.confirmBtn}
                    onClick={() => confirmBooking(b.bookingId)}
                  >
                    ✔ Confirm Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsContent;
