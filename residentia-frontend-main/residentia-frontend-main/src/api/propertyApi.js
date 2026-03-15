import API from "./api";

// Get all properties (public - no auth required)
export const getAllProperties = async () => {
  try {
    const response = await API.get("/api/client/properties");
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error.response?.data || error.message;
  }
};

// Get all properties of logged owner
export const getOwnerProperties = async () => {
  try {
    const response = await API.get("/api/owner/pgs");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single property by ID
export const getPropertyById = async (id) => {
  try {
    const response = await API.get(`/api/owner/pgs/${id}`);

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new property
export const createProperty = async (propertyData) => {
  try {
    const response = await API.post("/api/owner/pgs", propertyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update a property
export const updateProperty = async (id, propertyData) => {
  try {
    const response = await API.put(`/api/owner/pgs/${id}`, propertyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a property
export const deleteProperty = async (id) => {
  try {
    const response = await API.delete(`/api/owner/pgs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getAllProperties,
  getOwnerProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
