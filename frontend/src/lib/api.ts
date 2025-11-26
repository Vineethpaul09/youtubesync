/// <reference types="vite/client" />
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (Zustand persist stores it here)
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth storage:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem("auth-storage");
      // Redirect to login only if not already on login/register page
      if (!window.location.pathname.match(/\/(login|register|$)/)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
