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



-- Lecturers
INSERT INTO lecturers (name, initials, title, department, employee_id, email, password, points) VALUES
('Nimal Perera', 'N.P.', 'Senior Lecturer', 'IT', 'EMP001', 'nimal@uni.lk', 'pass123', 120),
('Kasun Silva', 'K.S.', 'Lecturer', 'SE', 'EMP002', 'kasun@uni.lk', 'pass123', 90),
('Amila Fernando', 'A.F.', 'Assistant Lecturer', 'CS', 'EMP003', 'amila@uni.lk', 'pass123', 60),
('Saman Kumara', 'S.K.', 'Lecturer', 'IT', 'EMP004', 'saman@uni.lk', 'pass123', 75),
('Ruwan Jayasinghe', 'R.J.', 'Senior Lecturer', 'SE', 'EMP005', 'ruwan@uni.lk', 'pass123', 150),
('Chathura Dias', 'C.D.', 'Lecturer', 'CS', 'EMP006', 'chathura@uni.lk', 'pass123', 80),
('Thilini Perera', 'T.P.', 'Assistant Lecturer', 'IT', 'EMP007', 'thilini@uni.lk', 'pass123', 55),
('Dilshan Wickrama', 'D.W.', 'Lecturer', 'SE', 'EMP008', 'dilshan@uni.lk', 'pass123', 95);

-- Students
INSERT INTO students (name, initials, student_id, email, password, year, semester, likes, rank, bonus_used) VALUES
('Bashitha Weerapperuma', 'B.W.', 'ST001', 'bashitha@gmail.com', 'pass123', 'Y1', 'S1', 10, 1, FALSE),
('Ishara Silva', 'I.S.', 'ST002', 'ishara@gmail.com', 'pass123', 'Y1', 'S1', 8, 2, FALSE),
('Kavindu Perera', 'K.P.', 'ST003', 'kavindu@gmail.com', 'pass123', 'Y2', 'S1', 15, 1, TRUE),
('Nadeesha Fernando', 'N.F.', 'ST004', 'nadeesha@gmail.com', 'pass123', 'Y2', 'S2', 5, 3, FALSE),
('Supun Jayawardena', 'S.J.', 'ST005', 'supun@gmail.com', 'pass123', 'Y3', 'S1', 20, 1, TRUE),
('Tharushi Silva', 'T.S.', 'ST006', 'tharushi@gmail.com', 'pass123', 'Y3', 'S2', 12, 2, FALSE),
('Ravindu Lakshan', 'R.L.', 'ST007', 'ravindu@gmail.com', 'pass123', 'Y4', 'S1', 25, 1, TRUE),
('Dinithi Perera', 'D.P.', 'ST008', 'dinithi@gmail.com', 'pass123', 'Y4', 'S2', 18, 2, FALSE);

-- Lectures
INSERT INTO lectures (lecturer_id, title, subject, topic, year, semester, youtube_url) VALUES
(1, 'Intro to Programming', 'Programming', 'Basics', 'Y1', 'S1', 'https://youtu.be/vid1'),
(2, 'OOP Concepts', 'Programming', 'OOP', 'Y1', 'S2', 'https://youtu.be/vid2'),
(3, 'Database Design', 'DBMS', 'ER Diagrams', 'Y2', 'S1', 'https://youtu.be/vid3'),
(4, 'SQL Basics', 'DBMS', 'Queries', 'Y2', 'S2', 'https://youtu.be/vid4'),
(5, 'Web Development', 'Web', 'HTML/CSS', 'Y1', 'S1', 'https://youtu.be/vid5'),
(6, 'React Basics', 'Web', 'Frontend', 'Y2', 'S2', 'https://youtu.be/vid6'),
(7, 'Networking Intro', 'Networks', 'OSI Model', 'Y3', 'S1', 'https://youtu.be/vid7'),
(8, 'Cyber Security', 'Security', 'Basics', 'Y4', 'S2', 'https://youtu.be/vid8');

-- Lecture files
INSERT INTO lecture_files (lecture_id, filename, filepath) VALUES
(1, 'intro.pdf', '/files/intro.pdf'),
(2, 'oop.pdf', '/files/oop.pdf'),
(3, 'db_design.pdf', '/files/db_design.pdf'),
(4, 'sql.pdf', '/files/sql.pdf'),
(5, 'web.pdf', '/files/web.pdf'),
(6, 'react.pdf', '/files/react.pdf'),
(7, 'network.pdf', '/files/network.pdf'),
(8, 'security.pdf', '/files/security.pdf');

-- Student notes
INSERT INTO student_notes (student_id, lecture_id, title, filename, filepath, filesize, likes, status) VALUES
(1, 1, 'Programming Notes', 'note1.pdf', '/notes/note1.pdf', '2MB', 5, 'approved'),
(2, 2, 'OOP Summary', 'note2.pdf', '/notes/note2.pdf', '1.5MB', 3, 'pending'),
(3, 3, 'DB Notes', 'note3.pdf', '/notes/note3.pdf', '3MB', 7, 'approved'),
(4, 4, 'SQL Queries', 'note4.pdf', '/notes/note4.pdf', '2MB', 2, 'rejected'),
(5, 5, 'Web Basics', 'note5.pdf', '/notes/note5.pdf', '2.5MB', 6, 'approved'),
(6, 6, 'React Guide', 'note6.pdf', '/notes/note6.pdf', '4MB', 9, 'approved'),
(7, 7, 'Networking', 'note7.pdf', '/notes/note7.pdf', '2MB', 1, 'pending'),
(8, 8, 'Security Tips', 'note8.pdf', '/notes/note8.pdf', '3MB', 4, 'approved');

-- Bonus requests
INSERT INTO bonus_mark_requests (student_id, lecturer_id, subject, status, unique_code, marks_added) VALUES
(1, 1, 'Programming', 'approved', 'CODE001', TRUE),
(2, 2, 'OOP', 'pending', 'CODE002', FALSE),
(3, 3, 'DBMS', 'approved', 'CODE003', TRUE),
(4, 4, 'DBMS', 'rejected', 'CODE004', FALSE),
(5, 5, 'Web', 'approved', 'CODE005', TRUE),
(6, 6, 'React', 'pending', 'CODE006', FALSE),
(7, 7, 'Networks', 'approved', 'CODE007', TRUE),
(8, 8, 'Security', 'pending', 'CODE008', FALSE);

-- Quizzes
INSERT INTO quizzes (lecture_id, title) VALUES
(1, 'Programming Quiz'),
(2, 'OOP Quiz'),
(3, 'DB Quiz'),
(4, 'SQL Quiz'),
(5, 'Web Quiz'),
(6, 'React Quiz'),
(7, 'Networking Quiz'),
(8, 'Security Quiz');

-- Quiz questions
INSERT INTO quiz_questions (quiz_id, question, options, answer_index, order_num) VALUES
(1, 'What is a variable?', '["Storage", "Loop", "Function", "Class"]', 0, 1),
(2, 'What is OOP?', '["Procedure", "Object-based", "Loop", "None"]', 1, 1),
(3, 'What is DB?', '["Data store", "UI", "API", "None"]', 0, 1),
(4, 'SELECT is used for?', '["Insert", "Delete", "Retrieve", "Update"]', 2, 1),
(5, 'HTML stands for?', '["HyperText", "HighText", "None", "Both"]', 0, 1),
(6, 'React is?', '["Backend", "Frontend", "DB", "None"]', 1, 1),
(7, 'OSI has layers?', '["5", "6", "7", "8"]', 2, 1),
(8, 'Security means?', '["Protection", "Attack", "Hack", "None"]', 0, 1);