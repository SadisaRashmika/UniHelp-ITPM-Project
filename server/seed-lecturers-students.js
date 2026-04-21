// Seed lecturers and students tables to match users table
// This is needed because getCurrentUser queries lecturers/students tables directly
// Run: cd server && node seed-lecturers-students.js

const pool = require('./config/db');

async function seed() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Seed lecturers table
    console.log('Seeding lecturers...');
    await client.query(`
      INSERT INTO lecturers (employee_id, name, initials, title, department, email, password, user_id, status, password_hash, updated_at)
      VALUES 
        ('LEC001', 'Dr. Sarath Gunasekara', 'DS', 'Dr.', 'IT', 'sarath@unihelp.lk', 'hashed_pw', 3, 'Active', '$2b$10$dummyhash1', NOW()),
        ('LEC002', 'Dr. Chamara Perera', 'DC', 'Dr.', 'CS', 'chamara@unihelp.lk', 'hashed_pw', 4, 'Active', '$2b$10$dummyhash2', NOW()),
        ('LEC003', 'Prof. Nimal Silva', 'NS', 'Prof.', 'SE', 'nimal@unihelp.lk', 'hashed_pw', 5, 'Active', '$2b$10$dummyhash3', NOW())
      ON CONFLICT (employee_id) DO UPDATE SET
        name = EXCLUDED.name, user_id = EXCLUDED.user_id, status = EXCLUDED.status, 
        password_hash = EXCLUDED.password_hash, updated_at = NOW()
    `);

    // Seed students table
    console.log('Seeding students...');
    await client.query(`
      INSERT INTO students (student_id, name, initials, email, password, year, semester, user_id, status, password_hash, updated_at)
      VALUES 
        ('STU001', 'Kavindu Perera', 'KP', 'kavindu@unihelp.lk', 'hashed_pw', '2', '1', 6, 'Active', '$2b$10$dummyhash4', NOW()),
        ('STU002', 'Nimali Fernando', 'NF', 'nimali@unihelp.lk', 'hashed_pw', '2', '1', 7, 'Active', '$2b$10$dummyhash5', NOW()),
        ('STU003', 'Amal Jayasinghe', 'AJ', 'amal@unihelp.lk', 'hashed_pw', '2', '1', 8, 'Active', '$2b$10$dummyhash6', NOW()),
        ('STU004', 'Dilini Wickramasinghe', 'DW', 'dilini@unihelp.lk', 'hashed_pw', '2', '2', 9, 'Active', '$2b$10$dummyhash7', NOW()),
        ('STU005', 'Ruwan Bandara', 'RB', 'ruwan@unihelp.lk', 'hashed_pw', '3', '1', 10, 'Active', '$2b$10$dummyhash8', NOW())
      ON CONFLICT (student_id) DO UPDATE SET
        name = EXCLUDED.name, user_id = EXCLUDED.user_id, status = EXCLUDED.status,
        password_hash = EXCLUDED.password_hash, updated_at = NOW()
    `);

    await client.query('COMMIT');
    console.log('SUCCESS: Lecturers and students seeded!');

    // Verify
    const lec = await client.query('SELECT employee_id, name, user_id, status FROM lecturers');
    const stu = await client.query('SELECT student_id, name, user_id, status FROM students');
    console.log('Lecturers:', JSON.stringify(lec.rows));
    console.log('Students:', JSON.stringify(stu.rows));
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('FAILED:', err.message);
    console.error(err.stack);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
