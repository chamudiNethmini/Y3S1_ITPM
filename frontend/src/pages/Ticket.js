import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/ticket.css";

function Ticket() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [receiverRole, setReceiverRole] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // New states for replying
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("userInfo")) || {};
  const currentRole = currentUser.role || localStorage.getItem("role") || "";

  const getBackPath = () => {
    if (currentRole === "admin") return "/admin-dashboard";
    if (currentRole === "coordinator") return "/coordinator-dashboard";
    return "/lecturer-dashboard";
  };

  const getReceiverOptions = () => {
    if (currentRole === "admin") return [{ value: "coordinator", label: "Coordinator" }, { value: "lic", label: "Lecturer" }];
    if (currentRole === "coordinator") return [{ value: "admin", label: "Admin" }, { value: "lic", label: "Lecturer" }];
    return [{ value: "admin", label: "Admin" }, { value: "coordinator", label: "Coordinator" }];
  };

  useEffect(() => {
    const options = getReceiverOptions();
    if (options.length > 0) setReceiverRole(options[0].value);
  }, [currentRole]);

  const fetchTickets = async () => {
    try {
      // If Admin/Coord, they need to see tickets sent TO them (/all)
      // Otherwise, they see tickets THEY sent (/my)
      const endpoint = (currentRole === "admin" || currentRole === "coordinator") ? "/tickets/all" : "/tickets/my";
      const res = await API.get(endpoint);
      setTickets(res.data);
    } catch (error) {
      console.log("LOAD TICKETS ERROR:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentRole]);

  const handleCreateTicket = async () => {
    if (!subject.trim() || !message.trim() || !receiverRole) return alert("All fields required");
    try {
      if (currentRole === "lic") {
        await API.post("/tickets/create", { subject, message, receiverRole });
      } else {
        await API.post("/tickets/create-coordinator", { subject, message, role: receiverRole });
      }
      setSubject(""); setMessage("");
      fetchTickets();
      alert("Ticket created successfully");
    } catch (error) {
      alert("Failed to create ticket");
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return alert("Reply cannot be empty");
    try {
      await API.put(`/tickets/reply/${id}`, { reply: replyText });
      setReplyText("");
      setActiveReplyId(null);
      fetchTickets();
      alert("Reply sent successfully");
    } catch (error) {
      alert("Failed to send reply");
    }
  };

  const filteredTickets = tickets
    .filter((t) => statusFilter === "all" || t.status === statusFilter)
    .filter((t) => searchTerm.trim() === "" || t.subject.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="page" style={{ padding: "20px", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>🎫 {currentRole === 'admin' ? 'Manage Tickets' : 'Raise Ticket'}</h2>
        <button onClick={() => navigate(getBackPath())} className="btn-secondary">Back</button>
      </div>

      {/* Only show "Create" card if not Admin, or keep as is if Admin also sends tickets */}
      <div className="card">
        <h3>Create Ticket</h3>
        <div className="form-group">
          <label>Send To</label>
          <select value={receiverRole} onChange={(e) => setReceiverRole(e.target.value)}>
            {getReceiverOptions().map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <textarea placeholder="Message..." value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} />
        <button onClick={handleCreateTicket} className="btn-primary">Submit Ticket</button>
      </div>

      <div className="filter-bar" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="replied">Replied</option>
        </select>
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="table-container" style={{ marginTop: "20px" }}>
        <table className="ticket-table" style={{ width: "100%", backgroundColor: "#fff" }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
              <th>ID</th>
              <th>{currentRole === 'admin' ? 'From' : 'To'}</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Reply Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.ticketId}</td>
                <td>{currentRole === 'admin' ? ticket.sender?.name : ticket.receiverRoles?.[0]}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.message}</td>
                <td><span className={`status ${ticket.status}`}>{ticket.status}</span></td>
                <td>
                  {ticket.status === "pending" && (currentRole === "admin" || currentRole === "coordinator") ? (
                    <div>
                      <input 
                        type="text" 
                        placeholder="Reply..." 
                        value={activeReplyId === ticket._id ? replyText : ""}
                        onChange={(e) => { setActiveReplyId(ticket._id); setReplyText(e.target.value); }}
                      />
                      <button onClick={() => handleReply(ticket._id)}>Send</button>
                    </div>
                  ) : (
                    ticket.reply || "No reply"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ticket;