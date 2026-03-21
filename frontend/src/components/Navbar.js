import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        {/* LEFT */}
        <div className="logo" onClick={() => navigate("/")}>
          UniMate
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          {/* MENU BUTTON */}
          <button
            className="menu-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            ⋮
          </button>

          {/* DROPDOWN */}
          {showDropdown && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/ticket");
                  setShowDropdown(false);
                }}
              >
                🎫 Raise Ticket
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/tickets");
                  setShowDropdown(false);
                }}
              >
                📋 View Tickets
              </button>
            </div>
          )}

          {/* PROFILE BUTTON */}
          <button className="profile-btn" onClick={() => setShowProfile(true)}>
            👤
          </button>

          {/* LOGOUT BUTTON */}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      {/* CLOSE DROPDOWN OVERLAY */}
      {showDropdown && (
        <div className="dropdown-overlay" onClick={() => setShowDropdown(false)} />
      )}
    </>
  );
}

export default Navbar;