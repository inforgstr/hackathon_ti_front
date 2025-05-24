import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as authService from "../services/AuthService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        const decoded = jwtDecode(storedToken);
        setUser({ id: decoded.user_id, email: decoded.email });
      } else if (refreshToken) {
        // Try to refresh the token
        try {
          const response = await authService.refreshTokenCall(refreshToken);
          const newToken = response.data.access_token;
          setToken(newToken);
          localStorage.setItem("token", newToken);
          const decoded = jwtDecode(newToken);
          setUser({ id: decoded.user_id, email: decoded.email });
        } catch (error) {
          // Refresh failed, clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const timeUntilExpiry = decoded.exp * 1000 - Date.now();
    const refreshTime = timeUntilExpiry - 60000; // Refresh 1 minute before expiry

    if (refreshTime > 0) {
      const timeoutId = setTimeout(async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const response = await authService.refreshTokenCall(refreshToken);
            const newToken = response.data.access_token;
            setToken(newToken);
            localStorage.setItem("token", newToken);
          } catch (error) {
            logout();
          }
        }
      }, refreshTime);

      return () => clearTimeout(timeoutId);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { access, refresh } = response.data;

      setToken(access);
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);

      // Decode token to get user info
      const decoded = jwtDecode(access);
      setUser({ id: decoded.user_id, email: decoded.email });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Login failed",
      };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (token && refreshToken) {
        await authService.logout(token, refreshToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
