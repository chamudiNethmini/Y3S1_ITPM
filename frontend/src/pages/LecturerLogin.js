import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function LecturerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);

      // ✅ Save token & role
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);

      // ✅ Role-based Redirect
      if (res.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.role === "coordinator") {
        navigate("/coordinator-dashboard");
      } else if (res.role === "lecturer") {
        navigate("/lecturer-dashboard");
      }

    } catch (error) {
      console.log("FULL ERROR OBJECT:", error);
      console.log("BACKEND RESPONSE:", error.response?.data);
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="page">
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

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LecturerLogin;