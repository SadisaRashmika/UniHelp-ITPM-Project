// Database connection module with fallback
// This file handles the connection to PostgreSQL database
// Falls back to in-memory mock database if PostgreSQL is unavailable

const { Pool } = require('pg');
const { getMockPool } = require('./mock');

// Database connection state
let pool = null;
let isMockDatabase = false;
let connectionError = null;

// Initialize database connection
async function initializeDatabase() {
    try {
        // Try PostgreSQL first
        const pgPool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'unihelp',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
        });

        // Test connection with timeout
        const client = await Promise.race([
            pgPool.connect(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Connection timeout')), 3000)
            )
        ]);
        
        client.release();
        pool = pgPool;
        isMockDatabase = false;
        console.log('✅ Connected to PostgreSQL database');
        return pool;
        
    } catch (error) {
        // PostgreSQL failed, use mock database
        connectionError = error.message;
        console.log('⚠️  PostgreSQL unavailable, switching to in-memory database');
        console.log(`   Reason: ${error.message}`);
        
        pool = await getMockPool();
        isMockDatabase = true;
        
        const stats = pool.getStats();
        console.log('📝 Using in-memory data store with dummy data');
        console.log(`   - ${stats.users} users (${stats.admins} admin, ${stats.lecturers} lecturers, ${stats.students} students)`);
        console.log(`   - ${stats.subjects} subjects`);
        console.log(`   - ${stats.locations} locations`);
        console.log(`   - ${stats.timeslots} timeslots`);
        console.log(`   - ${stats.bookings} bookings`);
        console.log(`   - ${stats.notifications} notifications`);
        
        return pool;
    }
}

// Get the current database pool
function getPool() {
    return pool;
}

// Check if using mock database
function isMock() {
    return isMockDatabase;
}

// Get connection error (if any)
function getConnectionError() {
    return connectionError;
}

// Query helper - works with both PostgreSQL and mock
async function query(text, params) {
    if (!pool) {
        await initializeDatabase();
    }
    return pool.query(text, params);
}

// Connect helper - works with both PostgreSQL and mock
async function connect() {
    if (!pool) {
        await initializeDatabase();
    }
    return pool.connect();
}

// End connection
async function end() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

// Export the pool and helpers
module.exports = {
    // Pool-like interface
    query,
    connect,
    end,
    
    // Initialization
    initializeDatabase,
    
    // Status helpers
    getPool,
    isMock,
    getConnectionError
};
