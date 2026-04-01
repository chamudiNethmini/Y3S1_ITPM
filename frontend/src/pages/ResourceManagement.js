import { useEffect, useRef, useState } from "react";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../services/resourceService";
import "../styles/ResourceManagement.css";

const departmentOptions = ["FOC", "FOE", "BM", "FHS"];

const lecturersByTitle = {
  "Prof.": [
    "Nuwan Kodagoda",
    "Pradeep Abeygunawardhana",
    "Koliya Pulasinghe",
    "Mahesha Kapurubandara",
    "Samantha Thelijjagoda",
    "Anuradha Karunasena",
    "Dasuni Nawinna",
    "Anuradha Jayakody",
    "Samantha Rajapakshe",
    "Dilshan De Silva",
  ],
  "Dr.": [
    "Dharshana Kasthurirathne",
    "Malitha Wijesundara",
    "Kalpani Manathunga",
    "Jayantha Amararachchi",
    "Jeewanee Bamunusinghe",
    "Harinda Sahadeva Fernando",
    "Bhagya Nathali Silva",
    "Sanvitha Kasturiarachchi",
    "Nimal Ratnayake",
    "Lakmini Abeywardhana",
  ],
  "Mr.": [
    "Jagath Wickramarathne",
    "Amila Senarathne",
    "Kavinga Yapa Abeywardene",
    "Aruna Ishara Gamage",
    "Nelum Chathuranga Amarasena",
    "Jeewaka Perera",
    "Paramabadu Wickramasuriyage Sarath",
    "Sanjeeva Perera",
    "Kanishka Yapa",
    "Vishan Danura Jayasinghearachchi",
  ],
  "Ms.": [
    "Uthpala Samarakoon",
    "Sanjeevi Chandrasiri",
    "Shashika Lokuliyana",
    "Hansika Mahaadikara",
    "Lokesha Prasadini",
    "Suranjini Silva",
    "Thilini Jayalath",
    "Jenny Kishara",
    "Chathurangika Kahandawarachchi",
    "Gaya Thamali Dassanayake",
  ],
};

