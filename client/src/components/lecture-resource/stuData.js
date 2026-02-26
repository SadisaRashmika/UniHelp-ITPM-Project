export const LECTURES = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    lecturer: 'Dr. Robert Smith',
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
  },
  {
    id: 2,
    title: 'Data Structures and Algorithms',
    lecturer: 'Dr. Robert Smith',
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
  },
  {
    id: 3,
    title: 'Database Management Systems',
    lecturer: 'Dr. Emily Chen',
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
  },
  {
    id: 4,
    title: 'Advanced Algorithms',
    lecturer: 'Dr. Emily Chen',
    tags: ['Algorithms', 'Graph Algorithms', '3rd Year', '1st Semester'],
    files: ['Graph_Theory.pdf'],
    quizTitle: 'Graphs Quiz',
    quiz: {
      title: 'Graphs Quiz',
      questions: [
        { question: 'Which algorithm finds the shortest path in a weighted graph?', options: ['DFS', 'BFS', "Dijkstra's", "Prim's"], answer: 2 },
      ],
    },
    studentNotes: [],
  },
];

export const STUDENT_NOTES = [
  { id: 1, title: 'Machine Learning Study Guide', uploader: 'Alex Johnson', isMyUpload: true,  tags: ['Machine Learning', 'Complete ML Guide', '2nd Year', '1st Semester'], file: 'Complete_ML_Notes.pdf', likes: 42 },
  { id: 2, title: 'Data Structures Cheat Sheet',  uploader: 'John Doe',     isMyUpload: false, tags: ['Data Structures', 'DS Quick Reference', '2nd Year', '1st Semester'], file: 'DS_Cheat_Sheet.pdf',    likes: 35 },
  { id: 3, title: 'Algorithm Analysis Notes',     uploader: 'Alex Johnson', isMyUpload: true,  tags: ['Algorithms', 'Big O Notation', '2nd Year', '2nd Semester'],          file: 'Algo_Analysis.pdf',     likes: 19 },
];
