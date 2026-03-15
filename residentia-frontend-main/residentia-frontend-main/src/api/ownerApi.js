import API from "./api";

// Owner Authentication
export const registerOwner = async (ownerData) => {
  try {
    const response = await API.post("/api/owner/register", ownerData);
    if (response.data.token) {
      localStorage.setItem("ownerEmail", response.data.email);
      localStorage.setItem("ownerToken", response.data.token);
      localStorage.setItem("ownerId", response.data.ownerId);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginOwner = async (email, passwordHash) => {
  try {
    const response = await API.post("/api/owner/login", {
      email,
      passwordHash,
    });
    if (response.data && response.data.token) {
      localStorage.setItem("ownerEmail", response.data.email);
      localStorage.setItem("ownerToken", response.data.token);
      localStorage.setItem("ownerId", response.data.ownerId);
    }
    return response.data;
  } catch (error) {
    console.error("Login API error response:", error.response?.data);
    // Extract error message from different possible sources
    let errorMessage = "Login failed";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (typeof error.response?.data === 'string') {
      errorMessage = error.response.data;
    } else if (error.message) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const getOwnerProfile = async () => {
  try {
    const response = await API.get("/api/owner/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateOwnerProfile = async (profileData) => {
  try {
    const response = await API.put("/api/owner/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
