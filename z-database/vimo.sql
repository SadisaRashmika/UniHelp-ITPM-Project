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
('Dilshan Wickrama', 'D.W.', 'Lecturer', 'SE', 'EMP008', 'dilshan@uni.lk', 'pass123', 95)
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
('Dinithi Perera', 'D.P.', 'ST008', 'dinithi@gmail.com', 'pass123', 'Y4', 'S2', 18, 2, FALSE)
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


INSERT INTO admins (name, admin_id, email, password, role) VALUES
('System Admin', 'ADM001', 'admin1@uni.lk', 'pass123', 'super_admin'),
('Nuwan Perera', 'ADM002', 'nuwan@uni.lk', 'pass123', 'admin'),
('Sajith Silva', 'ADM003', 'sajith@uni.lk', 'pass123', 'admin'),
('Tharindu Fernando', 'ADM004', 'tharindu@uni.lk', 'pass123', 'moderator'),
('Iresha Jayasinghe', 'ADM005', 'iresha@uni.lk', 'pass123', 'admin');