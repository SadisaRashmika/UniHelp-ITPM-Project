-- UniHelp Timetable Module Migration
-- Adds timetable-specific tables and seed data to the existing database
-- Run this AFTER init.sql

-- =====================================================================================
-- Timetable Tables
-- =====================================================================================

-- Table: subjects
-- Stores information about university subjects/courses         by sadii

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    id_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer','admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Blocked')),
    password_hash VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (id_number, full_name, email, role, status, password_hash) VALUES
    -- Admin
    ('ADM001', 'Bandula Jayawardena', 'admin@unihelp.com', 'admin', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    -- Lecturers
    ('LEC001', 'Dr. Sarath Gunasekara', 'sarath.gunasekara@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    ('LEC002', 'Dr. Chamara Perera', 'chamara.perera@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    ('LEC003', 'Prof. Nimal Silva', 'nimal.silva@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    -- Students
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
    password_hash = EXCLUDED.password_hash;








CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE
);

-- Table: locations
-- Stores information about lecture halls and rooms
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    seat_count INTEGER NOT NULL
);

-- Table: timeslots
-- The main timetable table. Each row is one lecture session
CREATE TABLE IF NOT EXISTS timeslots (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    lecturer_id INTEGER REFERENCES users(id),
    location_id INTEGER REFERENCES locations(id),
    day_of_week INTEGER NOT NULL,  -- 1 = Monday, 7 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    lecture_topic TEXT,  -- Added by lecturer
    notice TEXT  -- Added by lecturer
);

-- Table: bookings
-- Links students to their booked seats in lectures
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    timeslot_id INTEGER REFERENCES timeslots(id),
    seat_number INTEGER NOT NULL,
    attendance_status VARCHAR(20) DEFAULT 'booked' CHECK (attendance_status IN ('booked', 'attended', 'absent')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, timeslot_id),  -- One booking per student per lecture
    UNIQUE (timeslot_id, seat_number)  -- One student per seat per lecture
);

-- Table: notifications
-- Stores notifications for students
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    timeslot_id INTEGER REFERENCES timeslots(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================================================
-- Seed Data: Users (for both auth and timetable modules)
-- =====================================================================================
-- Password for all accounts: password123
-- bcrypt hash generated with 10 salt rounds
-- These users work with BOTH the login-signin OTP auth AND the timetable module

INSERT INTO users (id_number, full_name, email, role, status, password_hash) VALUES
    -- Admin
    ('ADM001', 'Bandula Jayawardena', 'admin@unihelp.com', 'admin', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    -- Lecturers
    ('LEC001', 'Dr. Sarath Gunasekara', 'sarath.gunasekara@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    ('LEC002', 'Dr. Chamara Perera', 'chamara.perera@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    ('LEC003', 'Prof. Nimal Silva', 'nimal.silva@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly'),
    -- Students
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
    password_hash = EXCLUDED.password_hash;

-- =====================================================================================
-- Seed Data: Timetable-specific tables
-- =====================================================================================

-- Insert subjects
INSERT INTO subjects (subject_name, subject_code) VALUES
    ('Introduction to Programming', 'CS101'),
    ('Data Structures and Algorithms', 'CS201'),
    ('Database Systems', 'CS301'),
    ('Web Development', 'CS401'),
    ('Software Engineering', 'CS402')
ON CONFLICT (subject_code) DO NOTHING;

-- Insert locations
INSERT INTO locations (room_name, seat_count) VALUES
    ('Lecture Hall A', 100),
    ('Lecture Hall B', 80),
    ('Computer Lab 1', 40),
    ('Computer Lab 2', 40),
    ('Seminar Room 1', 30)
ON CONFLICT DO NOTHING;

-- Insert timeslots
-- We need to reference user IDs from the users table
-- day_of_week: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday
INSERT INTO timeslots (subject_id, lecturer_id, location_id, day_of_week, start_time, end_time)
SELECT sub.id, lec.id, loc.id, t.day, t.start, t.end
FROM (
    VALUES
        -- Monday
        (1, 'LEC001', 'Lecture Hall A', 1, '09:00', '11:00'),
        (2, 'LEC002', 'Lecture Hall B', 1, '14:00', '16:00'),
        -- Tuesday
        (3, 'LEC001', 'Computer Lab 1', 2, '09:00', '11:00'),
        (4, 'LEC003', 'Computer Lab 2', 2, '14:00', '16:00'),
        -- Wednesday
        (1, 'LEC001', 'Lecture Hall A', 3, '10:00', '12:00'),
        (5, 'LEC002', 'Seminar Room 1', 3, '14:00', '16:00'),
        -- Thursday
        (2, 'LEC002', 'Lecture Hall B', 4, '09:00', '11:00'),
        (3, 'LEC001', 'Computer Lab 1', 4, '14:00', '16:00'),
        -- Friday
        (4, 'LEC003', 'Computer Lab 2', 5, '09:00', '11:00'),
        (5, 'LEC002', 'Lecture Hall A', 5, '13:00', '15:00')
) AS t(sub_order, lec_id_number, loc_name, day, start, end)
JOIN subjects sub ON sub.id = t.sub_order
JOIN users lec ON lec.id_number = t.lec_id_number
JOIN locations loc ON loc.room_name = t.loc_name;

-- Insert some bookings (students booking seats)
-- We need to reference user IDs from the users table
INSERT INTO bookings (student_id, timeslot_id, seat_number, attendance_status)
SELECT stu.id, ts.id, b.seat, b.status
FROM (
    VALUES
        (1, 'STU001', 1, 'booked'),
        (1, 'STU002', 2, 'booked'),
        (1, 'STU003', 3, 'booked'),
        (2, 'STU001', 5, 'booked'),
        (2, 'STU004', 6, 'booked'),
        (3, 'STU005', 1, 'attended')
) AS b(ts_order, stu_id_number, seat, status)
JOIN users stu ON stu.id_number = b.stu_id_number
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM timeslots
) ts ON ts.rn = b.ts_order;

-- Insert a notification for a student
INSERT INTO notifications (user_id, timeslot_id, message, is_read)
SELECT stu.id, ts.id, n.msg, n.read
FROM (
    VALUES
        ('STU001', 1, 'Lecture topic updated: Introduction to Variables and Data Types', false),
        ('STU002', 1, 'Room changed to Lecture Hall B', false)
) AS n(stu_id_number, ts_order, msg, read)
JOIN users stu ON stu.id_number = n.stu_id_number
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM timeslots
) ts ON ts.rn = n.ts_order;
