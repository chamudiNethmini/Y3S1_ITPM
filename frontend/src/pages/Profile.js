import { useEffect, useState } from "react";
import API from "../services/api";


function Profile() {

  const [user, setUser] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  console.log("TOKEN:", localStorage.getItem("token"));

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
    <div style={{ padding: "30px" }}>
      <h2>My Profile</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Email</label><br />
        <input value={user.email || ""} disabled />
      </div>

      <h3>Change Password</h3>

      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleChangePassword}>
        Update Password
      </button>

    </div>
  );
}

export default Profile;