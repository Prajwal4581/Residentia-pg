// import React, { useEffect, useState } from "react";
// import styles from "./AdminDashboard.module.css";
// import API from "../../api/api";

// const BookingsContent = () => {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const loadBookings = async () => {
//     const res = await API.get("/api/admin/pg-bookings");
//     setBookings(res.data);
//   };

//   const cancel = async (id) => {
//     await API.put(`/api/admin/pg-bookings/${id}/cancel`);
//     setBookings(prev =>
//       prev.map(b =>
//         b.id === id ? { ...b, status: "CANCELLED" } : b
//       )
//     );
//   };

//   const restore = async (id) => {
//     await API.put(`/api/admin/pg-bookings/${id}/restore`);
//     setBookings(prev =>
//       prev.map(b =>
//         b.id === id ? { ...b, status: "CONFIRMED" } : b
//       )
//     );
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className={styles.sectionTitle}>Bookings</h2>
//       </div>

//       <div className={styles.tableWrapper}>
//         <div className="table-responsive">
//           <table className="table table-dark table-hover">
//             <thead>
//               <tr className={styles.tableHeadRow}>
//                 <th className={styles.tableHead}>Booking ID</th>
//                 <th className={styles.tableHead}>User</th>
//                 <th className={styles.tableHead}>Property</th>
//                 <th className={styles.tableHead}>Status</th>
//                 <th className={styles.tableHead}>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {bookings.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-4">
//                     No bookings found
//                   </td>
//                 </tr>
//               ) : (
//                 bookings.map(booking => (
//                   <tr key={booking.id} className={styles.tableRow}>
//                     <td className={styles.tableCell}>#{booking.id}</td>
//                     <td className={styles.tableCell}>
//                       {booking.user?.name || "N/A"}
//                     </td>
//                     <td className={styles.tableCellAlt}>
//                       {booking.pg?.propertyName || "N/A"}
//                     </td>

//                     <td className={styles.tableCell}>
//                       <span
//                         className={
//                           booking.status === "CANCELLED"
//                             ? styles.badgeRed
//                             : styles.badgeGreen
//                         }
//                       >
//                         {booking.status}
//                       </span>
//                     </td>

//                     <td className={styles.tableCell}>
//                       {booking.status === "CONFIRMED" && (
//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => cancel(booking.id)}
//                         >
//                           Cancel
//                         </button>
//                       )}
//                       {booking.status === "CANCELLED" && (
//                         <button
//                           className="btn btn-success btn-sm"
//                           onClick={() => restore(booking.id)}
//                         >
//                           Restore
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>

//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingsContent;


import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import API from "../../api/api";

const BookingsContent = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await API.get(`/api/admin/pg-bookings`);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id) => {
    try {
      const res = await API.put(`/api/admin/pg-bookings/${id}/cancel`);
      setBookings(prev =>
        prev.map(b => (b.id === id ? res.data : b))
      );
    } catch (err) {
      alert("Cancel failed");
    }
  };

  const restore = async (id) => {
    try {
      const res = await API.put(`/api/admin/pg-bookings/${id}/restore`);
      setBookings(prev =>
        prev.map(b => (b.id === id ? res.data : b))
      );
    } catch (err) {
      alert("Restore failed");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading bookings…</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  return (
    <div>
      <h2 className={styles.sectionTitle}>Bookings</h2>

      <div className={styles.tableWrapper}>
        <table className="table table-hover">
          <thead>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHead}>ID</th>
              <th className={styles.tableHead}>User</th>
              <th className={styles.tableHead}>Property</th>
              <th className={styles.tableHead}>Status</th>
          </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking.bookingId || booking.id}>
                  <td>#{booking.bookingId || booking.id}</td>
                  <td>{booking.tenantName || "N/A"}</td>
                  <td>{booking.propertyName || "N/A"}</td>

                  <td>
                    <span
                      className={
                        booking.status === "CANCELLED"
                          ? styles.badgeRed
                          : styles.badgeGreen
                      }
                    >
                      {booking.status || "UNKNOWN"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsContent;
