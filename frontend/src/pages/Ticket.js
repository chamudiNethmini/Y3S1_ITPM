import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Ticket() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");

  // CREATE TICKET STATES
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    fetchTickets();
  }, []);

  // ===========================
  // HANDLE REPLY INPUT
  // ===========================
  const handleReplyChange = (id, value) => {
    // Limit reply input to 1000 characters
    if (value.length <= 1000) {
      setReplyTexts((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  // ===========================
  // REPLY FUNCTION
  // ===========================
  const handleReply = async (id) => {
    if (!replyTexts[id]) {
      alert("Reply cannot be empty");
      return;
    }

    try {
      await API.put(`/tickets/reply/${id}`, {
        reply: replyTexts[id],
      });

      setReplyTexts((prev) => ({
        ...prev,
        [id]: "",
      }));

      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // CREATE TICKET
  // ===========================
  const handleCreateTicket = async () => {
    if (!subject || !message) {
      alert("Please fill all fields");
      return;
    }

    // Message length validation
    if (message.length > 1000) {
      alert("Message cannot exceed 1000 characters");
      return;
    }

    try {
      await API.post("/tickets/create", {
        subject,
        message,
      });

      setSubject("");
      setMessage("");

      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // FILTER LOGIC
  // ===========================
  const isValidStatus = (status) => /^[a-zA-Z]+$/.test(status); // Only letters allowed

  const filteredTickets =
    statusFilter === "all"
      ? tickets
      : tickets.filter((t) => isValidStatus(t.status) && t.status === statusFilter);

  return (
    <div className="page">
      <h2>Ticket Dashboard</h2>

      {/* BACK BUTTON */}
      <button onClick={() => navigate("/admin")}>
        Back to Admin
      </button>

      {/* ===========================
          CREATE TICKET UI
      =========================== */}
      <div style={{ marginTop: "20px" }}>
        <h3>Create Ticket</h3>

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginLeft: "10px" }}
          maxLength={1000} // HTML max length validation
        />

        <button
          onClick={handleCreateTicket}
          style={{ marginLeft: "10px" }}
        >
          Submit Ticket
        </button>
      </div>

      {/* FILTER */}
      <div style={{ margin: "20px 0" }}>
        <label>Filter by Status: </label>
        <select
          value={statusFilter}
          onChange={(e) => {
            // Only allow words, no numbers/icons
            if (e.target.value === "all" || /^[a-zA-Z]+$/.test(e.target.value)) {
              setStatusFilter(e.target.value);
            } else {
              alert("Invalid status. Only letters allowed.");
            }
          }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* TICKET TABLE */}
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
          {filteredTickets.map((ticket) => (
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
                      onChange={(e) =>
                        handleReplyChange(ticket._id, e.target.value)
                      }
                      maxLength={1000} // Limit reply input
                    />
                    <button
                      onClick={() => handleReply(ticket._id)}
                      style={{ marginLeft: "5px" }}
                    >
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

export default Ticket;