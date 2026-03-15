-- UniHelp Database Schema
-- This file creates all the tables for the timetable management system

-- Table: users
-- Stores information about all users (students, lecturers, admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table: subjects
-- Stores information about university subjects/courses
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE
);

-- Table: locations
-- Stores information about lecture halls and rooms
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    seat_count INTEGER NOT NULL
);

-- Table: timeslots
-- The main timetable table. Each row is one lecture session
CREATE TABLE timeslots (
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
CREATE TABLE bookings (
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
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    timeslot_id INTEGER REFERENCES timeslots(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
