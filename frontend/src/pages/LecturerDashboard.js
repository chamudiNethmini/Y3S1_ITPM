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

  const staticLecturerNames = [
    "Prof. Nuwan Kodagoda",
    "Prof. Pradeep Abeygunawardhana",
    "Prof. Koliya Pulasinghe",
    "Prof. Mahesha Kapurubandara",
    "Prof. Samantha Thelijjagoda",
    "Prof. Anuradha Karunasena",
    "Prof. Dasuni Nawinna",
    "Prof. Anuradha Jayakody",
    "Prof. Samantha Rajapakshe",
    "Prof. Dilshan De Silva",
    "Dr. Dharshana Kasthurirathne",
    "Dr. Malitha Wijesundara",
    "Dr. Kalpani Manathunga",
    "Dr. Jayantha Amararachchi",
    "Dr. Jeewanee Bamunusinghe",
    "Dr. Harinda Sahadeva Fernando",
    "Dr. Bhagya Nathali Silva",
    "Dr. Sanvitha Kasturiarachchi",
    "Dr. Nimal Ratnayake",
    "Dr. Lakmini Abeywardhana",
    "Dr. Kapila Disanayaka",
    "Dr. Junius Anjana Amaranath",
    "Dr. Mahima Milinda Alwis Weerasinghe",
    "Dr. Prasanna Sumathipala",
    "Dr. Dinuka Wijendra",
    "Mr. Jagath Wickramarathne",
    "Ms. Uthpala Samarakoon",
    "Mr. Amila Senarathne",
    "Ms. Sanjeevi Chandrasiri",
    "Ms. Shashika Lokuliyana",
    "Mr. Kavinga Yapa Abeywardene",
    "Mr. Aruna Ishara Gamage",
    "Ms. Hansika Mahaadikara",
    "Ms. Lokesha Prasadini",
    "Mr. Nelum Chathuranga Amarasena",
    "Ms. Suranjini Silva",
    "Mr. Jeewaka Perera",
    "Ms. Thilini Jayalath",
    "Ms. Jenny Kishara",
    "Mr. Paramabadu Wickramasuriyage Sarath",
    "Mr. Sanjeeva Perera",
    "Ms. Chathurangika Kahandawarachchi",
    "Ms. Gaya Thamali Dassanayake",
    "Mr. Kanishka Yapa",
    "Ms. Hansi de Silva",
    "Mr. Vishan Danura Jayasinghearachchi",
    "Mr. Didula Chamara Thanaweera Arachchi",
    "Ms. Narmada Gamage",
    "Mr. Samadhi Chathuranga Rathnayake",
    "Ms. Buddhima Attanayaka",
    "Ms. Dinithi Sarithma Pandithage",
    "Ms. Vindhya Dilini Kalapuge",
    "Ms. Ishara Weerathunga",
    "Ms. Thamali Bandara Kelegama",
    "Mr. Indunil Vishvajith Daluwatte",
    "Mr. Uditha Dharmakeerthi",
    "Mr. Madu Rathnayake",
    "Mr. Suresh Niroshan Fernando",
    "Ms. Shalini Rupasinghe",
    "Ms. Karthiga Rajendran",
    "Ms. Poorna Gayathri Panduwawala",
    "Ms. Poojani Gunathilake",
    "Ms. Rangi Prarthana Babarande Liyanage",
    "Ms. Aruni Premarathne",
    "Ms. Akshi Himahansi De Silva",
    "Ms. Kaushika Kavindi Kahatapitiya",
    "Ms. Mihiri Samaraweera",
    "Ms. Nimasha Nimmi Chinthaka",
    "Ms. Sasini Hathurusinghe",
    "Ms. Tharushi Rubasinghe",
    "Mr. Deemantha Nayanajith Siriwardana",
    "Ms. Kaushalya Gayathri Rajapakse",
    "Ms. Kaveesha Menuji Wickramarathne",
    "Ms. Chamali Pabasara",
    "Ms. Thisara Shyamalee",
    "Ms. Aparna Jayawardena",
    "Ms. Malithi Nawarathne",
    "Mr. Tharaniyawarma Kumaralingam",
    "Ms. Sandeepa Gamage",
    "Mr. Dinith Primal",
    "Mr. Hanojhan Rajahrajasingh",
    "Ms. Ayesha Dilhani Wijesooriya",
    "Ms. Kalna Vihara Peiris",
    "Mr. Ashvinda Iddamalgoda",
    "Mr. Eishan Weerasinghe",
    "Ms. Madusha Sulakshi Weerasooriya",
    "Ms. Pubudika Wijesundara",
    "Ms. Shashini Kumarasinghe",
    "Ms. Samali Amarasekara",
    "Mr. Amila Alexander",
    "Ms. Heshani Sathmini",
    "Ms. Chathurya Kumarapperuma",
    "Ms. Osuri Vikma Dunuwila",
    "Ms. Chathushki Chathumali",
    "Ms. Nushkan Nismi",
    "Ms. Fathima Fanoon Raheem",
    "Mr. Asiri Gawesha",
    "Ms. Madumini Gunaratne",
    "Ms. Heshani Sathmini Bopage",
    "Ms. Nilakma Welgama",
    "Ms. Lakshi Lochana Nanayakkara",
    "Ms. Anjalie Gamage",
    "Mr. Dammika De silva",
    "Ms. Geethanjali Wimalaratne",
    "Ms. Manori Gamage",
    "Mr. S.M.B.Harshanath",
    "Ms. Nilushi Dias",
    "Ms. Malika Lakmali",
    "Ms. Uthmani Thathsarani",
    "Ms. Mathishi Adya Dissanayake",
    "Ms. Sadeepa Dushanthi Kuruppu",
    "Ms. Dilani Lunugalage",
    "Ms. Kalani Kasthuriarachchi",
    "Ms. Dilini Edirisingha",
    "Ms. Nirodha Kiriella",
    "Ms. Maheshi Jayasinghe",
    "Mr. Abisheka Withanage",
    "Ms. Nadeema Hansani",
    "Ms. Rasani Wijerathna",
    "Ms. Bawanthi Gunasekara",
    "Ms. Mokshika Perera",
    "Ms. Dayani Kaushalya",
    "Ms. Devmini Poornima",
    "Mr. Malshan Gunasekara",
    "Mr. Sahan Dhananjaya",
    "Ms. Nipuni Jayarathna",
    "Ms. Wathsala Rathnayake",
    "Ms. Chamina Sewwandi",
    "Ms. Helani Herath",
    "Ms. Thriyashi Silva",
    "Ms. Nipuni Amarasighe",
    "Ms. Kaveesha Amandi",
    "Ms. Hashini Rajapaksha",
    "Ms. Hiruni Peiris",
    "Ms. Kasuni Navodana",
    "Ms. Nadeeshani Wickramage",
    "Mr. Tharindu Wirasagoda",
    "Mr. Sharaf Mawjood",
    "Ms. Dinithi Dilshani",
    "Ms. Koshila Muthumali",
    "Ms. Maneesha Weragoda",
    "Ms. Dulya Perera",
    "Ms. Subodha Subasingha",
    "Ms. Tasikala Rathnayake",
    "Ms. Chalani Bhagya",
    "Ms. Hasini Herath",
    "Ms. Cheshani Peiris",
    "Ms. Devindi Perera",
    "Ms. Sameeri Subasinghe",
    "Ms. Sasangi Harischandra",
    "Ms. Malki Kumarage",
    "Ms. Prabhashini Jayasinghe",
    "Ms. Seshmi Senadheera",
    "Mr. Pasidhu Gulawita",
    "Ms. Jasmi Gunasekara",
    "Ms. Kugathasan Vethurja",
    "Mr. Yashmika Saparamadu",
    "Ms. Hiruni Herath",
    "Mr. Tharusha Perera",
    "Ms. Minuli Samaraweera",
    "Ms. Sugandhi Kalansooriya",
    "Ms. Sajani Kolabage",
    "Mr. Theshan Senanayake",
    "Ms. Prashanthi Dissanayake",
    "Ms. Santhushi Hemachandra",
    "Ms. Harini Gunawardana",
    "Ms. Piumi Navoda",
    "Mr. Bhanuka Edirisinghe",
    "Mr. Janidu Illesinghe",
    "Mr. Jaliya Wijayaraja",
    "Ms. Gayanthika Dayananda",
    "Ms. Mayumi Maleesha",
    "Ms. Sakuni Samara",
    "Mr. Sandun Meesara",
    "Mr. Muditha Kumara",
    "Ms. Nimesha Shalika",
    "Ms. Chanudi Tharushika",
    "Mr. Chalana Janith",
    "Ms. Vijini Tharushika",
    "Mr. Vishwa Gurusinghe",
    "Ms. Umayangana Wijayasiri",
    "Mr. Ranga Samaraweera",
    "Ms. Sashini Warnasooriya",
    "Ms. Maleesha Shavindi",
    "Mr. Chris Perera",
    "Ms. Minoli Rashmitha",
    "Mr. Dinusha Ukwaththage",
    "Ms. Isuri Yapa",
    "Ms. Saara Kaizer",
    "Mr. Manuka Rashen",
    "Ms. Shehani Dehipola",
    "Mr. Shashik Dulan",
    "Ms. Kaushalya Premarathne",
    "Ms. Iresha Bodhinayayana",
    "Mr. Sachintha Weththasinghe",
    "Mr. Saadhiq Hassaan",
    "Ms. Madhawie Sewwandi",
    "Mr. Dhanushka Balasingham",
    "Ms. Pavani Liyanage",
    "Mr. Charith Dabare",
    "Ms. Anuththara Hettiarachchi",
    "Ms. Yasassi Suriyabandara",
    "Ms. Lashika Chamini",
    "Ms. Hansika Peiris",
    "Mr. Dinal Senadheera",
    "Ms. Naduni Ranatunga",
    "VL IT 01",
    "VL IT 02",
    "VL IT 03",
    "VL DS 01",
    "VL DS 02",
    "VL DS 03",
    "VL SE 01",
    "VL SE 02",
    "VL SE 03",
    "VL IM 01",
    "VL IM 02",
    "VL IM 03",
    "VL CSNE 01",
    "VL CSNE 02",
    "VL CSNE 03",
    "VL CS 01",
    "VL CSN 02",
    "VL CS 03",
    "VL ISE 01",
    "VL ISE 02",
    "VL ISE 03",
    "INS 01",
    "INS 02",
  ];

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

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await API.get("/timetable/lic");
      setTimetable(res.data);
    } catch {
      alert("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

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

  // ── Batch filter ────────────────────────────────────────────────────────────
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

  // ── Time slots & grouped sessions (from filteredTimetable) ─────────────────
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

  // ── Resource name helper ────────────────────────────────────────────────────
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

  // ── Workload ────────────────────────────────────────────────────────────────
  const calculateRemainingHours = (lecturerId) => {
    const lec = lecturers.find((l) => l._id === lecturerId);
    if (!lec || !lec.designation) return 0;
    return (workloadHours[lec.designation] || 0) - (lec.assignedHours || 0);
  };

  // ── Assignment ──────────────────────────────────────────────────────────────
  const handleAssignChange = (id, name) => {
    setAssignments((prev) => ({ ...prev, [id]: name }));
    setOpenDropdown(null);
    setSessionSearch((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSave = async (id) => {
    const lecturerName = assignments[id];
    if (!lecturerName) {
      alert("Please select a lecturer");
      return;
    }
    try {
      await API.put(`/timetable/assign/${id}`, { lecturerName });
      alert("Lecturer assigned successfully ✅");
      fetchTimetable();
      fetchLecturers();
    } catch {
      alert("Failed to assign lecturer");
    }
  };

  // ── Hall availability ───────────────────────────────────────────────────────
  const handleCheckAvailability = () => {
    if (!selectedHall || !selectedDay || !selectedTime) {
      alert("Please select hall, day, and time");
      return;
    }
    const clash = timetable.some(
      (item) =>
        item.hall === selectedHall &&
        item.day === selectedDay &&
        item.time === selectedTime,
    );
    setHallStatus(
      clash
        ? `❌ ${selectedHall} is already occupied on ${selectedDay} at ${selectedTime}`
        : `✅ ${selectedHall} is available on ${selectedDay} at ${selectedTime}`,
    );
  };

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // ── Searchable dropdown per session ────────────────────────────────────────
  const getFilteredForSession = (id) => {
    const q = (sessionSearch[id] || "").toLowerCase();
    return staticLecturerNames.filter((n) => n.toLowerCase().includes(q));
  };

  return (
    <>
      <Navbar />
      <div className="lecturer-page">
        {/* HERO */}
        <div className="lecturer-hero">
          <h1>LIC Dashboard</h1>
          <p>
            Assign lecturers to timetable modules, manage workload, and raise
            support tickets.
          </p>
        </div>

        {/* STATS */}
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

        {/* TICKET */}
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

        {/* WORKLOAD */}
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
                        <td>
                          {lec.lecturerTitle} {lec.name}
                        </td>
                        <td>{lec.moduleCode || "-"}</td>
                        <td>{lec.designation || "Not Set"}</td>
                        <td>{maxHours} hrs</td>
                        <td>{assignedHours} hrs</td>
                        <td>
                          <span
                            className={
                              remainingHours > 0
                                ? "hours-available"
                                : "hours-full"
                            }
                          >
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

        {/* ── TIMETABLE GRID ── */}
        <div className="lecturer-card">
          <h3>Assign Lecturers to Timetable</h3>

          {/* BATCH FILTER */}
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <label style={{ fontWeight: "600", fontSize: "14px" }}>
              Filter by Batch:
            </label>
            <select
              className="hall-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              style={{ minWidth: "220px" }}
            >
              <option value="">— All Batches —</option>
              {staticBatches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {selectedBatch && (
              <button
                className="resource-secondary-btn"
                onClick={() => setSelectedBatch("")}
                style={{ padding: "6px 14px", fontSize: "13px" }}
              >
                Clear Filter
              </button>
            )}
            {selectedBatch && (
              <span style={{ fontSize: "13px", color: "#666" }}>
                Showing {filteredTimetable.length} session(s) for{" "}
                <strong>{selectedBatch}</strong>
              </span>
            )}
          </div>

          <div className="table-wrapper timetable-grid-wrapper">
            {loading ? (
              <p>Loading...</p>
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
                                      const chosen = assignments[sid] || "";
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

                                          {/* Searchable dropdown */}
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
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  top: "100%",
                                                  left: 0,
                                                  right: 0,
                                                  maxHeight: "180px",
                                                  overflowY: "auto",
                                                  background: "#fff",
                                                  border: "1px solid #ddd",
                                                  borderRadius: "6px",
                                                  zIndex: 999,
                                                  boxShadow:
                                                    "0 4px 12px rgba(0,0,0,0.12)",
                                                }}
                                              >
                                                {filtered.length > 0 ? (
                                                  filtered.map((name) => (
                                                    <div
                                                      key={name}
                                                      onClick={() =>
                                                        handleAssignChange(
                                                          sid,
                                                          name,
                                                        )
                                                      }
                                                      style={{
                                                        padding: "7px 12px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                        borderBottom:
                                                          "1px solid #f0f0f0",
                                                      }}
                                                      onMouseEnter={(e) =>
                                                        (e.currentTarget.style.background =
                                                          "#f5f7ff")
                                                      }
                                                      onMouseLeave={(e) =>
                                                        (e.currentTarget.style.background =
                                                          "#fff")
                                                      }
                                                    >
                                                      {name}
                                                    </div>
                                                  ))
                                                ) : (
                                                  <div
                                                    style={{
                                                      padding: "8px 12px",
                                                      color: "#999",
                                                      fontSize: "12px",
                                                    }}
                                                  >
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

        {/* HALL AVAILABILITY */}
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
