import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCustomers, createCustomer } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "male",
    phone: "",
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      setError("Failed to load customers");
      console.error("Customers error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setError("");

    try {
      await createCustomer(formData);
      setFormData({
        first_name: "",
        last_name: "",
        age: "",
        gender: "male",
        phone: "",
      });
      setShowAddForm(false);
      await fetchCustomers(); // Refresh the list
    } catch (error) {
      setError("Failed to add customer");
      console.error("Add customer error:", error);
    } finally {
      setAddLoading(false);
    }
  };

  const getGenderIcon = (gender) => {
    return gender === "male" ? "👨" : "👩";
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <div>Loading customers...</div>
      </div>
    );
  }

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
        <h1>Customers</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
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

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#fee",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showAddForm ? "Cancel" : "Add New Customer"}
        </button>
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <div
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3>Add New Customer</h3>
          <form
            onSubmit={handleAddCustomer}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                First Name:
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Last Name:
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Age:
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="1"
                max="120"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Gender:
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                Phone:
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ gridColumn: "span 2", display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                disabled={addLoading}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: addLoading ? "#ccc" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: addLoading ? "not-allowed" : "pointer",
                }}
              >
                {addLoading ? "Adding..." : "Add Customer"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customers Table */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Full Name
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Age
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Gender
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Phone
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td
                    style={{ padding: "1rem", borderBottom: "1px solid #eee" }}
                  >
                    {customer.id}
                  </td>
                  <td
                    style={{ padding: "1rem", borderBottom: "1px solid #eee" }}
                  >
                    {customer.full_name}
                  </td>
                  <td
                    style={{ padding: "1rem", borderBottom: "1px solid #eee" }}
                  >
                    {customer.age}
                  </td>
                  <td
                    style={{ padding: "1rem", borderBottom: "1px solid #eee" }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {getGenderIcon(customer.gender)}
                      {customer.gender.charAt(0).toUpperCase() +
                        customer.gender.slice(1)}
                    </span>
                  </td>
                  <td
                    style={{ padding: "1rem", borderBottom: "1px solid #eee" }}
                  >
                    {customer.phone}
                  </td>
                  <td
                    style={{ padding: "1rem", borderBottom: "1px solid #eee" }}
                  >
                    <button
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "0.5rem",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#6c757d",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
