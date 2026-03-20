require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const ticketRoutes = require("./routes/ticketRoutes");
const authRoutes = require("./routes/authRoutes");

const resourceRoutes = require("./routes/resourceRoutes");
const timetableEntryRoutes = require("./routes/timetableEntryRoutes");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/resources", resourceRoutes);
app.use("/api/timetable-entries", timetableEntryRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("🚀 Unimate Backend Server Running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});