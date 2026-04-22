const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'uni-help',
  password: '123456789',
  port: 5432,
});

async function addModulesWithIds() {
  try {
    console.log('=== ADDING MODULES WITH SPECIFIC IDS ===');
    
    // Get the next available ID
    const maxIdResult = await db.query('SELECT MAX(id) as max_id FROM modules');
    const nextId = (maxIdResult.rows[0].max_id || 0) + 1;
    console.log(`Starting from ID: ${nextId}`);
    
    // Add missing modules for Faculty 1 (Computing) - needs 1 more module
    await db.query(`
      INSERT INTO modules (id, name, code, faculty_id, intake_id, semester_id, credits, description)
      VALUES ($1, 'Data Structures & Algorithms', 'CS201', 1, 3, 4, 4, 'Advanced data structures and algorithm design')
    `, [nextId]);
    console.log(`Added CS201 for Computing faculty with ID ${nextId}`);
    
    // Add missing modules for Faculty 2 (Business) - needs 2 more modules
    await db.query(`
      INSERT INTO modules (id, name, code, faculty_id, intake_id, semester_id, credits, description)
      VALUES 
        ($1, 'Business Statistics', 'BUS201', 2, 3, 4, 3, 'Statistical methods for business analysis'),
        ($2, 'Marketing Principles', 'MKT101', 2, 4, 5, 3, 'Introduction to marketing concepts and strategies')
    `, [nextId + 1, nextId + 2]);
    console.log(`Added BUS201 and MKT101 for Business faculty with IDs ${nextId + 1}, ${nextId + 2}`);
    
    // Add missing modules for Faculty 3 (Engineering) - needs 2 more modules
    await db.query(`
      INSERT INTO modules (id, name, code, faculty_id, intake_id, semester_id, credits, description)
      VALUES 
        ($1, 'Physics for Engineers', 'PHY101', 3, 3, 4, 4, 'Fundamental physics concepts for engineering'),
        ($2, 'Engineering Design', 'ENG201', 3, 4, 5, 3, 'Engineering design principles and project work')
    `, [nextId + 3, nextId + 4]);
    console.log(`Added PHY101 and ENG201 for Engineering faculty with IDs ${nextId + 3}, ${nextId + 4}`);

    console.log('=== MODULES ADDED SUCCESSFULLY ===');
    
  } catch (error) {
    console.error('Error adding modules:', error);
  } finally {
    await db.end();
  }
}

addModulesWithIds();
