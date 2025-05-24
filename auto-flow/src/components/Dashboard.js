import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "1px solid #ddd",
          paddingBottom: "1rem",
        }}
      >
        <h1>Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Welcome, {user?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3>Welcome Back!</h3>
          <p>You are successfully logged in to the Auto Flow system.</p>
          <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
            User ID: {user?.id}
          </p>
        </div>

        <div
          style={{
            padding: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3>Quick Access</h3>
          <p>Navigate to different sections of the application.</p>
          <button
            onClick={() => navigate("/customers")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Manage Customers
          </button>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>System Information</h3>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#e9ecef",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "0.9rem",
          }}
        >
          <p>
            <strong>API Base URL:</strong>{" "}
            {process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1"}
          </p>
          <p>
            <strong>Login Status:</strong> ✅ Authenticated
          </p>
          <p>
            <strong>Token Status:</strong> ✅ Valid
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
