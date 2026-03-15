import React from "react";
import styles from "./AdminDashboard.module.css";
import { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";

const RequestsContent = () => {
  const [requests, setRequests] = useState([]);
  const [loadingRequestId, setLoadingRequestId] = useState(null);
  
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await API.get(`/api/admin/change-requests`);
      setRequests(res.data || []);
    } catch (error) {
      console.error("Failed to load requests:", error);
      toast.error("Failed to load change requests");
    }
  };

  const approve = async (id) => {
    try {
      setLoadingRequestId(id);
      const res = await API.put(`/api/admin/change-requests/${id}/approve`);
      
      // Update the request in UI
      setRequests(prev =>
        prev.map(r => (r.id === id ? res.data : r))
      );
      
      toast.success("Change request approved! Property updated successfully.");
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve change request");
    } finally {
      setLoadingRequestId(null);
    }
  };

  const reject = async (id) => {
    try {
      setLoadingRequestId(id);
      const res = await API.put(`/api/admin/change-requests/${id}/reject`);
      
      // Update the request in UI
      setRequests(prev =>
        prev.map(r => (r.id === id ? res.data : r))
      );
      
      toast.info("Change request rejected.");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject change request");
    } finally {
      setLoadingRequestId(null);
    }
  };

  const renderChanges = (json) => {
    try {
      const obj = JSON.parse(json);
      return Object.entries(obj).map(([key, value]) => (
        <li key={key}>
          <strong>{key}</strong>: {String(value)}
        </li>
      ));
    } catch {
      return <li>Invalid change details</li>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={styles.sectionTitle}>Change Requests</h2>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={loadRequests}
        >
          🔄 Refresh
        </button>
      </div>

      <div className={styles.activityContainer}>
        {requests.length === 0 ? (
          <p className="text-muted text-center">No requests</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className={styles.activityItem}>
              <h5>{req.property?.propertyName || "PG"}</h5>

              <p className="text-muted">
                Requested by: {req.owner?.name}
              </p>

              <ul>
                {renderChanges(req.changeDetails)}
              </ul>

              <p>
                Status:{" "}
                <span
                  className={
                    req.status === "APPROVED"
                      ? styles.badgeGreen
                      : req.status === "REJECTED"
                      ? styles.badgeRed
                      : styles.badgeOrange
                  }
                >
                  {req.status}
                </span>
              </p>

              <div>
                {req.status !== "APPROVED" && (
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => approve(req.id)}
                    disabled={loadingRequestId === req.id}
                  >
                    {loadingRequestId === req.id ? "Approving..." : "Approve"}
                  </button>
                )}

                {req.status !== "REJECTED" && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => reject(req.id)}
                    disabled={loadingRequestId === req.id}
                  >
                    {loadingRequestId === req.id ? "Rejecting..." : "Reject"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsContent;

/*
import React from "react";
import styles from "./AdminDashboard.module.css";
import { useEffect, useState } from "react";
import API from "../../api/api";

const RequestsContent = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await API.get("/api/admin/change-requests");
      console.log("Requests data:", res.data);
      setRequests(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
   try {
      await API.put(`/api/admin/change-requests/${id}/approve`);
      
      // Update UI
      setRequests(requests.map(r =>
        r.id === id ? { ...r, status: "APPROVED" } : r
      ));
      
      // Show success message
      alert("Request approved successfully! Property changes have been applied.");
    } catch (err) {
      console.error("Approve failed:", err);
      alert("Failed to approve request: " + (err.response?.data || err.message));
    }
  };

  const reject = async (id) => {
    try {
      await API.put(`/api/admin/change-requests/${id}/reject`);
      
      // Update UI
      setRequests(requests.map(r =>
        r.id === id ? { ...r, status: "REJECTED" } : r
      ));
      
      alert("Request rejected successfully!");
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Failed to reject request");
    }
  };

  if (loading) return <div className="text-center py-5">Loading requests...</div>;
  if (error) return <div className="text-center text-danger py-5">{error}</div>;

  // const renderChanges = (json) => {
  //   try {
  //     const obj = JSON.parse(json);
  //     return Object.entries(obj).map(([key, value]) => (
  //       <li key={key}>
  //         <strong>{key}</strong>: {String(value)}
  //       </li>
  //     ));
  //   } catch {
  //     return <li>Invalid change details</li>;
  //   }
  // };

  return (
    <div>
      <h2 className={styles.sectionTitle}>Change Requests ({requests.length})</h2>

      <div className={styles.tableWrapper}>
        <div className="table-responsive">
          <table className="table table-dark table-hover" style={{ marginBottom: 0 }}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHead}>ID</th>
                <th className={styles.tableHead}>Property</th>
                <th className={styles.tableHead}>Owner</th>
                <th className={styles.tableHead}>Type</th>
                <th className={styles.tableHead}>Status</th>
                <th className={styles.tableHead}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No change requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{request.id}</td>
                    <td className={styles.tableCellAlt}>{request.pg?.propertyName || "N/A"}</td>
                    <td className={styles.tableCell}>{request.owner?.name || "N/A"}</td>
                    <td className={styles.tableCell}>{request.changeType}</td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.badge} ${
                        request.status === "APPROVED" 
                          ? styles.badgeGreen 
                          : request.status === "REJECTED"
                          ? styles.badgeRed
                          : styles.badgeOrange
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {request.status === "PENDING" && (
                        <>
                          <button 
                            className="btn btn-success btn-sm me-2"
                            onClick={() => approve(request.id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => reject(request.id)}
                          >
                            Reject
                          </button>
                        </>
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

export default RequestsContent;

*/