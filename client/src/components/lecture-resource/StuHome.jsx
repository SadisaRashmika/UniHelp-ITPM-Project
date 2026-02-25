import React, { useState } from 'react';
import { Search, ChevronDown, BookOpen, Users } from 'lucide-react';
import StuResourceCard from './StuResourceCard';

export const LECTURES_DATA = [
  {
    id: 1,
    type: 'video',
    title: 'Introduction to Machine Learning',
    lecturer: 'Dr. Robert Smith',
    tags: ['Machine Learning', 'ML Basics'],
    year: '2nd Year',
    semester: 'Spring 2026',
    files: ['ML_Intro_Slides.pdf', 'ML_Lecture_Notes.pdf'],
    quizTitle: 'ML Basics Quiz',
    quiz: {
      title: 'ML Basics Quiz',
      questions: [
        { q: 'What does supervised learning use?', options: ['Unlabeled data', 'Labeled data', 'Random data', 'No data'], answer: 1 },
        { q: 'Which is a classification algorithm?', options: ['K-Means', 'Linear Regression', 'Decision Tree', 'PCA'], answer: 2 },
      ],
    },
    studentNotes: [
      { id: 1, title: 'Complete ML Notes', author: 'Sarah Williams', likes: 42 },
      { id: 2, title: 'ML Summary Sheet', author: 'Tom Brown', likes: 27 },
    ],
  },
  {
    id: 2,
    type: 'video',
    title: 'Data Structures and Algorithms',
    lecturer: 'Dr. Robert Smith',
    tags: ['Data Structures', 'Arrays & Linked Lists'],
    year: '2nd Year',
    semester: 'Spring 2026',
    files: ['DSA_Notes.pdf', 'Algorithm_Examples.pdf'],
    quizTitle: 'Data Structures Quiz',
    quiz: {
      title: 'Data Structures Quiz',
      questions: [
        { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], answer: 1 },
        { q: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Linked List'], answer: 1 },
      ],
    },
    studentNotes: [
      { id: 1, title: 'Tree Traversal Notes', author: 'Sarah Williams', likes: 31 },
      { id: 2, title: 'Sorting Algorithms Cheat Sheet', author: 'Tom Brown', likes: 27 },
    ],
  },
  {
    id: 3,
    type: 'video',
    title: 'Database Management Systems',
    lecturer: 'Dr. Emily Chen',
    tags: ['Database', 'SQL Fundamentals'],
    year: '2nd Year',
    semester: 'Spring 2026',
    files: ['SQL_Basics.pdf', 'ER_Diagrams.pdf'],
    quizTitle: 'Database Basics Quiz',
    quiz: {
      title: 'Database Basics Quiz',
      questions: [
        { q: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Logic', 'System Query Layer', 'Stored Query List'], answer: 0 },
        { q: 'Which SQL command retrieves data?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], answer: 2 },
      ],
    },
    studentNotes: [
      { id: 1, title: 'SQL Cheat Sheet', author: 'Mike Johnson', likes: 18 },
    ],
  },
  {
    id: 4,
    type: 'video',
    title: 'Advanced Algorithms',
    lecturer: 'Dr. Emily Chen',
    tags: ['Algorithms', 'Graph Algorithms'],
    year: '3rd Year',
    semester: 'Fall 2025',
    files: ['Graph_Theory.pdf'],
    quizTitle: 'Graphs Quiz',
    quiz: {
      title: 'Graphs Quiz',
      questions: [
        { q: 'Which finds the shortest path?', options: ['DFS', 'BFS', 'Dijkstra', 'Prim'], answer: 2 },
      ],
    },
    studentNotes: [],
  },
];

export const STUDENT_NOTES_DATA = [
  {
    id: 1,
    type: 'note',
    title: 'Machine Learning Study Guide',
    uploader: 'Alex Johnson',
    isMyUpload: true,
    tags: ['Machine Learning', 'Complete ML Guide'],
    year: '2nd Year',
    semester: 'Spring 2026',
    likes: 42,
    files: ['Complete_ML_Notes.pdf'],
  },
  {
    id: 2,
    type: 'note',
    title: 'Data Structures Cheat Sheet',
    uploader: 'John Doe',
    isMyUpload: false,
    tags: ['Data Structures', 'DS Quick Reference'],
    year: '2nd Year',
    semester: 'Spring 2026',
    likes: 35,
    files: ['DS_Cheat_Sheet.pdf'],
  },
  {
    id: 3,
    type: 'note',
    title: 'Algorithm Analysis Notes',
    uploader: 'Alex Johnson',
    isMyUpload: true,
    tags: ['Algorithms', 'Big O Notation'],
    year: '2nd Year',
    semester: 'Spring 2026',
    likes: 19,
    files: ['Algo_Analysis.pdf'],
  },
];

const StuHome = ({ onUploadClick, onTakeQuiz }) => {
  const [view, setView] = useState('lecturer');
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('All Years');
  const [semFilter, setSemFilter] = useState('All Semesters');

  const filteredLectures = LECTURES_DATA.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !search || l.title.toLowerCase().includes(q) || l.lecturer.toLowerCase().includes(q) || l.tags.some(t => t.toLowerCase().includes(q));
    const matchYear = yearFilter === 'All Years' || l.year === yearFilter;
    const matchSem = semFilter === 'All Semesters' || l.semester === semFilter;
    return matchSearch && matchYear && matchSem;
  });

  const filteredNotes = STUDENT_NOTES_DATA.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = !search || n.title.toLowerCase().includes(q) || n.uploader.toLowerCase().includes(q);
    const matchYear = yearFilter === 'All Years' || n.year === yearFilter;
    const matchSem = semFilter === 'All Semesters' || n.semester === semFilter;
    return matchSearch && matchYear && matchSem;
  });

  const baseFont = { fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" };

  return (
    <div style={{ ...baseFont, display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .stu-filter-select {
          appearance: none;
          background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5a8a' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 14px center;
          border: 1.5px solid #e8e8f0;
          border-radius: 12px;
          padding: 10px 40px 10px 16px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #3a3a5a;
          cursor: pointer;
          transition: border-color 0.15s;
          font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
        }
        .stu-filter-select:focus { outline: none; border-color: #a5b4fc; }
        .stu-search-input {
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.92rem;
          font-weight: 500;
          color: #2a2a4a;
          font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
        }
        .stu-search-input::placeholder { color: #b0b0c8; }
      `}</style>

      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0d0d1a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          Resources &amp; Notes
        </h2>
        <p style={{ color: '#7a7a9a', fontWeight: 500, fontSize: '0.95rem', margin: 0 }}>
          Access lecture materials, upload your notes, and test your knowledge
        </p>
      </header>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        background: '#fff', border: '1.5px solid #e8e8f0', borderRadius: '16px',
        padding: '12px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <Search size={18} color="#b0b0c8" />
        <input
          className="stu-search-input"
          type="text"
          placeholder="Search by lecture name, subject, topic, or lecturer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <select className="stu-filter-select" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
          <option>All Years</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
        </select>
        <select className="stu-filter-select" value={semFilter} onChange={e => setSemFilter(e.target.value)}>
          <option>All Semesters</option>
          <option>Spring 2026</option>
          <option>Fall 2025</option>
        </select>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px',
        background: '#f3f3f9', padding: '5px', borderRadius: '14px', width: 'fit-content',
      }}>
        <TabBtn
          active={view === 'lecturer'}
          label={`Lecture Resources (${filteredLectures.length})`}
          onClick={() => setView('lecturer')}
          icon={<BookOpen size={15} />}
        />
        <TabBtn
          active={view === 'student'}
          label={`Student Notes (${filteredNotes.length})`}
          onClick={() => setView('student')}
          icon={<Users size={15} />}
        />
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '24px',
      }}>
        {view === 'lecturer'
          ? filteredLectures.length > 0
            ? filteredLectures.map(l => (
                <StuResourceCard
                  key={l.id}
                  lecture={l}
                  onUpload={onUploadClick}
                  onQuiz={onTakeQuiz}
                />
              ))
            : <EmptyState text="No lectures match your search." />
          : filteredNotes.length > 0
            ? filteredNotes.map(n => (
                <StuResourceCard
                  key={n.id}
                  lecture={n}
                  onUpload={onUploadClick}
                  onQuiz={onTakeQuiz}
                />
              ))
            : <EmptyState text="No student notes match your search." />
        }
      </div>
    </div>
  );
};

const TabBtn = ({ active, label, onClick, icon }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '7px',
      padding: '9px 18px', borderRadius: '10px', border: 'none',
      background: active ? '#fff' : 'transparent',
      boxShadow: active ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
      color: active ? '#0d0d1a' : '#9090aa',
      fontSize: '0.86rem', fontWeight: 800, cursor: 'pointer',
      transition: 'all 0.2s',
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    }}
  >
    {icon} {label}
  </button>
);

const EmptyState = ({ text }) => (
  <div style={{
    gridColumn: '1/-1', padding: '60px 20px', textAlign: 'center',
    color: '#b0b0c8', fontWeight: 700, fontSize: '0.95rem',
    border: '2px dashed #e8e8f0', borderRadius: '24px',
  }}>
    {text}
  </div>
);

export default StuHome;