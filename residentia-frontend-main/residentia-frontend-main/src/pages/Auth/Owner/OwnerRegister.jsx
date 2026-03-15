import React, { useState } from "react";
import { toast } from "react-toastify";
import "./OwnerRegister.css";
import { useNavigate } from "react-router-dom";
import { registerOwner } from "../../../api/ownerApi";
import { frontLogin } from "../../../utils/frontAuth";

const OwnerRegister = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    managementCompany: "",
    address: "",
    aadharOrPan: "",
    identityDocUrl: "",
    bankAccount: "",
    ifsc: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate email on change
    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const handleLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      setEmailError("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      const result = await frontLogin(email, password, "OWNER");
      if (result.success) {
        toast.success("Login Successful");
        navigate("/owner-dashboard");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const { name, email, mobile, managementCompany, address, password, confirmPassword, city, state, pincode } = form;

    if (!email || !password || !mobile || !name || !managementCompany || !address || !confirmPassword || !city || !state || !pincode) {
      toast.error("Required fields missing");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      setEmailError("Invalid email format");
      return;
    }

    if (mobile.length < 10) {
      toast.error("Enter valid mobile number");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords mismatch");
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        managementCompany: form.managementCompany,
        address: form.address,
        aadharOrPan: form.aadharOrPan,
        identityDocUrl: form.identityDocUrl,
        bankAccount: form.bankAccount,
        ifsc: form.ifsc,
        password: form.password,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };

      await registerOwner(registrationData);
      toast.success("PG-Owner registered successfully! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-register-page">
      <div className="register-card">
        <button className="btn btn-link p-0 mb-3"
          style={{ textDecoration: "none", fontWeight: 500 }}
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <h3 className="text-center mb-4">
          🏠 {isLogin ? "Owner Login" : "Register, Join Residentia family!!"}
        </h3>

        {/* Toggle Buttons */}
        <div className="d-flex gap-2 mb-4">
          <button
            className={`btn w-50 ${!isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
          <button
            className={`btn w-50 ${isLogin ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <>
            <div className="mb-3">
              <input
                name="email"
                type="email"
                placeholder="Email"
                className={`form-control ${emailError && form.email ? 'is-invalid' : ''}`}
                onChange={handleChange}
                value={form.email}
              />
              {emailError && form.email && (
                <div className="invalid-feedback d-block">{emailError}</div>
              )}
            </div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="form-control mb-4"
              onChange={handleChange}
              value={form.password}
            />
            <button className="btn btn-primary w-100" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login as Owner"}
            </button>
          </>
        ) : (
          <>
            {/* Register Form */}

        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              name="name"
              placeholder="Full Name"
              className="form-control"
              onChange={handleChange}
              value={form.name}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className={`form-control ${emailError && form.email ? 'is-invalid' : ''}`}
              onChange={handleChange}
              value={form.email}
            />
            {emailError && form.email && (
              <div className="invalid-feedback d-block">{emailError}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="mobile"
              placeholder="Mobile Number"
              className="form-control"
              onChange={handleChange}
              value={form.mobile}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="managementCompany"
              placeholder="Management / Business Name"
              className="form-control"
              onChange={handleChange}
              value={form.managementCompany}
            />
          </div>

          <div className="col-12 mb-3">
            <textarea
              name="address"
              placeholder="Address"
              className="form-control"
              rows="2"
              onChange={handleChange}
              value={form.address}
            />
          </div>

          <div className="col-md-4 mb-3">
            <input
              name="city"
              placeholder="City"
              className="form-control"
              onChange={handleChange}
              value={form.city}
            />
          </div>

          <div className="col-md-4 mb-3">
            <input
              name="state"
              placeholder="State"
              className="form-control"
              onChange={handleChange}
              value={form.state}
            />
          </div>

          <div className="col-md-4 mb-3">
            <input
              name="pincode"
              placeholder="Pincode"
              className="form-control"
              onChange={handleChange}
              value={form.pincode}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="aadharOrPan"
              placeholder="Aadhaar / PAN Number"
              className="form-control"
              onChange={handleChange}
              value={form.aadharOrPan}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="identityDocUrl"
              placeholder="PAN Card Number"
              className="form-control"
              onChange={handleChange}
              value={form.identityDocUrl}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="bankAccount"
              placeholder="Bank Account Number"
              className="form-control"
              onChange={handleChange}
              value={form.bankAccount}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="ifsc"
              placeholder="IFSC Code"
              className="form-control"
              onChange={handleChange}
              value={form.ifsc}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="form-control"
              onChange={handleChange}
              value={form.password}
            />
          </div>

          <div className="col-md-6 mb-4">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              onChange={handleChange}
              value={form.confirmPassword}
            />
          </div>
        </div>
        <button className="btn btn-primary w-100" onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register as Owner"}
        </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerRegister;
