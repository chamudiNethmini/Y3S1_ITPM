import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/Login.css"; 

function LecturerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Auto redirect if already logged in
  

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await loginUser(email, password);

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);

      if (res.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.role === "coordinator") {
        navigate("/coordinator-dashboard");
      } else if (res.role === "lic") {
        navigate("/lecturer-dashboard");
      }

    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Lecturer Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default LecturerLogin;