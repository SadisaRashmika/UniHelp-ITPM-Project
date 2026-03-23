// ─────────────────────────────────────────────────────────────────────────────
//  sharedData.js
//  Single source of truth used by BOTH the student side and the lecturer side.
//  When the lecturer publishes a new lecture/quiz it should push into LECTURES.
// ─────────────────────────────────────────────────────────────────────────────

export const LECTURER = {
  name: 'Dr. Emily Chen',
  initials: 'EC',
  title: 'Senior Lecturer',
  department: 'Faculty of Engineering',
  employeeId: 'LEC-2018-045',
  subjects: ['Database Management Systems', 'Advanced Algorithms'],
};

export const SUBJECTS = [
  'Introduction to Machine Learning',
  'Data Structures and Algorithms',
  'Database Management Systems',
  'Advanced Algorithms',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const SEMESTERS = ['1st Semester', '2nd Semester'];

// ── Lecture resources (lecturer-created, shown on student side) ───────────────
export const LECTURES = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    lecturer: 'Dr. Robert Smith',
    subject: 'Introduction to Machine Learning',
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
      { id: 1, title: 'Complete ML Notes',  author: 'Sarah Williams', likes: 42 },
      { id: 2, title: 'ML Summary Sheet',   author: 'Tom Brown',      likes: 27 },
    ],
    publishedAt: '2026-02-10',
  },
  {
    id: 2,
    title: 'Data Structures and Algorithms',
    lecturer: 'Dr. Robert Smith',
    subject: 'Data Structures and Algorithms',
    topic: 'Arrays & Linked Lists',
    year: '2nd Year',
    semester: '1st Semester',
    tags: ['Data Structures', 'Arrays & Linked Lists', '2nd Year', '1st Semester'],
    files: ['DSA_Notes.pdf', 'Algorithm_Examples.pdf'],
    quizTitle: 'Data Structures Quiz',
    quiz: {
      title: 'Data Structures Quiz',
      questions: [
        { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1 },
        { question: 'Which data structure follows LIFO order?', options: ['Queue', 'Stack', 'Array', 'Linked List'], answer: 1 },
      ],
    },
    studentNotes: [
      { id: 1, title: 'Tree Traversal Notes',           author: 'Sarah Williams', likes: 31 },
      { id: 2, title: 'Sorting Algorithms Cheat Sheet', author: 'Tom Brown',      likes: 27 },
    ],
    publishedAt: '2026-02-14',
  },
  {
    id: 3,
    title: 'Database Management Systems',
    lecturer: 'Dr. Emily Chen',
    subject: 'Database Management Systems',
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
      { id: 1, title: 'SQL Cheat Sheet', author: 'Mike Johnson', likes: 18 },
    ],
    publishedAt: '2026-02-17',
  },
  {
    id: 4,
    title: 'Advanced Algorithms',
    lecturer: 'Dr. Emily Chen',
    subject: 'Advanced Algorithms',
    topic: 'Graph Algorithms',
    year: '3rd Year',
    semester: '2nd Semester',
    tags: ['Algorithms', 'Graph Algorithms', '3rd Year', '2nd Semester'],
    files: ['Graph_Theory.pdf'],
    quizTitle: 'Graphs Quiz',
    quiz: {
      title: 'Graphs Quiz',
      questions: [
        { question: 'Which algorithm finds the shortest path in a weighted graph?', options: ['DFS', 'BFS', "Dijkstra's", "Prim's"], answer: 2 },
      ],
    },
    studentNotes: [],
    publishedAt: '2026-02-20',
  },
];

// ── Student notes (student-uploaded, shown in Student Notes tab) ──────────────
export const STUDENT_NOTES = [
  { id: 1, title: 'Machine Learning Study Guide', uploader: 'Alex Johnson', isMyUpload: true,  tags: ['Machine Learning', 'Complete ML Guide', '2nd Year', '1st Semester'], file: 'Complete_ML_Notes.pdf', likes: 42 },
  { id: 2, title: 'Data Structures Cheat Sheet',  uploader: 'John Doe',     isMyUpload: false, tags: ['Data Structures', 'DS Quick Reference',  '2nd Year', '1st Semester'], file: 'DS_Cheat_Sheet.pdf',    likes: 35 },
  { id: 3, title: 'Algorithm Analysis Notes',     uploader: 'Alex Johnson', isMyUpload: true,  tags: ['Algorithms', 'Big O Notation',          '2nd Year', '1st Semester'], file: 'Algo_Analysis.pdf',     likes: 19 },
];

