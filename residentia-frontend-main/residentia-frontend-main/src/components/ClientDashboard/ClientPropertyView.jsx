import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { toast } from "react-toastify";
import styles from "./ClientPropertyView.module.css";

const ClientPropertyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/client/properties/${id}`);
      setProperty(res.data);
    } catch (err) {
      toast.error("Failed to load property details");
      navigate("/client");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!property) return null;

  return (
    <div className={styles.page}>
      {/* Back */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* IMAGE */}
      <div className={styles.imageWrapper}>
        {(property.imageUrl || property.imageName) ? (
          <img 
            src={
              property.imageUrl 
                ? (property.imageUrl.startsWith('http') ? property.imageUrl : `http://localhost:8888${property.imageUrl}`)
                : `http://localhost:8888/api/files/images/${property.imageName}`
            } 
            alt={property.propertyName} 
          />
        ) : (
          <div className={styles.placeholder}>🏠</div>
        )}
      </div>

      {/* CONTENT */}
      <div className={styles.contentWrapper}>
        {/* LEFT */}
        <div className={styles.left}>
          <h1 className={styles.title}>{property.propertyName}</h1>
          <p className={styles.location}>
            📍 {property.city}, {property.state}
          </p>

          <div className={styles.meta}>
            <span>{property.sharingType}</span>
            <span>•</span>
            <span>{property.availableBeds} beds available</span>
            <span>•</span>
            <span>{property.foodIncluded ? "Food Included" : "No Food"}</span>
          </div>

          <hr />

          <section>
            <h3>Description</h3>
            <p className={styles.desc}>{property.description || "No description provided."}</p>
          </section>

          <section>
            <h3>Amenities</h3>
            <div className={styles.amenities}>
              {(typeof property.amenities === "string"
                ? property.amenities.split(",")
                : []
              ).map((a, i) => (
                <span key={i}>{a.trim()}</span>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.bookCard}>
            <div className={styles.price}>
              ₹{property.rentAmount} <span>/ month</span>
            </div>

            <button
              className={styles.bookBtn}
              onClick={() => navigate(`/book/${property.propertyId}`)}
            >
              Book Now
            </button>

            <p className={styles.note}>No charges applied yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPropertyView;
