// Timetable-specific database module
// Uses the real PostgreSQL pool for timetable operations

const pool = require('../config/db');

async function query(text, params) {
  return pool.query(text, params);
}

async function connect() {
  return pool.connect();
}

module.exports = {
  query,
  connect,
};
