import axios from "axios";

// Central axios instance — baseURL "/api" hits the Vite dev proxy,
// which forwards every call to the Express backend on port 5000.
const api = axios.create({ baseURL: "/api" });

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
