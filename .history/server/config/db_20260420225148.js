const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
 
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
    console.warn('⚠️  All routes requiring the database will not work without PostgreSQL.');
  });

module.exports = pool;
