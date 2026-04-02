import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/SessionManagement.css";

function SessionManagement() {
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [batchGroups, setBatchGroups] = useState([]);
  const [halls, setHalls] = useState([]);
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

  const fetchResources = async () => {
    try {
      const [moduleRes, lecturerRes, batchRes, hallRes] = await Promise.all([
        API.get("/timetable-entries/resources", { params: { type: "module" } }),
        API.get("/timetable-entries/resources", { params: { type: "lecturer" } }),
        API.get("/timetable-entries/resources", { params: { type: "batch" } }),
        API.get("/timetable-entries/resources", { params: { type: "hall" } }),
      ]);

      setModules(moduleRes.data || []);
      setLecturers(lecturerRes.data || []);
      setBatchGroups(batchRes.data || []);
      setHalls(hallRes.data || []);
    } catch (error) {
      console.error("Failed to fetch resources", error);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await API.get("/timetable-entries", {
        params: { status: "draft" },
      });
      setEntries(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchResources();
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

  const getResourceName = (resource) => {
    if (!resource) return "N/A";

    if (resource.resourceType === "lecturer") {
      return `${resource.lecturerTitle || ""} ${resource.name}`.trim();
    }

    if (resource.resourceType === "module") {
      return resource.code ? `${resource.code} - ${resource.name}` : resource.name;
    }

    if (resource.resourceType === "batch") {
      return resource.batchNo ? `${resource.batchNo} - ${resource.name}` : resource.name;
    }

    if (resource.resourceType === "hall") {
      return resource.capacity && resource.capacity > 0
        ? `${resource.name} (Capacity: ${resource.capacity})`
        : resource.name;
    }

    return resource.name || "N/A";
  };

  const getNameFromList = (list, id) => {
    const item = list.find((resource) => resource._id === id);
    return item ? getResourceName(item) : "N/A";
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

    if (!form.module) {
      newErrors.module = "Module is required";
      isValid = false;
    }

    if (!form.lecturer) {
      newErrors.lecturer = "Lecturer is required";
      isValid = false;
    }

    if (!form.batchGroup) {
      newErrors.batchGroup = "Batch / Group is required";
      isValid = false;
    }

    if (!form.hall) {
      newErrors.hall = "Hall is required";
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

  const findAllClashes = (allEntries, currentPayload, currentEditingId = null) => {
    const currentStart = toMinutes(currentPayload.startTime);
    const currentEnd = toMinutes(currentPayload.endTime);

    if (currentStart === null || currentEnd === null) {
      return [];
    }

    const clashes = [];

    for (const entry of allEntries) {
      if (currentEditingId && entry._id === currentEditingId) {
        continue;
      }

      if (entry.day !== currentPayload.day) {
        continue;
      }

      const entryStart = toMinutes(entry.startTime);
      const entryEnd = toMinutes(entry.endTime);

      if (entryStart === null || entryEnd === null) {
        continue;
      }

      const timeOverlap = currentStart < entryEnd && entryStart < currentEnd;

      if (!timeOverlap) {
        continue;
      }

      const entryHallId = typeof entry.hall === "object" ? entry.hall?._id : entry.hall;
      const entryLecturerId =
        typeof entry.lecturer === "object" ? entry.lecturer?._id : entry.lecturer;

      const sameHall = String(entryHallId) === String(currentPayload.hall);
      const sameLecturer = String(entryLecturerId) === String(currentPayload.lecturer);

      if (sameHall || sameLecturer) {
        let clashType = "";

        if (sameHall && sameLecturer) {
          clashType = "Hall and Lecturer Clash";
        } else if (sameHall) {
          clashType = "Hall Clash";
        } else if (sameLecturer) {
          clashType = "Lecturer Clash";
        }

        clashes.push({
          id: `${currentPayload.day}-${currentPayload.startTime}-${currentPayload.endTime}-${entry._id}`,
          clashType,
          newSession: {
            module: getNameFromList(modules, currentPayload.module),
            lecturer: getNameFromList(lecturers, currentPayload.lecturer),
            batchGroup: getNameFromList(batchGroups, currentPayload.batchGroup),
            hall: getNameFromList(halls, currentPayload.hall),
            day: currentPayload.day,
            startTime: currentPayload.startTime,
            endTime: currentPayload.endTime,
          },
          existingSession: {
            module:
              typeof entry.module === "object" ? getResourceName(entry.module) : entry.module,
            lecturer:
              typeof entry.lecturer === "object"
                ? getResourceName(entry.lecturer)
                : "N/A",
            batchGroup:
              typeof entry.batchGroup === "object"
                ? getResourceName(entry.batchGroup)
                : entry.batchGroup,
            hall:
              typeof entry.hall === "object" ? getResourceName(entry.hall) : entry.hall,
            day: entry.day,
            startTime: entry.startTime,
            endTime: entry.endTime,
          },
        });
      }
    }

    return clashes;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        ...form,
      };

      const allEntriesRes = await API.get("/timetable-entries");
      const allEntries = allEntriesRes.data || [];

      const clashList = findAllClashes(allEntries, payload, editingId);

      if (editingId) {
        await API.put(`/timetable-entries/${editingId}`, payload);
        alert("Session updated successfully");
      } else {
        await API.post("/timetable-entries", payload);
        alert("Session created successfully");
      }

      resetForm();
      fetchEntries();

      if (clashList.length > 0) {
        navigate("/notifications", {
          state: {
            newClashes: clashList,
          },
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save session");
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setForm({
      module: entry.module?._id || entry.module,
      lecturer: entry.lecturer?._id || entry.lecturer,
      batchGroup: entry.batchGroup?._id || entry.batchGroup,
      hall: entry.hall?._id || entry.hall,
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

  const handleViewNotifications = async () => {
    try {
      const res = await API.get("/timetable-entries");
      const allEntries = Array.isArray(res.data) ? res.data : [];
      const clashList = findAllClashes(allEntries, form, editingId);

      navigate("/notifications", {
        state: {
          newClashes: clashList,
        },
      });
    } catch (error) {
      console.error("Failed to load clashes:", error);
      navigate("/notifications");
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
            <select
              className="resource-input"
              value={form.module}
              onChange={(e) => handleChange("module", e.target.value)}
            >
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module._id} value={module._id}>
                  {getResourceName(module)}
                </option>
              ))}
            </select>
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
                  {getResourceName(lecturer)}
                </option>
              ))}
            </select>
            {errors.lecturer && <span className="error-text">{errors.lecturer}</span>}
          </div>

          <div className="resource-form-group">
            <label>Batch / Group</label>
            <select
              className="resource-input"
              value={form.batchGroup}
              onChange={(e) => handleChange("batchGroup", e.target.value)}
            >
              <option value="">Select Batch / Group</option>
              {batchGroups.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {getResourceName(batch)}
                </option>
              ))}
            </select>
            {errors.batchGroup && (
              <span className="error-text">{errors.batchGroup}</span>
            )}
          </div>

          <div className="resource-form-group">
            <label>Hall</label>
            <select
              className="resource-input"
              value={form.hall}
              onChange={(e) => handleChange("hall", e.target.value)}
            >
              <option value="">Select Hall</option>
              {halls.map((hall) => (
                <option key={hall._id} value={hall._id}>
                  {getResourceName(hall)}
                </option>
              ))}
            </select>
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

          <button
            className="resource-secondary-btn"
            onClick={handleViewNotifications}
          >
            Notifications
          </button>
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
                      <span className="resource-badge module">
                        {typeof entry.module === "object"
                          ? getResourceName(entry.module)
                          : entry.module}
                      </span>
                    </td>
                    <td>
                      <span className="resource-badge lecturer">
                        {typeof entry.lecturer === "object"
                          ? getResourceName(entry.lecturer)
                          : "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="resource-badge batch">
                        {typeof entry.batchGroup === "object"
                          ? getResourceName(entry.batchGroup)
                          : entry.batchGroup}
                      </span>
                    </td>
                    <td>
                      <span className="resource-badge hall">
                        {typeof entry.hall === "object"
                          ? getResourceName(entry.hall)
                          : entry.hall}
                      </span>
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

export default SessionManagement;