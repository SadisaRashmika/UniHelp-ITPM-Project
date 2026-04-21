BEGIN;

-- =====================================================================================
-- Database: unihelp_db2
-- Exported: 2026-04-21T07:08:59.506Z
-- =====================================================================================

-- =====================================================================================
-- DROP EXISTING TABLES
-- =====================================================================================
DROP TABLE IF EXISTS auth_otp_codes CASCADE;
DROP TABLE IF EXISTS bonus_mark_requests CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS feedbacks CASCADE;
DROP TABLE IF EXISTS lecture_files CASCADE;
DROP TABLE IF EXISTS lecturers CASCADE;
DROP TABLE IF EXISTS lectures CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS student_note_likes CASCADE;
DROP TABLE IF EXISTS student_notes CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS ticket_chats CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS timeslots CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================================================
-- CREATE TABLES
-- =====================================================================================

CREATE TABLE auth_otp_codes (
  id bigint DEFAULT nextval('auth_otp_codes_id_seq'::regclass) NOT NULL,
  role character varying NOT NULL,
  id_number character varying NOT NULL,
  purpose character varying NOT NULL,
  otp_hash character varying NOT NULL,
  attempt_count integer DEFAULT 0 NOT NULL,
  max_attempts integer DEFAULT 5 NOT NULL,
  expires_at timestamp without time zone NOT NULL,
  used_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE bonus_mark_requests (
  id integer DEFAULT nextval('bonus_mark_requests_id_seq'::regclass) NOT NULL,
  student_id integer,
  lecturer_id integer,
  subject character varying NOT NULL,
  status character varying DEFAULT 'pending'::character varying,
  unique_code character varying,
  marks_added boolean DEFAULT false,
  requested_at timestamp without time zone DEFAULT now(),
  approved_at timestamp without time zone
);

CREATE TABLE bookings (
  id integer DEFAULT nextval('bookings_id_seq'::regclass) NOT NULL,
  student_id integer,
  timeslot_id integer,
  seat_number integer NOT NULL,
  attendance_status character varying DEFAULT 'booked'::character varying,
  created_at timestamp without time zone DEFAULT now()
);

CREATE TABLE feedbacks (
  id integer DEFAULT nextval('feedbacks_id_seq'::regclass) NOT NULL,
  student_id integer,
  lecturer_id integer,
  subject character varying,
  rating integer,
  comment text,
  created_at timestamp without time zone DEFAULT now(),
  module_id integer
);

CREATE TABLE lecture_files (
  id integer DEFAULT nextval('lecture_files_id_seq'::regclass) NOT NULL,
  lecture_id integer,
  filename character varying NOT NULL,
  filepath character varying NOT NULL,
  uploaded_at timestamp without time zone DEFAULT now()
);

CREATE TABLE lecturers (
  id integer DEFAULT nextval('lecturers_id_seq'::regclass) NOT NULL,
  name character varying NOT NULL,
  initials character varying NOT NULL,
  title character varying,
  department character varying,
  employee_id character varying NOT NULL,
  email character varying NOT NULL,
  password character varying NOT NULL,
  points integer DEFAULT 0,
  status character varying DEFAULT 'Pending'::character varying NOT NULL,
  password_hash character varying,
  updated_at timestamp without time zone DEFAULT now() NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  profile_image_url text
);

CREATE TABLE lectures (
  id integer DEFAULT nextval('lectures_id_seq'::regclass) NOT NULL,
  lecturer_id integer,
  title character varying NOT NULL,
  subject character varying NOT NULL,
  topic character varying,
  year character varying NOT NULL,
  semester character varying NOT NULL,
  youtube_url character varying,
  published_at timestamp without time zone DEFAULT now()
);

CREATE TABLE locations (
  id integer DEFAULT nextval('locations_id_seq'::regclass) NOT NULL,
  room_name character varying NOT NULL,
  seat_count integer NOT NULL
);

CREATE TABLE notifications (
  id integer DEFAULT nextval('notifications_id_seq'::regclass) NOT NULL,
  user_id integer,
  timeslot_id integer,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now()
);

CREATE TABLE quiz_questions (
  id integer DEFAULT nextval('quiz_questions_id_seq'::regclass) NOT NULL,
  quiz_id integer,
  question text NOT NULL,
  options jsonb NOT NULL,
  answer_index integer NOT NULL,
  order_num integer DEFAULT 1 NOT NULL
);

CREATE TABLE quizzes (
  id integer DEFAULT nextval('quizzes_id_seq'::regclass) NOT NULL,
  lecture_id integer,
  title character varying NOT NULL,
  created_at timestamp without time zone DEFAULT now()
);

CREATE TABLE student_note_likes (
  id bigint DEFAULT nextval('student_note_likes_id_seq'::regclass) NOT NULL,
  note_id integer NOT NULL,
  liked_by_student_id integer NOT NULL,
  liked_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE student_notes (
  id integer DEFAULT nextval('student_notes_id_seq'::regclass) NOT NULL,
  student_id integer,
  lecture_id integer,
  title character varying NOT NULL,
  filename character varying NOT NULL,
  filepath character varying NOT NULL,
  filesize character varying,
  likes integer DEFAULT 0,
  status character varying DEFAULT 'pending'::character varying,
  rejection_note text,
  uploaded_at timestamp without time zone DEFAULT now()
);

CREATE TABLE students (
  id integer DEFAULT nextval('students_id_seq'::regclass) NOT NULL,
  name character varying NOT NULL,
  initials character varying NOT NULL,
  student_id character varying NOT NULL,
  email character varying NOT NULL,
  password character varying NOT NULL,
  year character varying,
  semester character varying,
  likes integer DEFAULT 0,
  rank integer DEFAULT 0,
  bonus_used boolean DEFAULT false,
  status character varying DEFAULT 'Pending'::character varying NOT NULL,
  password_hash character varying,
  updated_at timestamp without time zone DEFAULT now() NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  profile_image_url text
);

CREATE TABLE subjects (
  id integer DEFAULT nextval('subjects_id_seq'::regclass) NOT NULL,
  subject_name character varying NOT NULL,
  subject_code character varying
);

CREATE TABLE ticket_chats (
  id integer DEFAULT nextval('ticket_chats_id_seq'::regclass) NOT NULL,
  ticket_id integer,
  sender_id integer,
  sender_role character varying,
  message text NOT NULL,
  is_system_message boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
  id integer DEFAULT nextval('tickets_id_seq'::regclass) NOT NULL,
  student_id integer,
  subject character varying NOT NULL,
  description text NOT NULL,
  screenshot_url character varying,
  category character varying DEFAULT 'Technical'::character varying,
  contact_number character varying,
  status character varying DEFAULT 'pending'::character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  lecturer_id integer
);

CREATE TABLE timeslots (
  id integer DEFAULT nextval('timeslots_id_seq'::regclass) NOT NULL,
  subject_id integer,
  lecturer_id integer,
  location_id integer,
  day_of_week integer NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  lecture_topic text,
  notice text
);

CREATE TABLE users (
  id bigint DEFAULT nextval('users_id_seq'::regclass) NOT NULL,
  id_number character varying NOT NULL,
  full_name character varying NOT NULL,
  email character varying NOT NULL,
  role character varying NOT NULL,
  status character varying DEFAULT 'Pending'::character varying NOT NULL,
  password_hash character varying,
  created_at timestamp without time zone DEFAULT now() NOT NULL,
  updated_at timestamp without time zone DEFAULT now() NOT NULL
);

-- =====================================================================================
-- CONSTRAINTS & INDEXES
-- =====================================================================================

CREATE UNIQUE INDEX auth_otp_codes_pkey ON public.auth_otp_codes USING btree (id);
CREATE INDEX idx_auth_otp_identity ON public.auth_otp_codes USING btree (role, id_number, purpose, created_at DESC);
CREATE INDEX idx_auth_otp_expires ON public.auth_otp_codes USING btree (expires_at);
CREATE UNIQUE INDEX bonus_mark_requests_pkey ON public.bonus_mark_requests USING btree (id);
CREATE UNIQUE INDEX bookings_pkey ON public.bookings USING btree (id);
CREATE UNIQUE INDEX bookings_student_id_timeslot_id_key ON public.bookings USING btree (student_id, timeslot_id);
CREATE UNIQUE INDEX bookings_timeslot_id_seat_number_key ON public.bookings USING btree (timeslot_id, seat_number);
CREATE UNIQUE INDEX feedbacks_pkey ON public.feedbacks USING btree (id);
CREATE UNIQUE INDEX lecture_files_pkey ON public.lecture_files USING btree (id);
CREATE UNIQUE INDEX lecturers_pkey ON public.lecturers USING btree (id);
CREATE UNIQUE INDEX lecturers_employee_id_key ON public.lecturers USING btree (employee_id);
CREATE UNIQUE INDEX lecturers_email_key ON public.lecturers USING btree (email);
CREATE UNIQUE INDEX lectures_pkey ON public.lectures USING btree (id);
CREATE UNIQUE INDEX locations_pkey ON public.locations USING btree (id);
CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);
CREATE UNIQUE INDEX quiz_questions_pkey ON public.quiz_questions USING btree (id);
CREATE UNIQUE INDEX quizzes_pkey ON public.quizzes USING btree (id);
CREATE UNIQUE INDEX student_note_likes_pkey ON public.student_note_likes USING btree (id);
CREATE UNIQUE INDEX student_note_likes_note_id_liked_by_student_id_key ON public.student_note_likes USING btree (note_id, liked_by_student_id);
CREATE UNIQUE INDEX student_notes_pkey ON public.student_notes USING btree (id);
CREATE UNIQUE INDEX students_pkey ON public.students USING btree (id);
CREATE UNIQUE INDEX students_student_id_key ON public.students USING btree (student_id);
CREATE UNIQUE INDEX students_email_key ON public.students USING btree (email);
CREATE UNIQUE INDEX subjects_pkey ON public.subjects USING btree (id);
CREATE UNIQUE INDEX subjects_subject_code_key ON public.subjects USING btree (subject_code);
CREATE UNIQUE INDEX ticket_chats_pkey ON public.ticket_chats USING btree (id);
CREATE INDEX idx_ticket_chats_ticket_id ON public.ticket_chats USING btree (ticket_id);
CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (id);
CREATE INDEX idx_tickets_student_id ON public.tickets USING btree (student_id);
CREATE INDEX idx_tickets_created_at ON public.tickets USING btree (created_at DESC);
CREATE UNIQUE INDEX timeslots_pkey ON public.timeslots USING btree (id);
CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);
CREATE UNIQUE INDEX users_id_number_key ON public.users USING btree (id_number);
CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

