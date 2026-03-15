import axios from "axios";

const API = axios.create({
  baseURL: "http://65.2.166.221:8888", // Backend running on port 8888
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add auth token
API.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("pg_auth"));
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pg_auth");
      // Could trigger a redirect to login here if needed
    }
    return Promise.reject(error);
  }
);

export default API;
