import API from "../api/api";


/**
 * Login function supporting API integration + temp credentials fallback
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - OWNER | ADMIN | CLIENT
 */
export async function frontLogin(email, password, role) {
  if (!email || !password) {
    return { success: false, message: "Email & password required" };
  }

  try {
    // Try API login first
    const res = await API.post("/api/auth/login", {
      email,
      password,
      role,
    });

    if (res.data.token) {
      const authData = {
        email: res.data.email,
        role,
        isLoggedIn: true,
        token: res.data.token,
        user: {
          id: res.data.userId || res.data.ownerId || res.data.adminId,
          name: res.data.name,
          email: res.data.email
        },
      };
      localStorage.setItem("pg_auth", JSON.stringify(authData));
      return { success: true, role, data: res.data };
    }
    return { success: false, message: res.data.message || "Login failed" };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred during login"
    };
  }
}

/**
 * Register client helper
 * Expects { email, name, mobileNumber, password }
 */
export async function frontRegisterClient({ email, name, mobileNumber, password }) {
  if (!email || !password || !mobileNumber) {
    return { success: false, message: "email, password and mobileNumber are required" };
  }

  try {
    const res = await API.post("/api/auth/register/client", {
      email,
      name,
      mobileNumber,
      password,
    });

    if (res.data && res.data.token) {
      const authData = {
        email: res.data.email,
        role: "CLIENT",
        isLoggedIn: true,
        token: res.data.token,
        user: {
          id: res.data.userId,
          name: res.data.name,
          email: res.data.email
        },
      };
      localStorage.setItem("pg_auth", JSON.stringify(authData));
      return { success: true, data: res.data };
    }

    return { success: false, message: res.data || "Registration failed" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: error.response?.data || error.message };
  }
}

/**
 * Get authenticated user from localStorage
 */
export function getAuthUser() {
  const data = localStorage.getItem("pg_auth");
  return data ? JSON.parse(data) : null;
}

/**
 * Clear auth data and logout user
 */
export function logout() {
  localStorage.removeItem("pg_auth");
  localStorage.removeItem("ownerEmail");
  localStorage.removeItem("ownerToken");
  localStorage.removeItem("ownerId");
}