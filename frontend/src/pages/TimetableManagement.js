import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/TimetableManagement.css";

function TimetableManagementPage() {
  const [entries, setEntries] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [filters, setFilters] = useState({
    day: "",
    batchGroup: "",
    lecturer: "",
    hall: "",
    status: "",
  });

  const [errors, setErrors] = useState({
    batchGroup: "",
    hall: "",
  });

  const fetchLecturers = async () => {
    try {
      const res = await API.get("/timetable-entries/lecturers");
      setLecturers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const validateFilters = () => {
    const newErrors = {
      batchGroup: "",
      hall: "",
    };

    let isValid = true;

    const batchRegex = /^[A-Za-z0-9\s\-/.()]*$/;
    const hallRegex = /^[A-Za-z0-9\s]*$/;

    if (filters.batchGroup && !batchRegex.test(filters.batchGroup.trim())) {
      newErrors.batchGroup = "Batch / Group contains invalid characters";
      isValid = false;
    }

    if (filters.hall) {
      const hallValue = filters.hall.trim();

      if (!hallRegex.test(hallValue)) {
        newErrors.hall = "Hall can contain only letters and numbers";
        isValid = false;
      } else if (hallValue.length < 3) {
        newErrors.hall = "Hall must be at least 3 characters";
        isValid = false;
      } else if (!/^[A-Z]/.test(hallValue)) {
        newErrors.hall = "Hall must start with an uppercase letter";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const fetchEntries = async () => {
    if (!validateFilters()) return;

    try {
      const params = {};
      if (filters.day) params.day = filters.day;
      if (filters.batchGroup.trim()) params.batchGroup = filters.batchGroup.trim();
      if (filters.lecturer) params.lecturer = filters.lecturer;
      if (filters.hall.trim()) params.hall = filters.hall.trim();
      if (filters.status) params.status = filters.status;

      const res = await API.get("/timetable-entries", { params });
      setEntries(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [filters.day, filters.lecturer, filters.status]);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "batchGroup" || field === "hall") {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleApplyFilters = () => {
    fetchEntries();
  };

  const handleClearFilters = () => {
    setFilters({
      day: "",
      batchGroup: "",
      lecturer: "",
      hall: "",
      status: "",
    });

    setErrors({
      batchGroup: "",
      hall: "",
    });
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resource-section">
      <div className="resource-card">
        <div className="resource-topbar">
          <h2>Timetable Management</h2>
          <p>View and filter timetable by day, batch/group, lecturer and hall.</p>
        </div>
      </div>

      <div className="resource-card">
        <div className="resource-header resource-list-header">
          <div>
            <h3>Timetable Filters</h3>
            <p>Filter published or draft timetable entries.</p>
          </div>
        </div>

        <div className="resource-filter-grid">
          <div className="resource-filter-box">
            <label>Day</label>
            <select
              className="resource-input"
              value={filters.day}
              onChange={(e) => handleInputChange("day", e.target.value)}
            >
              <option value="">All Days</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          <div className="resource-filter-box">
            <label>Batch / Group</label>
            <input
              className="resource-input"
              type="text"
              placeholder="Filter by batch/group"
              value={filters.batchGroup}
              onChange={(e) => handleInputChange("batchGroup", e.target.value)}
            />
            {errors.batchGroup && (
              <span className="error-text">{errors.batchGroup}</span>
            )}
          </div>

          <div className="resource-filter-box">
            <label>Lecturer</label>
            <select
              className="resource-input"
              value={filters.lecturer}
              onChange={(e) => handleInputChange("lecturer", e.target.value)}
            >
              <option value="">All Lecturers</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer._id} value={lecturer._id}>
                  {lecturer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="resource-filter-box">
            <label>Hall</label>
            <input
              className="resource-input"
              type="text"
              placeholder="Filter by hall"
              value={filters.hall}
              onChange={(e) => handleInputChange("hall", e.target.value)}
            />
            {errors.hall && <span className="error-text">{errors.hall}</span>}
          </div>

          <div className="resource-filter-box">
            <label>Status</label>
            <select
              className="resource-input"
              value={filters.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="resource-action-row">
          <button className="resource-primary-btn" onClick={handleApplyFilters}>
            Apply Filters
          </button>

          <button className="resource-secondary-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>

          <Link className="resource-link" to="/session-management">
            <button className="resource-secondary-btn">
              Go to Session Management
            </button>
          </Link>

          <button className="resource-print-btn" onClick={handlePrint}>
            Print Timetable
          </button>
        </div>
      </div>

      <div className="resource-card">
        <div className="resource-header">
          <div>
            <h3>Timetable Entries</h3>
            <p>Published timetable for viewing and printing.</p>
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
                      {entry.status !== "published" ? (
                        <button
                          className="resource-publish-btn"
                          onClick={() => handlePublish(entry._id)}
                        >
                          Publish
                        </button>
                      ) : (
                        <span className="resource-badge status-published">
                          Published
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="resource-empty" colSpan="9">
                    No timetable entries found.
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

export default TimetableManagementPage;