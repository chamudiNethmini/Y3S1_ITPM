import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/TimetableManagement.css";

function TimetableManagementPage() {
  const [entries, setEntries] = useState([]);
  const [batchGroups, setBatchGroups] = useState([]);
  const [filters, setFilters] = useState({
    batchGroup: "",
    status: "published",
  });

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getResourceName = (resource) => {
    if (!resource) return "N/A";

    if (typeof resource === "string") return resource;

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

  const fetchBatchGroups = async () => {
    try {
      const res = await API.get("/timetable-entries/resources", {
        params: { type: "batch" },
      });
      setBatchGroups(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching batch groups:", error);
      setBatchGroups([]);
    }
  };

  const fetchEntries = async (currentFilters = filters) => {
    try {
      const params = {
        status: currentFilters.status,
      };

      if (currentFilters.batchGroup) {
        params.batchGroup = currentFilters.batchGroup;
      }

      const res = await API.get("/timetable-entries", { params });
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching timetable entries:", error);
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchBatchGroups();
    fetchEntries();
  }, []);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    fetchEntries(filters);
  };

  const handleClearFilters = () => {
    const cleared = {
      batchGroup: "",
      status: "published",
    };

    setFilters(cleared);
    fetchEntries(cleared);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendToLic = async () => {
    try {
      await API.put("/timetable-entries/send-to-lic");
      alert("Timetable sent to LIC ✅");
    } catch (err) {
      alert("Error sending timetable");
    }
  };

  const timeSlots = useMemo(() => {
    const uniqueSlots = new Map();

    entries.forEach((entry) => {
      const slotKey = `${entry.startTime}-${entry.endTime}`;
      if (!uniqueSlots.has(slotKey)) {
        uniqueSlots.set(slotKey, {
          startTime: entry.startTime,
          endTime: entry.endTime,
        });
      }
    });

    return Array.from(uniqueSlots.values()).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  }, [entries]);

  const groupedSessions = useMemo(() => {
    const grouped = {};

    weekdays.forEach((day) => {
      grouped[day] = {};
      timeSlots.forEach((slot) => {
        const key = `${slot.startTime}-${slot.endTime}`;
        grouped[day][key] = [];
      });
    });

    entries.forEach((entry) => {
      const slotKey = `${entry.startTime}-${entry.endTime}`;

      if (weekdays.includes(entry.day)) {
        if (!grouped[entry.day]) grouped[entry.day] = {};
        if (!grouped[entry.day][slotKey]) grouped[entry.day][slotKey] = [];
        grouped[entry.day][slotKey].push(entry);
      }
    });

    return grouped;
  }, [entries, timeSlots]);

  return (
    <div className="resource-section">
      <div className="resource-card">
        <div className="resource-topbar">
          <h2>Timetable Management</h2>
          <p>
            View the weekly timetable by batch/group and see all sessions
            arranged by weekdays and time slots.
          </p>
        </div>
      </div>

      <div className="resource-card no-print">
        <div className="resource-header resource-list-header">
          <div>
            <h3>Timetable Filters</h3>
            <p>Filter timetable using batch/group only.</p>
          </div>
        </div>

        <div className="resource-filter-grid single-filter-grid">
          <div className="resource-filter-box">
            <label>Batch / Group</label>
            <select
              className="resource-input"
              value={filters.batchGroup}
              onChange={(e) => handleInputChange("batchGroup", e.target.value)}
            >
              <option value="">All Batch / Groups</option>
              {batchGroups.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {getResourceName(batch)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="resource-action-row">
          <button className="resource-primary-btn" onClick={handleApplyFilters}>
            Apply Filter
          </button>

          <button
            className="resource-secondary-btn"
            onClick={handleClearFilters}
          >
            Clear Filter
          </button>

          <Link className="resource-link" to="/session-management">
            <button className="resource-secondary-btn">
              Go to Session Management
            </button>
          </Link>

          <button className="resource-print-btn" onClick={handlePrint}>
            Print Timetable
          </button>

          <button className="resource-primary-btn" onClick={handleSendToLic}>
            Send to LIC
          </button>
        </div>
      </div>

      <div className="resource-card">
        <div className="resource-header">
          <div>
            <h3>Weekly Timetable</h3>
            <p>Sessions are grouped into weekdays and time slots.</p>
          </div>
        </div>

        <div className="resource-table-wrapper timetable-grid-wrapper">
          <table className="resource-table timetable-grid-table">
            <thead>
              <tr>
                <th className="timeslot-column">Time Slot</th>
                {weekdays.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.length > 0 ? (
                timeSlots.map((slot) => {
                  const slotKey = `${slot.startTime}-${slot.endTime}`;

                  return (
                    <tr key={slotKey}>
                      <td className="timeslot-cell">
                        <div className="timeslot-text">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </td>

                      {weekdays.map((day) => {
                        const sessions = groupedSessions[day]?.[slotKey] || [];

                        return (
                          <td
                            key={`${day}-${slotKey}`}
                            className="timetable-day-cell"
                          >
                            {sessions.length > 0 ? (
                              <div className="session-stack">
                                {sessions.map((session) => (
                                  <div
                                    key={session._id}
                                    className="session-card"
                                  >
                                    <div className="session-module">
                                      {getResourceName(session.module)}
                                    </div>
                                    <div className="session-info">
                                      <strong>Lecturer:</strong>{" "}
                                      {getResourceName(session.lecturer)}
                                    </div>
                                    <div className="session-info">
                                      <strong>Batch:</strong>{" "}
                                      {getResourceName(session.batchGroup)}
                                    </div>
                                    <div className="session-info">
                                      <strong>Hall:</strong>{" "}
                                      {getResourceName(session.hall)}
                                    </div>
                                    <div className="session-info">
                                      <strong>Status:</strong> {session.status}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="empty-slot">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="resource-empty" colSpan="6">
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