import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import API from "../../api/api";

const ReviewsContent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/admin/reviews`);
      setReviews(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await API.delete(`/api/admin/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-danger py-5">{error}</div>;
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>User Reviews</h2>

      <div className={styles.activityContainer}>
        {reviews.length === 0 ? (
          <p className="text-muted text-center">No reviews yet</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className={styles.activityItem}>
              <div className="d-flex justify-content-between mb-2">
                <h5 className={styles.activityTitle}>
                  {review.user?.name || "Anonymous"}
                </h5>
                <div style={{ fontSize: '1.2rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ color: star <= (review.rating || 0) ? '#FFD700' : '#ddd' }}>
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <small className="text-muted mb-1">
                PG: <strong>{review.property?.propertyName || "N/A"}</strong>
              </small>

              <p className={styles.activityDesc}>
                {review.reviewText}
              </p>

              <div className="d-flex justify-content-between align-items-center">
                <span className={styles.activityTime}>
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "N/A"}
                </span>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => remove(review.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsContent;