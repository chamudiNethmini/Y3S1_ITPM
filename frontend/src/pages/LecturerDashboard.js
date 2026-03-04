import { useState } from "react";
import API from "../services/api";

function LecturerDashboard() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    await API.post("/tickets/create", { subject, message });
    alert("Ticket Sent");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="page">
      <h2>Lecturer Dashboard</h2>

      <h3>Raise Ticket</h3>

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

      <button onClick={handleSend}>Send Ticket</button>
    </div>
  );
}

export default LecturerDashboard;