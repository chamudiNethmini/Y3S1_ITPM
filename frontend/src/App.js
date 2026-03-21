import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import CoordinatorLogin from "./pages/CoordinatorLogin";
import LecturerLogin from "./pages/LecturerLogin";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import Ticket from "./pages/Ticket";
import Profile from "./pages/Profile";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="topbar">
        <div className="brand-section">
          <div className="brand-logo">U</div>
          <h2 className="brand-name">Unimate</h2>
        </div>

        <div className="topbar-actions">
          <button className="nav-btn" onClick={() => navigate("/admin")}>
            Admin
          </button>
          <button className="nav-btn" onClick={() => navigate("/coordinator")}>
            Coordinator
          </button>
          <button className="nav-btn" onClick={() => navigate("/lecturer")}>
            Lecturer
          </button>
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-left">
          <span className="hero-badge">Smart Academic Scheduling</span>
          <h1 className="hero-title">Smart Timetable Management System</h1>
          <p className="hero-text">
            Efficiently manage academic schedules without clashes. Designed for
            Admins, Coordinators, and Lecturers with a clean and organized
            workflow.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/admin")}>
              Admin Login
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/coordinator")}
            >
              Coordinator Login
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/lecturer")}
            >
              Lecturer Login
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card main-card">
            <h3>Why Unimate?</h3>
            <ul>
              <li>Prevent timetable clashes</li>
              <li>Manage modules, lecturers, halls, and batches</li>
              <li>Easy access for Admins, Coordinators, and Lecturers</li>
              <li>Simple and professional dashboard experience</li>
            </ul>
          </div>

          <div className="mini-card-grid">
            <div className="hero-card mini-card">
              <h4>Admin</h4>
              <p>Full system control and management.</p>
            </div>

            <div className="hero-card mini-card">
              <h4>Coordinator</h4>
              <p>Manage resources, tickets, and scheduling.</p>
            </div>

            <div className="hero-card mini-card">
              <h4>Lecturer</h4>
              <p>View timetable and respond to academic tasks.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 Unimate | University Timetable Solution</p>
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
        <Route path="/ticket" element={<Ticket />} /> {/* ✅ MUST HAVE */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coordinator-dashboard"
          element={
            <ProtectedRoute allowedRole="coordinator">
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lecturer-dashboard"
          element={
            <ProtectedRoute allowedRole="lic">
              <LecturerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;