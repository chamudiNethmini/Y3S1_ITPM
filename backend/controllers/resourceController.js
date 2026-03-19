const Resource = require("../models/Resource");

// CREATE
exports.createResource = async (req, res) => {
  try {
    const {
      resourceType,
      name,
      code,
      department,
      capacity,
      semester,
      academicYear,
      description,
    } = req.body;

    if (!resourceType || !name) {
      return res.status(400).json({
        message: "Resource type and name are required",
      });
    }

    if (capacity < 0) {
      return res.status(400).json({
        message: "Capacity cannot be negative",
      });
    }

    const existing = await Resource.findOne({
      resourceType,
      name: name.trim(),
      code: code?.trim() || "",
    });

    if (existing) {
      return res.status(400).json({
        message: "Resource already exists",
      });
    }

    const resource = await Resource.create({
      resourceType,
      name,
      code,
      department,
      capacity,
      semester,
      academicYear,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// READ ALL
exports.getAllResources = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { resourceType: type } : {};

    const resources = await Resource.find(filter).sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// READ ONE
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.updateResource = async (req, res) => {
  try {
    const {
      resourceType,
      name,
      code,
      department,
      capacity,
      semester,
      academicYear,
      description,
    } = req.body;

    if (!resourceType || !name) {
      return res.status(400).json({
        message: "Resource type and name are required",
      });
    }

    if (capacity < 0) {
      return res.status(400).json({
        message: "Capacity cannot be negative",
      });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resource.resourceType = resourceType;
    resource.name = name;
    resource.code = code;
    resource.department = department;
    resource.capacity = capacity;
    resource.semester = semester;
    resource.academicYear = academicYear;
    resource.description = description;

    await resource.save();

    res.json({
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};