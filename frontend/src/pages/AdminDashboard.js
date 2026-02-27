import { useState, useEffect } from "react";
import API from "../services/api";

function AdminDashboard() {

  // ===========================
  // STATES
  // ===========================

  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lecturer");

  // ===========================
  // FETCH USERS
  // ===========================

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/all-users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // CREATE USER
  // ===========================

  const handleCreateUser = async () => {
  try {
    console.log("Sending role:", role);

    await API.post("/auth/create-user", {
      name,
      email,
      password,
      role,
    });

    fetchUsers();
  } catch (error) {
    console.log("FULL ERROR:", error.response?.data);
    alert(error.response?.data?.message || "Error creating user");
  }
};

  // ===========================
  // DELETE USER
  // ===========================

  const handleDelete = async (id) => {
    try {
      await API.delete(`/auth/delete-user/${id}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  // ===========================
  // TOGGLE STATUS
  // ===========================

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "active" ? "suspended" : "active";

      await API.put(`/auth/update-status/${id}`, {
        status: newStatus,
      });

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // LOAD ON START
  // ===========================

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      {/* ===========================
          CREATE USER FORM
      ============================ */}

      <div style={{ marginBottom: "30px" }}>
        <h3>Create New User</h3>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

    <select value={role} onChange={(e) => setRole(e.target.value)}>
  <option value="lecturer">LIC</option>
  <option value="coordinator">Coordinator</option>
  <option value="admin">Admin</option>
</select>

        <button onClick={handleCreateUser}>
          Create
        </button>
      </div>

      {/* ===========================
          USER TABLE
      ============================ */}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>

                {/* Suspend / Activate */}
                <button
                  onClick={() =>
                    handleStatusChange(user._id, user.status)
                  }
                >
                  {user.status === "active"
                    ? "Suspend"
                    : "Activate"}
                </button>

                {/* Delete (No Admin Delete) */}
                {user.role !== "admin" && (
                  <button
                    style={{ marginLeft: "10px", color: "red" }}
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;