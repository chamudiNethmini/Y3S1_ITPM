import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// Login Pages
import AdminLogin from "./pages/AdminLogin";
import CoordinatorLogin from "./pages/CoordinatorLogin";
import LecturerLogin from "./pages/LecturerLogin";

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";

// Ticket Page
import Ticket from "./pages/Ticket";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";


// ===========================
// HOME PAGE
// ===========================
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
          <button onClick={() => navigate("/admin")}>
            Admin Login
          </button>

          <button onClick={() => navigate("/coordinator")}>
            Coordinator Login
          </button>

          <button onClick={() => navigate("/lecturer")}>
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


// ===========================
// MAIN APP
// ===========================
function App() {
  return (
    <Router>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Login Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/coordinator" element={<CoordinatorLogin />} />
        <Route path="/lecturer" element={<LecturerLogin />} />

        {/* Protected Dashboards */}
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

        {/* ✅ TICKETS PAGE (ADMIN ONLY) */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRole="admin">
              <Ticket />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;