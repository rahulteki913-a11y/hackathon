import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBriefcase
} from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "freelancer"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === formData.email.trim().toLowerCase()
    );

    if (emailExists) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully! Please login.");

    navigate("/login");
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-brand">
          <Link to="/" className="brand-logo">
            Freelancer<span>Hub</span>
          </Link>

          <p>Your next opportunity starts here.</p>
        </div>

        <div className="auth-card">

          <div className="auth-icon">
            <FaBriefcase />
          </div>

          <h2>Create Account</h2>

          <p className="auth-subtitle">
            Join our growing freelancer community.
          </p>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <form onSubmit={handleSignup}>

            {/* FULL NAME */}
            <label>Full Name</label>

            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaUser />
              </span>

              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <label>Email Address</label>

            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaEnvelope />
              </span>

              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <label>Password</label>

            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaLock />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="input-group-text password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <label>Confirm Password</label>

            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaLock />
              </span>

              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* ROLE */}
            <label>Register As</label>

            <select
              name="role"
              className="form-select mb-4"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>

            <button
              type="submit"
              className="btn btn-primary w-100 auth-button"
            >
              Create My Account
            </button>

          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Signup;