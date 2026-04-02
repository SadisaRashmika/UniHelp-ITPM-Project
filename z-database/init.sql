-- Lecturers
CREATE TABLE IF NOT EXISTS lecturers (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	initials VARCHAR(5) NOT NULL,
	title VARCHAR(100),
	department VARCHAR(150),
	employee_id VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(150) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	points INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Students
CREATE TABLE IF NOT EXISTS students (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	initials VARCHAR(5) NOT NULL,
	student_id VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(150) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	year VARCHAR(20),
	semester VARCHAR(20),
	likes INTEGER DEFAULT 0,
	rank INTEGER DEFAULT 0,
	bonus_used BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Lectures
CREATE TABLE IF NOT EXISTS lectures (
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
CREATE TABLE IF NOT EXISTS lecture_files (
	id SERIAL PRIMARY KEY,
	lecture_id INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
	filename VARCHAR(255) NOT NULL,
	filepath VARCHAR(500) NOT NULL,
	uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Student notes
CREATE TABLE IF NOT EXISTS student_notes (
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

-- Bonus requests
CREATE TABLE IF NOT EXISTS bonus_mark_requests (
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
CREATE TABLE IF NOT EXISTS quizzes (
	id SERIAL PRIMARY KEY,
	lecture_id INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
	title VARCHAR(200) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
	id SERIAL PRIMARY KEY,
	quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
	question TEXT NOT NULL,
	options JSONB NOT NULL,
	answer_index INTEGER NOT NULL,
	order_num INTEGER NOT NULL DEFAULT 1
);

-- Feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
    lecturer_id INTEGER REFERENCES lecturers(id) ON DELETE CASCADE,
    subject VARCHAR(150),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TICKETS (INQUIRIES)
CREATE TABLE IF NOT EXISTS tickets (
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

CREATE INDEX IF NOT EXISTS idx_tickets_student_id ON tickets(student_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);

-- TICKET CHATS (COMMUNICATION LOGS)
CREATE TABLE IF NOT EXISTS ticket_chats (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    sender_id INTEGER, 
    sender_role VARCHAR(20), -- 'student' or 'lecturer' or 'system'
    message TEXT NOT NULL,
    is_system_message BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ticket_chats_ticket_id ON ticket_chats(ticket_id);

