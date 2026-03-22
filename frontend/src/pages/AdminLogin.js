import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/Login.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleLogin = async () => {
  setLoading(true);
  setErrorMsg("");

  try {
    const res = await loginUser(email, password);

    localStorage.setItem("token", res.token);
    localStorage.setItem("role", res.role);
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: res.name,
        email: res.email,
        role: res.role,
        id: res.id,
      })
    );

    if (res.role === "admin") {
      navigate("/admin-dashboard");
    } else if (res.role === "coordinator") {
      navigate("/coordinator-dashboard");
    } else if (res.role === "lic" || res.role === "lecturer") {
      navigate("/lecturer-dashboard");
    } else {
      setErrorMsg("Unknown user role");
    }
  } catch (error) {
    setErrorMsg(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-left">
          <span className="login-badge">Unimate Access Portal</span>
          <h1>Admin Login</h1>
          <p>
            Sign in to manage users, system operations, schedules, and
            administrative tasks securely.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-card">
              <h4>Manage System</h4>
              <p>Control resources, users, and scheduling workflows.</p>
            </div>
            <div className="login-feature-card">
              <h4>Track Activities</h4>
              <p>Monitor requests, updates, and key actions in one place.</p>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-top">
            <h2>Welcome Back</h2>
            <p>Login with your admin credentials</p>
          </div>

          <div className="login-form">
            <div className="login-form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && <p className="error-text">{errorMsg}</p>}

            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login as Admin"}
            </button>

            <p className="login-footer-text">
              Back to <Link to="/">Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;