// Run this script to add timetable tables and seed data to PostgreSQL
// Usage: cd server && node migrate-timetable.js

const pool = require('./config/db');

async function migrate() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // ─── Create timetable tables ───────────────────────────────────────────

    console.log('Creating timetable tables...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        subject_name VARCHAR(100) NOT NULL,
        subject_code VARCHAR(20) UNIQUE
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        room_name VARCHAR(100) NOT NULL,
        seat_count INTEGER NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS timeslots (
        id SERIAL PRIMARY KEY,
        subject_id INTEGER REFERENCES subjects(id),
        lecturer_id INTEGER REFERENCES users(id),
        location_id INTEGER REFERENCES locations(id),
        day_of_week INTEGER NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        lecture_topic TEXT,
        notice TEXT
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id),
        timeslot_id INTEGER REFERENCES timeslots(id),
        seat_number INTEGER NOT NULL,
        attendance_status VARCHAR(20) DEFAULT 'booked' CHECK (attendance_status IN ('booked', 'attended', 'absent')),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (student_id, timeslot_id),
        UNIQUE (timeslot_id, seat_number)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        timeslot_id INTEGER REFERENCES timeslots(id),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Timetable tables created');

    // ─── Alter users table to allow 'admin' role ──────────────────────────

    console.log('Altering users table to allow admin role...');

    await client.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check
    `);

    await client.query(`
      ALTER TABLE users ADD CONSTRAINT users_role_check
        CHECK (role IN ('student', 'lecturer', 'admin'))
    `);

    console.log('✅ Admin role added to users table');

    // ─── Seed lecturers table ──────────────────────────────────────────────

    console.log('Seeding lecturers...');

    await client.query(`
      INSERT INTO lecturers (name, initials, title, department, employee_id, email, password, points, status, password_hash)
      VALUES
        ('Dr. Sarath Gunasekara', 'SG', 'Senior Lecturer', 'Computer Science', 'LEC001', 'sarath.gunasekara@unihelp.com', 'password123', 10, 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('Dr. Chamara Perera', 'CP', 'Senior Lecturer', 'Computer Science', 'LEC002', 'chamara.perera@unihelp.com', 'password123', 8, 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('Prof. Nimal Silva', 'NS', 'Professor', 'Information Technology', 'LEC003', 'nimal.silva@unihelp.com', 'password123', 12, 'Active', '$2b$10$dummyHashForTestingPurposesOnly')
      ON CONFLICT (employee_id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        status = 'Active',
        password_hash = EXCLUDED.password_hash
    `);

    // Link lecturers to users table
    await client.query(`
      UPDATE lecturers l
      SET user_id = u.id
      FROM users u
      WHERE u.id_number = l.employee_id
        AND l.user_id IS DISTINCT FROM u.id
    `);

    const lecResult = await client.query('SELECT id, employee_id, name, status FROM lecturers ORDER BY id');
    console.log('✅ Lecturers seeded:');
    lecResult.rows.forEach(l => console.log(`   id=${l.id} ${l.employee_id} ${l.name} (${l.status})`));

    // ─── Seed students table ──────────────────────────────────────────────

    console.log('Seeding students...');

    await client.query(`
      INSERT INTO students (name, initials, student_id, email, password, year, semester, likes, rank, bonus_used, status, password_hash)
      VALUES
        ('Kavindu Perera', 'KP', 'STU001', 'kavindu.perera@student.unihelp.com', 'password123', '3rd Year', '2nd Semester', 5, 1, false, 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('Nimali Fernando', 'NF', 'STU002', 'nimali.fernando@student.unihelp.com', 'password123', '2nd Year', '1st Semester', 2, 2, false, 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('Amal Jayasinghe', 'AJ', 'STU003', 'amal.jayasinghe@student.unihelp.com', 'password123', '2nd Year', '2nd Semester', 0, 3, false, 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('Dilini Wickramasinghe', 'DW', 'STU004', 'dilini.wickramasinghe@student.unihelp.com', 'password123', '3rd Year', '1st Semester', 0, 4, false, 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('Ruwan Bandara', 'RB', 'STU005', 'ruwan.bandara@student.unihelp.com', 'password123', '1st Year', '2nd Semester', 0, 5, false, 'Active', '$2b$10$dummyHashForTestingPurposesOnly')
      ON CONFLICT (student_id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        status = 'Active',
        password_hash = EXCLUDED.password_hash
    `);

    // Link students to users table
    await client.query(`
      UPDATE students s
      SET user_id = u.id
      FROM users u
      WHERE u.id_number = s.student_id
        AND s.user_id IS DISTINCT FROM u.id
    `);

    const stuResult = await client.query('SELECT id, student_id, name, status FROM students ORDER BY id');
    console.log('✅ Students seeded:');
    stuResult.rows.forEach(s => console.log(`   id=${s.id} ${s.student_id} ${s.name} (${s.status})`));

    // ─── Seed users table ────────────────────────────────────────────────

    console.log('Seeding users...');

    await client.query(`
      INSERT INTO users (id_number, full_name, email, role, status, password_hash) VALUES
        ('ADM001', 'Bandula Jayawardena', 'admin@unihelp.com', 'admin', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('LEC001', 'Dr. Sarath Gunasekara', 'sarath.gunasekara@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('LEC002', 'Dr. Chamara Perera', 'chamara.perera@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('LEC003', 'Prof. Nimal Silva', 'nimal.silva@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('STU001', 'Kavindu Perera', 'kavindu.perera@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('STU002', 'Nimali Fernando', 'nimali.fernando@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('STU003', 'Amal Jayasinghe', 'amal.jayasinghe@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('STU004', 'Dilini Wickramasinghe', 'dilini.wickramasinghe@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
        ('STU005', 'Ruwan Bandara', 'ruwan.bandara@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly')
      ON CONFLICT (id_number) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        status = 'Active',
        password_hash = EXCLUDED.password_hash
    `);

    // Show user IDs
    const usersResult = await client.query('SELECT id, id_number, full_name, role FROM users ORDER BY id');
    console.log('✅ Users seeded:');
    usersResult.rows.forEach(u => console.log(`   id=${u.id} ${u.id_number} ${u.full_name} (${u.role})`));

    // ─── Seed subjects ────────────────────────────────────────────────────

    console.log('Seeding subjects...');

    await client.query(`
      INSERT INTO subjects (subject_name, subject_code) VALUES
        ('Introduction to Programming', 'CS101'),
        ('Data Structures and Algorithms', 'CS201'),
        ('Database Systems', 'CS301'),
        ('Web Development', 'CS401'),
        ('Software Engineering', 'CS402')
      ON CONFLICT (subject_code) DO NOTHING
    `);

    const subjectsResult = await client.query('SELECT id, subject_code, subject_name FROM subjects ORDER BY id');
    console.log('✅ Subjects seeded:');
    subjectsResult.rows.forEach(s => console.log(`   id=${s.id} ${s.subject_code} - ${s.subject_name}`));

    // ─── Seed locations ───────────────────────────────────────────────────

    console.log('Seeding locations...');

    await client.query(`
      INSERT INTO locations (room_name, seat_count) VALUES
        ('Lecture Hall A', 100),
        ('Lecture Hall B', 80),
        ('Computer Lab 1', 40),
        ('Computer Lab 2', 40),
        ('Seminar Room 1', 30)
      ON CONFLICT DO NOTHING
    `);

    const locationsResult = await client.query('SELECT id, room_name, seat_count FROM locations ORDER BY id');
    console.log('✅ Locations seeded:');
    locationsResult.rows.forEach(l => console.log(`   id=${l.id} ${l.room_name} (${l.seat_count} seats)`));

    // ─── Seed timeslots ──────────────────────────────────────────────────

    console.log('Seeding timeslots...');

    // Get user IDs by id_number
    const lec1 = await client.query("SELECT id FROM users WHERE id_number = 'LEC001'");
    const lec2 = await client.query("SELECT id FROM users WHERE id_number = 'LEC002'");
    const lec3 = await client.query("SELECT id FROM users WHERE id_number = 'LEC003'");

    const lec1Id = lec1.rows[0].id;
    const lec2Id = lec2.rows[0].id;
    const lec3Id = lec3.rows[0].id;

    // Get subject IDs
    const sub1 = await client.query("SELECT id FROM subjects WHERE subject_code = 'CS101'");
    const sub2 = await client.query("SELECT id FROM subjects WHERE subject_code = 'CS201'");
    const sub3 = await client.query("SELECT id FROM subjects WHERE subject_code = 'CS301'");
    const sub4 = await client.query("SELECT id FROM subjects WHERE subject_code = 'CS401'");
    const sub5 = await client.query("SELECT id FROM subjects WHERE subject_code = 'CS402'");

    // Get location IDs
    const loc1 = await client.query("SELECT id FROM locations WHERE room_name = 'Lecture Hall A'");
    const loc2 = await client.query("SELECT id FROM locations WHERE room_name = 'Lecture Hall B'");
    const loc3 = await client.query("SELECT id FROM locations WHERE room_name = 'Computer Lab 1'");
    const loc4 = await client.query("SELECT id FROM locations WHERE room_name = 'Computer Lab 2'");
    const loc5 = await client.query("SELECT id FROM locations WHERE room_name = 'Seminar Room 1'");

    await client.query(`
      INSERT INTO timeslots (subject_id, lecturer_id, location_id, day_of_week, start_time, end_time) VALUES
        ($1, $2, $3, 1, '09:00', '11:00'),
        ($4, $5, $6, 1, '14:00', '16:00'),
        ($7, $8, $9, 2, '09:00', '11:00'),
        ($10, $11, $12, 2, '14:00', '16:00'),
        ($13, $14, $15, 3, '10:00', '12:00'),
        ($16, $17, $18, 3, '14:00', '16:00'),
        ($19, $20, $21, 4, '09:00', '11:00'),
        ($22, $23, $24, 4, '14:00', '16:00'),
        ($25, $26, $27, 5, '09:00', '11:00'),
        ($28, $29, $30, 5, '13:00', '15:00')
    `, [
      // Monday
      sub1.rows[0].id, lec1Id, loc1.rows[0].id,       // CS101 with LEC001 in Lecture Hall A
      sub2.rows[0].id, lec2Id, loc2.rows[0].id,       // CS201 with LEC002 in Lecture Hall B
      // Tuesday
      sub3.rows[0].id, lec1Id, loc3.rows[0].id,       // CS301 with LEC001 in Computer Lab 1
      sub4.rows[0].id, lec3Id, loc4.rows[0].id,       // CS401 with LEC003 in Computer Lab 2
      // Wednesday
      sub1.rows[0].id, lec1Id, loc1.rows[0].id,       // CS101 with LEC001 in Lecture Hall A
      sub5.rows[0].id, lec2Id, loc5.rows[0].id,       // CS402 with LEC002 in Seminar Room 1
      // Thursday
      sub2.rows[0].id, lec2Id, loc2.rows[0].id,       // CS201 with LEC002 in Lecture Hall B
      sub3.rows[0].id, lec1Id, loc3.rows[0].id,       // CS301 with LEC001 in Computer Lab 1
      // Friday
      sub4.rows[0].id, lec3Id, loc4.rows[0].id,       // CS401 with LEC003 in Computer Lab 2
      sub5.rows[0].id, lec2Id, loc1.rows[0].id,       // CS402 with LEC002 in Lecture Hall A
    ]);

    const timeslotsResult = await client.query('SELECT COUNT(*) as c FROM timeslots');
    console.log(`✅ Timeslots seeded: ${timeslotsResult.rows[0].c} timeslots`);

    // ─── Seed bookings ────────────────────────────────────────────────────

    console.log('Seeding bookings...');

    // Get student user IDs
    const stu1 = await client.query("SELECT id FROM users WHERE id_number = 'STU001'");
    const stu2 = await client.query("SELECT id FROM users WHERE id_number = 'STU002'");
    const stu3 = await client.query("SELECT id FROM users WHERE id_number = 'STU003'");
    const stu4 = await client.query("SELECT id FROM users WHERE id_number = 'STU004'");
    const stu5 = await client.query("SELECT id FROM users WHERE id_number = 'STU005'");

    // Get timeslot IDs (ordered by id)
    const tsResult = await client.query('SELECT id FROM timeslots ORDER BY id');
    const tsIds = tsResult.rows.map(r => r.id);

    await client.query(`
      INSERT INTO bookings (student_id, timeslot_id, seat_number, attendance_status) VALUES
        ($1, $2, 1, 'booked'),
        ($3, $4, 2, 'booked'),
        ($5, $6, 3, 'booked'),
        ($7, $8, 5, 'booked'),
        ($9, $10, 6, 'booked'),
        ($11, $12, 1, 'attended')
    `, [
      stu1.rows[0].id, tsIds[0],   // STU001 booked seat 1 for timeslot 1
      stu2.rows[0].id, tsIds[0],   // STU002 booked seat 2 for timeslot 1
      stu3.rows[0].id, tsIds[0],   // STU003 booked seat 3 for timeslot 1
      stu1.rows[0].id, tsIds[1],   // STU001 booked seat 5 for timeslot 2
      stu4.rows[0].id, tsIds[1],   // STU004 booked seat 6 for timeslot 2
      stu5.rows[0].id, tsIds[2],   // STU005 booked seat 1 for timeslot 3 (attended)
    ]);

    const bookingsResult = await client.query('SELECT COUNT(*) as c FROM bookings');
    console.log(`✅ Bookings seeded: ${bookingsResult.rows[0].c} bookings`);

    // ─── Seed notifications ──────────────────────────────────────────────

    console.log('Seeding notifications...');

    await client.query(`
      INSERT INTO notifications (user_id, timeslot_id, message, is_read) VALUES
        ($1, $2, 'Lecture topic updated: Introduction to Variables and Data Types', false),
        ($3, $4, 'Room changed to Lecture Hall B', false)
    `, [
      stu1.rows[0].id, tsIds[0],   // Notification for STU001 about timeslot 1
      stu2.rows[0].id, tsIds[0],   // Notification for STU002 about timeslot 1
    ]);

    const notifResult = await client.query('SELECT COUNT(*) as c FROM notifications');
    console.log(`✅ Notifications seeded: ${notifResult.rows[0].c} notifications`);

    // ─── Commit transaction ──────────────────────────────────────────────

    await client.query('COMMIT');
    console.log('\n🎉 Migration completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    console.error(error);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
