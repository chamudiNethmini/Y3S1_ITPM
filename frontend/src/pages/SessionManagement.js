import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/SessionManagement.css";

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

  const [errors, setErrors] = useState({
    module: "",
    lecturer: "",
    batchGroup: "",
    hall: "",
    day: "",
    startTime: "",
    endTime: "",
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

  const toMinutes = (time) => {
    if (!time) return null;

    const parts = time.split(":");
    if (parts.length !== 2) return null;

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

    return hours * 60 + minutes;
  };

  const validateForm = () => {
    const newErrors = {
      module: "",
      lecturer: "",
      batchGroup: "",
      hall: "",
      day: "",
      startTime: "",
      endTime: "",
    };

    let isValid = true;

    const moduleRegex = /^[A-Za-z0-9\s\-&/().]+$/;
    const batchRegex = /^[A-Za-z0-9\s\-/.()]+$/;
    const hallRegex = /^[A-Za-z0-9\s\-/.()]+$/;

    if (!form.module.trim()) {
      newErrors.module = "Module is required";
      isValid = false;
    } else if (form.module.trim().length < 2) {
      newErrors.module = "Module must be at least 2 characters";
      isValid = false;
    } else if (!moduleRegex.test(form.module.trim())) {
      newErrors.module = "Module contains invalid characters";
      isValid = false;
    }

    if (!form.lecturer) {
      newErrors.lecturer = "Lecturer is required";
      isValid = false;
    }

    if (!form.batchGroup.trim()) {
      newErrors.batchGroup = "Batch / Group is required";
      isValid = false;
    } else if (form.batchGroup.trim().length < 2) {
      newErrors.batchGroup = "Batch / Group must be at least 2 characters";
      isValid = false;
    } else if (!batchRegex.test(form.batchGroup.trim())) {
      newErrors.batchGroup = "Batch / Group contains invalid characters";
      isValid = false;
    }

    if (!form.hall.trim()) {
      newErrors.hall = "Hall is required";
      isValid = false;
    } else if (form.hall.trim().length < 1) {
      newErrors.hall = "Hall is required";
      isValid = false;
    } else if (!hallRegex.test(form.hall.trim())) {
      newErrors.hall = "Hall contains invalid characters";
      isValid = false;
    }

    if (!form.day) {
      newErrors.day = "Day is required";
      isValid = false;
    }

    if (!form.startTime) {
      newErrors.startTime = "Start time is required";
      isValid = false;
    }

    if (!form.endTime) {
      newErrors.endTime = "End time is required";
      isValid = false;
    }

    if (form.startTime && form.endTime) {
      const start = toMinutes(form.startTime);
      const end = toMinutes(form.endTime);

      if (start === null) {
        newErrors.startTime = "Invalid start time";
        isValid = false;
      }

      if (end === null) {
        newErrors.endTime = "Invalid end time";
        isValid = false;
      }

      if (start !== null && end !== null && end <= start) {
        newErrors.endTime = "End time must be after start time";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

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

    setErrors({
      module: "",
      lecturer: "",
      batchGroup: "",
      hall: "",
      day: "",
      startTime: "",
      endTime: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        ...form,
        module: form.module.trim(),
        batchGroup: form.batchGroup.trim(),
        hall: form.hall.trim(),
      };

      if (editingId) {
        await API.put(`/timetable-entries/${editingId}`, payload);
        alert("Session updated successfully");
      } else {
        await API.post("/timetable-entries", payload);
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

    setErrors({
      module: "",
      lecturer: "",
      batchGroup: "",
      hall: "",
      day: "",
      startTime: "",
      endTime: "",
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
    <div className="resource-section">
      <div className="resource-card">
        <div className="resource-topbar">
          <h2>Session Management</h2>
          <p>Create, edit, delete and publish timetable sessions.</p>
        </div>
      </div>

      <div className="resource-card">
        <div className="resource-header">
          <div>
            <h3>{editingId ? "Edit Session" : "Create Session"}</h3>
            <p>Enter session details and save them into the draft timetable.</p>
          </div>
          {editingId && <span className="edit-pill">Editing Mode</span>}
        </div>

        <div className="resource-form-grid">
          <div className="resource-form-group">
            <label>Module</label>
            <input
              className="resource-input"
              type="text"
              placeholder="Enter module"
              value={form.module}
              onChange={(e) => handleChange("module", e.target.value)}
            />
            {errors.module && <span className="error-text">{errors.module}</span>}
          </div>

          <div className="resource-form-group">
            <label>Lecturer</label>
            <select
              className="resource-input"
              value={form.lecturer}
              onChange={(e) => handleChange("lecturer", e.target.value)}
            >
              <option value="">Select Lecturer</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer._id} value={lecturer._id}>
                  {lecturer.name} ({lecturer.email})
                </option>
              ))}
            </select>
            {errors.lecturer && <span className="error-text">{errors.lecturer}</span>}
          </div>

          <div className="resource-form-group">
            <label>Batch / Group</label>
            <input
              className="resource-input"
              type="text"
              placeholder="Enter batch/group"
              value={form.batchGroup}
              onChange={(e) => handleChange("batchGroup", e.target.value)}
            />
            {errors.batchGroup && (
              <span className="error-text">{errors.batchGroup}</span>
            )}
          </div>

          <div className="resource-form-group">
            <label>Hall</label>
            <input
              className="resource-input"
              type="text"
              placeholder="Enter hall"
              value={form.hall}
              onChange={(e) => handleChange("hall", e.target.value)}
            />
            {errors.hall && <span className="error-text">{errors.hall}</span>}
          </div>

          <div className="resource-form-group">
            <label>Day</label>
            <select
              className="resource-input"
              value={form.day}
              onChange={(e) => handleChange("day", e.target.value)}
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
            {errors.day && <span className="error-text">{errors.day}</span>}
          </div>

          <div className="resource-form-group">
            <label>Start Time</label>
            <input
              className="resource-input"
              type="time"
              value={form.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
            />
            {errors.startTime && (
              <span className="error-text">{errors.startTime}</span>
            )}
          </div>

          <div className="resource-form-group">
            <label>End Time</label>
            <input
              className="resource-input"
              type="time"
              value={form.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
            />
            {errors.endTime && <span className="error-text">{errors.endTime}</span>}
          </div>
        </div>

        <div className="resource-action-row">
          <button className="resource-primary-btn" onClick={handleSubmit}>
            {editingId ? "Update Session" : "Create Session"}
          </button>

          <button className="resource-secondary-btn" onClick={resetForm}>
            Clear
          </button>

          <Link className="resource-link" to="/timetable-management">
            <button className="resource-secondary-btn">View Timetable</button>
          </Link>
        </div>
      </div>

      <div className="resource-card">
        <div className="resource-header resource-list-header">
          <div>
            <h3>Draft Timetable</h3>
            <p>Manage draft sessions before publishing.</p>
          </div>
        </div>

        <div className="resource-table-wrapper">
          <table className="resource-table">
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
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      <span className="resource-badge module">{entry.module}</span>
                    </td>
                    <td>
                      <span className="resource-badge lecturer">
                        {entry.lecturer?.name || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="resource-badge batch">{entry.batchGroup}</span>
                    </td>
                    <td>
                      <span className="resource-badge hall">{entry.hall}</span>
                    </td>
                    <td>{entry.day}</td>
                    <td>{entry.startTime}</td>
                    <td>{entry.endTime}</td>
                    <td>
                      <span className={`resource-badge status-${entry.status}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td>
                      <div className="resource-btn-group">
                        <button
                          className="resource-edit-btn"
                          onClick={() => handleEdit(entry)}
                        >
                          Edit
                        </button>
                        <button
                          className="resource-delete-btn"
                          onClick={() => handleDelete(entry._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="resource-publish-btn"
                          onClick={() => handlePublish(entry._id)}
                        >
                          Publish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="resource-empty" colSpan="9">
                    No draft sessions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SessionManagementPage;