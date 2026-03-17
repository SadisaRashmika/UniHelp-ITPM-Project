// ─────────────────────────────────────────────────────────────────────────────
//  sharedData.js
//  Single source of truth used by BOTH the student side and the lecturer side.
//  When the lecturer publishes a new lecture/quiz it should push into LECTURES.
// ─────────────────────────────────────────────────────────────────────────────

export const LECTURER = {
  name: 'Dr. Sarath Gunasekara',
  initials: 'SG',
  title: 'Senior Lecturer',
  department: 'Faculty of Computing',
  employeeId: 'LEC-2018-001',
  subjects: ['Database Design and Development', 'Web and Mobile Technologies'],
};

export const SUBJECTS = [
  'Probability and Statistics (IT2120)',
  'Object Oriented Programming (SE2010)',
  'Operating Systems & System Administration (IT2130)',
  'Database Design and Development (IT2140)',
  'Artificial Intelligence & Machine Learning (IT2011)',
  'IT Project (IT2150)',
  'Web and Mobile Technologies (SE2020)',
  'Professional Skills (IT2160)',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const SEMESTERS = ['1st Semester', '2nd Semester'];

// ── Lecture resources (lecturer-created, shown on student side) ───────────────
export const LECTURES = [
  {
    id: 1,
    title: 'Artificial Intelligence & Machine Learning',
    lecturer: 'Prof. Chaminda Wijesinghe',
    subject: 'Artificial Intelligence & Machine Learning (IT2011)',
    topic: 'ML Basics',
    year: '2nd Year',
    semester: '1st Semester',
    tags: ['Machine Learning', 'ML Basics', '2nd Year', '1st Semester'],
    files: ['ML_Intro_Slides.pdf', 'ML_Lecture_Notes.pdf'],
    quizTitle: 'ML Basics Quiz',
    quiz: {
      title: 'ML Basics Quiz',
      questions: [
        { question: 'What does supervised learning use to train a model?', options: ['Unlabeled data', 'Labeled data', 'Random data', 'No data'], answer: 1 },
        { question: 'Which of these is a classification algorithm?', options: ['K-Means', 'Linear Regression', 'Decision Tree', 'PCA'], answer: 2 },
      ],
    },
    studentNotes: [
      { id: 1, title: 'Complete ML Notes',  author: 'Kavindu Perera', likes: 42 },
      { id: 2, title: 'ML Summary Sheet',   author: 'Dilini Senanayake',      likes: 27 },
    ],
    publishedAt: '2026-02-10',
  },
  {
    id: 2,
    title: 'Object Oriented Programming',
    lecturer: 'Prof. Chaminda Wijesinghe',
    subject: 'Object Oriented Programming (SE2010)',
    topic: 'Classes & Objects',
    year: '2nd Year',
    semester: '1st Semester',
    tags: ['OOP', 'Classes & Objects', '2nd Year', '1st Semester'],
    files: ['OOP_Notes.pdf', 'OOP_Examples.pdf'],
    quizTitle: 'OOP Quiz',
    quiz: {
      title: 'OOP Quiz',
      questions: [
        { question: 'What is encapsulation?', options: ['Hiding implementation details', 'Creating new classes', 'Inheriting from parent', 'Runtime polymorphism'], answer: 0 },
        { question: 'Which principle allows a subclass to override parent methods?', options: ['Encapsulation', 'Polymorphism', 'Abstraction', 'Composition'], answer: 1 },
      ],
    },
    studentNotes: [
      { id: 1, title: 'OOP Concepts Notes',           author: 'Kavindu Perera', likes: 31 },
      { id: 2, title: 'Java OOP Cheat Sheet', author: 'Pathum Dhananjaya',      likes: 27 },
    ],
    publishedAt: '2026-02-14',
  },
  {
    id: 3,
    title: 'Database Design and Development',
    lecturer: 'Dr. Sarath Gunasekara',
    subject: 'Database Design and Development (IT2140)',
    topic: 'SQL Fundamentals',
    year: '2nd Year',
    semester: '2nd Semester',
    tags: ['Database', 'SQL Fundamentals', '2nd Year', '2nd Semester'],
    files: ['SQL_Basics.pdf', 'ER_Diagrams.pdf'],
    quizTitle: 'Database Quiz',
    quiz: {
      title: 'Database Quiz',
      questions: [
        { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Logic', 'System Query Layer', 'Stored Query List'], answer: 0 },
        { question: 'Which SQL command retrieves data?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], answer: 2 },
      ],
    },
    studentNotes: [
      { id: 1, title: 'SQL Cheat Sheet', author: 'Tharushi Fernando', likes: 18 },
    ],
    publishedAt: '2026-02-17',
  },
  {
    id: 4,
    title: 'Web and Mobile Technologies',
    lecturer: 'Dr. Sarath Gunasekara',
    subject: 'Web and Mobile Technologies (SE2020)',
    topic: 'React Fundamentals',
    year: '3rd Year',
    semester: '2nd Semester',
    tags: ['Web Development', 'React', '3rd Year', '2nd Semester'],
    files: ['React_Basics.pdf'],
    quizTitle: 'React Quiz',
    quiz: {
      title: 'React Quiz',
      questions: [
        { question: 'What is a React component?', options: ['A database table', 'A reusable UI piece', 'A server endpoint', 'A CSS file'], answer: 1 },
      ],
    },
    studentNotes: [],
    publishedAt: '2026-02-20',
  },
];

// ── Student notes (student-uploaded, shown in Student Notes tab) ──────────────
export const STUDENT_NOTES = [
  { id: 1, title: 'Machine Learning Study Guide', uploader: 'Kavindu Perera', isMyUpload: true,  tags: ['Machine Learning', 'Complete ML Guide', '2nd Year', '1st Semester'], file: 'Complete_ML_Notes.pdf', likes: 42 },
  { id: 2, title: 'OOP Concepts Cheat Sheet',  uploader: 'Dilini Senanayake',     isMyUpload: false, tags: ['OOP', 'Java Quick Reference',  '2nd Year', '1st Semester'], file: 'OOP_Cheat_Sheet.pdf',    likes: 35 },
  { id: 3, title: 'Database Design Notes',     uploader: 'Kavindu Perera', isMyUpload: true,  tags: ['Database', 'ER Diagrams',          '2nd Year', '1st Semester'], file: 'DB_Design.pdf',     likes: 19 },
];

// ── Student resource submissions pending lecturer review ──────────────────────
export const PENDING_SUBMISSIONS = [
  { id: 1, studentName: 'Kavindu Perera', studentInitials: 'KP', studentRank: 1, studentLikes: 142, title: 'OOP Concepts Notes',           subject: 'Object Oriented Programming (SE2010)',    file: 'OOP_Concepts_Notes.pdf',  fileSize: '1.2 MB', uploadedAt: '2026-02-17T13:10:00', status: 'pending', rejectionNote: '' },
  { id: 2, studentName: 'Dilini Senanayake',      studentInitials: 'DS', studentRank: 4, studentLikes: 87,  title: 'Java Cheat Sheet',  subject: 'Object Oriented Programming (SE2010)',    file: 'Java_Cheat_Sheet.pdf',   fileSize: '0.8 MB', uploadedAt: '2026-02-18T11:00:00', status: 'pending', rejectionNote: '' },
  { id: 3, studentName: 'Pathum Dhananjaya',   studentInitials: 'PD', studentRank: 2, studentLikes: 115, title: 'SQL Cheat Sheet',                 subject: 'Database Design and Development (IT2140)',       file: 'SQL_Cheat_Sheet.pdf',       fileSize: '0.5 MB', uploadedAt: '2026-02-19T08:20:00', status: 'pending', rejectionNote: '' },
  { id: 4, studentName: 'Tharushi Fernando',    studentInitials: 'TF', studentRank: 3, studentLikes: 98,  title: 'React Summary',            subject: 'Web and Mobile Technologies (SE2020)',               file: 'React_Summary.pdf',  fileSize: '2.1 MB', uploadedAt: '2026-02-20T09:15:00', status: 'pending', rejectionNote: '' },
  { id: 5, studentName: 'Isuru Herath',   studentInitials: 'IH', studentRank: 7, studentLikes: 54,  title: 'ML Basics Summary',               subject: 'Artificial Intelligence & Machine Learning (IT2011)',  file: 'ML_Basics_Summary.pdf',     fileSize: '1.5 MB', uploadedAt: '2026-02-21T14:30:00', status: 'pending', rejectionNote: '' },
  { id: 6, studentName: 'Kavindu Perera',    studentInitials: 'KP', studentRank: 5, studentLikes: 76,  title: 'Neural Networks Notes',           subject: 'Artificial Intelligence & Machine Learning (IT2011)',  file: 'Neural_Networks_Notes.pdf', fileSize: '3.2 MB', uploadedAt: '2026-02-22T16:45:00', status: 'pending', rejectionNote: '' },
  { id: 7, studentName: 'Dilini Senanayake',   studentInitials: 'DS', studentRank: 6, studentLikes: 65,  title: 'ER Diagram Examples',             subject: 'Database Design and Development (IT2140)',       file: 'ER_Diagrams.pdf',           fileSize: '1.8 MB', uploadedAt: '2026-02-23T10:00:00', status: 'pending', rejectionNote: '' },
];

// ── Lecturer stats ────────────────────────────────────────────────────────────
export const LECTURER_STATS = {
  downloads: 342,
  uploadedResources: 24,
  myPoints: 180,
};

// ── Bonus mark requests (student → lecturer) ──────────────────────────────────
// In a real app these would be created when student submits from StuBonusMarksModal
export const BONUS_MARK_REQUESTS = [
  {
    id: 1,
    studentName: 'Kavindu Perera',
    studentInitials: 'KP',
    studentId: '2024001',
    studentLikes: 45,
    subject: 'Artificial Intelligence & Machine Learning (IT2011)',
    lecturerId: 'LEC-2018-001',
    requestedAt: '2026-02-24T10:30:00',
    status: 'pending',   // pending | approved | rejected
    uniqueCode: null,
    approvedAt: null,
    marksAdded: false,
  },
  {
    id: 2,
    studentName: 'Dilini Senanayake',
    studentInitials: 'DS',
    studentId: '2024015',
    studentLikes: 142,
    subject: 'Database Design and Development (IT2140)',
    lecturerId: 'LEC-2018-001',
    requestedAt: '2026-02-23T14:15:00',
    status: 'pending',
    uniqueCode: null,
    approvedAt: null,
    marksAdded: false,
  },
  {
    id: 3,
    studentName: 'Pathum Dhananjaya',
    studentInitials: 'PD',
    studentId: '2024022',
    studentLikes: 115,
    subject: 'Web and Mobile Technologies (SE2020)',
    lecturerId: 'LEC-2018-001',
    requestedAt: '2026-02-22T09:00:00',
    status: 'approved',
    uniqueCode: 'BONUS-2026-PD-WMT-X7K9',
    approvedAt: '2026-02-22T11:30:00',
    marksAdded: true,
  },
];