import React from "react";
import styles from "./AdminDashboard.module.css";
import { useEffect, useState } from "react";
import API from "../../api/api";

const OwnersContent = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const res = await API.get(`/api/admin/owners`);
      console.log("Owners data:", res.data);
      setOwners(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load owners:", err);
      setError("Failed to load owners");
    } finally {
      setLoading(false);
    }
  };

  const verifyOwner = async (id) => {
    try {
      await API.put(`/api/admin/owners/${id}/verify`);
      setOwners(owners.map(owner =>
        owner.id === id
          ? { ...owner, verificationStatus: "VERIFIED", isActive: true }
          : owner
      ));
    } catch (err) {
      console.error("Verify failed:", err);
      alert("Failed to verify owner");
    }
  };

  const rejectOwner = async (id) => {
    try {
      await API.put(`/api/admin/owners/${id}/reject`);
      setOwners(owners.map(owner =>
        owner.id === id
          ? { ...owner, verificationStatus: "REJECTED", isActive: false }
          : owner
      ));
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Failed to reject owner");
    }
  };

  if (loading) return <div className="text-center py-5">Loading owners...</div>;
  if (error) return <div className="text-center text-danger py-5">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={styles.sectionTitle}>PG Owners ({owners.length})</h2>
      </div>

      <div className={styles.tableWrapper}>
        <div className="table-responsive">
          <table className="table table-hover" style={{ marginBottom: 0 }}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHead}>ID</th>
                <th className={styles.tableHead}>Name</th>
                <th className={styles.tableHead}>Email</th>
                <th className={styles.tableHead}>Mobile</th>
                <th className={styles.tableHead}>Status</th>
                <th className={styles.tableHead}>Active</th>
                <th className={styles.tableHead}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No owners found
                  </td>
                </tr>
              ) : (
                owners.map((owner) => (
                  <tr key={owner.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{owner.id}</td>
                    <td className={styles.tableCellName}>{owner.name || "N/A"}</td>
                    <td className={styles.tableCell}>{owner.email || "N/A"}</td>
                    <td className={styles.tableCell}>{owner.mobileNumber || "N/A"}</td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.badge} ${owner.verificationStatus === "VERIFIED"
                          ? styles.badgeGreen
                          : owner.verificationStatus === "REJECTED"
                            ? styles.badgeRed
                            : styles.badgeOrange
                        }`}>
                        {owner.verificationStatus || "PENDING"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {owner.isActive ? "✅" : "❌"}
                    </td>
                    <td className={styles.tableCell}>
                      {owner.verificationStatus !== "VERIFIED" && (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => verifyOwner(owner.id)}
                        >
                          Verify
                        </button>
                      )}
                      {owner.verificationStatus !== "REJECTED" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => rejectOwner(owner.id)}
                        >
                          Reject
                        </button>

                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnersContent;
