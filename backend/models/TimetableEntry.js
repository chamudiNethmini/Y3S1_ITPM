const mongoose = require("mongoose");

const timetableEntrySchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      trim: true,
    },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    batchGroup: {
      type: String,
      required: true,
      trim: true,
    },
    hall: {
      type: String,
      required: true,
      trim: true,
    },
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },

    // 🔥 UPDATED PART (status eka update kala)
    status: {
      type: String,
      enum: ["draft", "sent", "published"], // ✅ "sent" add kala
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TimetableEntry", timetableEntrySchema);