const hallLocations = [
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

const moduleOptions = [
  { code: "IE1030", name: "DCN" },
  { code: "IT1120", name: "IP" },
  { code: "IT1130", name: "MC" },
  { code: "IT1140", name: "FC" },
  { code: "IT1180", name: "EAC" },
  { code: "SE1012", name: "PM" },
  { code: "SE1032", name: "CS" },
  { code: "IE1014", name: "EM" },
  { code: "IT2120", name: "PS" },
  { code: "SE2030", name: "SE" },
  { code: "IT2011", name: "AIML" },
  { code: "IT2140", name: "DDD" },
  { code: "SE1022", name: "DM" },
  { code: "IE1004", name: "CT" },
  { code: "IE1034", name: "EM II" },
  { code: "IE1024", name: "COA" },
  { code: "IE1044", name: "DE" },
  { code: "SE1052", name: "DSA" },
  { code: "SE1042", name: "EAP" },
  { code: "IT1010", name: "IP" },
  { code: "IT1020", name: "ICS" },
  { code: "IT1030", name: "MC" },
  { code: "IT1040", name: "CS" },
  { code: "IE1010", name: "EM" },
  { code: "IE1020", name: "NF" },
  { code: "IT1050", name: "OOC" },
  { code: "IT1060", name: "SPM" },
  { code: "IT1080", name: "EAP" },
  { code: "IT1090", name: "ISDM" },
  { code: "IT1100", name: "IWT" },
  { code: "IE2012", name: "SNP" },
  { code: "IE2020", name: "RS" },
  { code: "IE2021", name: "OOP" },
  { code: "IE2022", name: "ICS" },
  { code: "IE2030", name: "AE" },
  { code: "IE2031", name: "SAD" },
  { code: "IE2032", name: "SOS" },
  { code: "IE2041", name: "ISA" },
  { code: "IE2042", name: "DMSS" },
  { code: "IE2050", name: "OS" },
  { code: "IE2071", name: "DMCI" },
  { code: "IE2080", name: "DSA" },
  { code: "IT2020", name: "SE" },
  { code: "IT2030", name: "OOP" },
  { code: "IT2040", name: "DMS" },
  { code: "IT2050", name: "CN" },
  { code: "IT2060", name: "OSSA" },
  { code: "IE2010", name: "DE" },
  { code: "IE2040", name: "AI" },
  { code: "IE2051", name: "ISP" },
  { code: "IE2052", name: "ANT" },
  { code: "IE2060", name: "CSA" },
  { code: "IE2061", name: "OSSA" },
  { code: "IE2062", name: "WS" },
  { code: "IE2070", name: "ES" },
  { code: "IE2072", name: "FA" },
  { code: "IE2081", name: "OOAD" },
  { code: "IE2082", name: "DM" },
  { code: "IE2090", name: "PEPIM" },
  { code: "IT2010", name: "MAD" },
  { code: "IT2070", name: "DSA" },
  { code: "IT2080", name: "ITP" },
  { code: "IT2090", name: "PS" },
  { code: "IT2100", name: "ESD" },
  { code: "IT2110", name: "PS" },
  { code: "IE2004", name: "CN" },
  { code: "IE2024", name: "PS" },
  { code: "SE2012", name: "OOAD" },
  { code: "SE2022", name: "DAA" },
  { code: "SE2032", name: "DMS" },
  { code: "IE3010", name: "NP" },
  { code: "IE3011", name: "ISPM" },
  { code: "IE3020", name: "DSNM" },
  { code: "IE3021", name: "OBFI" },
  { code: "IE3022", name: "AIA" },
  { code: "IE3030", name: "WAN" },
  { code: "IE3031", name: "MIS" },
  { code: "IE3032", name: "NS" },
  { code: "IE3040", name: "ISM" },
  { code: "IE3041", name: "DMBI" },
  { code: "IE3042", name: "SSS" },
  { code: "IE3051", name: "EBSAD" },
  { code: "IE3052", name: "ISRM" },
  { code: "IE3112", name: "IOT&MS" },
  { code: "IT3010", name: "NDM" },
  { code: "IT3011", name: "TPSM" },
  { code: "IT3020", name: "DS" },
  { code: "IT3021", name: "DWBI" },
  { code: "IT3030", name: "PAF" },
  { code: "IT3031", name: "DS&DDA" },
  { code: "IT3040", name: "ITPM" },
  { code: "IT3050", name: "ESDSeminar" },
  { code: "SE3010", name: "SEP&QM" },
  { code: "SE3011", name: "TEM" },
  { code: "SE3020", name: "DS" },
  { code: "SE3021", name: "DI&CC" },
  { code: "SE3030", name: "SA" },
  { code: "SE3040", name: "AF" },
  { code: "SE3061", name: "UED" },
  { code: "SE3081", name: "DMS" },
  { code: "IE3050", name: "WC" },
  { code: "IE3060", name: "BMIT" },
  { code: "IE3061", name: "ISM" },
  { code: "IE3062", name: "DOSS" },
  { code: "IE3070", name: "NTP" },
  { code: "IE3071", name: "OBFII" },
  { code: "IE3072", name: "ISPM" },
  { code: "IE3080", name: "NSE" },
  { code: "IE3081", name: "ERP" },
  { code: "IE3082", name: "Crpto" },
  { code: "IE3091", name: "ISSM" },
  { code: "IE3092", name: "ISP" },
  { code: "IE3102", name: "ESIS" },
  { code: "IT3041", name: "IRWA" },
  { code: "IT3051", name: "FDM" },
  { code: "IT3060", name: "HCI" },
  { code: "IT3061", name: "MDP&CC" },
  { code: "IT3070", name: "IAS" },
  { code: "IT3071", name: "MLOM" },
  { code: "IT3080", name: "DS&A" },
  { code: "IT3090", name: "BMIT" },
  { code: "IT3110", name: "IndustryPlacement" },
  { code: "SE3031", name: "3DMA" },
  { code: "SE3041", name: "DVPD" },
  { code: "SE3050", name: "UEE" },
  { code: "SE3060", name: "DS" },
  { code: "SE3070", name: "CSSE" },
  { code: "SE3071", name: "DIP" },
  { code: "SE3080", name: "SPM" },
  { code: "SE3091", name: "GT" },
  { code: "IE4010", name: "ISM" },
  { code: "IE4011", name: "BPM" },
  { code: "IE4030", name: "VCCT" },
  { code: "IE4121", name: "BO" },
  { code: "IE4151", name: "HRIS" },
  { code: "IE4181", name: "ISAC" },
  { code: "IT4020", name: "MTIT" },
  { code: "IT4021", name: "IOTBDA" },
  { code: "IT4031", name: "VAUED" },
  { code: "IT4040", name: "DA" },
  { code: "IT4050", name: "IME" },
  { code: "IT4060", name: "ML" },
  { code: "IT4070", name: "PPW" },
  { code: "IT4090", name: "CC" },
  { code: "IT4100", name: "SQA" },
  { code: "IT4130", name: "IUP" },
  { code: "SE4010", name: "CTSE" },
  { code: "SE4031", name: "GD" },
  { code: "SE4051", name: "TDM" },
  { code: "IE4020", name: "ESIS" },
  { code: "IE4031", name: "CS" },
  { code: "IE4040", name: "IAA" },
  { code: "IE4050", name: "PDC" },
  { code: "IE4060", name: "RIS" },
  { code: "IE4071", name: "PBA" },
  { code: "IE4080", name: "SDN" },
  { code: "IE4081", name: "SCM" },
  { code: "IE4131", name: "HCI" },
  { code: "IE4201", name: "ISI&NT" },
  { code: "IT4010", name: "RP" },
  { code: "IT4011", name: "DASS" },
  { code: "IT4030", name: "IOT" },
  { code: "IT4041", name: "IISA" },
  { code: "IT4110", name: "CSNA" },
  { code: "IT4120", name: "KM" },
  { code: "SE4020", name: "MADD" },
  { code: "SE4030", name: "SSD" },
  { code: "SE4040", name: "EAD" },
  { code: "SE4041", name: "MADD" },
  { code: "SE4050", name: "DL" },
  { code: "SE4060", name: "PC" },
  { code: "SE4061", name: "MPM" },
  { code: "IE4012", name: "OH:TS" },
  { code: "IE4022", name: "SEA" },
  { code: "IE4062", name: "CFIR" },
  { code: "IE4092", name: "MLCS" },
  { code: "IE4032", name: "IW" },
  { code: "IE4042", name: "SSE" },
  { code: "IE4052", name: "HS" },
  { code: "IE4072", name: "GCLC" },
  { code: "SE2042", name: "OS" },
  { code: "SE2052", name: "PP" },
  { code: "SE2062", name: "DS" },
  { code: "SE2072", name: "SE" },
  { code: "SE2082", name: "HCI" },
  { code: "IE2034", name: "AE" },
  { code: "IE2044", name: "SMP" },
  { code: "IE2064", name: "ACOA" },
  { code: "IE2074", name: "CT" },
  { code: "IE2084", name: "CT" },
  { code: "IT1150", name: "TR" },
  { code: "IT1160", name: "DM" },
  { code: "IT1170", name: "DSA" },
  { code: "SE1020", name: "OOP" },
  { code: "SE3022", name: "" },
  { code: "SE3032", name: "" },
  { code: "SE3112", name: "" },
  { code: "IE3014", name: "" },
  { code: "SE3062", name: "" },
  { code: "SE3082", name: "" },
  { code: "IE3004", name: "" },
  { code: "IE3034", name: "" },
  { code: "IE3054", name: "" },
  { code: "IE3064", name: "" },
  { code: "IT2130", name: "OSSA" },
  { code: "IE2100", name: "DCWN" },
  { code: "IE2110", name: "NMA" },
  { code: "IT2160", name: "Prof. Skills" },
  { code: "IE2092", name: "ICS" },
  { code: "IE2102", name: "NP" },
  { code: "SE3012", name: "IME" },
  { code: "SE3092", name: "PBD" },
  { code: "SE3102", name: "RM" },
  { code: "SE3072", name: "IT" },
  { code: "SE2020", name: "WMT" },
  { code: "IT2150", name: "ITP" },
  { code: "Other", name: "" },
];

const batchOptions = [
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

function ResourceManagement() {
  const initialForm = {
    resourceType: "lecturer",
    lecturerTitle: "",
    name: "",
    batchNo: "",
    code: "",
    department: "",
    capacity: "",
    semester: "",
    academicYear: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [resources, setResources] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const formCardRef = useRef(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResources(filterType);
      setResources(data);
    } catch (error) {
      alert("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filterType]);

  const totalLecturers = resources.filter(
    (resource) => resource.resourceType === "lecturer"
  ).length;

  const totalHalls = resources.filter(
    (resource) => resource.resourceType === "hall"
  ).length;

  const totalModules = resources.filter(
    (resource) => resource.resourceType === "module"
  ).length;

  const totalBatches = resources.filter(
    (resource) => resource.resourceType === "batch"
  ).length;

  const getColumnCount = () => {
    if (filterType === "lecturer") return 5;
    if (filterType === "hall") return 6;
    if (filterType === "module") return 6;
    if (filterType === "batch") return 8;
    return 9;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.resourceType.trim()) {
      newErrors.resourceType = "Resource type is required";
    }

    if (formData.resourceType === "lecturer") {
      if (!formData.lecturerTitle.trim()) {
        newErrors.lecturerTitle = "Lecturer title is required";
      }
      if (!formData.name.trim()) {
        newErrors.name = "Lecturer name is required";
      }
      if (!formData.department.trim()) {
        newErrors.department = "Department is required";
      }
    }

    if (formData.resourceType === "hall") {
      if (!formData.name.trim()) {
        newErrors.name = "Location is required";
      }
      if (!formData.department.trim()) {
        newErrors.department = "Department is required";
      }
      if (formData.capacity === "") {
        newErrors.capacity = "Capacity is required";
      } else if (Number(formData.capacity) <= 0) {
        newErrors.capacity = "Capacity must be greater than 0";
      }
    }

    if (formData.resourceType === "module") {
      if (!formData.code.trim()) {
        newErrors.code = "Module code is required";
      }
      if (!formData.name.trim()) {
        newErrors.name = "Module name is required";
      }
      if (!formData.department.trim()) {
        newErrors.department = "Department is required";
      }
    }

    if (formData.resourceType === "batch") {
      if (!formData.batchNo.trim()) {
        newErrors.batchNo = "Batch number is required";
      }
      if (!formData.department.trim()) {
        newErrors.department = "Department is required";
      }
      if (formData.capacity === "") {
        newErrors.capacity = "Capacity is required";
      } else if (Number(formData.capacity) <= 0) {
        newErrors.capacity = "Capacity must be greater than 0";
      }
      if (!formData.semester.trim()) {
        newErrors.semester = "Semester is required";
      } else if (!/^\d$/.test(formData.semester.trim())) {
        newErrors.semester = "Semester must be only one number";
      }
      if (!formData.academicYear.trim()) {
        newErrors.academicYear = "Academic year is required";
      } else if (!/^\d$/.test(formData.academicYear.trim())) {
        newErrors.academicYear = "Academic year must be only one number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "semester" || name === "academicYear") {
      updatedValue = value.replace(/\D/g, "").slice(0, 1);
    }

    let updatedData = {
      ...formData,
      [name]: updatedValue,
    };

    if (name === "resourceType") {
      updatedData = {
        ...initialForm,
        resourceType: value,
      };
    }

    if (name === "lecturerTitle") {
      updatedData = {
        ...formData,
        lecturerTitle: value,
        name: "",
      };
    }

    if (name === "code" && formData.resourceType === "module") {
      const selectedModule = moduleOptions.find((module) => module.code === value);
      updatedData = {
        ...formData,
        code: value,
        name: selectedModule ? selectedModule.name : "",
      };
    }

    setFormData(updatedData);

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "lecturerTitle" ? { name: "" } : {}),
      ...(name === "code" ? { name: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      resourceType: formData.resourceType,
      lecturerTitle: formData.lecturerTitle.trim(),
      name:
        formData.resourceType === "batch"
          ? formData.batchNo.trim()
          : formData.name.trim(),
      batchNo: formData.batchNo.trim(),
      code: formData.code.trim(),
      department: formData.department.trim(),
      capacity: formData.capacity === "" ? 0 : Number(formData.capacity),
      semester: formData.semester.trim(),
      academicYear: formData.academicYear.trim(),
      description: formData.description.trim(),
    };

    try {
      if (editingId) {
        await updateResource(editingId, payload);
        alert("Resource updated successfully");
      } else {
        await createResource(payload);
        alert("Resource added successfully");
      }

      setFormData(initialForm);
      setEditingId(null);
      setErrors({});
      fetchResources();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save resource");
    }
  };

  const handleEdit = (resource) => {
    setEditingId(resource._id);
    setFormData({
      resourceType: resource.resourceType || "lecturer",
      lecturerTitle: resource.lecturerTitle || "",
      name: resource.name || "",
      batchNo: resource.batchNo || "",
      code: resource.code || "",
      department: resource.department || "",
      capacity: resource.capacity || "",
      semester: resource.semester || "",
      academicYear: resource.academicYear || "",
      description: resource.description || "",
    });
    setErrors({});

    setTimeout(() => {
      formCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );
    if (!confirmDelete) return;

    try {
      await deleteResource(id);
      alert("Resource deleted successfully");
      fetchResources();
    } catch (error) {
      alert("Failed to delete resource");
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setErrors({});
  };

  const getTypeClass = (type) => {
    if (type === "lecturer") return "resource-badge lecturer";
    if (type === "hall") return "resource-badge hall";
    if (type === "module") return "resource-badge module";
    if (type === "batch") return "resource-badge batch";
    return "resource-badge";
  };

  const renderLecturerFullName = (resource) =>
    [resource.lecturerTitle, resource.name].filter(Boolean).join(" ") || "-";

  const filteredResources = resources.filter((resource) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    if (resource.resourceType === "lecturer") {
      const lecturerFullName = `${resource.lecturerTitle || ""} ${
        resource.name || ""
      }`.toLowerCase();
      return lecturerFullName.includes(search);
    }

    if (resource.resourceType === "hall") {
      return (resource.name || "").toLowerCase().includes(search);
    }

    if (resource.resourceType === "module") {
      return (
        (resource.name || "").toLowerCase().includes(search) ||
        (resource.code || "").toLowerCase().includes(search)
      );
    }

    if (resource.resourceType === "batch") {
      return (resource.batchNo || resource.name || "")
        .toLowerCase()
        .includes(search);
    }

    return true;
  });

  const renderTableHeader = () => {
    if (filterType === "lecturer") {
      return (
        <tr>
          <th>Type</th>
          <th>Lecturer Name</th>
          <th>Department</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      );
    }

    if (filterType === "hall") {
      return (
        <tr>
          <th>Type</th>
          <th>Location</th>
          <th>Department</th>
          <th>Capacity</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      );
    }

    if (filterType === "module") {
      return (
        <tr>
          <th>Type</th>
          <th>Module Name</th>
          <th>Code</th>
          <th>Department</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      );
    }

    if (filterType === "batch") {
      return (
        <tr>
          <th>Type</th>
          <th>Batch Number</th>
          <th>Department</th>
          <th>Capacity</th>
          <th>Semester</th>
          <th>Academic Year</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      );
    }

    return (
      <tr>
        <th>Type</th>
        <th>Name / Batch</th>
        <th>Code</th>
        <th>Department</th>
        <th>Capacity</th>
        <th>Semester</th>
        <th>Academic Year</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    );
  };

  const renderTableRows = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={getColumnCount()} className="resource-empty">
            Loading resources...
          </td>
        </tr>
      );
    }

    if (filteredResources.length === 0) {
      return (
        <tr>
          <td colSpan={getColumnCount()} className="resource-empty">
            No resources found
          </td>
        </tr>
      );
    }

    return filteredResources.map((resource) => {
      if (filterType === "lecturer") {
        return (
          <tr key={resource._id}>
            <td>
              <span className={getTypeClass(resource.resourceType)}>
                {resource.resourceType}
              </span>
            </td>
            <td>{renderLecturerFullName(resource)}</td>
            <td>{resource.department || "-"}</td>
            <td>{resource.description || "-"}</td>
            <td>
              <div className="resource-btn-group">
                <button
                  className="resource-edit-btn"
                  onClick={() => handleEdit(resource)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="resource-delete-btn"
                  onClick={() => handleDelete(resource._id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );
      }

      if (filterType === "hall") {
        return (
          <tr key={resource._id}>
            <td>
              <span className={getTypeClass(resource.resourceType)}>
                {resource.resourceType}
              </span>
            </td>
            <td>{resource.name || "-"}</td>
            <td>{resource.department || "-"}</td>
            <td>{resource.capacity ?? "-"}</td>
            <td>{resource.description || "-"}</td>
            <td>
              <div className="resource-btn-group">
                <button
                  className="resource-edit-btn"
                  onClick={() => handleEdit(resource)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="resource-delete-btn"
                  onClick={() => handleDelete(resource._id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );
      }

      if (filterType === "module") {
        return (
          <tr key={resource._id}>
            <td>
              <span className={getTypeClass(resource.resourceType)}>
                {resource.resourceType}
              </span>
            </td>
            <td>{resource.name || "-"}</td>
            <td>{resource.code || "-"}</td>
            <td>{resource.department || "-"}</td>
            <td>{resource.description || "-"}</td>
            <td>
              <div className="resource-btn-group">
                <button
                  className="resource-edit-btn"
                  onClick={() => handleEdit(resource)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="resource-delete-btn"
                  onClick={() => handleDelete(resource._id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );
      }

      if (filterType === "batch") {
        return (
          <tr key={resource._id}>
            <td>
              <span className={getTypeClass(resource.resourceType)}>
                {resource.resourceType}
              </span>
            </td>
            <td>{resource.batchNo || resource.name || "-"}</td>
            <td>{resource.department || "-"}</td>
            <td>{resource.capacity ?? "-"}</td>
            <td>{resource.semester || "-"}</td>
            <td>{resource.academicYear || "-"}</td>
            <td>{resource.description || "-"}</td>
            <td>
              <div className="resource-btn-group">
                <button
                  className="resource-edit-btn"
                  onClick={() => handleEdit(resource)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="resource-delete-btn"
                  onClick={() => handleDelete(resource._id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );
      }

      return (
        <tr key={resource._id}>
          <td>
            <span className={getTypeClass(resource.resourceType)}>
              {resource.resourceType}
            </span>
          </td>
          <td>
            {resource.resourceType === "lecturer"
              ? renderLecturerFullName(resource)
              : resource.batchNo || resource.name || "-"}
          </td>
          <td>{resource.code || "-"}</td>
          <td>{resource.department || "-"}</td>
          <td>{resource.capacity ?? "-"}</td>
          <td>{resource.semester || "-"}</td>
          <td>{resource.academicYear || "-"}</td>
          <td>{resource.description || "-"}</td>
          <td>
            <div className="resource-btn-group">
              <button
                className="resource-edit-btn"
                onClick={() => handleEdit(resource)}
                type="button"
              >
                Edit
              </button>
              <button
                className="resource-delete-btn"
                onClick={() => handleDelete(resource._id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  const lecturerNames =
    formData.lecturerTitle && lecturersByTitle[formData.lecturerTitle]
      ? lecturersByTitle[formData.lecturerTitle]
      : [];

  return (
    <div className="resource-section">
      <div className="resource-card">
        <div className="resource-topbar">
          <div>
            <h2>Resource Management</h2>
            <p>Manage lecturers, halls, modules, and batches in one place.</p>
          </div>
        </div>
      </div>

      <div className="resource-summary-grid">
        <div className="resource-summary-card lecturers">
          <h4>Total Lecturers</h4>
          <p>{totalLecturers}</p>
        </div>
        <div className="resource-summary-card halls">
          <h4>Total Halls</h4>
          <p>{totalHalls}</p>
        </div>
        <div className="resource-summary-card modules">
          <h4>Total Modules</h4>
          <p>{totalModules}</p>
        </div>
        <div className="resource-summary-card batches">
          <h4>Total Batches</h4>
          <p>{totalBatches}</p>
        </div>
      </div>

      <div className="resource-card" ref={formCardRef}>
        <div className="resource-header">
          <div>
            <h3>{editingId ? "Edit Resource" : "Add New Resource"}</h3>
            <p>Fill in the details and save the resource.</p>
          </div>
          {editingId && <span className="edit-pill">Editing Mode</span>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="resource-form-grid">
            <div className="resource-form-group">
              <label>Resource Type</label>
              <select
                name="resourceType"
                value={formData.resourceType}
                onChange={handleChange}
                className="resource-input"
              >
                <option value="lecturer">Lecturer</option>
                <option value="hall">Hall</option>
                <option value="module">Module</option>
                <option value="batch">Batch</option>
              </select>
              {errors.resourceType && (
                <small className="error-text">{errors.resourceType}</small>
              )}
            </div>

            {formData.resourceType === "lecturer" && (
              <>
                <div className="resource-form-group">
                  <label>Lecturer Title</label>
                  <select
                    name="lecturerTitle"
                    value={formData.lecturerTitle}
                    onChange={handleChange}
                    className="resource-input"
                  >
                    <option value="">Select lecturer title</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                  {errors.lecturerTitle && (
                    <small className="error-text">{errors.lecturerTitle}</small>
                  )}
                </div>

                <div className="resource-form-group">
                  <label>Lecturer Name</label>
                  <select
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="resource-input"
                    disabled={!formData.lecturerTitle}
                  >
                    <option value="">
                      {formData.lecturerTitle
                        ? "Select lecturer name"
                        : "Select title first"}
                    </option>
                    {lecturerNames.map((lecturerName) => (
                      <option key={lecturerName} value={lecturerName}>
                        {lecturerName}
                      </option>
                    ))}
                  </select>
                  {errors.name && <small className="error-text">{errors.name}</small>}
                </div>

                <div className="resource-form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="resource-input"
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <small className="error-text">{errors.department}</small>
                  )}
                </div>
              </>
            )}

            {formData.resourceType === "hall" && (
              <>
                <div className="resource-form-group">
                  <label>Location</label>
                  <select
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="resource-input"
                  >
                    <option value="">Select location</option>
                    {hallLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.name && <small className="error-text">{errors.name}</small>}
                </div>

                <div className="resource-form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="resource-input"
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <small className="error-text">{errors.department}</small>
                  )}
                </div>

                <div className="resource-form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Enter capacity"
                    className="resource-input"
                    min="1"
                  />
                  {errors.capacity && (
                    <small className="error-text">{errors.capacity}</small>
                  )}
                </div>
              </>
            )}

            {formData.resourceType === "module" && (
              <>
                <div className="resource-form-group">
                  <label>Module Code</label>
                  <select
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="resource-input"
                  >
                    <option value="">Select module code</option>
                    {moduleOptions.map((module) => (
                      <option key={`${module.code}-${module.name}`} value={module.code}>
                        {module.code}
                      </option>
                    ))}
                  </select>
                  {errors.code && <small className="error-text">{errors.code}</small>}
                </div>

                <div className="resource-form-group">
                  <label>Module Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly
                    placeholder="Module name will appear automatically"
                    className="resource-input"
                  />
                  {errors.name && <small className="error-text">{errors.name}</small>}
                </div>

                <div className="resource-form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="resource-input"
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <small className="error-text">{errors.department}</small>
                  )}
                </div>
              </>
            )}

            {formData.resourceType === "batch" && (
              <>
                <div className="resource-form-group">
                  <label>Batch Number</label>
                  <select
                    name="batchNo"
                    value={formData.batchNo}
                    onChange={handleChange}
                    className="resource-input"
                  >
                    <option value="">Select batch number</option>
                    {batchOptions.map((batch) => (
                      <option key={batch} value={batch}>
                        {batch}
                      </option>
                    ))}
                  </select>
                  {errors.batchNo && (
                    <small className="error-text">{errors.batchNo}</small>
                  )}
                </div>

                <div className="resource-form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="resource-input"
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <small className="error-text">{errors.department}</small>
                  )}
                </div>

                <div className="resource-form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Enter capacity"
                    className="resource-input"
                    min="1"
                  />
                  {errors.capacity && (
                    <small className="error-text">{errors.capacity}</small>
                  )}
                </div>

                <div className="resource-form-group">
                  <label>Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    placeholder="Enter semester"
                    className="resource-input"
                    maxLength="1"
                  />
                  {errors.semester && (
                    <small className="error-text">{errors.semester}</small>
                  )}
                </div>

                <div className="resource-form-group">
                  <label>Academic Year</label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    placeholder="Enter academic year"
                    className="resource-input"
                    maxLength="1"
                  />
                  {errors.academicYear && (
                    <small className="error-text">{errors.academicYear}</small>
                  )}
                </div>
              </>
            )}

            <div className="resource-form-group resource-full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className="resource-input resource-textarea"
              />
            </div>
          </div>

          <div className="resource-action-row">
            <button type="submit" className="resource-primary-btn">
              {editingId ? "Update Resource" : "Add Resource"}
            </button>
            <button
              type="button"
              className="resource-secondary-btn"
              onClick={resetForm}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="resource-card">
        <div className="resource-header resource-list-header">
          <div>
            <h3>Resource List</h3>
            <p>View and manage all saved resources.</p>
          </div>

          <div className="resource-filter-box">
            <label>Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resource..."
              className="resource-input"
            />
          </div>

          <div className="resource-filter-box">
            <label>Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setSearchTerm("");
              }}
              className="resource-input"
            >
              <option value="">All Resources</option>
              <option value="lecturer">Lecturers</option>
              <option value="hall">Halls</option>
              <option value="module">Modules</option>
              <option value="batch">Batches</option>
            </select>
          </div>
        </div>

        <div className="resource-table-wrapper">
          <table className="resource-table">
            <thead>{renderTableHeader()}</thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResourceManagement;