import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import ProfileModal from "./ProfileModal";

function Navbar() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const storedUserRaw =
    localStorage.getItem("user") || localStorage.getItem("userInfo");

  let storedUser = null;

  try {
    storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  } catch (error) {
    storedUser = null;
  }

  const fallbackRole = localStorage.getItem("role");

  const user = {
    name: storedUser?.name || "User",
    email: storedUser?.email || "No email",
    role: storedUser?.role || fallbackRole || "user",
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const getRoleLabel = (role) => {
    if (role === "admin") return "Administrator";
    if (role === "coordinator") return "Coordinator";
    if (role === "lic") return "Lecturer";
    return "User";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleProfile = () => {
    setMenuOpen(false);
    setShowProfile(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="top-navbar">
        <div className="top-navbar__left">
          <div className="brand-badge">U</div>
          <div className="brand-text">
            <h2>Unimate Dashboard</h2>
            <p>Campus management system</p>
          </div>
        </div>

        <div className="top-navbar__right" ref={dropdownRef}>
          <div className="admin-meta">
            <span className="admin-name">{user.name}</span>
            <span className="admin-role">{getRoleLabel(user.role)}</span>
          </div>

          <button
            className="profile-trigger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="profile-avatar">{getInitials(user.name)}</div>
          </button>

          {menuOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <div className="dropdown-avatar">{getInitials(user.name)}</div>
                <div>
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>

              <button className="dropdown-item" onClick={handleProfile}>
                Profile
              </button>

              <button className="dropdown-item logout-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}

export default Navbar;