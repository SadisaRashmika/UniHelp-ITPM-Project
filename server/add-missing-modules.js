const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'uni-help',
  password: '123456789',
  port: 5432,
});

async function addMissingModules() {
  try {
    console.log('=== ADDING MISSING MODULES ===');
    
    // Add missing modules for Faculty 1 (Computing) - needs 1 more module
    await db.query(`
      INSERT INTO modules (name, code, faculty_id, intake_id, semester_id, credits, description)
      VALUES ('Data Structures & Algorithms', 'CS201', 1, 3, 4, 4, 'Advanced data structures and algorithm design')
    `);
    console.log('Added CS201 for Computing faculty');

    // Add missing modules for Faculty 2 (Business) - needs 2 more modules
    await db.query(`
      INSERT INTO modules (name, code, faculty_id, intake_id, semester_id, credits, description)
      VALUES 
        ('Business Statistics', 'BUS201', 2, 3, 4, 3, 'Statistical methods for business analysis'),
        ('Marketing Principles', 'MKT101', 2, 4, 5, 3, 'Introduction to marketing concepts and strategies')
    `);
    console.log('Added BUS201 and MKT101 for Business faculty');

    // Add missing modules for Faculty 3 (Engineering) - needs 2 more modules
    await db.query(`
      INSERT INTO modules (name, code, faculty_id, intake_id, semester_id, credits, description)
      VALUES 
        ('Physics for Engineers', 'PHY101', 3, 3, 4, 4, 'Fundamental physics concepts for engineering'),
        ('Engineering Design', 'ENG201', 3, 4, 5, 3, 'Engineering design principles and project work')
    `);
    console.log('Added PHY101 and ENG201 for Engineering faculty');

    console.log('=== MODULES ADDED SUCCESSFULLY ===');
    
  } catch (error) {
    console.error('Error adding modules:', error);
  } finally {
    await db.end();
  }
}

addMissingModules();