// ── Student resource submissions pending lecturer review ──────────────────────
export const PENDING_SUBMISSIONS = [
  { id: 1, studentName: 'Sarah Williams', studentInitials: 'SW', studentRank: 1, studentLikes: 142, title: 'Tree Traversal Notes',           subject: 'Data Structures and Algorithms',    file: 'Tree_Traversal_Notes.pdf',  fileSize: '1.2 MB', uploadedAt: '2026-02-17T13:10:00', status: 'pending', rejectionNote: '' },
  { id: 2, studentName: 'Tom Brown',      studentInitials: 'TB', studentRank: 4, studentLikes: 87,  title: 'Sorting Algorithms Cheat Sheet',  subject: 'Data Structures and Algorithms',    file: 'Sorting_Cheat_Sheet.pdf',   fileSize: '0.8 MB', uploadedAt: '2026-02-18T11:00:00', status: 'pending', rejectionNote: '' },
  { id: 3, studentName: 'Mike Johnson',   studentInitials: 'MJ', studentRank: 2, studentLikes: 115, title: 'SQL Cheat Sheet',                 subject: 'Database Management Systems',       file: 'SQL_Cheat_Sheet.pdf',       fileSize: '0.5 MB', uploadedAt: '2026-02-19T08:20:00', status: 'pending', rejectionNote: '' },
  { id: 4, studentName: 'Emily Davis',    studentInitials: 'ED', studentRank: 3, studentLikes: 98,  title: 'Graph Theory Summary',            subject: 'Advanced Algorithms',               file: 'Graph_Theory_Summary.pdf',  fileSize: '2.1 MB', uploadedAt: '2026-02-20T09:15:00', status: 'pending', rejectionNote: '' },
  { id: 5, studentName: 'James Wilson',   studentInitials: 'JW', studentRank: 7, studentLikes: 54,  title: 'ML Basics Summary',               subject: 'Introduction to Machine Learning',  file: 'ML_Basics_Summary.pdf',     fileSize: '1.5 MB', uploadedAt: '2026-02-21T14:30:00', status: 'pending', rejectionNote: '' },
  { id: 6, studentName: 'Priya Patel',    studentInitials: 'PP', studentRank: 5, studentLikes: 76,  title: 'Neural Networks Notes',           subject: 'Introduction to Machine Learning',  file: 'Neural_Networks_Notes.pdf', fileSize: '3.2 MB', uploadedAt: '2026-02-22T16:45:00', status: 'pending', rejectionNote: '' },
  { id: 7, studentName: 'Alex Johnson',   studentInitials: 'AJ', studentRank: 6, studentLikes: 65,  title: 'ER Diagram Examples',             subject: 'Database Management Systems',       file: 'ER_Diagrams.pdf',           fileSize: '1.8 MB', uploadedAt: '2026-02-23T10:00:00', status: 'pending', rejectionNote: '' },
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
    studentName: 'Alex Johnson',
    studentInitials: 'AJ',
    studentId: '2024001',
    studentLikes: 45,
    subject: 'Introduction to Machine Learning',
    lecturerId: 'LEC-2018-045',
    requestedAt: '2026-02-24T10:30:00',
    status: 'pending',   // pending | approved | rejected
    uniqueCode: null,
    approvedAt: null,
    marksAdded: false,
  },
  {
    id: 2,
    studentName: 'Sarah Williams',
    studentInitials: 'SW',
    studentId: '2024015',
    studentLikes: 142,
    subject: 'Database Management Systems',
    lecturerId: 'LEC-2018-045',
    requestedAt: '2026-02-23T14:15:00',
    status: 'pending',
    uniqueCode: null,
    approvedAt: null,
    marksAdded: false,
  },
  {
    id: 3,
    studentName: 'Mike Johnson',
    studentInitials: 'MJ',
    studentId: '2024022',
    studentLikes: 115,
    subject: 'Advanced Algorithms',
    lecturerId: 'LEC-2018-045',
    requestedAt: '2026-02-22T09:00:00',
    status: 'approved',
    uniqueCode: 'BONUS-2026-MJ-ADV-X7K9',
    approvedAt: '2026-02-22T11:30:00',
    marksAdded: true,
  },
];