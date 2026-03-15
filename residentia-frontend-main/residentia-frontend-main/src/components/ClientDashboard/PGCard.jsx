import React from "react";
import { useNavigate } from "react-router-dom";

const PGCard = ({ pg }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 14,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "320px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
      }}
    >
      {/* Image */}
      <div
        style={{
          width: "100%",
          height: 140,
          background: "#f3f4f6",
          position: "relative",
        }}
      >
        {pg.imageUrl ? (
          <img
            src={pg.imageUrl.startsWith('http') ? pg.imageUrl : `http://localhost:8888${pg.imageUrl}`}
            alt={pg.propertyName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = '<span style="fontSize: 40px; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center">🏠</span>';
            }}
          />
        ) : (
          <span
            style={{
              fontSize: 40,
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🏠
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px", flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>
          {pg.propertyName}
        </div>

        <div style={{ fontSize: 13, color: "#6b7280", margin: "4px 0" }}>
          📍 {pg.city}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>
            ₹{(pg.rentAmount ?? 0).toLocaleString()}
          </span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>/month</span>

          {pg.sharingType && (
            <span
              style={{
                fontSize: 11,
                padding: "2px 8px",
                background: "#f3f4f6",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                color: "#374151",
              }}
            >
              {pg.sharingType}
            </span>
          )}
        </div>

        {/* Amenities */}
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {(typeof pg.amenities === "string"
            ? pg.amenities.split(",").slice(0, 2)
            : []
          ).map((a, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                background: "#eff6ff",
                color: "#1e40af",
                padding: "2px 8px",
                borderRadius: 6,
              }}
            >
              {a.trim()}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, padding: "10px 14px" }}>
        <button
          style={{
            flex: 1,
            fontSize: 13,
            padding: "6px 0",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            background: "#fff",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/property/${pg.propertyId ?? pg.id}`)}
        >
          View
        </button>

        <button
          style={{
            flex: 1,
            fontSize: 13,
            padding: "6px 0",
            borderRadius: 6,
            border: "none",
            background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => navigate(`/book/${pg.propertyId ?? pg.id}`)}
        >
          Book
        </button>
      </div>
    </div>
  );
};

export default PGCard;
