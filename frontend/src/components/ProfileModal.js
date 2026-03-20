import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/ProfileModal.css";

function ProfileModal({ onClose }) {

  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
      } catch (error) {
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      alert("Password updated");
      setOldPassword("");
      setNewPassword("");
      onClose();

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <button className="close-btn" onClick={onClose}>❌</button>
                 <>br</>
        <h2>My Profile</h2>

        <label>Email</label>
        <input value={user.email || ""} disabled />

        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button onClick={handleChangePassword}>
          Update Password
        </button>

      </div>
    </div>
  );
}

export default ProfileModal;