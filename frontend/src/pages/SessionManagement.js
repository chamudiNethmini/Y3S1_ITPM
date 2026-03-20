import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function SessionManagementPage() {
  const [lecturers, setLecturers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    module: "",
    lecturer: "",
    batchGroup: "",
    hall: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    status: "draft",
  });

  const fetchLecturers = async () => {
    try {
      const res = await API.get("/timetable-entries/lecturers");
      setLecturers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await API.get("/timetable-entries", {
        params: { status: "draft" },
      });
      setEntries(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLecturers();
    fetchEntries();
  }, []);

  const resetForm = () => {
    setForm({
      module: "",
      lecturer: "",
      batchGroup: "",
      hall: "",
      day: "Monday",
      startTime: "",
      endTime: "",
      status: "draft",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await API.put(`/timetable-entries/${editingId}`, form);
        alert("Session updated successfully");
      } else {
        await API.post("/timetable-entries", form);
        alert("Session created successfully");
      }

      resetForm();
      fetchEntries();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save session");
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setForm({
      module: entry.module,
      lecturer: entry.lecturer?._id || entry.lecturer,
      batchGroup: entry.batchGroup,
      hall: entry.hall,
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      status: entry.status,
    });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/timetable-entries/${id}`);
      alert("Session deleted successfully");
      fetchEntries();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete session");
    }
  };

  const handlePublish = async (id) => {
    try {
      await API.patch(`/timetable-entries/${id}/publish`);
      alert("Timetable published successfully");
      fetchEntries();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to publish timetable");
    }
  };

  return (
    <div className="page">
      <h2>Session Management</h2>

      <div style={{ marginBottom: "15px" }}>
        <Link to="/coordinator-dashboard">
          <button>Back to Dashboard</button>
        </Link>
        <Link to="/timetable-management" style={{ marginLeft: "10px" }}>
          <button>Go to Timetable View</button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Module"
        value={form.module}
        onChange={(e) => setForm({ ...form, module: e.target.value })}
      />

      <select
        value={form.lecturer}
        onChange={(e) => setForm({ ...form, lecturer: e.target.value })}
      >
        <option value="">Select Lecturer</option>
        {lecturers.map((lecturer) => (
          <option key={lecturer._id} value={lecturer._id}>
            {lecturer.name} ({lecturer.email})
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Batch / Group"
        value={form.batchGroup}
        onChange={(e) => setForm({ ...form, batchGroup: e.target.value })}
      />

      <input
        type="text"
        placeholder="Hall"
        value={form.hall}
        onChange={(e) => setForm({ ...form, hall: e.target.value })}
      />

      <select
        value={form.day}
        onChange={(e) => setForm({ ...form, day: e.target.value })}
      >
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
        <option value="Saturday">Saturday</option>
      </select>

      <input
        type="time"
        value={form.startTime}
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />

      <input
        type="time"
        value={form.endTime}
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
      />

      <div style={{ marginTop: "12px" }}>
        <button onClick={handleSubmit}>
          {editingId ? "Update Session" : "Create Session"}
        </button>

        <button onClick={resetForm} style={{ marginLeft: "10px" }}>
          Clear
        </button>
      </div>

      <h3 style={{ marginTop: "20px" }}>Draft Timetable</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Module</th>
            <th>Lecturer</th>
            <th>Batch/Group</th>
            <th>Hall</th>
            <th>Day</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.module}</td>
              <td>{entry.lecturer?.name || "N/A"}</td>
              <td>{entry.batchGroup}</td>
              <td>{entry.hall}</td>
              <td>{entry.day}</td>
              <td>{entry.startTime}</td>
              <td>{entry.endTime}</td>
              <td>{entry.status}</td>
              <td>
                <button onClick={() => handleEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry._id)}>Delete</button>
                <button onClick={() => handlePublish(entry._id)}>Publish</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SessionManagementPage;