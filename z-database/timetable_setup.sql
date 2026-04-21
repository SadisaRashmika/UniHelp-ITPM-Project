-- =============================================================================
-- UniHelp Timetable Module - Fresh Schema Setup
-- =============================================================================
-- This script assumes the fresh database schema is already loaded:
--   - lecturers table exists
--   - students table exists
--   - no shared users table is used
-- It creates timetable-specific tables and seeds data using lecturer/student IDs.
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. TIMETABLE TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    seat_count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS timeslots (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    lecturer_id INTEGER REFERENCES lecturers(id),
    location_id INTEGER REFERENCES locations(id),
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    lecture_topic TEXT,
    notice TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    timeslot_id INTEGER REFERENCES timeslots(id),
    seat_number INTEGER NOT NULL,
    attendance_status VARCHAR(20) DEFAULT 'booked' CHECK (attendance_status IN ('booked', 'attended', 'absent')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, timeslot_id),
    UNIQUE (timeslot_id, seat_number)
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    recipient_role VARCHAR(20) NOT NULL CHECK (recipient_role IN ('student', 'lecturer')),
    recipient_id INTEGER NOT NULL,
    timeslot_id INTEGER REFERENCES timeslots(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 2. SEED SUBJECTS / LOCATIONS
-- =============================================================================

INSERT INTO subjects (subject_name, subject_code) VALUES
    ('Programming Fundamentals', 'IT101'),
    ('Data Structures', 'IT201'),
    ('Database Systems', 'IT301'),
    ('Web Development', 'IT401'),
    ('Software Engineering', 'IT402')
ON CONFLICT (subject_code) DO NOTHING;

INSERT INTO locations (room_name, seat_count) VALUES
    ('Lecture Hall A', 100),
    ('Lecture Hall B', 80),
    ('Computer Lab 1', 40),
    ('Computer Lab 2', 40),
    ('Seminar Room 1', 30)
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 3. SEED TIMETABLE DATA
-- =============================================================================

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
        (1, 'LEC001', 'Lecture Hall A', 1, '09:00'::TIME, '11:00'::TIME, 'Introduction to Variables and Data Types'::TEXT, NULL::TEXT),
        (2, 'LEC002', 'Lecture Hall B', 1, '14:00'::TIME, '16:00'::TIME, 'Arrays and Linked Lists'::TEXT, NULL::TEXT),
        (3, 'LEC001', 'Computer Lab 1', 2, '09:00'::TIME, '11:00'::TIME, 'SQL Basics and Joins'::TEXT, 'Bring your laptops'::TEXT),
        (4, 'LEC003', 'Computer Lab 2', 2, '14:00'::TIME, '16:00'::TIME, 'HTML and CSS Fundamentals'::TEXT, NULL::TEXT),
        (1, 'LEC001', 'Lecture Hall A', 3, '10:00'::TIME, '12:00'::TIME, 'Control Flow and Loops'::TEXT, NULL::TEXT),
        (5, 'LEC002', 'Seminar Room 1', 3, '14:00'::TIME, '16:00'::TIME, 'Agile Methodology'::TEXT, NULL::TEXT),
        (2, 'LEC002', 'Lecture Hall B', 4, '09:00'::TIME, '11:00'::TIME, 'Trees and Graphs'::TEXT, NULL::TEXT),
        (3, 'LEC001', 'Computer Lab 1', 4, '14:00'::TIME, '16:00'::TIME, 'Normalization and ER Diagrams'::TEXT, NULL::TEXT),
        (4, 'LEC003', 'Computer Lab 2', 5, '09:00'::TIME, '11:00'::TIME, 'JavaScript DOM Manipulation'::TEXT, NULL::TEXT),
        (5, 'LEC002', 'Lecture Hall A', 5, '13:00'::TIME, '15:00'::TIME, 'Software Testing Strategies'::TEXT, NULL::TEXT)
) AS t(subject_order, lecturer_code, location_name, day_of_week, start_time, end_time, lecture_topic, notice)
JOIN subjects sub ON sub.id = t.subject_order
JOIN lecturers lec ON lec.employee_id = t.lecturer_code
JOIN locations loc ON loc.room_name = t.location_name;

INSERT INTO bookings (student_id, timeslot_id, seat_number, attendance_status)
SELECT
    stu.id,
    ts.id,
    b.seat_number,
    b.attendance_status
FROM (
    VALUES
        ('STU001', 1, 1, 'booked'),
        ('STU002', 1, 2, 'booked'),
        ('STU003', 1, 3, 'booked'),
        ('STU001', 2, 5, 'booked'),
        ('STU004', 2, 6, 'booked'),
        ('STU005', 3, 1, 'attended')
) AS b(student_code, timeslot_order, seat_number, attendance_status)
JOIN students stu ON stu.student_id = b.student_code
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM timeslots
) ts ON ts.rn = b.timeslot_order;

INSERT INTO notifications (recipient_role, recipient_id, timeslot_id, message, is_read)
SELECT
    'student',
    stu.id,
    ts.id,
    n.message,
    n.is_read
FROM (
    VALUES
        ('STU001', 1, 'Lecture topic updated: Introduction to Variables and Data Types', false),
        ('STU002', 1, 'Room changed to Lecture Hall B', false)
) AS n(student_code, timeslot_order, message, is_read)
JOIN students stu ON stu.student_id = n.student_code
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM timeslots
) ts ON ts.rn = n.timeslot_order;

-- =============================================================================
-- 4. RESET SEQUENCES
-- =============================================================================

SELECT setval('subjects_id_seq', (SELECT COALESCE(MAX(id), 1) FROM subjects));
SELECT setval('locations_id_seq', (SELECT COALESCE(MAX(id), 1) FROM locations));
SELECT setval('timeslots_id_seq', (SELECT COALESCE(MAX(id), 1) FROM timeslots));
SELECT setval('bookings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM bookings));
SELECT setval('notifications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM notifications));

COMMIT;
