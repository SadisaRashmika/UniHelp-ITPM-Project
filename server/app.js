const express = require("express");
const pool = require("./config/db"); // ✅ import correctly
const app = express();


app.use(express.json());

app.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // simple query
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err.message); // log exact error
    res.status(500).json({ error: "Database connection failed" });
  }
});


module.exports = app;