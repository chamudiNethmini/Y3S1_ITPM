import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  
  // STATES
  

  // ===========================
  // STATES
  // ===========================
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lic");

  
  // store reply text per ticket
  const [replyTexts, setReplyTexts] = useState({});

  const navigate = useNavigate();

  // ===========================
  // FETCH USERS
  

  <button onClick={() => navigate("/tickets")}>
  Go to Ticket Dashboard
</button>

  // ===========================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/all-users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  
  // FETCH AUDIT LOGS
  

  // ===========================
  const fetchAuditLogs = async () => {
    try {
      const res = await API.get("/auth/audit-logs");
      setAuditLogs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  
  // ===========================
  // FETCH TICKETS
  // ===========================
  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets/all");
      setTickets(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // CREATE USER
  

  // ===========================
  const handleCreateUser = async () => {
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

  
  // DELETE USER
  

  // ===========================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/auth/delete-user/${id}`);
      fetchUsers();
      fetchAuditLogs();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  

  
  // ===========================
  // TOGGLE STATUS
  

  // TOGGLE USER STATUS
  // ===========================
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

  // ===========================
  // HANDLE TICKET REPLY INPUT
  // ===========================
  const handleReplyChange = (ticketId, value) => {
    setReplyTexts({
      ...replyTexts,
      [ticketId]: value,
    });
  };

  // ===========================
  // REPLY TO TICKET
  // ===========================
  const handleReply = async (id) => {
    try {
      await API.put(`/tickets/reply/${id}`, {
        reply: replyTexts[id],
      });

      setReplyTexts({
        ...replyTexts,
        [id]: "",
      });

      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  };

  
  // LOAD ON START
  

  // ===========================
  // INITIAL LOAD
  // ===========================
  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
    fetchTickets();
  }, []);

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>

      {/* ===========================
          NAVIGATE TO TICKET DASHBOARD
      ============================ */}
      <button
        onClick={() => navigate("/tickets")}
        style={{ marginBottom: "20px", padding: "8px 12px", cursor: "pointer" }}
      >
        Go to Ticket Dashboard
      </button>

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
          <option value="lic">LIC</option>
          <option value="coordinator">Academic Coordinator</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleCreateUser}>Create</button>
      </div>

      {/* ===========================
          USER TABLE
      ============================ */}
      <h3>Users</h3>
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
                <button onClick={() => handleStatusChange(user._id, user.status)}>
                  {user.status === "active" ? "Suspend" : "Activate"}
                </button>

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

      {/* ===========================
          AUDIT LOG TABLE
      ============================ */}
      <h3 style={{ marginTop: "40px" }}>Audit Logs</h3>
      <table border="1" cellPadding="10">
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
              <td>{log.performedBy ? `${log.performedBy.name} (${log.performedBy.email})` : "N/A"}</td>
              <td>{log.targetUser ? `${log.targetUser.name} (${log.targetUser.email})` : "N/A"}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===========================
          TICKETS TABLE
      ============================ */}
      <h3 style={{ marginTop: "40px" }}>Tickets</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Sender</th>
            <th>Status</th>
            <th>Reply</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.ticketId}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.message}</td>
              <td>{ticket.sender?.name}</td>
              <td>{ticket.status}</td>
              <td>{ticket.reply}</td>
              <td>
                {ticket.status === "pending" && (
                  <>
                    <input
                      type="text"
                      placeholder="Reply"
                      value={replyTexts[ticket._id] || ""}
                      onChange={(e) => handleReplyChange(ticket._id, e.target.value)}
                    />
                    <button onClick={() => handleReply(ticket._id)} style={{ marginLeft: "5px" }}>
                      Reply
                    </button>
                  </>
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