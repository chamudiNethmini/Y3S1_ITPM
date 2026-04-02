import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Notification.css";

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

  const notificationList = useMemo(() => {
    const clashes = [];
    if (!entries.length) return clashes;

    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const first = entries[i];
        const second = entries[j];

        if (!first || !second || first.day !== second.day) continue;

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

        const firstHallId = first.hall?._id || first.hall;
        const secondHallId = second.hall?._id || second.hall;
        const sameHall =
          firstHallId && secondHallId
            ? String(firstHallId) === String(secondHallId)
            : false;

        const firstLecturerId = first.lecturer?._id || first.lecturer;
        const secondLecturerId = second.lecturer?._id || second.lecturer;
        const sameLecturer =
          firstLecturerId && secondLecturerId
            ? String(firstLecturerId) === String(secondLecturerId)
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
              module: getResourceName(first.module),
              hall: getResourceName(first.hall),
              batchGroup: getResourceName(first.batchGroup),
              lecturer: getResourceName(first.lecturer),
            },
            secondSession: {
              module: getResourceName(second.module),
              hall: getResourceName(second.hall),
              batchGroup: getResourceName(second.batchGroup),
              lecturer: getResourceName(second.lecturer),
            },
          });
        }
      }
    }

    return clashes;
  }, [entries]);

  return (
    <div className="resource-section" style={{ padding: "20px", position: "relative" }}>
      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          width: "fit-content",
        }}
        onClick={() => navigate("/session-management")}
        title="Back to Session Management"
      >
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginRight: "8px",
            color: "#555",
          }}
        >
          ←
        </span>
        <span style={{ fontSize: "16px", color: "#555", fontWeight: "500" }}>
          Back
        </span>
      </div>

      <div className="resource-card">
        <div className="resource-topbar">
          <h2>Notifications</h2>
          <p>View timetable clash notifications.</p>
        </div>
      </div>

      {newClashes.length > 0 && (
        <div
          className="resource-card"
          style={{ marginTop: "20px", border: "2px solid #ff4d4d" }}
        >
          <div className="resource-header">
            <div>
              <h3 style={{ color: "#d32f2f" }}>New Clashes Detected</h3>
              <p>All clashes for the session you just saved are shown below.</p>
            </div>
          </div>

          <div className="session-stack">
            {newClashes.map((clash, index) => (
              <div
                key={clash.id || index}
                className="session-card"
                style={{
                  marginBottom: "15px",
                  padding: "15px",
                  backgroundColor: "#fff5f5",
                }}
              >
                <div
                  className="session-module"
                  style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "10px" }}
                >
                  {clash.clashType || "Clash Detected"}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <strong>New Session:</strong>
                    <div className="session-info">
                      Module: {clash.newSession?.module || "N/A"}
                    </div>
                    <div className="session-info">
                      Lecturer: {clash.newSession?.lecturer || "N/A"}
                    </div>
                    <div className="session-info">
                      Hall: {clash.newSession?.hall || "N/A"}
                    </div>
                    <div className="session-info">
                      Time: {clash.newSession?.startTime} - {clash.newSession?.endTime}
                    </div>
                  </div>
                  <div>
                    <strong>Clashing With:</strong>
                    <div className="session-info">
                      Module: {clash.existingSession?.module || "N/A"}
                    </div>
                    <div className="session-info">
                      Lecturer: {clash.existingSession?.lecturer || "N/A"}
                    </div>
                    <div className="session-info">
                      Hall: {clash.existingSession?.hall || "N/A"}
                    </div>
                    <div className="session-info">
                      Time: {clash.existingSession?.startTime} - {clash.existingSession?.endTime}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="resource-card" style={{ marginTop: "20px" }}>
        <div className="resource-header">
          <div>
            <h3>All Clash Notifications</h3>
            <p>System detected timetable conflicts are shown below.</p>
          </div>
        </div>

        {loading ? (
          <div className="resource-empty">Loading notifications...</div>
        ) : fetchError ? (
          <div className="resource-empty" style={{ color: "red" }}>
            {fetchError}
          </div>
        ) : notificationList.length === 0 ? (
          <div className="resource-empty">No clash notifications found.</div>
        ) : (
          <div className="session-stack">
            {notificationList.map((item) => (
              <div
                key={item.id}
                className="session-card"
                style={{ borderLeft: "5px solid #ffa000", marginBottom: "15px", padding: "15px" }}
              >
                <div className="session-module" style={{ color: "#ffa000", fontWeight: "bold" }}>
                  {item.type}
                </div>
                <div className="session-info">
                  <strong>Day:</strong> {item.day} | <strong>Time:</strong> {item.startTime} -{" "}
                  {item.endTime}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <div>
                    <strong>Session 1:</strong>
                    <div>
                      {item.firstSession.module} ({item.firstSession.lecturer})
                    </div>
                    <div>Hall: {item.firstSession.hall}</div>
                    <div>Batch / Group: {item.firstSession.batchGroup}</div>
                  </div>
                  <div>
                    <strong>Session 2:</strong>
                    <div>
                      {item.secondSession.module} ({item.secondSession.lecturer})
                    </div>
                    <div>Hall: {item.secondSession.hall}</div>
                    <div>Batch / Group: {item.secondSession.batchGroup}</div>
                  </div>
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