require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");
const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const timetableEntryRoutes = require("./routes/timetableEntryRoutes");

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Unimate Backend Server Running...");
});

app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/timetable-entries", timetableEntryRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});