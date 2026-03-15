import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import API from "../../api/api";

const UsersContent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await API.get(`/api/admin/users`);
      console.log("Users data:", res.data); 
      setUsers(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deactivate = async (id) => {
    try {
      await API.put(`/api/admin/users/${id}/deactivate`);
      setUsers(users.map(u =>
        u.id === id ? { ...u, isActive: false } : u
      ));
    } catch (err) {
      console.error("Deactivate failed:", err);
      alert("Failed to deactivate user");
    }
  };

  const activate = async (id) => {
    try {
      await API.put(`/api/admin/users/${id}/activate`);
      setUsers(users.map(u =>
        u.id === id ? { ...u, isActive: true } : u
      ));
    } catch (err) {
      console.error("Activate failed:", err);
      alert("Failed to activate user");
    }
  };

  if (loading) return <div className="text-center py-5">Loading users...</div>;
  if (error) return <div className="text-center text-danger py-5">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={styles.sectionTitle}>Users Management ({users.length})</h2>
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
                <th className={styles.tableHead}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{user.id}</td>
                    <td className={styles.tableCellName}>{user.name || "N/A"}</td>
                    <td className={styles.tableCell}>{user.email || "N/A"}</td>
                    <td className={styles.tableCell}>{user.mobileNumber || "N/A"}</td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.badge} ${
                        user.isActive ? styles.badgeGreen : styles.badgeRed
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {user.isActive ? (
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => deactivate(user.id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button 
                          className="btn btn-success btn-sm" 
                          onClick={() => activate(user.id)}
                        >
                          Activate
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

export default UsersContent;
