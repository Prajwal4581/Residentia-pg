import API from "./api";

// Booking related API calls
// Add your booking endpoints here as they're developed in the backend

export const getBookings = async () => {
  try {
    const response = await API.get("/api/owner/bookings");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await API.post("/api/owner/bookings", bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
