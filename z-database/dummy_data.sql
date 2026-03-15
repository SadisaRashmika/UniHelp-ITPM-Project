-- UniHelp Dummy Data
-- This file adds test data to the database

-- Insert admin user
-- password is 'admin123' (hashed with bcrypt)
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Admin User', 'admin@unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'admin');

-- Insert lecturers
-- password is 'lecturer123' (hashed with bcrypt)
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Dr. John Smith', 'john.smith@unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'lecturer'),
('Dr. Sarah Johnson', 'sarah.johnson@unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'lecturer'),
('Prof. Michael Brown', 'michael.brown@unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'lecturer');

-- Insert students
-- password is 'student123' (hashed with bcrypt)
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Alice Williams', 'alice.williams@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student'),
('Bob Taylor', 'bob.taylor@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student'),
('Charlie Davis', 'charlie.davis@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student'),
('Diana Miller', 'diana.miller@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student'),
('Eva Wilson', 'eva.wilson@student.unihelp.com', '$2b$10$dummyHashForTestingPurposesOnly', 'student');

-- Insert subjects
INSERT INTO subjects (subject_name, subject_code) VALUES
('Introduction to Programming', 'CS101'),
('Data Structures and Algorithms', 'CS201'),
('Database Systems', 'CS301'),
('Web Development', 'CS401'),
('Software Engineering', 'CS402');

-- Insert locations
INSERT INTO locations (room_name, seat_count) VALUES
('Lecture Hall A', 100),
('Lecture Hall B', 80),
('Computer Lab 1', 40),
('Computer Lab 2', 40),
('Seminar Room 1', 30);

-- Insert timeslots
-- day_of_week: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday
INSERT INTO timeslots (subject_id, lecturer_id, location_id, day_of_week, start_time, end_time) VALUES
-- Monday
(1, 2, 1, 1, '09:00', '11:00'),  -- CS101 with Dr. Sarah Johnson in Lecture Hall A
(2, 3, 2, 1, '14:00', '16:00'),  -- CS201 with Prof. Michael Brown in Lecture Hall B

-- Tuesday
(3, 2, 3, 2, '09:00', '11:00'),  -- CS301 with Dr. Sarah Johnson in Computer Lab 1
(4, 4, 4, 2, '14:00', '16:00'),  -- CS401 with lecturer id 4 in Computer Lab 2

-- Wednesday
(1, 2, 1, 3, '10:00', '12:00'),  -- CS101 with Dr. Sarah Johnson in Lecture Hall A
(5, 3, 5, 3, '14:00', '16:00'),  -- CS402 with Prof. Michael Brown in Seminar Room 1

-- Thursday
(2, 3, 2, 4, '09:00', '11:00'),  -- CS201 with Prof. Michael Brown in Lecture Hall B
(3, 2, 3, 4, '14:00', '16:00'),  -- CS301 with Dr. Sarah Johnson in Computer Lab 1

-- Friday
(4, 4, 4, 5, '09:00', '11:00'),  -- CS401 with lecturer id 4 in Computer Lab 2
(5, 3, 1, 5, '13:00', '15:00');  -- CS402 with Prof. Michael Brown in Lecture Hall A

-- Insert some bookings (students booking seats)
INSERT INTO bookings (student_id, timeslot_id, seat_number, attendance_status) VALUES
(5, 1, 1, 'booked'),   -- Alice booked seat 1 for timeslot 1
(6, 1, 2, 'booked'),   -- Bob booked seat 2 for timeslot 1
(7, 1, 3, 'booked'),   -- Charlie booked seat 3 for timeslot 1
(5, 2, 5, 'booked'),   -- Alice booked seat 5 for timeslot 2
(8, 2, 6, 'booked'),   -- Diana booked seat 6 for timeslot 2
(9, 3, 1, 'attended'); -- Eva booked seat 1 for timeslot 3 and attended

-- Insert a notification for a student
INSERT INTO notifications (user_id, timeslot_id, message, is_read) VALUES
(5, 1, 'Lecture topic updated: Introduction to Variables and Data Types', false),
(6, 1, 'Room changed to Lecture Hall B', false);
