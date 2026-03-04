import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import CoordinatorLogin from "./pages/CoordinatorLogin";
import LecturerLogin from "./pages/LecturerLogin";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <nav className="navbar">
        <h2>Unimate</h2>
      </nav>

      <div className="hero">
        <h1>Smart Timetable Management System</h1>
        <p>
          Efficiently manage academic schedules without clashes.
          Designed for Admins, Coordinators and Lecturers.
        </p>

        <div className="button-group">
          <button className="primary-btn" onClick={() => navigate("/admin")}>
            Admin Login
          </button>

          <button className="secondary-btn" onClick={() => navigate("/coordinator")}>
            Coordinator Login
          </button>

          <button className="secondary-btn" onClick={() => navigate("/lecturer")}>
            Lecturer Login
          </button>
        </div>
      </div>

      <footer className="footer">
        © 2026 Unimate | University Timetable Solution
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/coordinator" element={<CoordinatorLogin />} />
        <Route path="/lecturer" element={<LecturerLogin />} />

        {/* 🔐 Protected Admin Dashboard Route */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Protected Coordinator Dashboard Route */}
        <Route
          path="/coordinator-dashboard"
          element={
            <ProtectedRoute allowedRole="coordinator">
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Protected Lecturer Dashboard Route */}
        <Route
          path="/lecturer-dashboard"
          element={
            <ProtectedRoute allowedRole="lic">
              <LecturerDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;