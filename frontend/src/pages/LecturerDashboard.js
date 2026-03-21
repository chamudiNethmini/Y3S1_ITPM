import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/LecturerDashboard.css";

function LecturerDashboard() {

  const [timetable, setTimetable] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [assignments, setAssignments] = useState({});

  const [loading, setLoading] = useState(false);

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

      // only LIC users
      const licUsers = res.data.filter(user => user.role === "lic");
      setLecturers(licUsers);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchLecturers();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleAssignChange = (id, lecturerId) => {
    setAssignments(prev => ({
      ...prev,
      [id]: lecturerId
    }));
  };

  // ================= SAVE =================
  const handleSave = async (id) => {
    const lecturerId = assignments[id];

    if (!lecturerId) {
      alert("Please select a lecturer");
      return;
    }

    try {
      await API.put(`/timetable/assign/${id}`, {
        lecturerId
      });

      alert("Lecturer assigned successfully ✅");

    } catch (error) {
      alert("Failed to assign lecturer");
    }
  };

  return (
    <>
      <Navbar />

      <div className="lecturer-page">

        {/* HERO */}
        <div className="lecturer-hero">
          <h1>LIC Dashboard</h1>
          <p>Assign lecturers to timetable modules.</p>
        </div>

        {/* TABLE */}
        <div className="lecturer-card">

          <h3>Add lecturer's for Timetable</h3>

          <table className="lic-table">
            <thead>
              <tr>
                <th>Module Code</th>
                <th>Subject</th>
                <th>Day</th>
                <th>Time</th>
                <th>Assign Lecturer</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : timetable.length > 0 ? (
                timetable.map((item) => (
                  <tr key={item._id}>

                    <td>{item.moduleCode}</td>
                    <td>{item.subject}</td>
                    <td>{item.day}</td>
                    <td>{item.time}</td>

                    <td>
                      <select
                        value={assignments[item._id] || ""}
                        onChange={(e) =>
                          handleAssignChange(item._id, e.target.value)
                        }
                      >
                        <option value="">Select Lecturer</option>

                        {lecturers.map((lec) => (
                          <option key={lec._id} value={lec._id}>
                            {lec.name}
                          </option>
                        ))}
                      </select>
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
                  <td colSpan="6">No timetable found</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
}

export default LecturerDashboard;