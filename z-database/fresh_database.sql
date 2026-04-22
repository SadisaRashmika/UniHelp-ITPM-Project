BEGIN;

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
	status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Blocked')),
	password_hash VARCHAR(255),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	created_at TIMESTAMP DEFAULT NOW(),
	faculty VARCHAR(100)
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
	status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Blocked')),
	password_hash VARCHAR(255),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
	created_at TIMESTAMP DEFAULT NOW(),
	faculty VARCHAR(100)
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
	faculty VARCHAR(100),
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

-- Login and OTP for activation/reset
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

-- Starter lecturers
INSERT INTO lecturers (
	name,
	initials,
	title,
	department,
	employee_id,
	email,
	password,
	points,
	status,
	password_hash
)
VALUES
	('Dr. Chamara Perera', 'CP', 'Senior Lecturer', 'Computer Science', 'LEC001', 'chamara@uni.edu', 'LEGACY_DISABLED', 10, 'Pending', NULL),
	('Dr. Saman Jayasekara', 'SJ', 'Lecturer', 'Information Technology', 'LEC002', 'saman@uni.edu', 'LEGACY_DISABLED', 8, 'Pending', NULL)
ON CONFLICT (employee_id) DO UPDATE
SET
	name = EXCLUDED.name,
	initials = EXCLUDED.initials,
	title = EXCLUDED.title,
	department = EXCLUDED.department,
	email = EXCLUDED.email,
	password = EXCLUDED.password,
	points = EXCLUDED.points,
	status = EXCLUDED.status,
	password_hash = EXCLUDED.password_hash,
	updated_at = NOW();

-- Starter students
INSERT INTO students (
	name,
	initials,
	student_id,
	email,
	password,
	year,
	semester,
	likes,
	rank,
	bonus_used,
	status,
	password_hash
)
VALUES
	('Nimal Silva', 'NS', 'STU001', 'nimal@uni.edu', 'LEGACY_DISABLED', '3rd Year', '2nd Semester', 5, 1, FALSE, 'Pending', NULL),
	('Kamal Perera', 'KP', 'STU002', 'kamal@uni.edu', 'LEGACY_DISABLED', '2nd Year', '1st Semester', 2, 2, FALSE, 'Pending', NULL)
ON CONFLICT (student_id) DO UPDATE
SET
	name = EXCLUDED.name,
	initials = EXCLUDED.initials,
	email = EXCLUDED.email,
	password = EXCLUDED.password,
	year = EXCLUDED.year,
	semester = EXCLUDED.semester,
	likes = EXCLUDED.likes,
	rank = EXCLUDED.rank,
	bonus_used = EXCLUDED.bonus_used,
	status = EXCLUDED.status,
	password_hash = EXCLUDED.password_hash,
	updated_at = NOW();

COMMIT;