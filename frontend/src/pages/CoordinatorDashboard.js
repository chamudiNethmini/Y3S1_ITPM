import { useEffect, useState } from "react";
import API from "../services/api";
import ResourceManagement from "./ResourceManagement";
import "../styles/CoordinatorDashboard.css";

function CoordinatorDashboard() {
  const [tickets, setTickets] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tickets/all");
      setTickets(res.data);
    } catch (error) {
      alert("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplyTexts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReply = async (id) => {
    const reply = (replyTexts[id] || "").trim();

    if (!reply) {
      alert("Please enter a reply");
      return;
    }

    try {
      await API.put(`/tickets/reply/${id}`, { reply });
      setReplyTexts((prev) => ({
        ...prev,
        [id]: "",
      }));
      fetchTickets();
    } catch (error) {
      alert("Failed to send reply");
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please fill subject and message");
      return;
    }

    try {
      setSending(true);
      await API.post("/tickets/create-coordinator", {
        subject,
        message,
        role,
      });

      setSubject("");
      setMessage("");
      fetchTickets();
      alert("Ticket sent successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send ticket");
    } finally {
      setSending(false);
    }
  };

  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "pending"
  ).length;
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved"
  ).length;

  const getStatusClass = (status) => {
    if (status === "pending") return "status-badge pending";
    if (status === "resolved") return "status-badge resolved";
    return "status-badge";
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <div className="dashboard-hero">
          <div>
            <h1>Coordinator Dashboard</h1>
            <p>Manage tickets and resources with a clean professional dashboard.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <span className="stat-title">Total Tickets</span>
            <h2>{totalTickets}</h2>
          </div>

          <div className="stat-card stat-yellow">
            <span className="stat-title">Pending Tickets</span>
            <h2>{pendingTickets}</h2>
          </div>

          <div className="stat-card stat-green">
            <span className="stat-title">Resolved Tickets</span>
            <h2>{resolvedTickets}</h2>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="section-header">
            <div>
              <h3>Send Ticket</h3>
              <p>Create and send a new ticket to admin or lecturer.</p>
            </div>
          </div>

          <div className="form-grid two-cols">
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                className="dashboard-input"
                placeholder="Enter ticket subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Send To</label>
              <select
                className="dashboard-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="lic">Lecturer</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Message</label>
              <textarea
                className="dashboard-input dashboard-textarea"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="action-row">
            <button
              className="primary-btn"
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Ticket"}
            </button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="section-header">
            <div>
              <h3>Received Tickets</h3>
              <p>Review all tickets and respond to pending requests.</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="pro-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Reply Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      Loading tickets...
                    </td>
                  </tr>
                ) : tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td>{ticket.ticketId}</td>
                      <td>{ticket.subject}</td>
                      <td>{ticket.message}</td>
                      <td>
                        <span className={getStatusClass(ticket.status)}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>
                        {ticket.status === "pending" ? (
                          <div className="reply-box">
                            <input
                              type="text"
                              className="dashboard-input small-input"
                              placeholder="Enter reply"
                              value={replyTexts[ticket._id] || ""}
                              onChange={(e) =>
                                handleReplyChange(ticket._id, e.target.value)
                              }
                            />
                            <button
                              className="success-btn"
                              onClick={() => handleReply(ticket._id)}
                            >
                              Reply
                            </button>
                          </div>
                        ) : (
                          <span className="replied-text">Replied</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ResourceManagement />
      </div>
    </div>
  );
}

export default CoordinatorDashboard;