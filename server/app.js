const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const timetableRoutes = require("./routes/timetable");
const bookingRoutes = require("./routes/bookings");
app.use("/api/auth", authRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/test", async (req, res) => {
  try {
    res.json({ message: "Server is running!" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("UniHelp Backend Running 🚀");
});

module.exports = app;
