const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, 'z-database', 'structure_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running database migration...');
    await pool.query(sql);
    console.log('Migration completed successfully!');
    
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await pool.end();
  }
}

runMigration();
