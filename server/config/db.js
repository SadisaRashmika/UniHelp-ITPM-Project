const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

// Handle pool-level connection errors gracefully (e.g., PostgreSQL not running)
pool.on('error', (err) => {
  console.warn('⚠️  PostgreSQL pool error (DB may not be available):', err.message);
});

// Test connection on startup (non-blocking)
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL connected successfully'))
  .catch((err) => {
    console.warn('⚠️  PostgreSQL connection failed:', err.message);
    console.warn('⚠️  Auth and lecture-resource routes will not work without PostgreSQL.');
    console.warn('⚠️  Timetable routes (using mock DB) will still function.');
  });

module.exports = pool;
