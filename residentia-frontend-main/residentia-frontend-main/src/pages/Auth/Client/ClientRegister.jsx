import React,{useState} from"react";
import{toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import { frontRegisterClient, frontLogin } from "../../../utils/frontAuth";
import "./ClientRegister.css";

const ClientRegister=()=>{
    const [isLogin, setIsLogin] = useState(false);
    const[form,setForm]  =useState({
        name:"",
        email:"",
        mobile:"",
        dob:"",
        gender:"",
        occupation:"",
        address:"",
        password:"",
        confirmPassword:"",
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e) =>{
        const { name, value } = e.target;
        setForm({...form, [name]: value});
        
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
            const result = await frontLogin(email, password, "CLIENT");
            if (result.success) {
                toast.success("Login Successful");
                navigate("/client");
            } else {
                toast.error(result.message || "Login failed");
            }
        } catch (error) {
            toast.error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () =>{
        const{name,email,mobile,dob,gender,occupation,address,password,confirmPassword} = form;

        if(!name || !email || !mobile || !dob ||!gender ||!occupation ||!address || !password ||!confirmPassword){
            toast.error("All fields are required");
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

        if(password != confirmPassword)
        {
            toast.error("password mismatch");
            return;
        }

        setLoading(true);
        try {
            const res = await frontRegisterClient({
                email,
                name,
                mobileNumber: mobile,
                password
            });

            if (res.success) {
                toast.success("Client registered Successfully!!!");
                navigate("/");
            } else {
                const message = res.message?.message || res.message || "Registration failed";
                toast.error(message);
            }
        } catch (err) {
            console.error("Register error", err);
            toast.error("An error occurred during registration");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="register-page">
            <div className="register-card">
                <button className="btn btn-link p-0 mb-3"
                    style={{ textDecoration: "none", fontWeight: 500 }}
                    onClick={() => navigate("/")}
                >
                ← Back
                </button>
                <h3 className="text-center mb-4">
                    🏠 {isLogin ? "Client Login" : "Register, Join Residentia family!!"}
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
                        />
                        <button className="btn btn-primary w-100" onClick={handleLogin} disabled={loading}>
                            {loading ? "Logging in..." : "Login as Client"}
                        </button>
                    </>
                ) : (
                    <>
                        {/* Register Form */}

                <input
                    name="name"
                    placeholder="Full Name"
                    className="form-control mb-3"
                    onChange={handleChange}
                    value={form.name}
                />

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
                    name="mobile"
                    placeholder="Mobile Number"
                    className="form-control mb-3"
                    onChange={handleChange}
                    value={form.mobile}
                />

                <input
                    name="dob"
                    type="date"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <select
                    name="gender"
                    className="form-control mb-3"
                    onChange={handleChange}
                >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                </select>

                <input
                    name="occupation"
                    placeholder="Occupation"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <textarea
                    name="address"
                    placeholder="Address"
                    className="form-control mb-3"
                    rows="3"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="form-control mb-3"
                    onChange={handleChange}
                />

                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="form-control mb-4"
                    onChange={handleChange}
                />
                <button className="btn btn-primary w-100" onClick={handleRegister} disabled={loading}>
                    {loading ? "Registering..." : "Register as Client"}
                </button>
                    </>
                )}
        </div>
    </div>
    );
};

export default ClientRegister;