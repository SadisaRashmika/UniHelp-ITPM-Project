const express = require("express");
const pool = require("./config/db"); // ✅ import correctly
const app = express();

// Database middleware - attach db to all requests
app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use(express.json());

// File upload middleware
app.use('/uploads', express.static('uploads'));

app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // simple query
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err.message); // log exact error
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Import routes
const internshipApplicationsRoutes = require('./routes/internshipApplications');
const academicTicketRoutes = require('./routes/academic-ticket');

// Use routes
app.use('/api/internship-applications', internshipApplicationsRoutes);
app.use('/academic-ticket', academicTicketRoutes);

module.exports = app;