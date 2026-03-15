import axios from "axios";

const API = axios.create({

  baseURL: "http://13.235.51.122",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("pg_auth") || "{}");
  if (auth && auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const raw = localStorage.getItem("pg_auth");
        if (!raw) throw new Error("No refresh token");

        const authData = JSON.parse(raw);

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          { refreshToken: authData.refreshToken }
        );

        const { token } = response.data;
        localStorage.setItem(
          "pg_auth",
          JSON.stringify({ ...authData, token })
        );

        processQueue(null, token);
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("pg_auth");
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
