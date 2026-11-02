import axios from "axios";

// Central axios instance — baseURL "/api" hits the Vite dev proxy,
// which forwards every call to the Express backend on port 5000.
// In production the API lives on its own URL, so set VITE_API_URL
// (e.g. https://your-backend.onrender.com/api) in the host's env vars.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

// Attach the saved JWT (if any) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handling — token expired/invalid → force a clean logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
