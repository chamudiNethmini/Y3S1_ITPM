const Resource = require("../models/Resource");

// CREATE
exports.createResource = async (req, res) => {
  try {
    const {
      resourceType,
      lecturerTitle,
      name,
      batchNo,
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

    if (resourceType === "lecturer" && !lecturerTitle) {
      return res.status(400).json({
        message: "Lecturer title is required",
      });
    }

    if (capacity < 0) {
      return res.status(400).json({
        message: "Capacity cannot be negative",
      });
    }

    const existing = await Resource.findOne({
      resourceType,
      lecturerTitle:
        resourceType === "lecturer" ? lecturerTitle?.trim() || "" : "",
      name: name.trim(),
      code: code?.trim() || "",
      batchNo: batchNo?.trim() || "",
    });

    if (existing) {
      return res.status(400).json({
        message: "Resource already exists",
      });
    }

    const resource = await Resource.create({
      resourceType,
      lecturerTitle:
        resourceType === "lecturer" ? lecturerTitle?.trim() || "" : "",
      name: name.trim(),
      batchNo: batchNo?.trim() || "",
      code: code?.trim() || "",
      department: department?.trim() || "",
      capacity: capacity || 0,
      semester: semester?.trim() || "",
      academicYear: academicYear?.trim() || "",
      description: description?.trim() || "",
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

    if (type === "lecturer") {
      // Calculate assigned hours for lecturers
      const TimetableEntry = require("../models/TimetableEntry");
      const lecturerIds = resources.map((r) => r._id);

      const assignedHoursMap = {};
      for (const lecturerId of lecturerIds) {
        const entries = await TimetableEntry.find({ lecturer: lecturerId });
        let totalHours = 0;
        entries.forEach((entry) => {
          const [startH, startM] = entry.startTime.split(":").map(Number);
          const [endH, endM] = entry.endTime.split(":").map(Number);
          const hours = (endH * 60 + endM - (startH * 60 + startM)) / 60;
          totalHours += hours;
        });
        assignedHoursMap[lecturerId] = totalHours;
      }

      // Add assignedHours to each lecturer
      const enhancedResources = resources.map((resource) => ({
        ...resource.toObject(),
        assignedHours: assignedHoursMap[resource._id] || 0,
      }));

      return res.json(enhancedResources);
    }

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
      lecturerTitle,
      name,
      batchNo,
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

    if (resourceType === "lecturer" && !lecturerTitle) {
      return res.status(400).json({
        message: "Lecturer title is required",
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

    const duplicate = await Resource.findOne({
      _id: { $ne: req.params.id },
      resourceType,
      lecturerTitle:
        resourceType === "lecturer" ? lecturerTitle?.trim() || "" : "",
      name: name.trim(),
      code: code?.trim() || "",
      batchNo: batchNo?.trim() || "",
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Resource already exists",
      });
    }

    resource.resourceType = resourceType;
    resource.lecturerTitle =
      resourceType === "lecturer" ? lecturerTitle?.trim() || "" : "";
    resource.name = name.trim();
    resource.batchNo = batchNo?.trim() || "";
    resource.code = code?.trim() || "";
    resource.department = department?.trim() || "";
    resource.capacity = capacity || 0;
    resource.semester = semester?.trim() || "";
    resource.academicYear = academicYear?.trim() || "";
    resource.description = description?.trim() || "";

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
