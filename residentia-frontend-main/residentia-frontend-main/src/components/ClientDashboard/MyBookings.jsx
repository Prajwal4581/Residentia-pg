import React, { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import styles from "./ClientDashboard.module.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/client/bookings");
      console.log("✅ Bookings loaded:", res.data);
      setBookings(res.data);
    } catch (err) {
      console.error("❌ Error loading bookings:", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (bookingId) => {
    if (!reviewText.trim()) {
      toast.error("Review cannot be empty");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await API.post(`/api/reviews/${bookingId}`, {
        review: reviewText,
        rating: rating,
      });
      toast.success("Review submitted!");
      setReviewingId(null);
      setReviewText("");
      setRating(0);
      setHoveredRating(0);
      loadBookings();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit review"
      );
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    
    try {
      const date = new Date(dateTimeString);
      
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateTimeString);
        return "Invalid Date";
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      console.error("Date formatting error:", err);
      return dateTimeString;
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    
    try {
      const date = new Date(dateTimeString);
      
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error("DateTime formatting error:", err);
      return dateTimeString;
    }
  };

  if (loading) return <div className={styles.loading}>Loading bookings...</div>;

  return (
    <div>
      <h2 className={styles.sectionTitle}>My Bookings</h2>

      {bookings.length === 0 ? (
        <p className={styles.emptyText}>No bookings yet.</p>
      ) : (
        <div className={styles.bookingGrid}>
          {bookings.map((booking) => (
            <div key={booking.bookingId} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div>
                  <h4 className={styles.propertyName}>
                    {booking.propertyName || "Property"}
                  </h4>
                  
                  <div className={styles.bookingDatesContainer}>
                    {booking.checkInDate && (
                      <p className={styles.bookingDates}>
                        <strong>Check-in:</strong> {formatDate(booking.checkInDate)}
                      </p>
                    )}
                    
                    {booking.checkOutDate && (
                      <p className={styles.bookingDates}>
                        <strong>Check-out:</strong> {formatDate(booking.checkOutDate)}
                      </p>
                    )}
                    
                    {booking.bookingDate && (
                      <p className={styles.bookingDates} style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                        Booked: {formatDateTime(booking.bookingDate)}
                      </p>
                    )}
                  </div>

                  {booking.amount && (
                    <p className={styles.bookingAmount}>
                      Amount: ₹{booking.amount.toFixed(2)}
                    </p>
                  )}

                  {booking.tenantName && (
                    <p className={styles.tenantInfo} style={{ fontSize: '0.9em', marginTop: '4px' }}>
                      Guest: {booking.tenantName}
                    </p>
                  )}
                </div>

                <span
                  className={`${styles.statusBadge} ${
                    booking.status === "CONFIRMED"
                      ? styles.statusGreen
                      : booking.status === "CANCELLED"
                      ? styles.statusRed
                      : styles.statusOrange
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              {booking.notes && (
                <div className={styles.notesSection} style={{ 
                  marginTop: '10px', 
                  padding: '8px', 
                  background: '#f9f9f9', 
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}>
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}

              {booking.canPay && (
                <div style={{ marginTop: '12px' }}>
                  <button
                    className={styles.primaryBtn}
                    onClick={() => {
                      window.location.href = `/payment/${booking.bookingId}`;
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    💳 Pay Now - ₹{booking.amount?.toFixed(2)}
                  </button>
                </div>
              )}

              {booking.canReview && (
                <div className={styles.reviewSection}>
                  {reviewingId === booking.bookingId ? (
                    <>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.9em', color: '#666', display: 'block', marginBottom: '5px' }}>Rating:</label>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              style={{
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: star <= (hoveredRating || rating) ? '#fbbf24' : '#d1d5db',
                                transition: 'color 0.2s',
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write a brief one-sentence review about your experience..."
                        className={styles.reviewTextarea}
                        rows={2}
                        maxLength={200}
                      />
                      <div className={styles.reviewActions}>
                        <button
                          className={styles.primaryBtn}
                          onClick={() => handleReview(booking.bookingId)}
                        >
                          Submit Review
                        </button>
                        <button
                          className={styles.secondaryBtn}
                          onClick={() => {
                            setReviewingId(null);
                            setReviewText("");
                            setRating(0);
                            setHoveredRating(0);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      className={styles.linkBtn}
                      onClick={() => setReviewingId(booking.bookingId)}
                    >
                      Leave a review →
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
