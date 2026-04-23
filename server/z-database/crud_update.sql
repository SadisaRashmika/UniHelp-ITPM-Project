-- Update quizzes table
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'quiz';
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS faculty_id INTEGER;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS intake_id INTEGER;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS semester_id INTEGER;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS module_id INTEGER;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS total_marks INTEGER;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS questions JSONB;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Update submissions table
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS quiz_title VARCHAR(255);

-- Create careers table
CREATE TABLE IF NOT EXISTS careers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- Internship, Full-time, Co-op
    location VARCHAR(255),
    salary VARCHAR(100),
    duration VARCHAR(100),
    stipend VARCHAR(100),
    posted DATE DEFAULT CURRENT_DATE,
    deadline DATE,
    description TEXT,
    requirements JSONB,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    skills TEXT,
    education TEXT,
    experience TEXT,
    projects TEXT,
    certificates TEXT,
    achievements TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Dummy data for careers
INSERT INTO careers (title, company, type, location, salary, posted, deadline, description, requirements, status)
VALUES 
('Frontend Developer Intern', 'Tech Solutions Inc.', 'Internship', 'San Francisco, CA', '$25-30/hr', '2024-04-01', '2024-04-15', 'Looking for motivated frontend developer intern with React experience.', '["React", "JavaScript", "CSS", "HTML"]', 'active'),
('Junior Software Developer', 'Digital Innovations', 'Full-time', 'New York, NY', '$60,000-75,000', '2024-03-28', '2024-04-20', 'Entry-level position for recent CS graduates.', '["JavaScript", "Python", "SQL", "Git"]', 'active'),
('Data Science Intern', 'Microsoft', 'Internship', 'Redmond, WA', '', '2024-03-18', '2024-04-08', 'Work with real-world data science projects.', '["Python", "Machine Learning", "Statistics", "SQL"]', 'active');
