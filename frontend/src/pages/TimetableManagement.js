import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/TimetableManagement.css";

function TimetableManagementPage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({
    batchGroup: "",
    status: "published",
  });

  const [errors, setErrors] = useState({
    batchGroup: "",
  });

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const validateFilters = () => {
    const newErrors = {
      batchGroup: "",
    };

    let isValid = true;
    const batchRegex = /^[A-Za-z0-9\s\-/.()]*$/;

    if (filters.batchGroup && !batchRegex.test(filters.batchGroup.trim())) {
      newErrors.batchGroup = "Batch / Group contains invalid characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const fetchEntries = async () => {
    if (!validateFilters()) return;

    try {
      const params = {
        status: filters.status,
      };

      if (filters.batchGroup.trim()) {
        params.batchGroup = filters.batchGroup.trim();
      }

      const res = await API.get("/timetable-entries", { params });
      setEntries(res.data || []);
    } catch (error) {
      console.error("Error fetching timetable entries:", error);
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "batchGroup") {
      setErrors((prev) => ({
        ...prev,
        batchGroup: "",
      }));
    }
  };

  const handleApplyFilters = () => {
    fetchEntries();
  };

  const handleClearFilters = () => {
    setFilters({
      batchGroup: "",
      status: "published",
    });

    setErrors({
      batchGroup: "",
    });

    setTimeout(() => {
      fetchEntries();
    }, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  // Collect all unique time slots from fetched sessions
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

    const sortedSlots = Array.from(uniqueSlots.values()).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });

    return sortedSlots;
  }, [entries]);

  // Group sessions by day and time slot
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
            <input
              className="resource-input"
              type="text"
              placeholder="Enter batch/group"
              value={filters.batchGroup}
              onChange={(e) => handleInputChange("batchGroup", e.target.value)}
            />
            {errors.batchGroup && (
              <span className="error-text">{errors.batchGroup}</span>
            )}
          </div>
        </div>

        <div className="resource-action-row">
          <button className="resource-primary-btn" onClick={handleApplyFilters}>
            Apply Filter
          </button>

          <button className="resource-secondary-btn" onClick={handleClearFilters}>
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
                          <td key={`${day}-${slotKey}`} className="timetable-day-cell">
                            {sessions.length > 0 ? (
                              <div className="session-stack">
                                {sessions.map((session) => (
                                  <div key={session._id} className="session-card">
                                    <div className="session-module">{session.module}</div>
                                    <div className="session-info">
                                      <strong>Lecturer:</strong>{" "}
                                      {session.lecturer?.name || "N/A"}
                                    </div>
                                    <div className="session-info">
                                      <strong>Batch:</strong> {session.batchGroup}
                                    </div>
                                    <div className="session-info">
                                      <strong>Hall:</strong> {session.hall}
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