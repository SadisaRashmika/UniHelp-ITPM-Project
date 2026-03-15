// Database connection module
// This file handles the connection to PostgreSQL database

const { Pool } = require('pg');

// Create a connection pool
// This allows multiple connections to the database
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to database successfully');
        release();
    }
});

// Export the pool so other files can use it
module.exports = pool;
