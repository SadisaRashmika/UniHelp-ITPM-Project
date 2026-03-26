const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

async function groupDates() {
    try {
        const res = await pool.query(`
            SELECT date_trunc('day', created_at) as day, count(*) 
            FROM tickets 
            GROUP BY day 
            ORDER BY day DESC
        `);
        console.log(res.rows);
    } finally {
        await pool.end();
    }
}
groupDates();
