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
    status: "published",
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
      const params = {};
      if (filters.day) params.day = filters.day;
      if (filters.batchGroup) params.batchGroup = filters.batchGroup;
      if (filters.lecturer) params.lecturer = filters.lecturer;
      if (filters.hall) params.hall = filters.hall;
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
  }, [filters]);

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
              onChange={(e) => setFilters({ ...filters, day: e.target.value })}
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
              onChange={(e) =>
                setFilters({ ...filters, batchGroup: e.target.value })
              }
            />
          </div>

          <div className="resource-filter-box">
            <label>Lecturer</label>
            <select
              className="resource-input"
              value={filters.lecturer}
              onChange={(e) =>
                setFilters({ ...filters, lecturer: e.target.value })
              }
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
              onChange={(e) => setFilters({ ...filters, hall: e.target.value })}
            />
          </div>

          <div className="resource-filter-box">
            <label>Status</label>
            <select
              className="resource-input"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="resource-action-row">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="resource-empty" colSpan="8">
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