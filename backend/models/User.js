const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "coordinator", "lecturer"] },
  status: { type: String, enum: ["pending", "active", "suspended"], default: "active" }
});

module.exports = mongoose.model("User", userSchema);