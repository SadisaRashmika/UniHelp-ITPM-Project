// Timetable-specific database module
// Uses the mock database for timetable operations (independent of the real PostgreSQL pool)
// This allows timetable to work without requiring PostgreSQL tables to exist

const { getMockPool } = require('./mock');

let mockPool = null;
let initialized = false;

async function initializeTimetableDb() {
  if (initialized && mockPool) return mockPool;

  mockPool = await getMockPool();
  initialized = true;
  console.log('📅 Timetable module using mock database');
  return mockPool;
}

async function query(text, params) {
  if (!mockPool) {
    await initializeTimetableDb();
  }
  return mockPool.query(text, params);
}

async function connect() {
  if (!mockPool) {
    await initializeTimetableDb();
  }
  return mockPool.connect();
}

module.exports = {
  query,
  connect,
  initializeTimetableDb,
};
