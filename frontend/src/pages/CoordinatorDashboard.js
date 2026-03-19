import { useState, useEffect } from "react";
import API from "../services/api";

function CoordinatorDashboard() {
  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("admin");

  const fetchTickets = async () => {
    const res = await API.get("/tickets/all");
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReply = async (id) => {
    await API.put(`/tickets/reply/${id}`, { reply: replyText });
    setReplyText("");
    fetchTickets();
  };

  const handleSend = async () => {
    await API.post("/tickets/create-coordinator", {
      subject,
      message,
      role
    });

    setSubject("");
    setMessage("");
    fetchTickets();
  };

  return (
    <div className="page">
      <h2>Coordinator Dashboard</h2>

      <h3>Send Ticket</h3>

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="lic">Lecturer</option>
      </select>

      <button onClick={handleSend}>Send</button>

      <h3>Received Tickets</h3>

      <table border="1">
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.ticketId}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.message}</td>
              <td>{ticket.status}</td>
              <td>
                {ticket.status === "pending" && (
                  <>
                    <input
                      type="text"
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button onClick={() => handleReply(ticket._id)}>
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

export default CoordinatorDashboard;