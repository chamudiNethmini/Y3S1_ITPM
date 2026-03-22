import { useEffect, useState } from "react";
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

  // WORKLOAD HOURS
  const workloadHours = {
    "Instructor": 22,
    "Assistant Lecturer": 16,
    "Lecturer": 15,
    "Senior Lecturer": 12,
    "Senior Lecturer (Higher Grade)": 12,
    "Assistant Professor": 12,
    "Associate Professor": 10,
    "Professor": 8
  };

  // LOCATIONS
  const locations = [
    "A304", "A503", "A504 Smart Classroom", "A505", "A506", "A507",
    "B501", "B502", "F301", "F302", "F303", "F502", "F503",
    "F1306", "F1307", "F1308", "G601", "G602", "G603", "G604",
    "G605", "G606", "G1101", "G1102", "G1103", "G1104", "G1105",
    "G1106", "G1401", "G1402", "B401", "B402", "B403", "A405",
    "A412", "A410", "A411", "F304", "F305", "F1301+F1302",
    "F1303+F1304", "F1305", "G1301", "G1302", "G1303", "G1304",
    "G1305 Linux Lab", "G1306", "CyberSecLab", "Emblab", "DClab",
    "Robotics Lab", "MMlab", "F602", "E102", "F501", "E105",
    "E101", "E106", "G1205", "F1401 & F1402", "F605", "F406"
  ];

  const [selectedHall, setSelectedHall] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [hallStatus, setHallStatus] = useState("");

  // ================= FETCH TIMETABLE =================
  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await API.get("/timetable/published");
      setTimetable(res.data);
    } catch (error) {
      alert("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH LECTURERS =================
  const fetchLecturers = async () => {
    try {
      const res = await API.get("/auth/all-users");
      const licUsers = res.data.filter((user) => user.role === "lic");
      setLecturers(licUsers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchLecturers();
  }, []);

  // ================= CALCULATE REMAINING HOURS =================
  const calculateRemainingHours = (lecturerId) => {
    const lecturer = lecturers.find((lec) => lec._id === lecturerId);
    if (!lecturer || !lecturer.designation) return 0;

    const maxHours = workloadHours[lecturer.designation] || 0;
    const assignedHours = lecturer.assignedHours || 0;
    return maxHours - assignedHours;
  };

  // ================= HANDLE ASSIGN CHANGE =================
  const handleAssignChange = (id, lecturerId) => {
    setAssignments((prev) => ({
      ...prev,
      [id]: lecturerId
    }));
  };

  // ================= SAVE ASSIGNMENT =================
  const handleSave = async (id) => {
    const lecturerId = assignments[id];

    if (!lecturerId) {
      alert("Please select a lecturer");
      return;
    }

    try {
      await API.put(`/timetable/assign/${id}`, { lecturerId });
      alert("Lecturer assigned successfully ✅");
      fetchTimetable();
      fetchLecturers();
    } catch (error) {
      alert("Failed to assign lecturer");
    }
  };

  // ================= CHECK HALL AVAILABILITY =================
  const checkHallAvailability = (hall, day, time) => {
    const clashes = timetable.filter(
      (item) => item.hall === hall && item.day === day && item.time === time
    );
    return clashes.length === 0;
  };

  const handleCheckAvailability = () => {
    if (!selectedHall || !selectedDay || !selectedTime) {
      alert("Please select hall, day, and time");
      return;
    }

    const isAvailable = checkHallAvailability(selectedHall, selectedDay, selectedTime);

    if (isAvailable) {
      setHallStatus(`✅ ${selectedHall} is available on ${selectedDay} at ${selectedTime}`);
    } else {
      setHallStatus(`❌ ${selectedHall} is already occupied on ${selectedDay} at ${selectedTime}`);
    }
  };

  return (
    <>
      <Navbar />

      <div className="lecturer-page">
        {/* HERO */}
        <div className="lecturer-hero">
          <h1>LIC Dashboard</h1>
          <p>Assign lecturers to timetable modules, manage workload, and raise support tickets.</p>
        </div>

        {/* STATS CARDS */}
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

        {/* TICKET SECTION */}
        <div className="lecturer-card">
          <div className="section-header">
            <div>
              <h3>Raise a Ticket</h3>
              <p>Create a support request and send it to admin or coordinator.</p>
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
            <button
              className="primary-btn"
              onClick={() => navigate("/ticket")}
            >
              Raise Ticket
            </button>
          </div>
        </div>

        {/* SUPPORT INFO */}
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
                <tr>
                  <td>Create Ticket</td>
                  <td>Send a new request to admin or coordinator</td>
                  <td>
                    <span className="status-badge resolved">Available</span>
                  </td>
                </tr>
                <tr>
                  <td>Track My Tickets</td>
                  <td>View previously submitted tickets and current status</td>
                  <td>
                    <span className="status-badge resolved">Available</span>
                  </td>
                </tr>
                <tr>
                  <td>View Replies</td>
                  <td>Check responses sent by admin or coordinator</td>
                  <td>
                    <span className="status-badge resolved">Available</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* LECTURER WORKLOAD TABLE */}
        <div className="lecturer-card">
          <h3>Lecturer Workload Overview</h3>

          <div className="table-wrapper">
            <table className="lic-table">
              <thead>
                <tr>
                  <th>Lecturer Name</th>
                  <th>Module Code</th>
                  <th>Designation</th>
                  <th>Max Hours</th>
                  <th>Assigned Hours</th>
                  <th>Remaining Hours</th>
                </tr>
              </thead>

              <tbody>
                {lecturers.length > 0 ? (
                  lecturers.map((lec) => {
                    const maxHours = workloadHours[lec.designation] || 0;
                    const assignedHours = lec.assignedHours || 0;
                    const remainingHours = maxHours - assignedHours;

                    return (
                      <tr key={lec._id}>
                        <td>{lec.name}</td>
                        <td>{lec.moduleCode || "-"}</td>
                        <td>{lec.designation || "Not Set"}</td>
                        <td>{maxHours} hrs</td>
                        <td>{assignedHours} hrs</td>
                        <td>
                          <span className={remainingHours > 0 ? "hours-available" : "hours-full"}>
                            {remainingHours} hrs
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">No lecturers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ASSIGN LECTURERS TABLE */}
        <div className="lecturer-card">
          <h3>Assign Lecturers to Timetable</h3>

          <div className="table-wrapper">
            <table className="lic-table">
              <thead>
                <tr>
                  <th>Module Code</th>
                  <th>Subject</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Hall</th>
                  <th>Assign Lecturer</th>
                  <th>Remaining Hours</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8">Loading...</td>
                  </tr>
                ) : timetable.length > 0 ? (
                  timetable.map((item) => (
                    <tr key={item._id}>
                      <td>{item.moduleCode}</td>
                      <td>{item.subject}</td>
                      <td>{item.day}</td>
                      <td>{item.time}</td>
                      <td>{item.hall}</td>

                      <td>
                        <select
                          value={assignments[item._id] || ""}
                          onChange={(e) => handleAssignChange(item._id, e.target.value)}
                          className="lecturer-select"
                        >
                          <option value="">Select Lecturer</option>

                          {lecturers.map((lec) => (
                            <option key={lec._id} value={lec._id}>
                              {lec.name} - {lec.moduleCode || "No Module"}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        {assignments[item._id] ? (
                          <span className="remaining-hours">
                            {calculateRemainingHours(assignments[item._id])} hrs
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        <button
                          className="primary-btn"
                          onClick={() => handleSave(item._id)}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No timetable found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* HALL AVAILABILITY CHECKER */}
        <div className="lecturer-card">
          <h3>Check Hall Availability</h3>

          <div className="hall-checker">
            <select
              className="hall-select"
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
            >
              <option value="">Select Hall</option>
              {locations.map((hall, index) => (
                <option key={index} value={hall}>
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
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>

            <select
              className="hall-select"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">Select Time</option>
              <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
              <option value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</option>
              <option value="3:00 PM - 5:00 PM">3:00 PM - 5:00 PM</option>
            </select>

            <button className="primary-btn" onClick={handleCheckAvailability}>
              Check Availability
            </button>
          </div>

          {hallStatus && (
            <div style={{ marginTop: "14px", fontWeight: "600" }}>
              {hallStatus}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default LecturerDashboard;