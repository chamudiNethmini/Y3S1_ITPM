require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb://localhost:27017/unimate";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully (Local)"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("🚀 Unimate Backend Server Running...");
});

app.use("/api/auth", require("./routes/authRoutes"));


const User = require("./models/User");
const bcrypt = require("bcryptjs");

// 🔥 Force create fresh admin (temporary)
(async () => {
  await User.deleteMany({ email: "admin@unimate.com" });

  const hashed = await bcrypt.hash("1234", 10);

  await User.create({
    name: "Admin",
    email: "admin@unimate.com",
    password: hashed,
    role: "admin",
    status: "active"
  });

  console.log("🔥 Fresh Admin Created with password 1234");
})();

app.listen(5000, () => {
  console.log("🌍 Server running on http://localhost:5000");
});