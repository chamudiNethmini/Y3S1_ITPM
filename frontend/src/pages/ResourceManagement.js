import { useEffect, useState } from "react";
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.resourceType.trim()) {
      newErrors.resourceType = "Resource type is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Resource name is required";
    }

    if (formData.capacity !== "" && Number(formData.capacity) < 0) {
      newErrors.capacity = "Capacity cannot be negative";
    }

    if (formData.code.length > 20) {
      newErrors.code = "Code must be less than 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...formData,
      capacity: formData.capacity === "" ? 0 : Number(formData.capacity),
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
      code: resource.code || "",
      department: resource.department || "",
      capacity: resource.capacity || "",
      semester: resource.semester || "",
      academicYear: resource.academicYear || "",
      description: resource.description || "",
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      <div className="resource-card">
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

            <div className="resource-form-group">
              <label>Resource Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter resource name"
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
                placeholder="Enter code"
                className="resource-input"
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
              />
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
              />
            </div>

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
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Code</th>
                <th>Department</th>
                <th>Capacity</th>
                <th>Semester</th>
                <th>Academic Year</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="resource-empty">
                    Loading resources...
                  </td>
                </tr>
              ) : resources.length > 0 ? (
                resources.map((resource) => (
                  <tr key={resource._id}>
                    <td>
                      <span className={getTypeClass(resource.resourceType)}>
                        {resource.resourceType}
                      </span>
                    </td>
                    <td>{resource.name}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="resource-empty">
                    No resources found
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

export default ResourceManagement;