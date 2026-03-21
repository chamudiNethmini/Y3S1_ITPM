import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/LecturerDashboard.css";

function LecturerDashboard() {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {

    // ✅ VALIDATION
    if (!subject.trim() || !message.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSending(true);

      await API.post("/tickets/create", {
        subject,
        message
      });

      alert("Ticket Sent Successfully ✅");

      setSubject("");
      setMessage("");

    } catch (error) {
      alert(error.response?.data?.message || "Failed to send ticket");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* 🔥 NAVBAR */}
      <Navbar />

      <div className="lecturer-page">

        {/* HERO */}
        <div className="lecturer-hero">
          <h1>Lecturer Dashboard</h1>
          <p>Raise and manage your support tickets easily.</p>
        </div>

        {/* CARD */}
        <div className="lecturer-card">

          <h3>Raise Ticket</h3>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            className="primary-btn"
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Ticket"}
          </button>

        </div>
      </div>
    </>
  );
}

export default LecturerDashboard;