const mongoose = require("mongoose");
const TimetableEntry = require("../models/TimetableEntry");
const Resource = require("../models/Resource");
const AuditLog = require("../models/AuditLog");

const toMinutes = (time) => {
  const [hours, minutes] = String(time || "")
    .split(":")
    .map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

const hasTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && end1 > start2;
};

const findClashes = async ({
  lecturer,
  batchGroup,
  hall,
  day,
  startTime,
  endTime,
  excludeId = null,
}) => {
  const newStart = toMinutes(startTime);
  const newEnd = toMinutes(endTime);

  const existingEntries = await TimetableEntry.find({
    day,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  });

  const clashes = existingEntries.filter((entry) => {
    const existingStart = toMinutes(entry.startTime);
    const existingEnd = toMinutes(entry.endTime);

    const overlap = hasTimeOverlap(
      newStart,
      newEnd,
      existingStart,
      existingEnd,
    );

    if (!overlap) return false;

    return (
      String(entry.lecturer) === String(lecturer) ||
      String(entry.batchGroup) === String(batchGroup) ||
      String(entry.hall) === String(hall)
    );
  });

  return clashes;
};

// GET RESOURCES FOR SESSION DROPDOWNS
exports.getSessionResources = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = type ? { resourceType: type } : {};

    const resources = await Resource.find(filter).sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resources" });
  }
};

exports.createTimetableEntry = async (req, res) => {
  try {
    const {
      module,
      lecturer,
      batchGroup,
      hall,
      day,
      startTime,
      endTime,
      status,
    } = req.body;

    if (
      !module ||
      !lecturer ||
      !batchGroup ||
      !hall ||
      !day ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    if (start === null || end === null) {
      return res.status(400).json({ message: "Invalid time format" });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    const moduleResource = await Resource.findOne({
      _id: module,
      resourceType: "module",
    });

    const lecturerResource = await Resource.findOne({
      _id: lecturer,
      resourceType: "lecturer",
    });

    const batchResource = await Resource.findOne({
      _id: batchGroup,
      resourceType: "batch",
    });

    const hallResource = await Resource.findOne({
      _id: hall,
      resourceType: "hall",
    });

    if (!moduleResource) {
      return res.status(400).json({ message: "Invalid module selected" });
    }

    if (!lecturerResource) {
      return res.status(400).json({ message: "Invalid lecturer selected" });
    }

    if (!batchResource) {
      return res.status(400).json({ message: "Invalid batch selected" });
    }

    if (!hallResource) {
      return res.status(400).json({ message: "Invalid hall selected" });
    }

    const clashes = await findClashes({
      lecturer,
      batchGroup,
      hall,
      day,
      startTime,
      endTime,
    });

    if (clashes.length > 0) {
      return res.status(409).json({
        message: "Clash detected with lecturer, hall, or batch/group",
        clashes,
      });
    }

    const entry = await TimetableEntry.create({
      module,
      lecturer,
      batchGroup,
      hall,
      day,
      startTime,
      endTime,
      status: status || "draft",
      createdBy: req.user.id,
    });

    const populated = await TimetableEntry.findById(entry._id)
      .populate("module")
      .populate("lecturer")
      .populate("batchGroup")
      .populate("hall")
      .populate("createdBy", "name email");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to create session" });
  }
};

exports.getTimetableEntries = async (req, res) => {
  try {
    const { day, batchGroup, lecturer, hall, status } = req.query;

    const filter = {};

    if (status) {
      if (typeof status === "string" && status.includes(",")) {
        filter.status = { $in: status.split(",").map((s) => s.trim()) };
      } else {
        filter.status = status;
      }
    }
    if (lecturer) filter.lecturer = lecturer;
    if (batchGroup) filter.batchGroup = batchGroup;
    if (hall) filter.hall = hall;
    if (day) filter.day = day;

    console.log("getTimetableEntries query filter:", filter);

    const entries = await TimetableEntry.find(filter)
      .populate("module")
      .populate("lecturer")
      .populate("batchGroup")
      .populate("hall")
      .populate("createdBy", "name email")
      .sort({ day: 1, startTime: 1 });

    console.log(
      `Found ${entries.length} timetable entries with filter:`,
      filter,
    );
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch timetable entries" });
  }
};

exports.updateTimetableEntry = async (req, res) => {
  try {
    const {
      module,
      lecturer,
      batchGroup,
      hall,
      day,
      startTime,
      endTime,
      status,
    } = req.body;

    const existing = await TimetableEntry.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Session not found" });
    }

    const updateData = {};
    if (module !== undefined && module !== null) updateData.module = module;
    if (lecturer !== undefined && lecturer !== null)
      updateData.lecturer = lecturer;
    if (batchGroup !== undefined && batchGroup !== null)
      updateData.batchGroup = batchGroup;
    if (hall !== undefined && hall !== null) updateData.hall = hall;
    if (day !== undefined && day !== null) updateData.day = day;
    if (startTime !== undefined && startTime !== null)
      updateData.startTime = startTime;
    if (endTime !== undefined && endTime !== null) updateData.endTime = endTime;
    if (status !== undefined && status !== null) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Validate provided fields
    if (updateData.module) {
      const moduleResource = await Resource.findOne({
        _id: updateData.module,
        resourceType: "module",
      });
      if (!moduleResource) {
        return res.status(400).json({ message: "Invalid module selected" });
      }
    }

    if (updateData.lecturer) {
      const lecturerResource = await Resource.findOne({
        _id: updateData.lecturer,
        resourceType: "lecturer",
      });
      if (!lecturerResource) {
        return res.status(400).json({ message: "Invalid lecturer selected" });
      }
    }

    if (updateData.batchGroup) {
      const batchResource = await Resource.findOne({
        _id: updateData.batchGroup,
        resourceType: "batch",
      });
      if (!batchResource) {
        return res.status(400).json({ message: "Invalid batch selected" });
      }
    }

    if (updateData.hall) {
      const hallResource = await Resource.findOne({
        _id: updateData.hall,
        resourceType: "hall",
      });
      if (!hallResource) {
        return res.status(400).json({ message: "Invalid hall selected" });
      }
    }

    if (updateData.startTime || updateData.endTime) {
      const finalStartTime = updateData.startTime || existing.startTime;
      const finalEndTime = updateData.endTime || existing.endTime;

      const start = toMinutes(finalStartTime);
      const end = toMinutes(finalEndTime);

      if (start === null || end === null) {
        return res.status(400).json({ message: "Invalid time format" });
      }

      if (start >= end) {
        return res
          .status(400)
          .json({ message: "End time must be after start time" });
      }
    }

    // Check for clashes using final data
    const finalData = { ...existing.toObject(), ...updateData };
    const clashes = await findClashes({
      lecturer: finalData.lecturer,
      batchGroup: finalData.batchGroup,
      hall: finalData.hall,
      day: finalData.day,
      startTime: finalData.startTime,
      endTime: finalData.endTime,
      excludeId: req.params.id,
    });

    if (clashes.length > 0) {
      return res.status(409).json({
        message: "Clash detected with lecturer, hall, or batch/group",
        clashes,
      });
    }

    const updated = await TimetableEntry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    )
      .populate("module")
      .populate("lecturer")
      .populate("batchGroup")
      .populate("hall")
      .populate("createdBy", "name email");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update session" });
  }
};

