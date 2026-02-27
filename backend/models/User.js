const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "coordinator", "lic"] },
  status: { type: String, enum: ["pending", "active", "suspended"], default: "active" },


resetToken: String,
resetTokenExpiry: Date,
});


module.exports = mongoose.model("User", userSchema);