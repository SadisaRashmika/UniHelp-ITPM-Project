const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,        // e.g., "postgres"
  password: process.env.DB_PASSWORD,// e.g., "UniHelp123"
  host: process.env.DB_HOST,        // usually "localhost"
  port: process.env.DB_PORT,        // usually 5432
  database: process.env.DB_NAME     // e.g., "unihelp_itpm"
});

module.exports = pool; // ✅ correct export