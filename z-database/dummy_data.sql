-- Insert 2 lecturers
INSERT INTO lecturers (name, initials, title, department, employee_id, email, password, points)
VALUES
	('Dr. Chamara Perera', 'CP', 'Senior Lecturer', 'Computer Science', 'LEC001', 'chamara@uni.edu', 'password123', 10),
	('Dr. Saman Jayasekara', 'SJ', 'Lecturer', 'Information Technology', 'LEC002', 'saman@uni.edu', 'password123', 8)
ON CONFLICT (employee_id) DO NOTHING;

-- Insert 2 students
INSERT INTO students (name, initials, student_id, email, password, year, semester, likes, rank, bonus_used)
VALUES
	('Nimal Silva', 'NS', 'STU001', 'nimal@uni.edu', 'password123', '3rd Year', '2nd Semester', 5, 1, false),
	('Kamal Perera', 'KP', 'STU002', 'kamal@uni.edu', 'password123', '2nd Year', '1st Semester', 2, 2, false)
ON CONFLICT (student_id) DO NOTHING;
