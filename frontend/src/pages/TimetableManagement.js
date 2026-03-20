import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

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
    <div className="page">
      <h2>Timetable Management</h2>

      <div style={{ marginBottom: "15px" }}>
        <Link to="/coordinator-dashboard">
          <button>Back to Dashboard</button>
        </Link>
        <Link to="/session-management" style={{ marginLeft: "10px" }}>
          <button>Go to Session Management</button>
        </Link>
        <button style={{ marginLeft: "10px" }} onClick={handlePrint}>
          Print Timetable
        </button>
      </div>

      <select
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

      <input
        type="text"
        placeholder="Filter by Batch / Group"
        value={filters.batchGroup}
        onChange={(e) => setFilters({ ...filters, batchGroup: e.target.value })}
      />

      <select
        value={filters.lecturer}
        onChange={(e) => setFilters({ ...filters, lecturer: e.target.value })}
      >
        <option value="">All Lecturers</option>
        {lecturers.map((lecturer) => (
          <option key={lecturer._id} value={lecturer._id}>
            {lecturer.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Filter by Hall"
        value={filters.hall}
        onChange={(e) => setFilters({ ...filters, hall: e.target.value })}
      />

      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <table border="1" cellPadding="8" style={{ marginTop: "15px" }}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TimetableManagementPage;