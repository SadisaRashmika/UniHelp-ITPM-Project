const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

async function checkDates() {
    try {
        const res = await pool.query('SELECT created_at FROM tickets LIMIT 20');
        console.log(res.rows.map(r => r.created_at));
    } finally {
        await pool.end();
    }
}
checkDates();
