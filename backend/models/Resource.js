const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      enum: ["lecturer", "hall", "module", "batch"],
      required: true,
    },
    lecturerTitle: {
      type: String,
      enum: ["", "Prof.", "Dr.", "Mr.", "Ms."],
      default: "",
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      trim: true,
      default: "",
    },
    capacity: {
      type: Number,
      default: 0,
    },
    semester: {
      type: String,
      trim: true,
      default: "",
    },
    academicYear: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    batchNo: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);