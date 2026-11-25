import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBriefcase } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) =>
        u.email === formData.email &&
        u.password === formData.password &&
        u.role === formData.role
    );

    // Demo admin account
    const isAdmin =
      formData.role === "admin" &&
      formData.email === "admin@freelancerhub.com" &&
      formData.password === "admin123";

    if (isAdmin) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: "Administrator",
          email: formData.email,
          role: "admin"
        })
      );
      navigate("/admin-dashboard");
      return;
    }

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));

      if (user.role === "client") {
        navigate("/client-dashboard");
      } else {
        navigate("/freelancer-dashboard");
      }
    } else {
      setError("Invalid email, password, or account type.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">
          <Link to="/" className="brand-logo">
            Freelancer<span>Hub</span>
          </Link>
          <p>Welcome back! Let's get you working.</p>
        </div>

        <div className="auth-card">
          <div className="auth-icon">
            <FaBriefcase />
          </div>

          <h2>Welcome Back!</h2>
          <p className="auth-subtitle">
            Login to access your FreelancerHub account.
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>

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

            <label>Password</label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                placeholder="Enter your password"
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

            <label>Login As</label>
            <select
              name="role"
              className="form-select mb-4"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className="btn btn-primary w-100 auth-button">
              Login to Account
            </button>

          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Create Account</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;