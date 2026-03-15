import React, { useEffect, useState } from "react";
import styles from "./Owner.module.css";
import API from "../../api/api";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardContent = () => {
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [propertyStatusData, setPropertyStatusData] = useState([]);
  const [propertyShareData, setPropertyShareData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const propertiesRes = await API.get("/api/owner/pgs");
        const bookingsRes = await API.get("/api/owner/bookings");

        const properties = propertiesRes.data;
        const bookings = bookingsRes.data;
        const confirmed = bookings.filter(b => b.status === "CONFIRMED");
        const revenue = confirmed.reduce((sum, b) => sum + b.amount, 0);

        setStats([
          { label: "Properties", value: properties.length, color: "#38bdf8" },
          { label: "Bookings", value: bookings.length, color: "#22c55e" },
          { label: "Confirmed", value: confirmed.length, color: "#facc15" },
          { label: "Revenue", value: "₹" + revenue, color: "#a78bfa" }
        ]);

        setRecentBookings(bookings.slice(0, 5));

        // Property Status Data (ACTIVE vs INACTIVE)
        const activeCount = properties.filter(p => p.status === "ACTIVE").length;
        const inactiveCount = properties.filter(p => p.status === "INACTIVE").length;
        setPropertyStatusData([
          { x: "Active Properties", y: activeCount, text: `${activeCount}` },
          { x: "Inactive Properties", y: inactiveCount, text: `${inactiveCount}` }
        ]);

        // Property Sharing Type Data
        const sharingTypes = {};
        properties.forEach(p => {
          const type = p.sharingType || "Not Specified";
          sharingTypes[type] = (sharingTypes[type] || 0) + 1;
        });
        const sharingData = Object.entries(sharingTypes).map(([type, count]) => ({
          x: type,
          y: count,
          text: `${count}`
        }));
        setPropertyShareData(sharingData);

      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <h2 className={styles.sectionTitle}>Dashboard Overview</h2>

      <div className="row g-4 mb-5">
        {stats.map((stat, i) => (
          <div key={i} className="col-md-3">
            <div className={styles.statCard}>
              <h3 className={styles.statValue} style={{ color: stat.color }}>
                {stat.value}
              </h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Charts Section */}
      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className={styles.chartCard} style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#1F2937", fontSize: "18px", fontWeight: "600" }}>
              📊 Property Status
            </h3>
            {propertyStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="y"
                    nameKey="x"
                  >
                    <Cell fill="#16d092" />
                    <Cell fill="#eb2d2d" />
                  </Pie>
                  <Tooltip formatter={(value) => `Count: ${value}`} contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: "#9CA3AF", textAlign: "center", padding: "20px" }}>No data available</p>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className={styles.chartCard} style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#1F2937", fontSize: "18px", fontWeight: "600" }}>
              🏠 Sharing Type Distribution
            </h3>
            {propertyShareData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyShareData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="y"
                    nameKey="x"
                  >
                    <Cell fill="#3B82F6" />
                    <Cell fill="#8B5CF6" />
                    <Cell fill="#EC4899" />
                    <Cell fill="#F59E0B" />
                    <Cell fill="#06B6D4" />
                  </Pie>
                  <Tooltip formatter={(value) => `Count: ${value}`} contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: "#9CA3AF", textAlign: "center", padding: "20px" }}>No data available</p>
            )}
          </div>
        </div>
      </div>

      <h3 className={styles.subTitle}>Recent Bookings</h3>

      <div className={styles.tableWrapper}>
        <div className="table-responsive">
          <table className="table table-hover" style={{ marginBottom: 0 }}>
            <thead>
              <tr className={styles.tableHeadRow}>
                <th className={styles.tableHead}>Property</th>
                <th className={styles.tableHead}>Tenant</th>
                <th className={styles.tableHead}>Amount</th>
                <th className={styles.tableHead}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking, idx) => (
                <tr key={idx} className={styles.tableRow}>
                  <td className={styles.tableCell}>{booking.propertyName || 'N/A'}</td>
                  <td className={styles.tableCell}>{booking.tenantName}</td>
                  <td className={styles.tableCell}>{booking.amount}</td>
                  <td className={styles.tableCell}>
                    <span
                      className={`${styles.statusBadge} ${booking.status === "CONFIRMED"
                          ? styles.confirmed
                          : styles.pending
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
