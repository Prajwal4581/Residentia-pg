import React, { useEffect, useState, useRef } from "react";
import styles from "./AdminDashboard.module.css";
import API from "../../api/api";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

/* ================= VIBRANT COLORS ================= */
const COLORS = {
  active: "#6366f1",
  inactive: "#94a3b8",
  verified: "#22c55e",
  pending: "#facc15",
  rejected: "#f43f5e",
  confirmed: "#2dd4bf",
  cancelled: "#fb7185"
};

const DashboardContent = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({
  userStatus: [],
  ownerVerification: [],
  propertyStatus: [],
  bookingStatus: []
});
  const [highlight, setHighlight] = useState(null);

  const userRef = useRef(null);
  const ownerRef = useRef(null);
  const propertyRef = useRef(null);
  const bookingRef = useRef(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const focusChart = (key, ref) => {
    setHighlight(key);
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlight(null), 1300);
  };

  const loadAllData = async () => {
    try{
    const [
      dashboardRes,
      usersRes,
      ownersRes,
      pgsRes,
      bookingsRes
    ] = await Promise.all([
      API.get(`/api/admin/dashboard`),
      API.get(`/api/admin/users`),
      API.get(`/api/admin/owners`),
      API.get(`/api/admin/pgs`),
      API.get(`/api/admin/pg-bookings`)
    ]);

    setStats(dashboardRes.data);

    setChartData({
      userStatus: [
        { name: "Active", value: usersRes.data.filter(u => u.isActive).length },
        { name: "Inactive", value: usersRes.data.filter(u => !u.isActive).length }
      ],
      ownerVerification: [
        { name: "Verified", value: ownersRes.data.filter(o => o.verificationStatus === "VERIFIED").length },
        { name: "Pending", value: ownersRes.data.filter(o => o.verificationStatus === "PENDING").length },
        { name: "Rejected", value: ownersRes.data.filter(o => o.verificationStatus === "REJECTED").length }
      ],
      propertyStatus: [
        { name: "Active", value: pgsRes.data.filter(p => p.status === "ACTIVE").length },
        { name: "Pending", value: pgsRes.data.filter(p => p.status === "PENDING").length },
        { name: "Rejected", value: pgsRes.data.filter(p => p.status === "REJECTED").length }
      ],
      bookingStatus: [
        { name: "Confirmed", value: bookingsRes.data.filter(b => b.status === "CONFIRMED").length },
        { name: "Pending", value: bookingsRes.data.filter(b => b.status === "PENDING").length },
        { name: "Cancelled", value: bookingsRes.data.filter(b => b.status === "CANCELLED").length }
      ]
    });
  } catch (err) {
    console.error("Dashboard load failed:", err);
  }
  };

  return (
    <div>
      <h2 className={styles.sectionTitle}>Platform Analytics Dashboard</h2>

      {/* ================= STAT CARDS ================= */}
      <div className="row g-4 mb-5">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥"
          onClick={() => focusChart("users", userRef)} />
        <StatCard label="PG Owners" value={stats.totalOwners} icon="🏢"
          onClick={() => focusChart("owners", ownerRef)} />
        <StatCard label="Properties" value={stats.totalProperties} icon="🏠"
          onClick={() => focusChart("properties", propertyRef)} />
        <StatCard label="Pending Verifications" value={stats.pendingVerifications} icon="⏳"
          onClick={() => focusChart("bookings", bookingRef)} />
      </div>

      {/* ================= USER STATUS ================= */}
      <ChartCard ref={userRef} highlight={highlight === "users"} title="User Status">
        <ResponsiveContainer height={300}>
          <PieChart>
            <defs>
              <filter id="glow">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.35" />
              </filter>
            </defs>
            <Pie data={chartData.userStatus} dataKey="value"
              innerRadius={60} outerRadius={105} paddingAngle={4} filter="url(#glow)">
              <Cell fill={COLORS.active} />
              <Cell fill={COLORS.inactive} />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ================= OWNER VERIFICATION ================= */}
      <ChartCard ref={ownerRef} highlight={highlight === "owners"} title="Owner Verification">
        <ResponsiveContainer height={300}>
          <PieChart>
            <Pie data={chartData.ownerVerification} dataKey="value"
              innerRadius={60} outerRadius={105} paddingAngle={4}>
              <Cell fill={COLORS.verified} />
              <Cell fill={COLORS.pending} />
              <Cell fill={COLORS.rejected} />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ================= PROPERTY STATUS ================= */}
      <ChartCard ref={propertyRef} highlight={highlight === "properties"} title="Property Status">
        <ResponsiveContainer height={300}>
          <BarChart data={chartData.propertyStatus} barCategoryGap={30}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} fill={COLORS.active} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ================= BOOKING STATUS ================= */}
      <ChartCard ref={bookingRef} highlight={highlight === "bookings"} title="Booking Status">
        <ResponsiveContainer height={300}>
          <BarChart data={chartData.bookingStatus} barCategoryGap={30}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[12, 12, 0, 0]}>
              <Cell fill={COLORS.confirmed} />
              <Cell fill={COLORS.pending} />
              <Cell fill={COLORS.cancelled} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const StatCard = ({ label, value, icon, onClick }) => (
  <div className="col-md-3">
    <div className={styles.statCard} onClick={onClick}>
      <div style={{ fontSize: 30 }}>{icon}</div>
      <h3>{value ?? 0}</h3>
      <p>{label}</p>
    </div>
  </div>
);

const ChartCard = React.forwardRef(({ title, children, highlight }, ref) => (
  <div ref={ref} className={`${styles.chartCard} ${highlight ? styles.focus : ""}`}>
    <h4>{title}</h4>
    {children}
  </div>
));

export default DashboardContent;
