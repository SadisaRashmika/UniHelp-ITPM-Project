-- =============================================================================
-- UniHelp Timetable Module — Complete Database Setup
-- =============================================================================
--
-- WHAT THIS FILE DOES:
--   1. Creates all 6 timetable-related tables (subjects, locations, timeslots,
--      bookings, notifications) — users table already exists from init.sql
--   2. Alters the users table CHECK constraint to include 'admin' role
--   3. Inserts seed data for all tables (admin, lecturers, students, subjects,
--      locations, timeslots, bookings, notifications)
--   4. Resets all serial sequences so future INSERTs get correct IDs
--
-- PREREQUISITES:
--   - PostgreSQL 17 (or compatible version)
--   - Database already created (e.g., "unihelp_db")
--   - The users table must already exist (created by init.sql from the
--     login-signin module). If it doesn't exist, this script creates it.
--   - Run init.sql FIRST if starting from a blank database
--
-- HOW TO RUN:
--   1. Open pgAdmin
--   2. Connect to your UniHelp database
--   3. Open Query Tool (right-click database → Query Tool)
--   4. Open this file (File → Open → timetable_setup.sql)
--   5. Click Execute (▶ button) or press F5
--
-- IDEMPOTENCY:
--   - All CREATE TABLE statements use IF NOT EXISTS
--   - User inserts use ON CONFLICT (email) DO NOTHING
--   - Subject inserts use ON CONFLICT (subject_code) DO NOTHING
--   - Location inserts use ON CONFLICT DO NOTHING (no unique constraint —
--     duplicates may appear if run multiple times; truncate locations first
--     if you need clean data)
--   - Timeslot/booking/notification inserts use dynamic lookups, so re-running
--     may create duplicates. For a clean reset, drop and recreate the tables.
--
-- =============================================================================

-- =============================================================================
-- STEP 1: Create tables (in dependency order)
-- =============================================================================

-- Ensure users table exists (it should, from init.sql)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    id_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer')),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Blocked')),
    password_hash VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    seat_count INTEGER NOT NULL
);

-- Timeslots table
CREATE TABLE IF NOT EXISTS timeslots (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    lecturer_id INTEGER REFERENCES users(id),
    location_id INTEGER REFERENCES locations(id),
    day_of_week INTEGER NOT NULL,  -- 1=Monday, 2=Tuesday, ..., 5=Friday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    lecture_topic TEXT,
    notice TEXT
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    timeslot_id INTEGER REFERENCES timeslots(id),
    seat_number INTEGER NOT NULL,
    attendance_status VARCHAR(20) DEFAULT 'booked' CHECK (attendance_status IN ('booked', 'attended', 'absent')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, timeslot_id),   -- One booking per student per lecture
    UNIQUE (timeslot_id, seat_number)    -- One student per seat per lecture
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    timeslot_id INTEGER REFERENCES timeslots(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- STEP 2: Alter users table to include 'admin' role
-- =============================================================================

-- The existing CHECK constraint only allows 'student' and 'lecturer'.
-- We need to drop it and add a new one that includes 'admin'.
-- PostgreSQL requires knowing the constraint name; we use a DO block to find it.

DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the CHECK constraint on the users.role column
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
    WHERE rel.relname = 'users'
      AND att.attname = 'role'
      AND con.contype = 'c';

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE users DROP CONSTRAINT %I', constraint_name);
        RAISE NOTICE 'Dropped existing role constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No existing role CHECK constraint found on users.role';
    END IF;

    -- Add the new constraint with 'admin' included
    ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'lecturer', 'admin'));
    RAISE NOTICE 'Added new role CHECK constraint including admin';
END $$;

-- =============================================================================
-- STEP 3: Insert seed data — Users
-- =============================================================================

-- Password hash for ALL users: $2b$10$dummyHashForTestingPurposesOnly
-- (Use DEV QUICK LOGIN in development — this hash is for DB completeness only)

