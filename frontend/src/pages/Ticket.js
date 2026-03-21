import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/ticket.css";

function Ticket() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ================= FETCH =================
  const fetchTickets = async () => {
    try {
      const res = await API.get("/tickets/all");
      setTickets(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ================= SCROLL DETECTION =================
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= REPLY =================
  const handleReplyChange = (id, value) => {
    if (value.length <= 1000) {
      setReplyTexts((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleReply = async (id) => {
    const reply = replyTexts[id]?.trim();
    if (!reply) {
      alert("Reply is required");
      return;
    }
    try {
      await API.put(`/tickets/reply/${id}`, { reply });
      setReplyTexts((prev) => ({ ...prev, [id]: "" }));
      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= CREATE =================
  const handleCreateTicket = async () => {
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject || !trimmedMessage) {
      alert("All fields are required");
      return;
    }

    if (trimmedMessage.length > 1000) {
      alert("Message cannot exceed 1000 characters");
      return;
    }

    try {
      await API.post("/tickets/create", {
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      setSubject("");
      setMessage("");
      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FILTER =================
  const isValidStatus = (status) => /^[a-zA-Z]+$/.test(status);

  const filteredTickets = tickets
    .filter((t) => statusFilter === "all" || (isValidStatus(t.status) && t.status === statusFilter))
    .filter((t) =>
      searchTerm.trim() === "" ||
      (t.sender?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="page" style={{ padding: "20px", backgroundColor: "#f4f6f9", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#333" }}>🎫 Ticket Dashboard</h2>
        <button onClick={() => navigate("/admin")} className="btn-secondary">
          Back
        </button>
      </div>

      {/* CREATE CARD */}
      <div className="card" style={{ borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <h3 style={{ marginBottom: "15px", color: "#333" }}>Create Ticket</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ fontSize: "14px" }}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
          />
          <small style={{ color: "#666" }}>{message.length}/1000</small>
        </div>
        <button onClick={handleCreateTicket} className="btn-primary">
          Submit Ticket
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="filter-bar" style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label style={{ fontWeight: "600" }}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              if (e.target.value === "all" || /^[a-zA-Z]+$/.test(e.target.value)) {
                setStatusFilter(e.target.value);
              }
            }}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", height: "38px" }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by sender name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", height: "38px" }}
        />
      </div>

      {/* TABLE */}
      <div className="table-container" style={{ borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <table className="ticket-table" style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
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
            {filteredTickets.map((ticket, idx) => (
              <tr key={ticket._id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff", transition: "background-color 0.2s" }}>
                <td>{ticket.ticketId}</td>
                <td>{ticket.subject}</td>
                <td className="message-cell">{ticket.message}</td>
                <td>{ticket.sender?.name}</td>
                <td>
                  <span className={`status ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                </td>
                <td>{ticket.reply}</td>
                <td>
                  {ticket.status === "pending" && (
                    <div className="reply-box">
                      <input
                        type="text"
                        placeholder="Reply..."
                        value={replyTexts[ticket._id] || ""}
                        onChange={(e) => handleReplyChange(ticket._id, e.target.value)}
                      />
                      <button onClick={() => handleReply(ticket._id)} className="btn-primary small">
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

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 15px",
            fontSize: "18px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Ticket;