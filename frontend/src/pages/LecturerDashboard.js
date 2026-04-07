import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/LecturerDashboard.css";

function LecturerDashboard() {
  const navigate = useNavigate();

  const [timetable, setTimetable] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");

  // ========== WORKLOAD HOURS BY DESIGNATION ==========
  const workloadHours = {
    Instructor: 22,
    "Assistant Lecturer": 16,
    Lecturer: 15,
    "Senior Lecturer": 12,
    "Senior Lecturer (Higher Grade)": 12,
    "Assistant Professor": 12,
    "Associate Professor": 10,
    Professor: 8,
  };

  // ========== STATIC BATCHES ==========
  const staticBatches = [
    "Y1.S2.WE.IT.01",
    "Y1.S2.WE.IT.02",
    "Y1.S2.WE.IT.03",
    "Y1.S2.WD.IT.01",
    "Y1.S2.WD.IT.02",
    "Y1.S2.WD.IT.03",
    "Y1.S2.WD.IT.04",
    "Y1.S2.WD.IT.05",
    "Y1.S2.WD.IT.06",
    "Y1.S2.WD.IT.07",
    "Y1.S2.WD.IT.08",
    "Y1.S2.WD.IT.09",
    "Y1.S2.WD.IT.10",
    "Y1.S2.WD.IT.11",
    "Y1.S2.WD.IT.12",
    "Y1.S2.WD.IT.13",
    "Y1.S2.WD.IT.14",
    "Y1.S2.WD.IT.15",
    "Y1.S2.WD.IT.16",
    "Y1.S2.WD.IT.17",
    "Y1.S2.WD.IT.01.QU",
    "Y2.S1.WD.IT.01",
    "Y2.S2.WE.IT.01",
    "Y2.S2.WE.IT.02",
    "Y2.S2.WE.IT.03",
    "Y2.S2.WE.IT.04",
    "Y2.S2.WE.CS.01",
    "Y2.S2.WE.ISE.01",
    "Y2.S2.WE.CSNE.01",
    "Y2.S2.WE.SE.01",
    "Y2.S2.WE.IM.01",
    "Y2.S2.WE.DS.01",
    "Y2.S2.WD.IT.01",
    "Y2.S2.WD.IT.02",
    "Y2.S2.WD.IT.03",
    "Y2.S2.WD.IT.04",
    "Y2.S2.WD.IT.05",
    "Y2.S2.WD.IT.06",
    "Y2.S2.WD.IT.07",
    "Y2.S2.WD.DS.01",
    "Y2.S2.WD.CS.01",
    "Y2.S2.WD.CS.02",
    "Y2.S2.WD.ISE.01",
    "Y2.S2.WD.CSNE.01",
    "Y2.S2.WD.IM.01",
    "Y2.S2.WD.SE.01",
    "Y2.S2.WD.SE.02",
    "Y3.S1.WE.IT.01",
    "Y3.S1.WE.IT.02",
    "Y3.S1.WE.IT.03",
    "Y3.S1.WE.IT.04",
    "Y3.S1.WE.IT.05",
    "Y3.S1.WE.CS.01",
    "Y3.S1.WE.ISE.01",
    "Y3.S1.WE.CSNE.01",
    "Y3.S1.WE.SE.01",
    "Y3.S1.WE.SE.02",
    "Y3.S1.WE.IM.01",
    "Y3.S1.WE.DS.01",
    "Y3.S1.WE.DS.02",
    "Y3.S1.WD.IT.01",
    "Y3.S1.WD.IT.02",
    "Y3.S1.WD.IT.03",
    "Y3.S1.WD.CSNE.01",
    "Y3.S1.WD.CS.01",
    "Y3.S1.WD.ISE.01",
    "Y3.S1.WD.SE.01",
    "Y3.S1.WD.IM.01",
    "Y3.S1.WD.DS.01",
    "Y3.S2.WE.IT.01",
    "Y3.S2.WE.IT.02",
    "Y3.S2.WE.IT.03",
    "Y3.S2.WE.IT.04",
    "Y3.S2.WE.IT.05",
    "Y3.S2.WE.CSNE.01",
    "Y3.S2.WE.CS.01",
    "Y3.S2.WE.ISE.01",
    "Y3.S2.WE.SE.01",
    "Y3.S2.WE.SE.02",
    "Y3.S2.WE.SE.03",
    "Y3.S2.WE.SE.04",
    "Y3.S2.WE.DS.01",
    "Y3.S2.WE.DS.02",
    "Y3.S2.WE.IM.01",
    "Y3.S2.WD.IT.01",
    "Y3.S2.WD.SE.01",
    "Y3.S2.WD.DS.01",
    "Y3.S2.WD.IM.01",
    "Y3.S2.WD.CS.01",
    "Y3.S2.WD.ISE.01",
    "Y3.S2.WD.CSNE.01",
    "Y4.S1.WE.IT.01",
    "Y4.S1.WE.IT.02",
    "Y4.S1.WE.IT.03",
    "Y4.S1.WE.CS.01",
    "Y4.S1.WE.ISE.01",
    "Y4.S1.WE.IM.01",
    "Y4.S1.WE.DS.01",
    "Y4.S1.WE.SE.01",
    "Y4.S1.WD.IT.01",
    "Y4.S1.WD.CS.01",
    "Y4.S1.WD.ISE.01",
    "Y4.S1.WD.IM.01",
    "Y4.S1.WD.DS.01",
    "Y4.S1.WD.SE.01",
    "Y4.S2.WE.IT.01",
    "Y4.S2.WE.IT.02",
    "Y4.S2.WE.IT.03",
    "Y4.S2.WE.IT.04",
    "Y4.S2.WE.IT.05",
    "Y4.S2.WE.IT.06",
    "Y4.S2.WE.IT.07",
    "Y4.S2.WE.IT.08",
    "Y4.S2.WE.CSNE.01",
    "Y4.S2.WE.CS.01",
    "Y4.S2.WE.ISE.01",
    "Y4.S2.WE.IM.01",
    "Y4.S2.WE.DS.01",
    "Y4.S2.WE.DS.02",
    "Y4.S2.WE.SE.01",
    "Y4.S2.WE.SE.02",
    "Y4.S2.WE.SE.03",
    "Y4.S2.WD.IT.02",
    "Y4.S2.WD.IM.01",
    "Y4.S2.WD.DS.01",
    "Y4.S2.WD.SE.01",
    "Y4.S2.WD.CSNE.01",
    "Y4.S2.WD.CS.01",
    "Y4.S2.WD.ISE.01",
  ];

  // ========== LOCATIONS ==========
  const locations = [
    "A304",
    "A503",
    "A504 Smart Classroom",
    "A505",
    "A506",
    "A507",
    "B501",
    "B502",
    "F301",
    "F302",
    "F303",
    "F502",
    "F503",
    "F1306",
    "F1307",
    "F1308",
    "G601",
    "G602",
    "G603",
    "G604",
    "G605",
    "G606",
    "G1101",
    "G1102",
    "G1103",
    "G1104",
    "G1105",
    "G1106",
    "G1401",
    "G1402",
    "B401",
    "B402",
    "B403",
    "A405",
    "A412",
    "A410",
    "A411",
    "F304",
    "F305",
    "F1301+F1302",
    "F1303+F1304",
    "F1305",
    "G1301",
    "G1302",
    "G1303",
    "G1304",
    "G1305 Linux Lab",
    "G1306",
    "CyberSecLab",
    "Emblab",
    "DClab",
    "Robotics Lab",
    "MMlab",
    "F602",
    "E102",
    "F501",
    "E105",
    "E101",
    "E106",
    "G1205",
    "F1401 & F1402",
    "F605",
    "F406",
  ];

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [selectedHall, setSelectedHall] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [hallStatus, setHallStatus] = useState("");
  const [sessionSearch, setSessionSearch] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  // ========== FETCH TIMETABLE ==========
  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await API.get("/timetable-entries/lic");
      setTimetable(res.data);
    } catch {
      alert("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  // ========== FETCH LECTURERS ==========
  const fetchLecturers = async () => {
    try {
      const res = await API.get("/resources?type=lecturer");
      setLecturers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchLecturers();
  }, []);

  // ========== BATCH FILTER ==========
  const filteredTimetable = useMemo(() => {
    if (!selectedBatch) return timetable;
    return timetable.filter((entry) => {
      const batchName =
        typeof entry.batchGroup === "string"
          ? entry.batchGroup
          : entry.batchGroup?.name || entry.batchGroup?.batchNo || "";
      return batchName === selectedBatch;
    });
  }, [timetable, selectedBatch]);

  // ========== TIME SLOTS ==========
  const timeSlots = useMemo(() => {
    const unique = new Map();
    filteredTimetable.forEach((entry) => {
      const key = `${entry.startTime}-${entry.endTime}`;
      if (!unique.has(key))
        unique.set(key, { startTime: entry.startTime, endTime: entry.endTime });
    });
    return Array.from(unique.values()).sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
  }, [filteredTimetable]);

  // ========== GROUPED SESSIONS ==========
  const groupedSessions = useMemo(() => {
    const grouped = {};
    weekdays.forEach((day) => {
      grouped[day] = {};
      timeSlots.forEach((slot) => {
        grouped[day][`${slot.startTime}-${slot.endTime}`] = [];
      });
    });
    filteredTimetable.forEach((entry) => {
      const key = `${entry.startTime}-${entry.endTime}`;
      if (weekdays.includes(entry.day)) {
        if (!grouped[entry.day]) grouped[entry.day] = {};
        if (!grouped[entry.day][key]) grouped[entry.day][key] = [];
        grouped[entry.day][key].push(entry);
      }
    });
    return grouped;
  }, [filteredTimetable, timeSlots]);

  // ========== RESOURCE NAME HELPER ==========
  const getResourceName = (resource) => {
    if (!resource) return "N/A";
    if (typeof resource === "string") return resource;
    if (resource.resourceType === "lecturer")
      return `${resource.lecturerTitle || ""} ${resource.name}`.trim();
    if (resource.resourceType === "module")
      return resource.code
        ? `${resource.code} - ${resource.name}`
        : resource.name;
    if (resource.resourceType === "batch")
      return resource.batchNo
        ? `${resource.batchNo} - ${resource.name}`
        : resource.name;
    if (resource.resourceType === "hall")
      return resource.capacity > 0
        ? `${resource.name} (Capacity: ${resource.capacity})`
        : resource.name;
    return resource.name || "N/A";
  };

  // ========== LECTURER OPTIONS FOR DROPDOWN ==========
  const lecturerOptions = useMemo(
    () =>
      lecturers.map((resource) => ({
        id: resource._id,
        label: getResourceName(resource),
      })),
    [lecturers],
  );

  const getFilteredForSession = (id) => {
    const q = (sessionSearch[id] || "").toLowerCase();
    return lecturerOptions.filter((item) =>
      item.label.toLowerCase().includes(q),
    );
  };

  // ========== CALCULATE REMAINING HOURS ==========
  const calculateRemainingHours = (lecturerId) => {
    const lec = lecturers.find((l) => l._id === lecturerId);
    if (!lec || !lec.lecturerTitle) return 0;

    const maxHours = workloadHours[lec.lecturerTitle] || 0;
    const assignedHours = lec.assignedHours || 0;

    return Math.max(0, maxHours - assignedHours);
  };

  // ========== HANDLE ASSIGN CHANGE ==========
  const handleAssignChange = (id, lecturer) => {
    setAssignments((prev) => ({ ...prev, [id]: lecturer }));
    setOpenDropdown(null);
    setSessionSearch((prev) => ({ ...prev, [id]: "" }));
  };

  // ========== SAVE ASSIGNMENT ==========
  const handleSave = async (id) => {
    const selectedLecturer = assignments[id];
    if (!selectedLecturer?.id) {
      alert("Please select a lecturer");
      return;
    }

    const entry = timetable.find((item) => item._id === id);
    if (!entry) {
      alert("Session not found");
      return;
    }

    // Check remaining hours
    if (calculateRemainingHours(selectedLecturer.id) <= 0) {
      alert("This lecturer has no remaining hours available");
      return;
    }

    try {
      await API.put(`/timetable-entries/${id}`, {
        module: entry.module?._id || entry.module,
        lecturer: selectedLecturer.id,
        batchGroup: entry.batchGroup?._id || entry.batchGroup,
        hall: entry.hall?._id || entry.hall,
        day: entry.day,
        startTime: entry.startTime,
        endTime: entry.endTime,
        status: entry.status || "sent",
      });
      alert("Lecturer assigned successfully ✅");
      fetchTimetable();
      fetchLecturers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to assign lecturer");
    }
  };

  // ========== SEND TO ADMIN ==========
  const handleSendToAdmin = async () => {
    if (!selectedBatch) {
      alert("Please select a batch to send");
      return;
    }
    try {
      await API.put("/timetable-entries/send-to-admin", {
        batchGroup: selectedBatch,
      });
      alert("Timetable sent to Admin successfully ✅");
      fetchTimetable();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to send timetable to admin",
      );
    }
  };

  // ========== HALL AVAILABILITY ==========
  const handleCheckAvailability = () => {
    if (!selectedHall || !selectedDay || !selectedTime) {
      alert("Please select hall, day, and time");
      return;
    }
    const clash = timetable.some(
      (item) =>
        item.hall?.name === selectedHall &&
        item.day === selectedDay &&
        `${item.startTime} - ${item.endTime}` === selectedTime,
    );
    setHallStatus(
      clash
        ? `❌ ${selectedHall} is already occupied on ${selectedDay} at ${selectedTime}`
        : `✅ ${selectedHall} is available on ${selectedDay} at ${selectedTime}`,
    );
  };

  // ========== CLOSE DROPDOWN ON OUTSIDE CLICK ==========
  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <Navbar />
      <div className="lecturer-page">
        {/* ========== HERO ========== */}
        <div className="lecturer-hero">
          <h1>LIC Dashboard</h1>
          <p>
            Assign lecturers to timetable modules, manage workload, and raise
            support tickets.
          </p>
        </div>

        {/* ========== STATS CARDS ========== */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <span className="stat-title">Total Lecturers</span>
            <h2>{lecturers.length}</h2>
          </div>
          <div className="stat-card stat-green">
            <span className="stat-title">Total Modules</span>
            <h2>{timetable.length}</h2>
          </div>
          <div className="stat-card stat-yellow">
            <span className="stat-title">Available Halls</span>
            <h2>{locations.length}</h2>
          </div>
        </div>

        {/* ========== SEND TO ADMIN ========== */}
        {selectedBatch && filteredTimetable.length > 0 && (
          <div className="lecturer-card">
            <div className="section-header">
              <div>
                <h3>Send Timetable to Admin</h3>
                <p>
                  After assigning lecturers, send the timetable back to admin
                  for final review and publishing.
                </p>
              </div>
            </div>
            <div className="action-row">
              <button className="primary-btn" onClick={handleSendToAdmin}>
                Send LIC Timetable to Admin
              </button>
            </div>
          </div>
        )}

        {/* ========== TICKET SECTION ========== */}
        <div className="lecturer-card">
          <div className="section-header">
            <div>
              <h3>Raise a Ticket</h3>
              <p>
                Create a support request and send it to admin or coordinator.
              </p>
            </div>
          </div>
          <div className="form-grid two-cols">
            <div className="form-group">
              <label>Support Type</label>
              <input
                type="text"
                className="lecturer-input"
                value="Ticket Request"
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <input
                type="text"
                className="lecturer-input"
                value="Admin / Coordinator"
                readOnly
              />
            </div>
          </div>
          <div className="action-row">
            <button className="primary-btn" onClick={() => navigate("/ticket")}>
              Raise Ticket
            </button>
          </div>
        </div>

        {/* ========== SUPPORT INFO ========== */}
        <div className="lecturer-card">
          <div className="section-header">
            <div>
              <h3>Support Information</h3>
              <p>Use the ticket system to submit issues and check replies.</p>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="lic-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Create Ticket",
                    "Send a new request to admin or coordinator",
                  ],
                  [
                    "Track My Tickets",
                    "View previously submitted tickets and current status",
                  ],
                  [
                    "View Replies",
                    "Check responses sent by admin or coordinator",
                  ],
                ].map(([feat, desc]) => (
                  <tr key={feat}>
                    <td>{feat}</td>
                    <td>{desc}</td>
                    <td>
                      <span className="status-badge resolved">Available</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== LECTURER WORKLOAD TABLE ========== */}
        <div className="lecturer-card">
          <h3>Lecturer Workload Overview</h3>
          <div className="table-wrapper">
            <table className="lic-table">
              <thead>
                <tr>
                  <th>Lecturer Name</th>
                  <th>Designation</th>
                  <th>Max Hours</th>
                  <th>Assigned Hours</th>
                  <th>Remaining Hours</th>
                </tr>
              </thead>
              <tbody>
                {lecturers.length > 0 ? (
                  lecturers.map((lec) => {
                    const designation = lec.lecturerTitle || "Not Set";
                    const maxHours = workloadHours[designation] || 0;
                    const assignedHours = lec.assignedHours || 0;
                    const remainingHours = Math.max(
                      0,
                      maxHours - assignedHours,
                    );

                    return (
                      <tr key={lec._id}>
                        <td>
                          <strong>{lec.name}</strong>
                        </td>
                        <td>
                          <span className="designation-badge">
                            {designation}
                          </span>
                        </td>
                        <td>
                          <span className="max-hours">{maxHours} hrs</span>
                        </td>
                        <td>
                          <span className="assigned-hours">
                            {assignedHours.toFixed(1)} hrs
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              remainingHours > 0
                                ? "hours-available"
                                : "hours-full"
                            }
                          >
                            {remainingHours.toFixed(1)} hrs
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#999",
                      }}
                    >
                      No lecturers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========== TIMETABLE GRID ========== */}
        <div className="lecturer-card">
          <h3>Assign Lecturers to Timetable</h3>

          {/* BATCH FILTER */}
          <div className="batch-filter-row">
            <label>Filter by Batch:</label>
            <select
              className="hall-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">— All Batches —</option>
              {staticBatches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {selectedBatch && (
              <>
                <button
                  className="resource-secondary-btn"
                  onClick={() => setSelectedBatch("")}
                >
                  Clear Filter
                </button>
                <span className="filtered-count">
                  Showing {filteredTimetable.length} session(s) for{" "}
                  <strong>{selectedBatch}</strong>
                </span>
              </>
            )}
          </div>

          <div className="table-wrapper timetable-grid-wrapper">
            {loading ? (
              <p style={{ padding: "20px", textAlign: "center" }}>
                Loading timetable...
              </p>
            ) : (
              <table className="lic-table timetable-grid-table">
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
                            const sessions =
                              groupedSessions[day]?.[slotKey] || [];
                            return (
                              <td
                                key={`${day}-${slotKey}`}
                                className="timetable-day-cell"
                              >
                                {sessions.length > 0 ? (
                                  <div className="session-stack">
                                    {sessions.map((session) => {
                                      const sid = session._id;
                                      const chosen =
                                        assignments[sid]?.label || "";
                                      const isOpen = openDropdown === sid;
                                      const filtered =
                                        getFilteredForSession(sid);

                                      return (
                                        <div key={sid} className="session-card">
                                          <div className="session-module">
                                            {getResourceName(session.module)}
                                          </div>
                                          <div className="session-info">
                                            <strong>Batch:</strong>{" "}
                                            {getResourceName(
                                              session.batchGroup,
                                            )}
                                          </div>
                                          <div className="session-info">
                                            <strong>Hall:</strong>{" "}
                                            {getResourceName(session.hall)}
                                          </div>
                                          <div className="session-info">
                                            <strong>Status:</strong>{" "}
                                            {session.status}
                                          </div>
                                          <div className="session-info">
                                            <strong>Lecturer:</strong>{" "}
                                            {session.lecturer ? (
                                              getResourceName(session.lecturer)
                                            ) : (
                                              <span
                                                style={{ color: "#e67e22" }}
                                              >
                                                Not Assigned
                                              </span>
                                            )}
                                          </div>

                                          {/* SEARCHABLE DROPDOWN */}
                                          <div
                                            style={{
                                              position: "relative",
                                              marginTop: "6px",
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <input
                                              type="text"
                                              className="lecturer-input"
                                              placeholder="Search lecturer..."
                                              value={
                                                isOpen
                                                  ? sessionSearch[sid] || ""
                                                  : chosen
                                              }
                                              onFocus={() => {
                                                setOpenDropdown(sid);
                                                setSessionSearch((p) => ({
                                                  ...p,
                                                  [sid]: "",
                                                }));
                                              }}
                                              onChange={(e) => {
                                                setOpenDropdown(sid);
                                                setSessionSearch((p) => ({
                                                  ...p,
                                                  [sid]: e.target.value,
                                                }));
                                              }}
                                              style={{
                                                width: "100%",
                                                fontSize: "12px",
                                              }}
                                            />
                                            {isOpen && (
                                              <div className="dropdown-menu">
                                                {filtered.length > 0 ? (
                                                  filtered.map((lecturer) => (
                                                    <div
                                                      key={lecturer.id}
                                                      className="dropdown-item"
                                                      onClick={() =>
                                                        handleAssignChange(
                                                          sid,
                                                          lecturer,
                                                        )
                                                      }
                                                    >
                                                      {lecturer.label}
                                                    </div>
                                                  ))
                                                ) : (
                                                  <div className="dropdown-empty">
                                                    No results found
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>

                                          <button
                                            className="primary-btn"
                                            style={{
                                              marginTop: "6px",
                                              fontSize: "12px",
                                              padding: "4px 10px",
                                            }}
                                            onClick={() => handleSave(sid)}
                                          >
                                            Save
                                          </button>
                                        </div>
                                      );
                                    })}
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
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          color: "#999",
                        }}
                      >
                        {selectedBatch
                          ? `No sessions found for batch "${selectedBatch}"`
                          : "No timetable entries found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ========== HALL AVAILABILITY CHECKER ========== */}
        <div className="lecturer-card">
          <h3>Check Hall Availability</h3>
          <div className="hall-checker">
            <select
              className="hall-select"
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
            >
              <option value="">Select Hall</option>
              {locations.map((hall, i) => (
                <option key={i} value={hall}>
                  {hall}
                </option>
              ))}
            </select>
            <select
              className="hall-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Select Day</option>
              {weekdays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              className="hall-select"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Select Time</option>
              {timeSlots.map((slot) => (
                <option
                  key={`${slot.startTime}-${slot.endTime}`}
                  value={`${slot.startTime} - ${slot.endTime}`}
                >
                  {slot.startTime} - {slot.endTime}
                </option>
              ))}
            </select>
            <button className="primary-btn" onClick={handleCheckAvailability}>
              Check Availability
            </button>
          </div>
          {hallStatus && <div className="hall-status-result">{hallStatus}</div>}
        </div>
      </div>
    </>
  );
}

export default LecturerDashboard;