-- =====================================================================================
-- DATA INSERTS
-- =====================================================================================

INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('1', 'student', 'STU001', 'ACTIVATE', 'testhash', 0, 5, '"2026-04-02T14:40:24.165Z"', '"2026-04-02T14:31:39.347Z"', '"2026-04-02T14:30:24.166Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('2', 'student', 'STU001', 'ACTIVATE', '9d1ee7a90b105b7803893384a74b7d43f52573e73895a38717f2153625566b76', 0, 5, '"2026-04-02T14:41:39.345Z"', '"2026-04-02T14:33:51.726Z"', '"2026-04-02T14:31:39.347Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('3', 'student', 'STU001', 'ACTIVATE', '9a754eaccf00f57c2daec22a5cffa55e7b0eb0b521dc7456ff0586d236522d44', 0, 5, '"2026-04-02T14:43:51.724Z"', '"2026-04-02T14:37:07.667Z"', '"2026-04-02T14:33:51.726Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('4', 'student', 'STU001', 'ACTIVATE', '1359def5a988fa83dfe57e515bf6606c9eb3615682b24381444128f4c66fa022', 0, 5, '"2026-04-02T14:57:33.838Z"', '"2026-04-02T14:48:06.058Z"', '"2026-04-02T14:47:33.840Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('5', 'student', 'STU001', 'ACTIVATE', '2eaffe2607f5dabc5d95eed71fd1ac73fea7036d5985b74e33a1a689bebe2c53', 0, 5, '"2026-04-02T15:14:18.248Z"', '"2026-04-02T15:04:57.785Z"', '"2026-04-02T15:04:18.250Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('6', 'student', 'STU001', 'RESET', '4b77c78dfe909f7ff8e43aa0bb791a336b961755237b8ac0ca48f634b443c672', 0, 5, '"2026-04-02T15:16:51.545Z"', '"2026-04-02T15:07:35.639Z"', '"2026-04-02T15:06:51.546Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('7', 'student', 'STU002', 'ACTIVATE', 'a554dafc14b14d05f319841e44defe5b16387f20196d3b3592b13895c98f9b93', 0, 5, '"2026-04-02T15:57:47.660Z"', '"2026-04-02T15:48:32.772Z"', '"2026-04-02T15:47:47.661Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('8', 'student', 'STU002', 'RESET', 'e42a9316b475caf8624cf4aa32e12f3c04e2fa2b9166dc4ceef69a0659dd6c90', 0, 5, '"2026-04-02T18:44:42.451Z"', '"2026-04-02T18:35:15.970Z"', '"2026-04-02T18:34:42.452Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('9', 'lecturer', 'LEC001', 'ACTIVATE', 'ee41cce15f44e0fa716d8a48881ea4c6dd895a5fbc981fc701e095ebdce07f75', 0, 5, '"2026-04-02T18:55:01.337Z"', '"2026-04-02T18:45:47.342Z"', '"2026-04-02T18:45:01.338Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('10', 'lecturer', 'LEC002', 'ACTIVATE', '0ecd691810632f8e578d09329d6a111dd01f02d4dd95129cc928f377c4cac46b', 0, 5, '"2026-04-03T04:04:26.982Z"', '"2026-04-03T03:55:22.384Z"', '"2026-04-03T03:54:26.983Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('11', 'lecturer', 'LEC001', 'RESET', '7e8bd7e9a38a2ca7c3f90600d08f41858221989755545b6d94b74583c7924262', 0, 5, '"2026-04-07T04:04:16.815Z"', '"2026-04-07T03:55:00.031Z"', '"2026-04-07T03:54:16.816Z"');
INSERT INTO auth_otp_codes (id, role, id_number, purpose, otp_hash, attempt_count, max_attempts, expires_at, used_at, created_at) VALUES ('12', 'student', 'STU003', 'ACTIVATE', 'b9e60a2b830ccd211e5d8dfdf779cc194da8aac57ad267b8e11a756c669ef089', 0, 5, '"2026-04-08T04:53:40.122Z"', '"2026-04-08T04:44:49.162Z"', '"2026-04-08T04:43:40.127Z"');

INSERT INTO bonus_mark_requests (id, student_id, lecturer_id, subject, status, unique_code, marks_added, requested_at, approved_at) VALUES (1, 2, 2, 'Artificial Intelligence', 'pending', NULL, FALSE, '"2026-04-03T04:42:01.227Z"', NULL);
INSERT INTO bonus_mark_requests (id, student_id, lecturer_id, subject, status, unique_code, marks_added, requested_at, approved_at) VALUES (2, 2, 1, 'Introduction to Machine Learning', 'approved', 'BONUS-2026-U002-ITML-FU5S', FALSE, '"2026-04-03T04:42:37.678Z"', '"2026-04-03T04:43:24.211Z"');
INSERT INTO bonus_mark_requests (id, student_id, lecturer_id, subject, status, unique_code, marks_added, requested_at, approved_at) VALUES (3, 1, 1, 'Introduction to Machine Learning', 'rejected', NULL, FALSE, '"2026-04-03T04:47:52.009Z"', NULL);
INSERT INTO bonus_mark_requests (id, student_id, lecturer_id, subject, status, unique_code, marks_added, requested_at, approved_at) VALUES (4, 1, 1, 'Introduction to Machine Learning', 'approved', 'BONUS-2026-U001-ITML-5J6G', FALSE, '"2026-04-03T04:49:37.872Z"', '"2026-04-03T04:50:36.550Z"');
INSERT INTO bonus_mark_requests (id, student_id, lecturer_id, subject, status, unique_code, marks_added, requested_at, approved_at) VALUES (5, 1, 1, 'Data Structures and Algorithms', 'rejected', NULL, FALSE, '"2026-04-03T04:50:08.377Z"', NULL);
INSERT INTO bonus_mark_requests (id, student_id, lecturer_id, subject, status, unique_code, marks_added, requested_at, approved_at) VALUES (6, 1, 1, 'Data Structures and Algorithms', 'pending', NULL, FALSE, '"2026-04-03T04:51:59.529Z"', NULL);

INSERT INTO bookings (id, student_id, timeslot_id, seat_number, attendance_status, created_at) VALUES (1, 8, 1, 6, 'booked', '"2026-04-09T05:42:47.826Z"');
INSERT INTO bookings (id, student_id, timeslot_id, seat_number, attendance_status, created_at) VALUES (2, 5, 1, 5, 'booked', '"2026-04-09T05:42:47.826Z"');
INSERT INTO bookings (id, student_id, timeslot_id, seat_number, attendance_status, created_at) VALUES (3, 7, 5, 3, 'booked', '"2026-04-09T05:42:47.826Z"');
INSERT INTO bookings (id, student_id, timeslot_id, seat_number, attendance_status, created_at) VALUES (4, 6, 5, 2, 'booked', '"2026-04-09T05:42:47.826Z"');
INSERT INTO bookings (id, student_id, timeslot_id, seat_number, attendance_status, created_at) VALUES (5, 5, 5, 1, 'booked', '"2026-04-09T05:42:47.826Z"');
INSERT INTO bookings (id, student_id, timeslot_id, seat_number, attendance_status, created_at) VALUES (6, 9, 10, 1, 'attended', '"2026-04-09T05:42:47.826Z"');
INSERT INTO bookings (id, student_id, timeslot_id, seat_number, attendance_status, created_at) VALUES (8, 5, 11, 28, 'booked', '"2026-04-09T09:25:42.441Z"');

INSERT INTO feedbacks (id, student_id, lecturer_id, subject, rating, comment, created_at, module_id) VALUES (9, 1, 1, 'Test Subject', 4, 'Test feedback', '"2026-04-20T15:13:25.818Z"', NULL);
INSERT INTO feedbacks (id, student_id, lecturer_id, subject, rating, comment, created_at, module_id) VALUES (10, 1, 1, 'Data Structures and Algorithms', 5, 'uyxs2tq', '"2026-04-20T15:14:07.115Z"', NULL);

INSERT INTO lecture_files (id, lecture_id, filename, filepath, uploaded_at) VALUES (1, 1, 'Resource-From-Lecturer.pdf', 'uploads\notes\083feb92686c1f679c3da0bb8f2c0efc', '"2026-04-03T03:09:19.612Z"');
INSERT INTO lecture_files (id, lecture_id, filename, filepath, uploaded_at) VALUES (2, 1, 'Resource-From-Lecturer.docx', 'uploads\notes\3d1376a3d1df56b9fccf85f516bc35b5', '"2026-04-03T03:09:19.616Z"');
INSERT INTO lecture_files (id, lecture_id, filename, filepath, uploaded_at) VALUES (3, 2, 'Resource-From-Lecturer.pdf', 'uploads\notes\86d4fce8c61a591bc057ee3d9b26cd37', '"2026-04-03T03:14:29.541Z"');
INSERT INTO lecture_files (id, lecture_id, filename, filepath, uploaded_at) VALUES (4, 3, 'IT3020_Prac06.pdf', 'uploads\notes\b7d1b83b7a7f64ea93472380ac87c31f', '"2026-04-03T03:25:41.368Z"');
INSERT INTO lecture_files (id, lecture_id, filename, filepath, uploaded_at) VALUES (5, 4, 'Resource-From-Lecturer.docx', 'uploads\notes\8e58e943c2060cce4866b46b9a05d220', '"2026-04-03T04:01:58.039Z"');
INSERT INTO lecture_files (id, lecture_id, filename, filepath, uploaded_at) VALUES (6, 4, 'Resource-From-Lecturer.pdf', 'uploads\notes\f06a200b1584c8ed189a1761bc4eac36', '"2026-04-03T04:01:58.044Z"');
INSERT INTO lecture_files (id, lecture_id, filename, filepath, uploaded_at) VALUES (7, 5, 'Resource-From-Lecturer.docx', 'uploads\notes\b544e55280fb7831f1938f330aeccf14', '"2026-04-08T08:23:03.116Z"');

INSERT INTO lecturers (id, name, initials, title, department, employee_id, email, password, points, status, password_hash, updated_at, created_at, profile_image_url) VALUES (1, 'Dr. Chamara Perera', 'CP', 'Senior Lecturer', 'Computer Science', 'LEC001', 'sadisa.rashmika02@gmail.com', 'LEGACY_DISABLED', 725, 'Active', '$2b$12$ryv2aiyfQp561iDUUzhylOp9WzndLIAnssXvnMVuRJN/JBAJmFkTm', '"2026-04-07T17:18:34.926Z"', '"2026-04-02T14:20:11.521Z"', '/uploads/profile-images/lecturer-LEC001-1775582314870.jpg');
INSERT INTO lecturers (id, name, initials, title, department, employee_id, email, password, points, status, password_hash, updated_at, created_at, profile_image_url) VALUES (2, 'Dr. Nipuni Jayasekara', 'SJ', 'Lecturer', 'Information Technology', 'LEC002', 'nonamefree.follow@gmail.com', 'LEGACY_DISABLED', 135, 'Active', '$2b$12$lccC8TJQcjXT83iEUR5s4eO4EJYIUOFRvGFUNyhDog6ut1xWq0oqi', '"2026-04-08T07:00:13.831Z"', '"2026-04-02T14:20:11.521Z"', '/uploads/profile-images/lecturer-LEC002-1775631613761.jpg');

INSERT INTO lectures (id, lecturer_id, title, subject, topic, year, semester, youtube_url, published_at) VALUES (1, 1, 'ML Lecture 01', 'Introduction to Machine Learning', 'ML Basics', '4th Year', '1st Semester', 'https://youtu.be/i_LwzRVP7bg?si=UBTOw7CdaAhzTKAQ', '"2026-04-03T03:09:19.594Z"');
INSERT INTO lectures (id, lecturer_id, title, subject, topic, year, semester, youtube_url, published_at) VALUES (2, 1, 'DSA Introduction', 'Data Structures and Algorithms', 'DSA Basics', '2nd Year', '2nd Semester', 'https://youtu.be/8hly31xKli0?si=v5tryPZDHtgJJ0bx', '"2026-04-03T03:14:29.533Z"');
INSERT INTO lectures (id, lecturer_id, title, subject, topic, year, semester, youtube_url, published_at) VALUES (3, 1, 'ML Foundation', 'Introduction to Machine Learning', 'ML Part 02', '4th Year', '1st Semester', 'https://youtu.be/BUTjcAjfMgY?si=0GHKVu-4q_TjdpGt', '"2026-04-03T03:25:41.360Z"');
INSERT INTO lectures (id, lecturer_id, title, subject, topic, year, semester, youtube_url, published_at) VALUES (4, 2, 'Intro to AI', 'Artificial Intelligence', 'What is AI?', '4th Year', '2nd Semester', 'https://youtu.be/D2JY38VShxI?si=SqQYrP33UNYW34ci', '"2026-04-03T04:01:58.025Z"');
INSERT INTO lectures (id, lecturer_id, title, subject, topic, year, semester, youtube_url, published_at) VALUES (5, 1, 'Time and Space Complexity', 'Data Structures and Algorithms', 'Basics', '2nd Year', '2nd Semester', 'https://youtu.be/IzGac_ZANqg?si=eebDzMo-bxQLqatA', '"2026-04-08T08:23:03.091Z"');

INSERT INTO locations (id, room_name, seat_count) VALUES (6, 'Seminar Room 1', 30);
INSERT INTO locations (id, room_name, seat_count) VALUES (7, 'Lecture Hall B', 80);
INSERT INTO locations (id, room_name, seat_count) VALUES (8, 'Computer Lab 1', 40);
INSERT INTO locations (id, room_name, seat_count) VALUES (9, 'Computer Lab 2', 40);
INSERT INTO locations (id, room_name, seat_count) VALUES (10, 'Lecture Hall A', 100);

INSERT INTO notifications (id, user_id, timeslot_id, message, is_read, created_at) VALUES (1, 6, 5, 'Room changed to Lecture Hall B', FALSE, '"2026-04-09T05:42:47.826Z"');
INSERT INTO notifications (id, user_id, timeslot_id, message, is_read, created_at) VALUES (2, 5, 5, 'Lecture topic updated: Introduction to Variables and Data Types', FALSE, '"2026-04-09T05:42:47.826Z"');

INSERT INTO quiz_questions (id, quiz_id, question, options, answer_index, order_num) VALUES (1, 1, 'What does ML stand for?', '["Machine Language","Machine Learning","Manual Learning","Modern Logic"]', 1, 1);
INSERT INTO quiz_questions (id, quiz_id, question, options, answer_index, order_num) VALUES (2, 1, 'Which of these is a type of machine learning?', '["Supervised Learning","Guided Writing","Digital Reading","Data Typing"]', 0, 2);
INSERT INTO quiz_questions (id, quiz_id, question, options, answer_index, order_num) VALUES (3, 1, 'In machine learning, data is used to:', '["decorate the computer","train the model","switch off the system","create folders only"]', 1, 3);
INSERT INTO quiz_questions (id, quiz_id, question, options, answer_index, order_num) VALUES (4, 2, 'What is the time complexity of accessing an element in an array by index?', '["O(1)","O(log n)","O(n)","O(n^2)"]', 0, 1);
INSERT INTO quiz_questions (id, quiz_id, question, options, answer_index, order_num) VALUES (5, 2, 'Which of the following is not a type of Linked List?', '["Singly Linked List","Doubly Linked List","Circular Linked List","Binary Linked List"]', 3, 2);
INSERT INTO quiz_questions (id, quiz_id, question, options, answer_index, order_num) VALUES (6, 3, 'What does AI stand for?', '["Automatic Information","Artificial Intelligence","Advanced Internet","Artificial Integration"]', 1, 1);
INSERT INTO quiz_questions (id, quiz_id, question, options, answer_index, order_num) VALUES (7, 3, 'Which of the following is an example of AI?', '["Calculator","Voice assistant","Keyboard","Monitor"]', 1, 2);
INSERT INTO quiz_questions (id, quiz_id, question, options, answer_index, order_num) VALUES (8, 4, 'What does Time Complexity refer to?', '["The color of the program","The growth of the time taken by a program to run","The name of memory","The CPU brand"]', 1, 1);

INSERT INTO quizzes (id, lecture_id, title, created_at) VALUES (1, 1, 'ML Quiz - Intro', '"2026-04-03T03:09:19.635Z"');
INSERT INTO quizzes (id, lecture_id, title, created_at) VALUES (2, 2, 'DSA Quiz 01', '"2026-04-03T03:14:29.552Z"');
INSERT INTO quizzes (id, lecture_id, title, created_at) VALUES (3, 4, 'AI simple Quiz', '"2026-04-03T04:01:58.059Z"');
INSERT INTO quizzes (id, lecture_id, title, created_at) VALUES (4, 5, 'Quiz DSA', '"2026-04-08T08:23:03.130Z"');

INSERT INTO student_note_likes (id, note_id, liked_by_student_id, liked_at) VALUES ('1', 1, 1, '"2026-04-03T04:30:50.184Z"');
INSERT INTO student_note_likes (id, note_id, liked_by_student_id, liked_at) VALUES ('3', 1, 3, '"2026-04-08T04:58:28.816Z"');
INSERT INTO student_note_likes (id, note_id, liked_by_student_id, liked_at) VALUES ('4', 4, 3, '"2026-04-08T04:58:32.075Z"');

INSERT INTO student_notes (id, student_id, lecture_id, title, filename, filepath, filesize, likes, status, rejection_note, uploaded_at) VALUES (2, 2, 1, 'ML Lec 01', 'Notes-From-Student.pdf', 'uploads/notes/036c3b7a941e072f73fd41f4b67b9d19', '78 KB', 76, 'accepted', NULL, '"2026-04-03T03:35:39.046Z"');
INSERT INTO student_notes (id, student_id, lecture_id, title, filename, filepath, filesize, likes, status, rejection_note, uploaded_at) VALUES (3, 2, 1, 'ML Note 02', 'IT3020_Prac06.pdf', 'uploads/notes/55412ba33d9bb5da72f08b4dcbff6293', '149 KB', 0, 'rejected', 'This note has issues. Please check your examples again.', '"2026-04-03T03:36:26.500Z"');
INSERT INTO student_notes (id, student_id, lecture_id, title, filename, filepath, filesize, likes, status, rejection_note, uploaded_at) VALUES (5, 1, 3, 'ML Note for Foundation', 'IT3020_Prac06.pdf', 'uploads/notes/e357523410e7addcf954c44108fa99eb', '149 KB', 0, 'rejected', 'Watch the video again and get better idea.', '"2026-04-03T03:49:38.773Z"');
INSERT INTO student_notes (id, student_id, lecture_id, title, filename, filepath, filesize, likes, status, rejection_note, uploaded_at) VALUES (6, 2, 3, 'ML Note New', 'Notes-From-Student.pdf', 'uploads/notes/6a50a6b08feedc12ecbc4c42d94e7b72', '78 KB', 0, 'pending', 'ML Note New', '"2026-04-03T05:08:48.652Z"');
INSERT INTO student_notes (id, student_id, lecture_id, title, filename, filepath, filesize, likes, status, rejection_note, uploaded_at) VALUES (7, 3, 3, 'ML short note from Sahani', 'Notes-From-Student.pdf', 'uploads/notes/b3aeaecf78a9468e85e9f8ad91077a39', '78 KB', 0, 'accepted', NULL, '"2026-04-08T04:53:57.112Z"');
INSERT INTO student_notes (id, student_id, lecture_id, title, filename, filepath, filesize, likes, status, rejection_note, uploaded_at) VALUES (1, 2, 2, 'DSA Short Note', 'Notes-From-Student.pdf', 'uploads/notes/b3f0a2c9c1db245573531b84df443f36', '78 KB', 297, 'accepted', NULL, '"2026-04-03T03:29:06.666Z"');
INSERT INTO student_notes (id, student_id, lecture_id, title, filename, filepath, filesize, likes, status, rejection_note, uploaded_at) VALUES (4, 1, 2, 'Intro DSA by Nimal', 'Notes-From-Student.pdf', 'uploads/notes/317b24d67ca664dfe416de281f96b0c3', '78 KB', 322, 'accepted', NULL, '"2026-04-03T03:48:14.803Z"');

INSERT INTO students (id, name, initials, student_id, email, password, year, semester, likes, rank, bonus_used, status, password_hash, updated_at, created_at, profile_image_url) VALUES (2, 'Kamal Perera', 'KP', 'STU002', 'sadisa.karunarathne@gmail.com', 'LEGACY_DISABLED', '2nd Year', '1st Semester', 6, 2, FALSE, 'Active', '$2b$12$hwvm2SD7qTwxCFjXrtB5G.8TPmpJtj3NQJdP17jTa710sJK8z6Buu', '"2026-04-09T08:40:52.589Z"', '"2026-04-02T14:20:11.521Z"', '/uploads/profile-images/student-STU002-1775724052538.jpg');
INSERT INTO students (id, name, initials, student_id, email, password, year, semester, likes, rank, bonus_used, status, password_hash, updated_at, created_at, profile_image_url) VALUES (3, 'Sahani Fernando', 'SF', 'STU003', 'emoji.officialff@gmail.com', 'LEGACY_DISABLED', '2nd Year', '2nd Semester', 0, 3, FALSE, 'Active', '$2b$12$Zlzh2KcWgmQ/8EhUqi3ive8LIx1gs/epOfbcCCjsHh6igSlHDBl26', '"2026-04-08T04:51:26.568Z"', '"2026-04-08T03:40:58.379Z"', '/uploads/profile-images/student-STU003-1775623886378.jpg');
INSERT INTO students (id, name, initials, student_id, email, password, year, semester, likes, rank, bonus_used, status, password_hash, updated_at, created_at, profile_image_url) VALUES (1, 'Nimali Silva', 'NS', 'STU001', 'koffy.doggy@gmail.com', 'LEGACY_DISABLED', '3rd Year', '2nd Semester', 6, 1, FALSE, 'Active', '$2b$12$.aSBmhIqTAXMy3MFpbcvku6i7GTkPArlD.nXpUSzFV1YgTmFtR922', '"2026-04-07T17:17:26.630Z"', '"2026-04-02T14:20:11.521Z"', '/uploads/profile-images/student-STU001-1775582246568.jpg');

INSERT INTO subjects (id, subject_name, subject_code) VALUES (6, 'Introduction to Programming', 'CS101');
INSERT INTO subjects (id, subject_name, subject_code) VALUES (7, 'Data Structures and Algorithms', 'CS201');
INSERT INTO subjects (id, subject_name, subject_code) VALUES (8, 'Database Systems', 'CS301');
INSERT INTO subjects (id, subject_name, subject_code) VALUES (9, 'Web Development', 'CS401');
INSERT INTO subjects (id, subject_name, subject_code) VALUES (10, 'Software Engineering', 'CS402');

INSERT INTO ticket_chats (id, ticket_id, sender_id, sender_role, message, is_system_message, created_at) VALUES (1, 1, 1, 'lecturer', 'ygjyg', FALSE, '"2026-04-09T07:37:53.209Z"');
INSERT INTO ticket_chats (id, ticket_id, sender_id, sender_role, message, is_system_message, created_at) VALUES (2, 1, 1, 'student', 'jfnkwjdf', FALSE, '"2026-04-09T07:38:39.435Z"');
INSERT INTO ticket_chats (id, ticket_id, sender_id, sender_role, message, is_system_message, created_at) VALUES (3, 2, 1, 'student', 'hi', FALSE, '"2026-04-09T09:31:57.616Z"');
INSERT INTO ticket_chats (id, ticket_id, sender_id, sender_role, message, is_system_message, created_at) VALUES (4, 2, 1, 'lecturer', 'hii', FALSE, '"2026-04-09T09:32:30.613Z"');
INSERT INTO ticket_chats (id, ticket_id, sender_id, sender_role, message, is_system_message, created_at) VALUES (5, 2, 0, 'system', '[SYSTEM] Inquiry closed, resolved.', TRUE, '"2026-04-09T09:32:41.619Z"');

INSERT INTO tickets (id, student_id, subject, description, screenshot_url, category, contact_number, status, created_at, lecturer_id) VALUES (1, 1, 'jyg', 'dfghjhg', NULL, 'Technical Support', '078990998', 'pending', '"2026-04-09T07:35:45.274Z"', 1);
INSERT INTO tickets (id, student_id, subject, description, screenshot_url, category, contact_number, status, created_at, lecturer_id) VALUES (2, 1, 'sjgd', 'werty', NULL, 'Technical Support', '0710005678', 'resolved', '"2026-04-09T09:29:48.513Z"', 1);
INSERT INTO tickets (id, student_id, subject, description, screenshot_url, category, contact_number, status, created_at, lecturer_id) VALUES (3, 1, 'uih', 'jygu', NULL, 'Technical Support', '0777894561', 'pending', '"2026-04-20T15:00:22.569Z"', 2);

INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (1, 7, 3, 7, 1, '14:00:00', '16:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (2, 10, 3, 6, 3, '14:00:00', '16:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (3, 9, 4, 9, 2, '14:00:00', '16:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (4, 9, 4, 9, 5, '09:00:00', '11:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (5, 6, 2, 10, 1, '09:00:00', '11:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (6, 7, 3, 7, 4, '09:00:00', '11:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (7, 6, 2, 10, 3, '10:00:00', '12:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (8, 10, 3, 10, 5, '13:00:00', '15:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (9, 8, 2, 8, 4, '14:00:00', '16:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (10, 8, 2, 8, 2, '09:00:00', '11:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (11, 7, 2, 9, 3, '08:00:00', '10:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (12, 10, 1, 8, 5, '08:00:00', '10:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (13, 6, 1, 10, 5, '08:00:00', '10:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (16, 6, 1, 8, 5, '07:00:00', '08:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (17, 6, 1, 6, 5, '10:00:00', '11:00:00', NULL, NULL);
INSERT INTO timeslots (id, subject_id, lecturer_id, location_id, day_of_week, start_time, end_time, lecture_topic, notice) VALUES (18, 8, 2, 6, 5, '09:00:00', '10:00:00', NULL, NULL);

INSERT INTO users (id, id_number, full_name, email, role, status, password_hash, created_at, updated_at) VALUES ('1', 'ADM001', 'Bandula Jayawardena', 'admin@unihelp.com', 'admin', 'Active', '$2b$10$dummyHashForTestingPurposesOnly', '"2026-04-09T05:27:12.002Z"', '"2026-04-09T05:27:12.002Z"');
INSERT INTO users (id, id_number, full_name, email, role, status, password_hash, created_at, updated_at) VALUES ('2', 'LEC001', 'Dr. Sarath Gunasekara', 'sarath.gunasekara@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly', '"2026-04-09T05:27:12.002Z"', '"2026-04-09T05:27:12.002Z"');
INSERT INTO users (id, id_number, full_name, email, role, status, password_hash, created_at, updated_at) VALUES ('3', 'LEC002', 'Dr. Chamara Perera', 'chamara.perera@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly', '"2026-04-09T05:27:12.002Z"', '"2026-04-09T05:27:12.002Z"');
INSERT INTO users (id, id_number, full_name, email, role, status, password_hash, created_at, updated_at) VALUES ('4', 'LEC003', 'Prof. Nimal Silva', 'nimal.silva@unihelp.com', 'lecturer', 'Active', '$2b$10$dummyHashForTestingPurposesOnly', '"2026-04-09T05:27:12.002Z"', '"2026-04-09T05:27:12.002Z"');
INSERT INTO users (id, id_number, full_name, email, role, status, password_hash, created_at, updated_at) VALUES ('5', 'STU001', 'Kavindu Perera', 'kavindu.perera@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly', '"2026-04-09T05:27:12.002Z"', '"2026-04-09T05:27:12.002Z"');
INSERT INTO users (id, id_number, full_name, email, role, status, password_hash, created_at, updated_at) VALUES ('6', 'STU002', 'Nimali Fernando', 'nimali.fernando@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly', '"2026-04-09T05:27:12.002Z"', '"2026-04-09T05:27:12.002Z"');
INSERT INTO users (id, id_number, full_name, email, role, status, password_hash, created_at, updated_at) VALUES ('7', 'STU003', 'Amal Jayasinghe', 'amal.jayasinghe@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly', '"2026-04-09T05:27:12.002Z"', '"2026-04-09T05:27:12.002Z"');
INSERT INTO users (id, id_number, full_name, email, role, status, password_hash, created_at, updated_at) VALUES ('8', 'STU004', 'Dilini Wickramasinghe', 'dilini.wickramasinghe@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly', '"2026-04-09T05:27:12.002Z"', '"2026-04-09T05:27:12.002Z"');
INSERT INTO users (id, id_number, full_name, email, role, status, password_hash, created_at, updated_at) VALUES ('9', 'STU005', 'Ruwan Bandara', 'ruwan.bandara@student.unihelp.com', 'student', 'Active', '$2b$10$dummyHashForTestingPurposesOnly', '"2026-04-09T05:27:12.002Z"', '"2026-04-09T05:27:12.002Z"');


COMMIT;
