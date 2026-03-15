import React, { useState } from "react";
import { toast } from "react-toastify";
import "./OwnerLogin.css";
import { useNavigate } from "react-router-dom";
import { loginOwner } from "../../../api/ownerApi";

const OwnerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await loginOwner(email, password);
      console.log("Login response:", response);
      
      if (response && response.token) {
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/owner-dashboard");
        }, 1500);
      } else {
        toast.error("Login response invalid - no token received");
      }
    } catch (error) {
      console.error("Login error details:", error);
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-login-page">
      <div className="login-card">
        <button 
          className="btn btn-link p-0 mb-3"
          style={{ textDecoration: "none", fontWeight: 500 }}
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <h3 className="text-center mb-4">🏠 Owner Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            className="btn btn-primary w-100 mb-3" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted">
            Don't have an account? 
            <button 
              className="btn btn-link p-0 ms-2"
              onClick={() => navigate("/register-owner")}
              style={{ textDecoration: "none" }}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;
