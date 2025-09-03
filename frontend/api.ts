// src/api.ts
import axios from "axios";
import { authService } from "@/service/authService";

// Create axios instance
const api = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:4000",
  withCredentials: true, // IMPORTANT: allow sending cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Add this check to avoid loop
    if (originalRequest.url === '/auth/refresh') {
      return Promise.reject(error);
    }

    // If token expired (401) and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try refreshing tokens
        await authService.refreshToken();
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → force logout
        await authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
