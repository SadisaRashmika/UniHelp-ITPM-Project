// Database migration script for quiz structure (faculty, intake, semester, modules)
const db = require('../../config/db');

async function createQuizStructureTables() {
  try {
    console.log('Creating quiz structure tables...');

    // Create faculties table
    await db.query(`
      CREATE TABLE IF NOT EXISTS faculties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(20) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Faculties table created');

    // Create intakes table
    await db.query(`
      CREATE TABLE IF NOT EXISTS intakes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        year INT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Intakes table created');

    // Create semesters table
    await db.query(`
      CREATE TABLE IF NOT EXISTS semesters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        number INT NOT NULL,
        academic_year VARCHAR(20) NOT NULL,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Semesters table created');

    // Create modules table
    await db.query(`
      CREATE TABLE IF NOT EXISTS modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        faculty_id INT NOT NULL,
        intake_id INT NOT NULL,
        semester_id INT NOT NULL,
        credits INT DEFAULT 3,
        description TEXT,
        lecturer_id VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
        FOREIGN KEY (intake_id) REFERENCES intakes(id) ON DELETE CASCADE,
        FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
      )
    `);
    console.log('Modules table created');

    // Update quizzes table to include faculty, intake, semester, module relationships
    await db.query(`
      ALTER TABLE quizzes 
      ADD COLUMN IF NOT EXISTS faculty_id INT,
      ADD COLUMN IF NOT EXISTS intake_id INT,
      ADD COLUMN IF NOT EXISTS semester_id INT,
      ADD COLUMN IF NOT EXISTS module_id INT,
      ADD FOREIGN KEY IF NOT EXISTS (faculty_id) REFERENCES faculties(id),
      ADD FOREIGN KEY IF NOT EXISTS (intake_id) REFERENCES intakes(id),
      ADD FOREIGN KEY IF NOT EXISTS (semester_id) REFERENCES semesters(id),
      ADD FOREIGN KEY IF NOT EXISTS (module_id) REFERENCES modules(id)
    `);
    console.log('Quizzes table updated with relationships');

    // Insert sample data
    await insertSampleData();
    
    console.log('Quiz structure migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

async function insertSampleData() {
  try {
    console.log('Inserting sample data...');

    // Insert faculties
    const [faculties] = await db.query(`
      INSERT IGNORE INTO faculties (id, name, code, description) VALUES
      (1, 'Faculty of Computing', 'FC', 'Computer Science and IT programs'),
      (2, 'Faculty of Engineering', 'FE', 'Engineering and Technology programs'),
      (3, 'Faculty of Business', 'FB', 'Business and Management programs')
    `);

    // Insert intakes
    const [intakes] = await db.query(`
      INSERT IGNORE INTO intakes (id, name, year, description) VALUES
      (1, 'January 2026', 2026, 'First intake of 2026'),
      (2, 'May 2026', 2026, 'Second intake of 2026'),
      (3, 'September 2026', 2026, 'Third intake of 2026')
    `);

    // Insert semesters
    const [semesters] = await db.query(`
      INSERT IGNORE INTO semesters (id, name, number, academic_year, start_date, end_date) VALUES
      (1, 'Semester 1', 1, '2025/2026', '2025-09-01', '2025-12-20'),
      (2, 'Semester 2', 2, '2025/2026', '2026-01-11', '2026-04-30'),
      (3, 'Semester 3', 3, '2025/2026', '2026-05-09', '2026-08-28')
    `);

    // Insert modules (at least 3 per faculty/intake/semester combination)
    const [modules] = await db.query(`
      INSERT IGNORE INTO modules (code, name, faculty_id, intake_id, semester_id, credits, description, lecturer_id) VALUES
      -- Faculty of Computing modules
      ('CS101', 'Introduction to Programming', 1, 1, 1, 4, 'Basic programming concepts and problem solving', 'LEC001'),
      ('CS102', 'Web Development Fundamentals', 1, 1, 1, 3, 'HTML, CSS, and JavaScript basics', 'LEC001'),
      ('CS103', 'Database Systems', 1, 1, 1, 3, 'Relational database design and SQL', 'LEC002'),
      
      ('CS201', 'Data Structures and Algorithms', 1, 1, 2, 4, 'Advanced data structures and algorithm analysis', 'LEC002'),
      ('CS202', 'Software Engineering', 1, 1, 2, 3, 'Software development methodologies', 'LEC003'),
      ('CS203', 'Computer Networks', 1, 1, 2, 3, 'Network protocols and architectures', 'LEC003'),
      
      ('CS301', 'Machine Learning', 1, 1, 3, 4, 'Introduction to machine learning algorithms', 'LEC001'),
      ('CS302', 'Cloud Computing', 1, 1, 3, 3, 'Cloud services and deployment', 'LEC002'),
      ('CS303', 'Cybersecurity', 1, 1, 3, 3, 'Information security and protection', 'LEC003'),
      
      -- Faculty of Engineering modules
      ('ENG101', 'Engineering Mathematics', 2, 1, 1, 4, 'Mathematical foundations for engineering', 'LEC004'),
      ('ENG102', 'Engineering Physics', 2, 1, 1, 3, 'Physics principles for engineering', 'LEC004'),
      ('ENG103', 'Introduction to CAD', 2, 1, 1, 3, 'Computer-aided design basics', 'LEC005'),
      
      ('ENG201', 'Thermodynamics', 2, 1, 2, 4, 'Heat transfer and energy systems', 'LEC005'),
      ('ENG202', 'Fluid Mechanics', 2, 1, 2, 3, 'Fluid behavior and applications', 'LEC006'),
      ('ENG203', 'Materials Science', 2, 1, 2, 3, 'Engineering materials and properties', 'LEC006'),
      
      -- Faculty of Business modules
      ('BUS101', 'Business Fundamentals', 3, 1, 1, 3, 'Introduction to business concepts', 'LEC007'),
      ('BUS102', 'Marketing Principles', 3, 1, 1, 3, 'Marketing strategies and concepts', 'LEC007'),
      ('BUS103', 'Financial Accounting', 3, 1, 1, 3, 'Basic accounting principles', 'LEC008'),
      
      ('BUS201', 'Business Analytics', 3, 1, 2, 4, 'Data analysis for business decisions', 'LEC008'),
      ('BUS202', 'Digital Marketing', 3, 1, 2, 3, 'Online marketing strategies', 'LEC009'),
      ('BUS203', 'Supply Chain Management', 3, 1, 2, 3, 'Logistics and supply chain', 'LEC009')
    `);

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  createQuizStructureTables()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createQuizStructureTables, insertSampleData };
