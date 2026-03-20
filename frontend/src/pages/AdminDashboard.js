import { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/AdminDashboard.css";
import Navbar from "../components/Navbar";

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lic");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 NEW STATE (FILTER)
  const [filterRole, setFilterRole] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/all-users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await API.get("/auth/audit-logs");
      setAuditLogs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateUser = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Invalid email format");
      return;
    }

    try {
      await API.post("/auth/create-user", {
        name,
        email,
        password,
        role,
      });

      setName("");
      setEmail("");
      setPassword("");
      setRole("lic");

      fetchUsers();
      fetchAuditLogs();

    } catch (error) {
      alert(error.response?.data?.message || "Error creating user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/auth/delete-user/${id}`);
      fetchUsers();
      fetchAuditLogs();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      await API.put(`/auth/update-status/${id}`, { status: newStatus });
      fetchUsers();
      fetchAuditLogs();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredUsers = users.filter((user) => {
  const matchesRole =
    filterRole === "all" || user.role === filterRole;

  const search = searchTerm.toLowerCase();

  const matchesSearch =
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search) ||
    user.role.toLowerCase().includes(search);

  return matchesRole && matchesSearch;
});

  return (
    <>
      <Navbar />

      <div className="admin-page">

        <div className="admin-hero">
          <h1>Admin Dashboard</h1>
          <p>Manage users, roles and system access.</p>
        </div>

        {/* CREATE USER */}
        <div className="admin-card">
          <h3>Create New User</h3>

          <div className="form-grid">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="lic">LIC</option>
              <option value="coordinator">Coordinator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="primary-btn" onClick={handleCreateUser}>
            Create User
          </button>
        </div>

        {/* USERS TABLE */}
        <div className="admin-card">
          
         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
  
  {/* 🔍 SEARCH */}
  <input
    type="text"
    placeholder="Search by name, email or role..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      width: "250px"
    }}
  />

  {/* 🔽 FILTER */}
  <select
    value={filterRole}
    onChange={(e) => setFilterRole(e.target.value)}
    style={{ padding: "8px", borderRadius: "8px" }}
  >
    <option value="all">All</option>
    <option value="admin">Admin</option>
    <option value="lic">LIC</option>
    <option value="coordinator">Coordinator</option>
  </select>

</div>

          <table className="admin-table">
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
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>

                  <td>
                    <span className={`status ${user.status}`}>
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="warning-btn"
                      onClick={() =>
                        handleStatusChange(user._id, user.status)
                      }
                    >
                      {user.status === "active" ? "Suspend" : "Activate"}
                    </button>

                    {user.role !== "admin" && (
                      <button
                        className="danger-btn"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* AUDIT LOGS */}
        <div className="admin-card">
          <h3>Audit Logs</h3>

          <div className="audit-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Performed By</th>
                  <th>Target User</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.action}</td>
                    <td>{log.performedBy ? log.performedBy.name : "N/A"}</td>
                    <td>{log.targetUser ? log.targetUser.name : "N/A"}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}

export default AdminDashboard;