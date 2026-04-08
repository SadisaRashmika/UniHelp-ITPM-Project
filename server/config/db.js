const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,        // e.g., "postgres"
  password: process.env.DB_PASSWORD,// e.g., "UniHelp123"
  host: process.env.DB_HOST,        // usually "localhost"
  port: process.env.DB_PORT,        // usually 5432
  database: process.env.DB_NAME     // e.g., "unihelp_itpm"
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
