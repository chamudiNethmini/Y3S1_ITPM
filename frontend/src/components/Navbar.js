import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      
      {/* LEFT SIDE */}
      <div style={styles.logo}>
        UniMate
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        
        <button style={styles.btn} onClick={() => navigate("/profile")}>
          👤 Profile
        </button>

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

const styles = {
  navbar: {
    width: "100%",
    height: "60px",
    background: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold"
  },
  right: {
    display: "flex",
    gap: "10px"
  },
  btn: {
    background: "white",
    color: "#2563eb",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  logout: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default Navbar;