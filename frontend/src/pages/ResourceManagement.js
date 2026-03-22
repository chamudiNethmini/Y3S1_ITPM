import { useEffect, useRef, useState } from "react";
import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../services/resourceService";
import "../styles/ResourceManagement.css";

function ResourceManagement() {
  const initialForm = {
    resourceType: "lecturer",
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
      } else if (!/^[A-Z]/.test(formData.name.trim())) {
        newErrors.name = "Location must start with a capital letter";
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
      if (!formData.name.trim()) {
        newErrors.name = "Module name is required";
      }

      if (!formData.code.trim()) {
        newErrors.code = "Module code is required";
      } else if (!/^[A-Z]{2}/.test(formData.code.trim())) {
        newErrors.code = "Module code must start with 2 capital letters";
      } else if (formData.code.trim().length > 20) {
        newErrors.code = "Code must be less than 20 characters";
      }

      if (!formData.department.trim()) {
        newErrors.department = "Department is required";
      }
    }

    if (formData.resourceType === "batch") {
      if (!formData.batchNo.trim()) {
        newErrors.batchNo = "Batch number is required";
      } else if (!/^\d\.\d$/.test(formData.batchNo.trim())) {
        newErrors.batchNo = "Batch number must be in format like 3.2";
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

    if (name === "batchNo") {
      updatedValue = value.replace(/[^0-9.]/g, "").slice(0, 3);

      const dotCount = (updatedValue.match(/\./g) || []).length;
      if (dotCount > 1) {
        return;
      }
    }

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

    setFormData(updatedData);

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      resourceType: formData.resourceType,
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

    if (resources.length === 0) {
      return (
        <tr>
          <td colSpan={getColumnCount()} className="resource-empty">
            No resources found
          </td>
        </tr>
      );
    }

    return resources.map((resource) => {
      if (filterType === "lecturer") {
        return (
          <tr key={resource._id}>
            <td>
              <span className={getTypeClass(resource.resourceType)}>
                {resource.resourceType}
              </span>
            </td>
            <td>{resource.name || "-"}</td>
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
          <td>{resource.batchNo || resource.name || "-"}</td>
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
                  <label>Lecturer Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter lecturer name"
                    className="resource-input"
                  />
                  {errors.name && <small className="error-text">{errors.name}</small>}
                </div>

                <div className="resource-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                    className="resource-input"
                  />
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
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter hall location"
                    className="resource-input"
                  />
                  {errors.name && <small className="error-text">{errors.name}</small>}
                </div>

                <div className="resource-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                    className="resource-input"
                  />
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
                  <label>Module Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter module name"
                    className="resource-input"
                  />
                  {errors.name && <small className="error-text">{errors.name}</small>}
                </div>

                <div className="resource-form-group">
                  <label>Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter module code"
                    className="resource-input"
                    maxLength="20"
                  />
                  {errors.code && <small className="error-text">{errors.code}</small>}
                </div>

                <div className="resource-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                    className="resource-input"
                  />
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
                  <input
                    type="text"
                    name="batchNo"
                    value={formData.batchNo}
                    onChange={handleChange}
                    placeholder="Enter batch number like 3.2"
                    className="resource-input"
                    maxLength="3"
                  />
                  {errors.batchNo && (
                    <small className="error-text">{errors.batchNo}</small>
                  )}
                </div>

                <div className="resource-form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                    className="resource-input"
                  />
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
            <label>Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
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