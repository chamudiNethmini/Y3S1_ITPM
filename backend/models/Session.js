const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  batch: String,
  moduleCode: String,
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hall: String,
  day: String,
  startTime: String,
  endTime: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Session", sessionSchema);