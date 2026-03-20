import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      <div className="navbar">

        {/* LEFT */}
        <div className="logo">
          UniMate
        </div>

        {/* RIGHT */}
        <div className="nav-right">

          <button
            className="profile-btn"
            onClick={() => setShowProfile(true)}
          >
            👤 Profile
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </div>

      {/* 🔥 PROFILE MODAL */}
      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}

export default Navbar;