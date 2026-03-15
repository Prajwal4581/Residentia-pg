import React from "react";
import PGCard from "./PGCard";

const Listings = ({ pgListings, filter }) => {
  const { selectedCity, selectedBudget, selectedType, foodIncluded } = filter;

  const filtered = pgListings.filter((pg) => {
    // If no filters selected, show all
    if (!selectedCity && !selectedType && !selectedBudget && !foodIncluded) return true;

    // City filter
    if (selectedCity) {
      if (!pg.city || !pg.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    }

    // Sharing type filter
    if (selectedType) {
      if (!pg.sharingType || !pg.sharingType.includes(selectedType)) return false;
    }

    // Food included filter (UNCHANGED)
    if (foodIncluded) {
      if (
        !(
          pg.foodIncluded === true ||
          (typeof pg.amenities === "string" &&
            pg.amenities.toLowerCase().includes("food"))
        )
      ) return false;
    } else {
      if (
        pg.foodIncluded === true ||
        (typeof pg.amenities === "string" &&
          pg.amenities.toLowerCase().includes("food"))
      ) return false;
    }

    // Budget filter (UNCHANGED)
    const amt = pg.rentAmount ?? pg.price ?? 0;
    if (selectedBudget) {
      if (selectedBudget === "5000-10000" && !(amt >= 5000 && amt <= 10000)) return false;
      if (selectedBudget === "10000-15000" && !(amt > 10000 && amt <= 15000)) return false;
      if (selectedBudget === "15000-20000" && !(amt > 15000 && amt <= 20000)) return false;
      if (selectedBudget === "20000+" && !(amt > 20000)) return false;
    }

    return true;
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        margin: "24px 0",
      }}
    >
      {filtered.length === 0 ? (
        <div
          style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            color: "#9ca3af",
            fontSize: 16,
          }}
        >
          No PGs found matching your filters.
        </div>
      ) : (
        filtered.map((pg, idx) => (
          <PGCard key={pg.propertyId || pg.id || idx} pg={pg} />
        ))
      )}
    </div>
  );
};

export default Listings;