exports.deleteTimetableEntry = async (req, res) => {
  try {
    const deleted = await TimetableEntry.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete session" });
  }
};

exports.publishTimetableEntry = async (req, res) => {
  try {
    const entry = await TimetableEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Session not found" });
    }

    const clashes = await findClashes({
      lecturer: entry.lecturer,
      batchGroup: entry.batchGroup,
      hall: entry.hall,
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      excludeId: entry._id,
    });

    if (clashes.length > 0) {
      return res.status(409).json({
        message: "Cannot publish because a clash exists",
        clashes,
      });
    }

    entry.status = "published";
    await entry.save();

    const populated = await TimetableEntry.findById(entry._id)
      .populate("module")
      .populate("lecturer")
      .populate("batchGroup")
      .populate("hall")
      .populate("createdBy", "name email");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to publish timetable" });
  }
};

// PUBLISH ALL TIMETABLE
exports.publishAllTimetable = async (req, res) => {
  try {
    const { message } = req.body;

    // Update all assigned entries to published
    await TimetableEntry.updateMany(
      { status: "assigned" },
      { status: "published" },
    );

    // AUDIT LOG
    await AuditLog.create({
      action: `Timetable published: ${message}`,
      performedBy: req.user.id,
    });

    res.json({ message: "Timetable published successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to publish timetable" });
  }
};

// SEND TO LIC
exports.sendToLic = async (req, res) => {
  try {
    await TimetableEntry.updateMany({ status: "draft" }, { status: "sent" });
    res.json({ message: "Timetable sent to LIC" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// SEND TO ADMIN
exports.sendToAdmin = async (req, res) => {
  try {
    const { batchGroup } = req.body;

    const filter = { status: { $in: ["sent", "draft"] } };

    if (batchGroup) {
      let batchId = batchGroup;

      if (!mongoose.Types.ObjectId.isValid(batchGroup)) {
        const batchResource = await Resource.findOne({
          resourceType: "batch",
          $or: [{ batchNo: batchGroup }, { name: batchGroup }],
        });

        if (!batchResource) {
          return res.status(400).json({ message: "Invalid batch selected" });
        }

        batchId = batchResource._id;
      }

      filter.batchGroup = batchId;
    }

    await TimetableEntry.updateMany(filter, { status: "assigned" });
    res.json({ message: "Timetable sent to Admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET LIC TIMETABLE
exports.getLicTimetable = async (req, res) => {
  try {
    console.log("LIC API HIT"); // debug

    const data = await TimetableEntry.find({
      status: { $in: ["sent", "assigned", "published"] },
    })
      .populate("module")
      .populate("lecturer")
      .populate("batchGroup")
      .populate("hall")
      .populate("createdBy", "name email")
      .sort({ day: 1, startTime: 1 });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
