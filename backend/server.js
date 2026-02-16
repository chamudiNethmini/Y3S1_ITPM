const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb://localhost:27017/unimate_db";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully (Local)"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("🚀 Unimate Backend Server Running...");
});

app.listen(5000, () => {
  console.log("🌍 Server running on http://localhost:5000");
});
