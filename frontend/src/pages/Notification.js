import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/TimetableManagement.css";

function Notification() {
  const location = useLocation();
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const newClashes = Array.isArray(location.state?.newClashes)
    ? location.state.newClashes
    : [];

  useEffect(() => {
    fetchTimetableEntries();
  }, []);

  const fetchTimetableEntries = async () => {
    try {
      setLoading(true);
      setFetchError("");

      const res = await API.get("/timetable-entries");
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching timetable entries:", error);
      setFetchError("Failed to load notifications.");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const toMinutes = (time) => {
    if (!time || typeof time !== "string") return null;

    const parts = time.split(":");
    if (parts.length !== 2) return null;

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

    return hours * 60 + minutes;
  };

  const notificationList = useMemo(() => {
    const clashes = [];

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const first = entries[i];
        const second = entries[j];

        if (!first || !second) continue;

        const sameDay = first.day === second.day;
        if (!sameDay) continue;

        const firstStart = toMinutes(first.startTime);
        const firstEnd = toMinutes(first.endTime);
        const secondStart = toMinutes(second.startTime);
        const secondEnd = toMinutes(second.endTime);

        if (
          firstStart === null ||
          firstEnd === null ||
          secondStart === null ||
          secondEnd === null
        ) {
          continue;
        }

        const timeOverlap = firstStart < secondEnd && secondStart < firstEnd;
        if (!timeOverlap) continue;

        const sameHall =
          String(first.hall || "").trim().toLowerCase() ===
          String(second.hall || "").trim().toLowerCase();

        const firstLecturerId =
          first.lecturer && typeof first.lecturer === "object"
            ? first.lecturer._id
            : first.lecturer;

        const secondLecturerId =
          second.lecturer && typeof second.lecturer === "object"
            ? second.lecturer._id
            : second.lecturer;

        const sameLecturer =
          firstLecturerId && secondLecturerId
            ? firstLecturerId === secondLecturerId
            : false;

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
            id: `${first._id || i}-${second._id || j}`,
            type: clashType,
            day: first.day || "N/A",
            startTime: first.startTime || "N/A",
            endTime: first.endTime || "N/A",
            firstSession: {
              module: first.module || "N/A",
              hall: first.hall || "N/A",
              batchGroup: first.batchGroup || "N/A",
              lecturer:
                first.lecturer && typeof first.lecturer === "object"
                  ? first.lecturer.name || "N/A"
                  : "N/A",
            },
            secondSession: {
              module: second.module || "N/A",
              hall: second.hall || "N/A",
              batchGroup: second.batchGroup || "N/A",
              lecturer:
                second.lecturer && typeof second.lecturer === "object"
                  ? second.lecturer.name || "N/A"
                  : "N/A",
            },
          });
        }
      }
    }

    return clashes;
  }, [entries]);

  return (
    <div className="resource-section">
      <div className="resource-card">
        <div className="resource-topbar">
          <h2>Notifications</h2>
          <p>View timetable clash notifications.</p>
        </div>
      </div>

      <div className="resource-card no-print">
        <div className="resource-action-row">
          <button
            className="resource-secondary-btn"
            onClick={() => navigate("/session-management")}
          >
            Back to Session Management
          </button>
        </div>
      </div>

      {newClashes.length > 0 && (
        <div className="resource-card">
          <div className="resource-header">
            <div>
              <h3>New Clashes Detected</h3>
              <p>All clashes for the session you just saved are shown below.</p>
            </div>
          </div>

          <div className="session-stack">
            {newClashes.map((clash, index) => (
              <div key={clash.id || index} className="session-card">
                <div className="session-module">
                  {clash.clashType || "Clash Detected"}
                </div>

                <div className="session-info">
                  <strong>New Session:</strong>
                </div>
                <div className="session-info">
                  Module: {clash.newSession?.module || "N/A"}
                </div>
                <div className="session-info">
                  Lecturer: {clash.newSession?.lecturer || "N/A"}
                </div>
                <div className="session-info">
                  Batch / Group: {clash.newSession?.batchGroup || "N/A"}
                </div>
                <div className="session-info">
                  Hall: {clash.newSession?.hall || "N/A"}
                </div>
                <div className="session-info">
                  Day: {clash.newSession?.day || "N/A"}
                </div>
                <div className="session-info">
                  Time: {clash.newSession?.startTime || "N/A"} -{" "}
                  {clash.newSession?.endTime || "N/A"}
                </div>

                <div className="session-info" style={{ marginTop: "12px" }}>
                  <strong>Clashing With:</strong>
                </div>
                <div className="session-info">
                  Module: {clash.existingSession?.module || "N/A"}
                </div>
                <div className="session-info">
                  Lecturer: {clash.existingSession?.lecturer || "N/A"}
                </div>
                <div className="session-info">
                  Batch / Group: {clash.existingSession?.batchGroup || "N/A"}
                </div>
                <div className="session-info">
                  Hall: {clash.existingSession?.hall || "N/A"}
                </div>
                <div className="session-info">
                  Day: {clash.existingSession?.day || "N/A"}
                </div>
                <div className="session-info">
                  Time: {clash.existingSession?.startTime || "N/A"} -{" "}
                  {clash.existingSession?.endTime || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="resource-card">
        <div className="resource-header">
          <div>
            <h3>All Clash Notifications</h3>
            <p>System detected timetable conflicts are shown below.</p>
          </div>
        </div>

        {loading ? (
          <div className="resource-empty">Loading notifications...</div>
        ) : fetchError ? (
          <div className="resource-empty">{fetchError}</div>
        ) : notificationList.length === 0 ? (
          <div className="resource-empty">No clash notifications found.</div>
        ) : (
          <div className="session-stack">
            {notificationList.map((item) => (
              <div key={item.id} className="session-card">
                <div className="session-module">{item.type}</div>

                <div className="session-info">
                  <strong>Day:</strong> {item.day}
                </div>
                <div className="session-info">
                  <strong>Time:</strong> {item.startTime} - {item.endTime}
                </div>

                <div className="session-info" style={{ marginTop: "10px" }}>
                  <strong>Session 1:</strong>
                </div>
                <div className="session-info">
                  Module: {item.firstSession.module}
                </div>
                <div className="session-info">
                  Lecturer: {item.firstSession.lecturer}
                </div>
                <div className="session-info">Hall: {item.firstSession.hall}</div>
                <div className="session-info">
                  Batch / Group: {item.firstSession.batchGroup}
                </div>

                <div className="session-info" style={{ marginTop: "10px" }}>
                  <strong>Session 2:</strong>
                </div>
                <div className="session-info">
                  Module: {item.secondSession.module}
                </div>
                <div className="session-info">
                  Lecturer: {item.secondSession.lecturer}
                </div>
                <div className="session-info">Hall: {item.secondSession.hall}</div>
                <div className="session-info">
                  Batch / Group: {item.secondSession.batchGroup}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;