INSERT INTO users (id, id_number, full_name, email, role, status, password_hash) VALUES
    -- Admin
    (2,  'ADM001', 'Bandula Jayawardena',   'admin@unihelp.com',                  'admin',    'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    -- Lecturers
    (3,  'LEC001', 'Dr. Sarath Gunasekara',  'sarath.gunasekara@unihelp.com',       'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    (4,  'LEC002', 'Prof. Nimal Perera',     'nimal.perera@unihelp.com',            'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    (5,  'LEC003', 'Dr. Kamani Silva',       'kamani.silva@unihelp.com',            'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    -- Students
    (6,  'STU001', 'Kavindu Perera',         'kavindu.perera@student.unihelp.com',  'student',  'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    (7,  'STU002', 'Nuwani Weerasinghe',     'nuwani.weerasinghe@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    (8,  'STU003', 'Dasun Madusanka',        'dasun.madusanka@student.unihelp.com', 'student',  'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    (9,  'STU004', 'Sanduni Fernando',       'sanduni.fernando@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    (10, 'STU005', 'Chathura Wijesinghe',    'chathura.wijesinghe@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly')
ON CONFLICT (email) DO NOTHING;

-- If users with these emails already exist but have wrong IDs, update them
-- (This handles the case where init.sql already created some users)
UPDATE users SET id_number = 'ADM001', full_name = 'Bandula Jayawardena', role = 'admin', status = 'Active' WHERE email = 'admin@unihelp.com';
UPDATE users SET id_number = 'LEC001', full_name = 'Dr. Sarath Gunasekara', role = 'lecturer', status = 'Active' WHERE email = 'sarath.gunasekara@unihelp.com';
UPDATE users SET id_number = 'LEC002', full_name = 'Prof. Nimal Perera', role = 'lecturer', status = 'Active' WHERE email = 'nimal.perera@unihelp.com';
UPDATE users SET id_number = 'LEC003', full_name = 'Dr. Kamani Silva', role = 'lecturer', status = 'Active' WHERE email = 'kamani.silva@unihelp.com';
UPDATE users SET id_number = 'STU001', full_name = 'Kavindu Perera', role = 'student', status = 'Active' WHERE email = 'kavindu.perera@student.unihelp.com';
UPDATE users SET id_number = 'STU002', full_name = 'Nuwani Weerasinghe', role = 'student', status = 'Active' WHERE email = 'nuwani.weerasinghe@student.unihelp.com';
UPDATE users SET id_number = 'STU003', full_name = 'Dasun Madusanka', role = 'student', status = 'Active' WHERE email = 'dasun.madusanka@student.unihelp.com';
UPDATE users SET id_number = 'STU004', full_name = 'Sanduni Fernando', role = 'student', status = 'Active' WHERE email = 'sanduni.fernando@student.unihelp.com';
UPDATE users SET id_number = 'STU005', full_name = 'Chathura Wijesinghe', role = 'student', status = 'Active' WHERE email = 'chathura.wijesinghe@student.unihelp.com';

-- =============================================================================
-- STEP 4: Insert seed data — Subjects
-- =============================================================================

INSERT INTO subjects (id, subject_name, subject_code) VALUES
    (1, 'Programming Fundamentals',  'IT101'),
    (2, 'Data Structures',           'IT201'),
    (3, 'Database Systems',          'IT301'),
    (4, 'Web Development',           'IT401'),
    (5, 'Software Engineering',      'IT402')
ON CONFLICT (subject_code) DO NOTHING;

-- =============================================================================
-- STEP 5: Insert seed data — Locations
-- =============================================================================

INSERT INTO locations (id, room_name, seat_count) VALUES
    (1, 'Lecture Hall A',  100),
    (2, 'Lecture Hall B',  80),
    (3, 'Computer Lab 1',  40),
    (4, 'Computer Lab 2',  40),
    (5, 'Seminar Room 1',  30)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- STEP 6: Insert seed data — Timeslots
-- =============================================================================

-- 10 timeslots spread across Mon-Fri with realistic schedules
-- Uses dynamic lookup by id_number and room_name so it works regardless of
-- the actual serial IDs assigned to users/locations

INSERT INTO timeslots (subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice)
SELECT
    sub.id,
    lec.id,
    loc.id,
    t.day_of_week,
    t.start_time,
    t.end_time,
    t.lecture_topic,
    t.notice
FROM (
    VALUES
        -- Monday
        (1, 'LEC001', 'Lecture Hall A',  1, '09:00'::TIME, '11:00'::TIME, 'Introduction to Variables and Data Types'::TEXT, NULL::TEXT),
        (2, 'LEC002', 'Lecture Hall B',  1, '14:00'::TIME, '16:00'::TIME, 'Arrays and Linked Lists'::TEXT, NULL::TEXT),
        -- Tuesday
        (3, 'LEC001', 'Computer Lab 1', 2, '09:00'::TIME, '11:00'::TIME, 'SQL Basics and Joins'::TEXT, 'Bring your laptops'::TEXT),
        (4, 'LEC003', 'Computer Lab 2', 2, '14:00'::TIME, '16:00'::TIME, 'HTML and CSS Fundamentals'::TEXT, NULL::TEXT),
        -- Wednesday
        (1, 'LEC001', 'Lecture Hall A',  3, '10:00'::TIME, '12:00'::TIME, 'Control Flow and Loops'::TEXT, NULL::TEXT),
        (5, 'LEC002', 'Seminar Room 1', 3, '14:00'::TIME, '16:00'::TIME, 'Agile Methodology'::TEXT, NULL::TEXT),
        -- Thursday
        (2, 'LEC002', 'Lecture Hall B',  4, '09:00'::TIME, '11:00'::TIME, 'Trees and Graphs'::TEXT, NULL::TEXT),
        (3, 'LEC001', 'Computer Lab 1', 4, '14:00'::TIME, '16:00'::TIME, 'Normalization and ER Diagrams'::TEXT, NULL::TEXT),
        -- Friday
        (4, 'LEC003', 'Computer Lab 2', 5, '09:00'::TIME, '11:00'::TIME, 'JavaScript DOM Manipulation'::TEXT, NULL::TEXT),
        (5, 'LEC002', 'Lecture Hall A',  5, '13:00'::TIME, '15:00'::TIME, 'Software Testing Strategies'::TEXT, NULL::TEXT)
) AS t(subject_id, lec_id_number, loc_name, day_of_week, start_time, end_time, lecture_topic, notice)
JOIN subjects sub ON sub.id = t.subject_id
JOIN users lec ON lec.id_number = t.lec_id_number
JOIN locations loc ON loc.room_name = t.loc_name;

-- =============================================================================
-- STEP 7: Insert seed data — Bookings
-- =============================================================================

-- 6 bookings: some 'booked', some 'attended'
-- Uses dynamic lookup so it works with any user/timeslot IDs

INSERT INTO bookings (student_id, timeslot_id, seat_number, attendance_status)
SELECT
    stu.id,
    ts.id,
    b.seat_number,
    b.attendance_status::VARCHAR
FROM (
    VALUES
        -- STU001 → timeslot 1 (Mon 09:00 IT101), seat 1, 'booked'
        ('STU001', 1, 1, 'booked'),
        -- STU002 → timeslot 1 (Mon 09:00 IT101), seat 2, 'booked'
        ('STU002', 1, 2, 'booked'),
        -- STU003 → timeslot 1 (Mon 09:00 IT101), seat 3, 'booked'
        ('STU003', 1, 3, 'booked'),
        -- STU001 → timeslot 2 (Mon 14:00 IT201), seat 5, 'booked'
        ('STU001', 2, 5, 'booked'),
        -- STU004 → timeslot 2 (Mon 14:00 IT201), seat 6, 'booked'
        ('STU004', 2, 6, 'booked'),
        -- STU005 → timeslot 3 (Tue 09:00 IT301), seat 1, 'attended'
        ('STU005', 3, 1, 'attended')
) AS b(stu_id_number, ts_order, seat_number, attendance_status)
JOIN users stu ON stu.id_number = b.stu_id_number
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM timeslots
) ts ON ts.rn = b.ts_order;

-- =============================================================================
-- STEP 8: Insert seed data — Notifications
-- =============================================================================

-- 2 unread notifications
-- Uses dynamic lookup so it works with any user/timeslot IDs

INSERT INTO notifications (user_id, timeslot_id, message, is_read)
SELECT
    stu.id,
    ts.id,
    n.message,
    n.is_read
FROM (
    VALUES
        -- STU001, timeslot 1 (Mon 09:00 IT101)
        ('STU001', 1, 'Lecture topic updated: Introduction to Variables and Data Types', false),
        -- STU002, timeslot 1 (Mon 09:00 IT101)
        ('STU002', 1, 'Room changed to Lecture Hall B', false)
) AS n(stu_id_number, ts_order, message, is_read)
JOIN users stu ON stu.id_number = n.stu_id_number
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM timeslots
) ts ON ts.rn = n.ts_order;

-- =============================================================================
-- STEP 9: Reset sequences for all serial columns
-- =============================================================================
-- After inserting with explicit IDs, the sequences are out of sync.
-- We reset them so the next INSERT gets the correct auto-incremented ID.

-- Users table (BIGSERIAL)
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));

-- Subjects table
SELECT setval('subjects_id_seq', (SELECT COALESCE(MAX(id), 1) FROM subjects));

-- Locations table
SELECT setval('locations_id_seq', (SELECT COALESCE(MAX(id), 1) FROM locations));

-- Timeslots table
SELECT setval('timeslots_id_seq', (SELECT COALESCE(MAX(id), 1) FROM timeslots));

-- Bookings table
SELECT setval('bookings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM bookings));

-- Notifications table
SELECT setval('notifications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM notifications));

-- =============================================================================
-- DONE! Your UniHelp timetable database is ready.
-- =============================================================================
--
-- Quick verification queries (optional):
--
--   SELECT id, id_number, full_name, role FROM users ORDER BY id;
--   SELECT * FROM subjects ORDER BY id;
--   SELECT * FROM locations ORDER BY id;
--   SELECT t.*, s.subject_name, s.subject_code, l.room_name, u.full_name as lecturer_name
--     FROM timeslots t
--     JOIN subjects s ON t.subject_id = s.id
--     JOIN locations l ON t.location_id = l.id
--     JOIN users u ON t.lecturer_id = u.id
--     ORDER BY t.day_of_week, t.start_time;
--   SELECT b.*, u.full_name as student_name FROM bookings b JOIN users u ON b.student_id = u.id ORDER BY b.id;
--   SELECT n.*, u.full_name FROM notifications n JOIN users u ON n.user_id = u.id ORDER BY n.id;
--
-- =============================================================================
