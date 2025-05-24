import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await refreshTokenCall(refreshToken);
          const newToken = response.data.access;
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const login = (email, password) => {
  return api.post("/login/", { email, password });
};

export const refreshTokenCall = (refresh) => {
  return api.post("/refresh/", { refresh });
};

export const logout = (access_token, refresh_token) => {
  return api.post("/logout/", { access_token, refresh_token });
};

export const getCustomers = (params = {}) => {
  return api.get("/customers/", { params });
};

export const createCustomer = (customerData) => {
  return api.post("/customers/", customerData);
};

export const updateCustomer = (id, customerData) => {
  return api.put(`/customers/${id}/`, customerData);
};

export const deleteCustomer = (id) => {
  return api.delete(`/customers/${id}/`);
};

export const getCustomer = (id) => {
  return api.get(`/customers/${id}/`);
};

export default api;
