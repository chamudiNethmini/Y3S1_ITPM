import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Profile.css";

function Profile() {

  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
    } catch (error) {
      alert("Failed to load profile");
    }
  };

  useEffect(() => {
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

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <h2>My Profile</h2>

        <div className="profile-group">
          <label>Email</label>
          <input value={user.email || ""} disabled />
        </div>

        <h3>Change Password</h3>

        <div className="profile-group">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="profile-group">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button className="profile-btn" onClick={handleChangePassword}>
          Update Password
        </button>

      </div>
    </div>
  );
}

export default Profile;