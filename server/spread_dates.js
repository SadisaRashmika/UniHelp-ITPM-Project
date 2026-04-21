const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

async function spreadDates() {
    try {
        const res = await pool.query('SELECT id FROM tickets ORDER BY id');
        const tickets = res.rows;
        
        console.log(`Found ${tickets.length} tickets. Spreading ~85 per day for exactly 12 days...`);
        
        const targetPerDay = 85;
        const totalDays = 12;
        let processedCount = 0;

        for (let day = 0; day < totalDays; day++) {
            for (let i = 0; i < targetPerDay; i++) {
                if (processedCount >= tickets.length) break;
                
                const ticketId = tickets[processedCount].id;
                const hoursOffset = Math.floor(Math.random() * 24);
                const date = new Date();
                date.setDate(date.getDate() - day);
                date.setHours(date.getHours() - hoursOffset);
                
                await pool.query('UPDATE tickets SET created_at = $1 WHERE id = $2', [date, ticketId]);
                processedCount++;
            }
        }

        // Set the remaining 9000+ tickets to a very old date so they don't cluster on one day
        if (processedCount < tickets.length) {
            console.log(`Setting remaining ${tickets.length - processedCount} tickets to historical dates...`);
            const oldDate = new Date();
            oldDate.setFullYear(oldDate.getFullYear() - 1);
            await pool.query('UPDATE tickets SET created_at = $1 WHERE id IN (SELECT id FROM tickets OFFSET $2)', [oldDate, processedCount]);
        }
        
        console.log('✅ Successfully spread ticket creation dates (85 per day for 12 days).');
    } catch (err) {
        console.error('❌ Error spreading dates:', err);
    } finally {
        await pool.end();
    }
}

spreadDates();
