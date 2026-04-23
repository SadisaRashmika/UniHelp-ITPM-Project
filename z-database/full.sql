BEGIN;

-- =====================================================================================
-- 1. DROP EXISTING TABLES (CLEAN SLATE)
-- =====================================================================================
DROP TABLE IF EXISTS auth_otp_codes CASCADE;
DROP TABLE IF EXISTS student_note_likes CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS bonus_mark_requests CASCADE;
DROP TABLE IF EXISTS student_notes CASCADE;
DROP TABLE IF EXISTS lecture_files CASCADE;
DROP TABLE IF EXISTS lectures CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS lecturers CASCADE;
DROP TABLE IF EXISTS otp_codes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS feedbacks CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS ticket_chats CASCADE;

-- =====================================================================================
-- 2. SCHEMA DEFINITION (FROM init.sql)
-- =====================================================================================

-- Lecturers
CREATE TABLE lecturers (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	initials VARCHAR(5) NOT NULL,
	title VARCHAR(100),
	department VARCHAR(150),
	employee_id VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(150) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	profile_image_url TEXT,
	points INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Students
CREATE TABLE students (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	initials VARCHAR(5) NOT NULL,
	student_id VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(150) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	profile_image_url TEXT,
	year VARCHAR(20),
	semester VARCHAR(20),
	likes INTEGER DEFAULT 0,
	rank INTEGER DEFAULT 0,
	bonus_used BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Lectures
CREATE TABLE lectures (
	id SERIAL PRIMARY KEY,
	lecturer_id INTEGER REFERENCES lecturers(id) ON DELETE SET NULL,
	title VARCHAR(200) NOT NULL,
	subject VARCHAR(150) NOT NULL,
	topic VARCHAR(150),
	year VARCHAR(20) NOT NULL,
	semester VARCHAR(20) NOT NULL,
	youtube_url VARCHAR(255),
	published_at TIMESTAMP DEFAULT NOW()
);

-- Lecture files
CREATE TABLE lecture_files (
	id SERIAL PRIMARY KEY,
	lecture_id INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
	filename VARCHAR(255) NOT NULL,
	filepath VARCHAR(500) NOT NULL,
	uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Student notes
CREATE TABLE student_notes (
	id SERIAL PRIMARY KEY,
	student_id INTEGER REFERENCES students(id),
	lecture_id INTEGER REFERENCES lectures(id),
	title VARCHAR(200) NOT NULL,
	filename VARCHAR(255) NOT NULL,
	filepath VARCHAR(500) NOT NULL,
	filesize VARCHAR(20),
	likes INTEGER DEFAULT 0,
	status VARCHAR(20) DEFAULT 'pending',
	rejection_note TEXT,
	uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Student note likes (one like per student per note)
CREATE TABLE student_note_likes (
	id BIGSERIAL PRIMARY KEY,
	note_id INTEGER NOT NULL REFERENCES student_notes(id) ON DELETE CASCADE,
	liked_by_student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
	liked_at TIMESTAMP NOT NULL DEFAULT NOW(),
	UNIQUE (note_id, liked_by_student_id)
);

-- Bonus requests
CREATE TABLE bonus_mark_requests (
	id SERIAL PRIMARY KEY,
	student_id INTEGER REFERENCES students(id),
	lecturer_id INTEGER REFERENCES lecturers(id),
	subject VARCHAR(150) NOT NULL,
	status VARCHAR(20) DEFAULT 'pending',
	unique_code VARCHAR(100),
	marks_added BOOLEAN DEFAULT FALSE,
	requested_at TIMESTAMP DEFAULT NOW(),
	approved_at TIMESTAMP
);

-- Quizzes
CREATE TABLE quizzes (
	id SERIAL PRIMARY KEY,
	lecture_id INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
	title VARCHAR(200) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE quiz_questions (
	id SERIAL PRIMARY KEY,
	quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
	question TEXT NOT NULL,
	options JSONB NOT NULL,
	answer_index INTEGER NOT NULL,
	order_num INTEGER NOT NULL DEFAULT 1
);

-- Feedbacks
CREATE TABLE feedbacks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
    lecturer_id INTEGER REFERENCES lecturers(id) ON DELETE CASCADE,
    subject VARCHAR(150),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TICKETS (INQUIRIES)
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    screenshot_url VARCHAR(255),
    category VARCHAR(100) DEFAULT 'Technical',
    contact_number VARCHAR(10),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_student_id ON tickets(student_id);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);

-- TICKET CHATS (COMMUNICATION LOGS)
CREATE TABLE ticket_chats (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    sender_id INTEGER, 
    sender_role VARCHAR(20), -- 'student' or 'lecturer' or 'system'
    message TEXT NOT NULL,
    is_system_message BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticket_chats_ticket_id ON ticket_chats(ticket_id);

-- Authentication Tables
CREATE TABLE users (
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

CREATE INDEX idx_users_email_lower ON users (LOWER(email));
CREATE INDEX idx_users_id_number ON users (id_number);

CREATE TABLE otp_codes (
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('ACTIVATE', 'RESET')),
	otp_hash VARCHAR(128) NOT NULL,
	attempt_count INTEGER NOT NULL DEFAULT 0,
	max_attempts INTEGER NOT NULL DEFAULT 5,
	expires_at TIMESTAMP NOT NULL,
	used_at TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otp_user_purpose_created ON otp_codes (user_id, purpose, created_at DESC);
CREATE INDEX idx_otp_expires_at ON otp_codes (expires_at);


ALTER TABLE lecturers ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Blocked'));
ALTER TABLE lecturers ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE lecturers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

ALTER TABLE students ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Blocked'));
ALTER TABLE students ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE TABLE auth_otp_codes (
	id BIGSERIAL PRIMARY KEY,
	role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer')),
	id_number VARCHAR(50) NOT NULL,
	purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('ACTIVATE', 'RESET')),
	otp_hash VARCHAR(128) NOT NULL,
	attempt_count INTEGER NOT NULL DEFAULT 0,
	max_attempts INTEGER NOT NULL DEFAULT 5,
	expires_at TIMESTAMP NOT NULL,
	used_at TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auth_otp_identity ON auth_otp_codes (role, id_number, purpose, created_at DESC);
CREATE INDEX idx_auth_otp_expires ON auth_otp_codes (expires_at);

-- =====================================================================================
-- 3. DATA INSERTS (FROM vimo.sql and dummy_data.sql)
-- =====================================================================================

-- LECTURERS
INSERT INTO lecturers (name, initials, title, department, employee_id, email, password, points) VALUES
('Dr. Chamara Perera', 'CP', 'Senior Lecturer', 'Computer Science', 'LEC001', 'chamara@uni.edu', 'password123', 10),
('Dr. Saman Jayasekara', 'SJ', 'Lecturer', 'Information Technology', 'LEC002', 'saman@uni.edu', 'password123', 8),
('Nimal Perera', 'N.P.', 'Senior Lecturer', 'IT', 'EMP001', 'nimal@uni.lk', 'pass123', 120),
('Kasun Silva', 'K.S.', 'Lecturer', 'SE', 'EMP002', 'kasun@uni.lk', 'pass123', 90),
('Amila Fernando', 'A.F.', 'Assistant Lecturer', 'CS', 'EMP003', 'amila@uni.lk', 'pass123', 60),
('Saman Kumara', 'S.K.', 'Lecturer', 'IT', 'EMP004', 'saman@uni.lk', 'pass123', 75),
('Ruwan Jayasinghe', 'R.J.', 'Senior Lecturer', 'SE', 'EMP005', 'ruwan@uni.lk', 'pass123', 150),
('Chathura Dias', 'C.D.', 'Lecturer', 'CS', 'EMP006', 'chathura@uni.lk', 'pass123', 80),
('Thilini Perera', 'T.P.', 'Assistant Lecturer', 'IT', 'EMP007', 'thilini@uni.lk', 'pass123', 55),
('Dilshan Wickrama', 'D.W.', 'Lecturer', 'SE', 'EMP008', 'dilshan@uni.lk', 'pass123', 95),
('System Admin', 'S.A.', 'Academic Head', 'Administration', 'ADM001', 'admin1@uni.lk', 'pass123', 0),
('Nuwan Perera', 'N.P.', 'Administrator', 'Administration', 'ADM002', 'nuwan@uni.lk', 'pass123', 0),
('Sajith Silva', 'S.S.', 'Administrator', 'Administration', 'ADM003', 'sajith@uni.lk', 'pass123', 0),
('Tharindu Fernando', 'T.F.', 'Support Moderator', 'Administration', 'ADM004', 'tharindu@uni.lk', 'pass123', 0),
('Iresha Jayasinghe', 'I.J.', 'Administrator', 'Administration', 'ADM005', 'iresha@uni.lk', 'pass123', 0)
ON CONFLICT (employee_id) DO UPDATE SET 
    name = EXCLUDED.name, 
    email = EXCLUDED.email, 
    points = EXCLUDED.points;

-- STUDENTS
INSERT INTO students (name, initials, student_id, email, password, year, semester, likes, rank, bonus_used) VALUES
('Nimal Silva', 'NS', 'STU001', 'nimal@uni.edu', 'password123', '3rd Year', '2nd Semester', 5, 1, false),
('Kamal Perera', 'KP', 'STU002', 'kamal@uni.edu', 'password123', '2nd Year', '1st Semester', 2, 2, false),
('Bashitha Weerapperuma', 'B.W.', 'ST001', 'bashitha@gmail.com', 'pass123', 'Y1', 'S1', 10, 1, FALSE),
('Ishara Silva', 'I.S.', 'ST002', 'ishara@gmail.com', 'pass123', 'Y1', 'S1', 8, 2, FALSE),
('Kavindu Perera', 'K.P.', 'ST003', 'kavindu@gmail.com', 'pass123', 'Y2', 'S1', 15, 1, TRUE),
('Nadeesha Fernando', 'N.F.', 'ST004', 'nadeesha@gmail.com', 'pass123', 'Y2', 'S2', 5, 3, FALSE),
('Supun Jayawardena', 'S.J.', 'ST005', 'supun@gmail.com', 'pass123', 'Y3', 'S1', 20, 1, TRUE),
('Tharushi Silva', 'T.S.', 'ST006', 'tharushi@gmail.com', 'pass123', 'Y3', 'S2', 12, 2, FALSE),
('Ravindu Lakshan', 'R.L.', 'ST007', 'ravindu@gmail.com', 'pass123', 'Y4', 'S1', 25, 1, TRUE),
('Dinithi Perera', 'D.P.', 'ST008', 'dinithi@gmail.com', 'pass123', 'Y4', 'S2', 18, 2, FALSE),
('Sahani Fernando', 'SF', 'STU003', 'emoji.officialff@gmail.com', 'password123', '2nd Year', '2nd Semester', 0, 3, false)
ON CONFLICT (student_id) DO UPDATE SET 
    name = EXCLUDED.name, 
    email = EXCLUDED.email, 
    likes = EXCLUDED.likes;

-- LECTURES
INSERT INTO lectures (lecturer_id, title, subject, topic, year, semester, youtube_url) VALUES
(1, 'Intro to Programming', 'Programming', 'Basics', 'Y1', 'S1', 'https://youtu.be/vid1'),
(2, 'OOP Concepts', 'Programming', 'OOP', 'Y1', 'S2', 'https://youtu.be/vid2'),
(3, 'Database Design', 'DBMS', 'ER Diagrams', 'Y2', 'S1', 'https://youtu.be/vid3'),
(4, 'SQL Basics', 'DBMS', 'Queries', 'Y2', 'S2', 'https://youtu.be/vid4'),
(5, 'Web Development', 'Web', 'HTML/CSS', 'Y1', 'S1', 'https://youtu.be/vid5'),
(6, 'React Basics', 'Web', 'Frontend', 'Y2', 'S2', 'https://youtu.be/vid6'),
(7, 'Networking Intro', 'Networks', 'OSI Model', 'Y3', 'S1', 'https://youtu.be/vid7'),
(8, 'Cyber Security', 'Security', 'Basics', 'Y4', 'S2', 'https://youtu.be/vid8')
ON CONFLICT DO NOTHING;

-- STUDENT NOTES
INSERT INTO student_notes (student_id, lecture_id, title, filename, filepath, filesize, likes, status) VALUES
(1, 1, 'Programming Notes', 'note1.pdf', '/notes/note1.pdf', '2MB', 5, 'approved'),
(2, 2, 'OOP Summary', 'note2.pdf', '/notes/note2.pdf', '1.5MB', 3, 'pending'),
(3, 3, 'DB Notes', 'note3.pdf', '/notes/note3.pdf', '3MB', 7, 'approved'),
(4, 4, 'SQL Queries', 'note4.pdf', '/notes/note4.pdf', '2MB', 2, 'rejected'),
(5, 5, 'Web Basics', 'note5.pdf', '/notes/note5.pdf', '2.5MB', 6, 'approved'),
(6, 6, 'React Guide', 'note6.pdf', '/notes/note6.pdf', '4MB', 9, 'approved'),
(7, 7, 'Networking', 'note7.pdf', '/notes/note7.pdf', '2MB', 1, 'pending'),
(8, 8, 'Security Tips', 'note8.pdf', '/notes/note8.pdf', '3MB', 4, 'approved')
ON CONFLICT DO NOTHING;

-- FEEDBACKS
INSERT INTO feedbacks (student_id, lecturer_id, subject, rating, comment) VALUES
(1, 1, 'Programming Basics', 5, 'Excellent teaching style, very clear concepts.'),
(2, 2, 'OOP Design', 4, 'Good lecture, but could use more practical examples.'),
(3, 3, 'Database Systems', 5, 'Highly detailed and well-structured database course.'),
(4, 4, 'SQL Advanced', 3, 'The pace was a bit too fast for beginners.'),
(5, 5, 'Web Architecture', 4, 'Fantastic insights into modern web frameworks.'),
(6, 6, 'React Native', 5, 'Perfect balance between theory and hands-on coding.'),
(7, 7, 'Network Security', 2, 'Audio quality was low in some parts of the recording.'),
(8, 8, 'Security Audit', 5, 'Very useful tips for real-world security practices.')
ON CONFLICT DO NOTHING;

-- TICKETS (INQUIRIES)
INSERT INTO tickets (student_id, subject, description, screenshot_url, category, contact_number, status) VALUES
(1, 'Portal Login Failure', 'I cannot login to the student portal despite using correct credentials.', NULL, 'System Access (Login)', '0712345678', 'pending'),
(2, 'Resource Link Broken', 'The PDF link for "OOP Summary" seems to be broken.', NULL, 'Technical Support', '0722345678', 'in-review'),
(3, 'Quiz Submission Bug', 'My quiz was submitted automatically before I could finish the last question.', NULL, 'Technical Support', '0752345678', 'resolved'),
(4, 'Grade Discrepancy', 'The grades shown in my overview do not match my actual results.', NULL, 'Examination & Results', '0762345678', 'pending'),
(5, 'Image Content Missing', 'Some images in the Web Architecture slides are not loading.', NULL, 'Technical Support', '0772345678', 'in-review'),
(6, 'Access Denied: SQL', 'I am getting an access denied error when trying to view SQL advanced notes.', NULL, 'System Access (Login)', '0782345678', 'resolved'),
(7, 'Module Registration Error', 'Unable to register for the Cloud Computing elective module.', NULL, 'Academic Assistance', '0702345678', 'pending'),
(8, 'Exam Timetable Issue', 'My elective exam and core exam are scheduled at the same time.', NULL, 'Examination & Results', '0719876543', 'in-review')
ON CONFLICT DO NOTHING;

-- Seed auth users for activation flow
INSERT INTO users (id_number, full_name, email, role, status, password_hash)
VALUES
	('LEC001', 'Dr. Chamara Perera', 'chamara@uni.edu', 'lecturer', 'Pending', NULL),
	('LEC002', 'Dr. Saman Jayasekara', 'saman@uni.edu', 'lecturer', 'Pending', NULL),
	('STU001', 'Nimal Silva', 'nimal@uni.edu', 'student', 'Pending', NULL),
	('STU002', 'Kamal Perera', 'kamal@uni.edu', 'student', 'Pending', NULL),
	('STU003', 'Sahani Fernando', 'emoji.officialff@gmail.com', 'student', 'Pending', NULL)
ON CONFLICT (id_number) DO UPDATE
SET
	full_name = EXCLUDED.full_name,
	email = EXCLUDED.email,
	role = EXCLUDED.role,
	status = 'Pending',
	password_hash = NULL,
	updated_at = NOW();

-- Initialize lecturer/student auth columns
UPDATE lecturers
SET
	status = COALESCE(status, 'Pending'),
	password_hash = NULL,
	updated_at = NOW();

UPDATE students
SET
	status = COALESCE(status, 'Pending'),
	password_hash = NULL,
	updated_at = NOW();

COMMIT;
