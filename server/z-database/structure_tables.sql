CREATE TABLE IF NOT EXISTS faculties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS intakes (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL
);

-- Ensure name column exists in case the table was created previously without it
ALTER TABLE intakes ADD COLUMN IF NOT EXISTS name VARCHAR(255);

CREATE TABLE IF NOT EXISTS semesters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Ensure number column exists in case the table was created previously without it
ALTER TABLE semesters ADD COLUMN IF NOT EXISTS number INTEGER;

CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Ensure columns exist in case the table was created previously without them
ALTER TABLE modules ADD COLUMN IF NOT EXISTS faculty_id INTEGER REFERENCES faculties(id);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS intake_id INTEGER REFERENCES intakes(id);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS semester_id INTEGER REFERENCES semesters(id);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS credits INTEGER;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS description TEXT;

-- Insert dummy data if empty
INSERT INTO faculties (id, name, code) VALUES 
(1, 'Faculty of Computing', 'FC'),
(2, 'Faculty of Engineering', 'FE'),
(3, 'Faculty of Business', 'FB')
ON CONFLICT (id) DO NOTHING;

INSERT INTO intakes (id, year, name) VALUES 
(1, 2026, 'January 2026'),
(2, 2026, 'May 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO semesters (id, name, number) VALUES 
(1, 'Semester 1', 1),
(2, 'Semester 2', 2),
(3, 'Semester 3', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO modules (id, code, name, faculty_id, intake_id, semester_id, credits, description) VALUES 
(1, 'CS101', 'Introduction to Programming', 1, 1, 1, 4, 'Basic programming concepts'),
(2, 'CS102', 'Web Development Fundamentals', 1, 1, 1, 3, 'HTML, CSS, and JavaScript basics'),
(3, 'ENG101', 'Engineering Mathematics', 2, 1, 1, 4, 'Calculus and Linear Algebra'),
(4, 'BUS101', 'Introduction to Business', 3, 1, 1, 3, 'Business fundamentals')
ON CONFLICT (id) DO NOTHING;
