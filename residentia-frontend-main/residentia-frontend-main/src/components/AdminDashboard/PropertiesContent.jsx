import React,{useEffect,useState} from "react";
import styles from "./AdminDashboard.module.css";
import API from "../../api/api";
import { toast } from "react-toastify";

const PropertiesContent = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPgs();
  }, []);

  const loadPgs = async () => {
    try {
      setError(null);
      const res = await API.get(`/api/admin/pgs`);
      console.log("PGs data:", res.data); 
      setPgs(res.data);
    } catch (err) {
      console.error("Failed to load PGs:", err);
      setError("Failed to load properties");
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPgs();
    toast.info("Properties refreshed");
  };

  const approvePg = async (id) => {
    try {
      await API.put(`/api/admin/pgs/${id}/approve`);
      setPgs(pgs.map(pg =>
        pg.id === id ? { ...pg, status: "ACTIVE" } : pg
      ));
      toast.success("Property approved successfully");
    } catch (err) {
      console.error("Approve failed:", err);
      toast.error("Failed to approve property");
    }
  };

  const rejectPg = async (id) => {
    try {
      await API.put(`/api/admin/pgs/${id}/reject`);
      setPgs(pgs.map(pg =>
        pg.id === id ? { ...pg, status: "REJECTED" } : pg
      ));
      toast.info("Property rejected");
    } catch (err) {
      console.error("Reject failed:", err);
      toast.error("Failed to reject property");
    }
  };

  if (loading) return <div className="text-center py-5">Loading properties...</div>;
  if (error) return <div className="text-center text-danger py-5">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={styles.sectionTitle}>Properties ({pgs.length})</h2>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <div className="table-responsive">
          <table className="table table-hover" style={{ marginBottom: 0 }}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHead}>ID</th>
                <th className={styles.tableHead}>Property Name</th>
                <th className={styles.tableHead}>Owner</th>
                <th className={styles.tableHead}>City</th>
                <th className={styles.tableHead}>Rent</th>
                <th className={styles.tableHead}>Status</th>
                <th className={styles.tableHead}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pgs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No properties found
                  </td>
                </tr>
              ) : (
                pgs.map((pg) => (
                  <tr key={pg.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{pg.id}</td>
                    <td className={styles.propName}>{pg.propertyName || "N/A"}</td>
                    <td className={styles.tableCell}>{pg.owner?.name || "N/A"}</td>
                    <td className={styles.tableCell}>{pg.city || "N/A"}</td>
                    <td className={styles.tableCellPrice}>
                      ₹{pg.rentAmount ? pg.rentAmount.toLocaleString() : "0"}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.badge} ${
                        pg.status === "ACTIVE" 
                          ? styles.badgeGreen 
                          : pg.status === "REJECTED"
                          ? styles.badgeRed
                          : styles.badgeOrange
                      }`}>
                        {pg.status || "PENDING"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {pg.status !== "ACTIVE" && (
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => approvePg(pg.id)}
                          >
                            Approve
                          </button>
                        )}

                        {pg.status !== "REJECTED" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => rejectPg(pg.id)}
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

export default PropertiesContent;
