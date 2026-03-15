import { Navigate } from "react-router-dom";
import { getAuthUser } from "../utils/frontAuth";

/**
 * ProtectedRoute - Prevents unauthorized access to pages
 * @param {ReactNode} children - Page content
 * @param {string} role - Required role (OWNER, ADMIN, CLIENT)
 */
export default function ProtectedRoute({ children, role }) {
  const auth = getAuthUser();

  // Not logged in
  if (!auth || !auth.isLoggedIn) {
    // Redirect to role-specific login page
    if (role === "ADMIN") {
      return <Navigate to="/admin-login" replace />;
    } else if (role === "OWNER") {
      return <Navigate to="/owner-login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Wrong role trying to access
  if (role && auth.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}