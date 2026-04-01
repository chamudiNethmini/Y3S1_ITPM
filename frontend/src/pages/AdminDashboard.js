import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketReply, setTicketReply] = useState({});
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lic");
  const [moduleCode, setModuleCode] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [moduleSearch, setModuleSearch] = useState("");

  // PUBLISH TIMETABLE STATE
  const [publishMessage, setPublishMessage] = useState("");

  // ================= MODULE CODES =================
  const moduleCodes = [
    "IE1030 - DCN",
    "IT1120 - IP",
    "IT1130 - MC",
    "IT1140 - FC",
    "IT1180 - EAC",
    "SE1012 - PM",
    "SE1032 - CS",
    "IE1014 - EM",
    "IT2120 - PS",
    "SE2030 - SE",
    "IT2011 - AIML",
    "IT2140 - DDD",
    "SE1022 - DM",
    "IE1004 - CT",
    "IE1034 - EM II",
    "IE1024 - COA",
    "IE1044 - DE",
    "SE1052 - DSA",
    "SE1042 - EAP",
    "IT1010 - IP",
    "IT1020 - ICS",
    "IT1030 - MC",
    "IT1040 - CS",
    "IE1010 - EM",
    "IE1020 - NF",
    "IT1050 - OOC",
    "IT1060 - SPM",
    "IT1080 - EAP",
    "IT1090 - ISDM",
    "IT1100 - IWT",
    "IE2012 - SNP",
    "IE2020 - RS",
    "IE2021 - OOP",
    "IE2022 - ICS",
    "IE2030 - AE",
    "IE2031 - SAD",
    "IE2032 - SOS",
    "IE2041 - ISA",
    "IE2042 - DMSS",
    "IE2050 - OS",
    "IE2071 - DMCI",
    "IE2080 - DSA",
    "IT2020 - SE",
    "IT2030 - OOP",
    "IT2040 - DMS",
    "IT2050 - CN",
    "IT2060 - OSSA",
    "IE2010 - DE",
    "IE2040 - AI",
    "IE2051 - ISP",
    "IE2052 - ANT",
    "IE2060 - CSA",
    "IE2061 - OSSA",
    "IE2062 - WS",
    "IE2070 - ES",
    "IE2072 - FA",
    "IE2081 - OOAD",
    "IE2082 - DM",
    "IE2090 - PEPIM",
    "IT2010 - MAD",
    "IT2070 - DSA",
    "IT2080 - ITP",
    "IT2090 - PS",
    "IT2100 - ESD",
    "IT2110 - PS",
    "IE2004 - CN",
    "IE2024 - PS",
    "SE2012 - OOAD",
    "SE2022 - DAA",
    "SE2032 - DMS",
    "IE3010 - NP",
    "IE3011 - ISPM",
    "IE3020 - DSNM",
    "IE3021 - OBFI",
    "IE3022 - AIA",
    "IE3030 - WAN",
    "IE3031 - MIS",
    "IE3032 - NS",
    "IE3040 - ISM",
    "IE3041 - DMBI",
    "IE3042 - SSS",
    "IE3051 - EBSAD",
    "IE3052 - ISRM",
    "IE3112 - IOT&MS",
    "IT3010 - NDM",
    "IT3011 - TPSM",
    "IT3020 - DS",
    "IT3021 - DWBI",
    "IT3030 - PAF",
    "IT3031 - DS&DDA",
    "IT3040 - ITPM",
    "IT3050 - ESDSeminar",
    "SE3010 - SEP&QM",
    "SE3011 - TEM",
    "SE3020 - DS",
    "SE3021 - DI&CC",
    "SE3030 - SA",
    "SE3040 - AF",
    "SE3061 - UED",
    "SE3081 - DMS",
    "IE3050 - WC",
    "IE3060 - BMIT",
    "IE3061 - ISM",
    "IE3062 - DOSS",
    "IE3070 - NTP",
    "IE3071 - OBFII",
    "IE3072 - ISPM",
    "IE3080 - NSE",
    "IE3081 - ERP",
    "IE3082 - Crpto",
    "IE3091 - ISSM",
    "IE3092 - ISP",
    "IE3102 - ESIS",
    "IT3041 - IRWA",
    "IT3051 - FDM",
    "IT3060 - HCI",
    "IT3061 - MDP&CC",
    "IT3070 - IAS",
    "IT3071 - MLOM",
    "IT3080 - DS&A",
    "IT3090 - BMIT",
    "IT3110 - IndustryPlacement",
    "SE3031 - 3DMA",
    "SE3041 - DVPD",
    "SE3050 - UEE",
    "SE3060 - DS",
    "SE3070 - CSSE",
    "SE3071 - DIP",
    "SE3080 - SPM",
    "SE3091 - GT",
    "IE4010 - ISM",
    "IE4011 - BPM",
    "IE4030 - VCCT",
    "IE4121 - BO",
    "IE4151 - HRIS",
    "IE4181 - ISAC",
    "IT4020 - MTIT",
    "IT4021 - IOTBDA",
    "IT4031 - VAUED",
    "IT4040 - DA",
    "IT4050 - IME",
    "IT4060 - ML",
    "IT4070 - PPW",
    "IT4090 - CC",
    "IT4100 - SQA",
    "IT4130 - IUP",
    "SE4010 - CTSE",
    "SE4031 - GD",
    "SE4051 - TDM",
    "IE4020 - ESIS",
    "IE4031 - CS",
    "IE4040 - IAA",
    "IE4050 - PDC",
    "IE4060 - RIS",
    "IE4071 - PBA",
    "IE4080 - SDN",
    "IE4081 - SCM",
    "IE4131 - HCI",
    "IE4201 - ISI&NT",
    "IT4010 - RP",
    "IT4011 - DASS",
    "IT4030 - IOT",
    "IT4041 - IISA",
    "IT4110 - CSNA",
    "IT4120 - KM",
    "SE4020 - MADD",
    "SE4030 - SSD",
    "SE4040 - EAD",
    "SE4041 - MADD",
    "SE4050 - DL",
    "SE4060 - PC",
    "SE4061 - MPM",
    "IE4012 - OH:TS",
    "IE4022 - SEA",
    "IE4062 - CFIR",
    "IE4092 - MLCS",
    "IE4032 - IW",
    "IE4042 - SSE",
    "IE4052 - HS",
    "IE4072 - GCLC",
    "SE2042 - OS",
    "SE2052 - PP",
    "SE2062 - DS",
    "SE2072 - SE",
    "SE2082 - HCI",
    "IE2034 - AE",
    "IE2044 - SMP",
    "IE2064 - ACOA",
    "IE2074 - CT",
    "IE2084 - CT",
    "IT1150 - TR",
    "IT1160 - DM",
    "IT1170 - DSA",
    "SE1020 - OOP",
    "SE3022",
    "SE3032",
    "SE3112",
    "IE3014",
    "SE3062",
    "SE3082",
    "IE3004",
    "IE3014",
    "IE3034",
    "IE3054",
    "IE3064",
    "IT2130 - OSSA",
    "IE2100 - DCWN",
    "IE2110 - NMA",
    "IT2160 - Prof. Skills",
    "IE2092 - ICS",
    "IE2102 - NP",
    "SE3012 - IME",
    "SE3092 - PBD",
    "SE3102 - RM",
    "SE3072 - IT",
    "SE2020 - WMT",
    "IT2150 - ITP"
  ];

  // Filter module codes based on search
  const filteredModules = moduleCodes.filter((module) =>
    module.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  // ================= FETCH =================

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

  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets/all");
      setTickets(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReplyTicket = async (ticketId) => {
    const reply = ticketReply[ticketId]?.trim();
    if (!reply) {
      alert("Reply cannot be empty");
      return;
    }
    try {
      await API.put(`/tickets/reply/${ticketId}`, { reply });
      setTicketReply((prev) => ({ ...prev, [ticketId]: "" }));
      fetchTickets();
      alert("Reply sent successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send reply");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAuditLogs();
    fetchTickets();
  }, []);

  // ================= CREATE USER =================

  const handleCreateUser = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    if (role === "lic" && !moduleCode) {
      alert("Module code is required for LIC users");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      alert("Invalid email format");
      return;
    }

    // PASSWORD VALIDATION
    if (password.length < 8 || password.length > 12) {
      alert("Password must be between 8 and 12 characters");
      return;
    }

    try {
      await API.post("/auth/create-user", {
        name,
        email,
        password,
        role,
        moduleCode: role === "lic" ? moduleCode : undefined
      });

      alert("User created successfully");

      setName("");
      setEmail("");
      setPassword("");
      setRole("lic");
      setModuleCode("");
      setModuleSearch("");

      fetchUsers();
      fetchAuditLogs();

    } catch (error) {
      alert(error.response?.data?.message || "Error creating user");
    }
  };

  // ================= PUBLISH TIMETABLE =================

  const handlePublishTimetable = async () => {
    if (!publishMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    if (publishMessage.length < 1 || publishMessage.length > 100) {
      alert("Message must be between 1 and 100 characters");
      return;
    }

    try {
      await API.post("/timetable/publish", {
        message: publishMessage
      });

      alert("Timetable published successfully ✅");
      setPublishMessage("");
      fetchAuditLogs();

    } catch (error) {
      alert(error.response?.data?.message || "Failed to publish timetable");
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/auth/delete-user/${id}`);
      fetchUsers();
      fetchAuditLogs();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  // ================= STATUS =================

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";

      await API.put(`/auth/update-status/${id}`, {
        status: newStatus,
      });

      fetchUsers();
      fetchAuditLogs();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FILTER =================

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search);

    return matchesRole && matchesSearch;
  });

  // ================= STATS =================

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.status === "active").length;

  const suspendedUsers = users.filter(
    (user) => user.status === "suspended"
  ).length;

  // ================= UI =================

  return (
    <>
      <Navbar />

      <div className="admin-page">
        {/* HERO */}
        <div className="admin-hero">
          <h1>Admin Dashboard</h1>
          <p>Manage users, roles and system access.</p>
        </div>

        {/* RAISE TICKET BUTTON */}
        <div style={{ marginBottom: "20px" }}>
          <button className="primary-btn" onClick={() => navigate("/ticket")}>
            Raise Ticket
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <span className="stat-title">Total Users</span>
            <h2>{totalUsers}</h2>
          </div>

          <div className="stat-card stat-green">
            <span className="stat-title">Active Users</span>
            <h2>{activeUsers}</h2>
          </div>

          <div className="stat-card stat-yellow">
            <span className="stat-title">Suspended Users</span>
            <h2>{suspendedUsers}</h2>
          </div>
        </div>

        {/* CREATE USER */}
        <div className="admin-card">
          <h3>Create New User</h3>

          <div className="form-grid">
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
              placeholder="Password (8-12 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="lic">LIC</option>
              <option value="coordinator">Academic Coordinator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* MODULE CODE FOR LIC */}
          {role === "lic" && (
            <div className="module-code-section">
              <input
                type="text"
                placeholder="Search module code..."
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                className="module-search-input"
              />

              <select
                value={moduleCode}
                onChange={(e) => setModuleCode(e.target.value)}
                className="module-select"
              >
                <option value="">-- Select Module Code --</option>
                {filteredModules.map((module, index) => (
                  <option key={index} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button className="primary-btn" onClick={handleCreateUser}>
            Create User
          </button>
        </div>

        {/* USERS */}
        <div className="admin-card">
          <div className="top-bar">
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
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
                <th>Module Code</th>
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
                    {user.role === "lic" 
                      ? (user.moduleCode || <span className="not-assigned">Not Assigned</span>) 
                      : "-"
                    }
                  </td>
                  <td>
                    <span className={`status ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="warning-btn"
                      onClick={() => handleStatusChange(user._id, user.status)}
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
                  <td colSpan="6" className="no-data">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PUBLISH TIMETABLE */}
        <div className="admin-card">
          <h3>Publish Final Timetable</h3>

          <div className="publish-section">
            <input
              type="text"
              placeholder="Enter message (1-100 characters)..."
              value={publishMessage}
              onChange={(e) => setPublishMessage(e.target.value)}
              maxLength={100}
              className="publish-input"
            />

            <span className="char-count">
              {publishMessage.length}/100
            </span>

            <button 
              className="primary-btn publish-btn" 
              onClick={handlePublishTimetable}
            >
              Publish
            </button>
          </div>
        </div>

        {/* TICKETS */}
        <div className="admin-card">
          <h3>Received Tickets ({tickets.length})</h3>
          {tickets.length === 0 ? (
            <p style={{ color: "#888" }}>No tickets received.</p>
          ) : (
            <div className="audit-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td>{ticket.ticketId}</td>
                      <td>{ticket.sender?.name || "Unknown"}<br /><small>{ticket.sender?.role}</small></td>
                      <td>{ticket.subject}</td>
                      <td style={{ maxWidth: "200px", wordBreak: "break-word" }}>{ticket.message}</td>
                      <td>
                        <span className={`status ${ticket.status}`}>{ticket.status}</span>
                      </td>
                      <td>
                        {ticket.status === "replied" ? (
                          <span style={{ color: "#28a745" }}>{ticket.reply}</span>
                        ) : (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <input
                              type="text"
                              placeholder="Write reply..."
                              value={ticketReply[ticket._id] || ""}
                              onChange={(e) =>
                                setTicketReply((prev) => ({ ...prev, [ticket._id]: e.target.value }))
                              }
                              style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", flex: 1 }}
                            />
                            <button
                              className="primary-btn"
                              style={{ padding: "6px 12px", fontSize: "13px" }}
                              onClick={() => handleReplyTicket(ticket._id)}
                            >
                              Send
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
//
export default AdminDashboard;