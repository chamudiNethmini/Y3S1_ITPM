const TimetableEntry = require("../models/TimetableEntry");
const User = require("../models/User");

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
      entry.batchGroup === batchGroup ||
      entry.hall === hall
    );
  });

  return clashes;
};

exports.getLecturers = async (req, res) => {
  try {
    const lecturers = await User.find({
      role: "lic",
      status: "active",
    }).select("_id name email");

    res.json(lecturers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lecturers" });
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

    const lecturerUser = await User.findById(lecturer);
    if (!lecturerUser || lecturerUser.role !== "lic") {
      return res.status(400).json({ message: "Invalid lecturer selected" });
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
      .populate("lecturer", "name email")
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

    if (req.user.role === "lic") {
      filter.lecturer = req.user.id;
      filter.status = "published";
    } else {
      if (status) filter.status = status;
      if (lecturer) filter.lecturer = lecturer;
    }

    if (day) filter.day = day;
    if (batchGroup) filter.batchGroup = new RegExp(batchGroup, "i");
    if (hall) filter.hall = new RegExp(hall, "i");

    const entries = await TimetableEntry.find(filter)
      .populate("lecturer", "name email")
      .populate("createdBy", "name email")
      .sort({ day: 1, startTime: 1 });

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

    const lecturerUser = await User.findById(lecturer);
    if (!lecturerUser || lecturerUser.role !== "lic") {
      return res.status(400).json({ message: "Invalid lecturer selected" });
    }

    const existing = await TimetableEntry.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Session not found" });
    }

    const clashes = await findClashes({
      lecturer,
      batchGroup,
      hall,
      day,
      startTime,
      endTime,
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
      {
        module,
        lecturer,
        batchGroup,
        hall,
        day,
        startTime,
        endTime,
        status: status || existing.status,
      },
      { new: true, runValidators: true },
    )
      .populate("lecturer", "name email")
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
      .populate("lecturer", "name email")
      .populate("createdBy", "name email");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to publish timetable" });
  }
};

// ================= SEND TO LIC =================
exports.sendToLic = async (req, res) => {
  try {
    await TimetableEntry.updateMany({ status: "draft" }, { status: "sent" });
    res.json({ message: "Timetable sent to LIC" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET LIC TIMETABLE ================= 🔥 NEW
exports.getLicTimetable = async (req, res) => {
  try {
    const data = await TimetableEntry.find({ status: "sent" })
      .populate("lecturer", "name email")
      .populate("createdBy", "name email")
      .sort({ day: 1, startTime: 1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
