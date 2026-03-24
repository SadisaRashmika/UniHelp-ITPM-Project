import React, { useEffect, useState } from 'react';
import { Search, BookOpen, Users, ChevronDown, Sparkles, Heart, FileText, User } from 'lucide-react';
import StuResourceCard from './StuResourceCard';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeFileUrl = (fileObj) => {
  if (fileObj?.url) {
    return fileObj.url.startsWith('http') ? fileObj.url : `${API_BASE}${fileObj.url}`;
  }
  if (fileObj?.filepath) {
    const normalizedPath = String(fileObj.filepath).replace(/\\/g, '/');
    const withSlash = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
    return `${API_BASE}${withSlash}`;
  }
  return null;
};

const normalizeLecture = (row) => {
  const files = toArray(row.files).map((f) => {
    if (typeof f === 'string') {
      return { name: f, url: null };
    }
    return {
      name: f.filename,
      url: normalizeFileUrl(f),
    };
  }).filter((f) => f.name);

  const quizFromRow = row.quiz && typeof row.quiz === 'object' ? row.quiz : null;
  const quizQuestions = toArray(quizFromRow?.questions || row.quiz_questions).map((q) => ({
    question: q.question,
    options: Array.isArray(q.options) ? q.options : toArray(q.options),
    answer: Number(q.answer),
    orderNum: Number(q.orderNum ?? q.order_num ?? 0),
  }));

  const quizTitle = quizFromRow?.title || row.quiz_title || null;
  const quiz = quizTitle && quizQuestions.length > 0
    ? { title: quizTitle, questions: quizQuestions }
    : null;

  const tags = [row.subject, row.topic, row.year, row.semester].filter(Boolean);

  return {
    id: row.id,
    title: row.title,
    lecturer: row.lecturer_name || 'Lecturer',
    lecturerEmail: row.lecturer_email || row.lecturerEmail || row.email || '',
    subject: row.subject,
    topic: row.topic,
    year: row.year,
    semester: row.semester,
    tags,
    files,
    youtubeUrl: row.youtube_url,
    quizTitle: quiz?.title || 'No quiz yet',
    quiz,
    studentNotes: [],
  };
};

const normalizeAcceptedNote = (row, currentStudentId) => ({
  id: row.id,
  lectureId: row.lecture_id,
  title: row.title,
  uploader: row.uploader,
  isMyUpload: row.owner_student_id === currentStudentId,
  tags: [row.subject, row.topic, row.year, row.semester].filter(Boolean),
  file: row.filename,
  fileUrl: normalizeFileUrl({ url: row.file_url, filepath: row.filepath }),
  likes: row.likes || 0,
  uploadedAt: row.uploaded_at,
});

const downloadFile = async (url, filename) => {
  if (!url) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'student-note';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

const YEAR_OPTIONS = [
  { value: 'all',      label: 'All Years'     },
  { value: '1st Year', label: '1st Year'      },
  { value: '2nd Year', label: '2nd Year'      },
  { value: '3rd Year', label: '3rd Year'      },
];
const SEM_OPTIONS = [
  { value: 'all',          label: 'All Semesters' },
  { value: '1st Semester', label: '1st Semester'  },
  { value: '2nd Semester', label: '2nd Semester'  },
];

const StuHome = ({ student, onUploadClick, onTakeQuiz, onBonusMarks, onLikeEarned, onMyUploads }) => {
  const [view,       setView]  = useState('lecturer');
  const [search,     setSearch]= useState('');
  const [yearFilter, setYear]  = useState('all');
  const [semFilter,  setSem]   = useState('all');
  const [lectures,   setLectures] = useState([]);
  const [acceptedNotes, setAcceptedNotes] = useState([]);

  useEffect(() => {
    const loadLectures = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/student/lectures`);
        setLectures((response.data || []).map(normalizeLecture));
      } catch (error) {
        console.error('Error fetching lectures for student home:', error);
      }
    };

    loadLectures();
  }, []);

  useEffect(() => {
    const loadAcceptedNotes = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/student/notes/accepted`);
        const currentStudentId = student?.student_id || 'STU001';
        const notes = (response.data || []).map((n) => normalizeAcceptedNote(n, currentStudentId));
        setAcceptedNotes(notes);
        setNoteLikes(Object.fromEntries(notes.map((n) => [n.id, n.likes])));
      } catch (error) {
        console.error('Error fetching accepted notes:', error);
      }
    };

    loadAcceptedNotes();
  }, [student?.student_id]);

  // Like state — keyed by noteId
  const [noteLikes, setNoteLikes] = useState({});
  const [likedSet, setLikedSet] = useState(new Set());

  const handleLike = async (noteId, isMyUpload) => {
    if (isMyUpload)         return; // can't like own note
    if (likedSet.has(noteId)) return; // already liked

    try {
      const studentId = student?.student_id || 'STU001';
      const res = await axios.post(`${API_BASE}/api/student/notes/${noteId}/like`, { studentId });
      setLikedSet(prev => new Set([...prev, noteId]));
      setNoteLikes(prev => ({ ...prev, [noteId]: res.data?.likes ?? ((prev[noteId] ?? 0) + 1) }));
      if (onLikeEarned) onLikeEarned();
    } catch (error) {
      console.error('Error liking note:', error);
    }
  };

  const lectureMatches = (l) => {
    const q = search.toLowerCase();
    return (
      (!q || l.title.toLowerCase().includes(q) || l.lecturer.toLowerCase().includes(q) || l.tags.some(t => t.toLowerCase().includes(q))) &&
      (yearFilter === 'all' || l.tags.includes(yearFilter)) &&
      (semFilter  === 'all' || l.tags.includes(semFilter))
    );
  };
  const noteMatches = (n) => {
    const q = search.toLowerCase();
    return (
      (!q || n.title.toLowerCase().includes(q) || n.uploader.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q))) &&
      (yearFilter === 'all' || n.tags.includes(yearFilter)) &&
      (semFilter  === 'all' || n.tags.includes(semFilter))
    );
  };

  const filteredLectures = lectures.filter(lectureMatches);
  const filteredNotes    = acceptedNotes.filter(noteMatches);
  const notesByLecture = acceptedNotes.reduce((acc, note) => {
    if (!note.lectureId) return acc;
    if (!acc[note.lectureId]) acc[note.lectureId] = [];
    acc[note.lectureId].push(note);
    return acc;
  }, {});

  const lecturesWithNotes = filteredLectures.map((lecture) => ({
    ...lecture,
    studentNotes: (notesByLecture[lecture.id] || [])
      .slice()
      .sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()),
  }));

  return (
    <div className="space-y-6 w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources and Notes</h1>
          <p className="text-gray-400 text-sm mt-1">Access lecture materials, upload your notes, and test your knowledge</p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={onMyUploads}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <FileText size={15} /> My Uploads
          </button>
          <button
            onClick={onBonusMarks}
            className="flex items-center gap-2 bg-blue-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Sparkles size={15} /> Bonus Marks
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by lecture name, subject, topic, or lecturer..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <SelectFilter value={yearFilter} onChange={setYear} options={YEAR_OPTIONS} />
        <SelectFilter value={semFilter}  onChange={setSem}  options={SEM_OPTIONS}  />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <TabBtn active={view === 'lecturer'} label={`Lecture Resources (${filteredLectures.length})`} onClick={() => setView('lecturer')} icon={<BookOpen size={15}/>} />
        <TabBtn active={view === 'student'}  label={`Student Notes (${filteredNotes.length})`}        onClick={() => setView('student')}  icon={<Users size={15}/>} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
        {view === 'lecturer' ? (
          filteredLectures.length > 0 ? (
            lecturesWithNotes.map(lecture => (
              <StuResourceCard
                key={lecture.id}
                lecture={lecture}
                onUpload={onUploadClick}
                onQuiz={onTakeQuiz}
                noteLikes={noteLikes}
                likedSet={likedSet}
                onLike={handleLike}
                onExploreStudentNotes={() => setView('student')}
              />
            ))
          ) : (
            <div className="col-span-3 py-20 text-center text-gray-400 text-sm font-medium border-2 border-dashed border-gray-200 rounded-2xl">
              No lectures match your search.
            </div>
          )
        ) : (
          filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <StudentNoteCard
                key={note.id}
                note={note}
                likes={noteLikes[note.id] ?? note.likes}
                liked={likedSet.has(note.id)}
                onLike={() => handleLike(note.id, note.isMyUpload)}
              />
            ))
          ) : (
            <div className="col-span-3 py-20 text-center text-gray-400 text-sm font-medium border-2 border-dashed border-gray-200 rounded-2xl">
              No student notes match your search.
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ── Student note card with like button ────────────────────────────────────────
const StudentNoteCard = ({ note, likes, liked, onLike }) => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition-all">
    <div className="h-36 bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <div className="p-5 space-y-3">
      {/* Title + badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{note.title}</h3>
        {note.isMyUpload && (
          <span className="shrink-0 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            My Upload
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {note.tags.map(tag => (
          <span key={tag} className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wide">
            {tag}
          </span>
        ))}
      </div>

      {/* Uploader */}
      <div>
      <p className="text-sm text-gray-700 font-medium"><User size={16}/>Uploaded by {note.uploader}</p>
      </div>
      {/* File */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Files:</p>
        {note.fileUrl ? (
          <button
            onClick={() => downloadFile(note.fileUrl, note.file)}
            className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline cursor-pointer"
          >
            <FileText size={13} className="shrink-0" />
            {note.file}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
            <FileText size={13} className="shrink-0" />
            {note.file || 'File unavailable'}
          </div>
        )}
      </div>

      {/* Like row */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-sm">
          <Heart size={14} className="text-red-400 fill-red-400" />
          <span className="font-semibold text-gray-700">{likes}</span>
          <span className="text-gray-400 font-medium">likes</span>
        </div>

        {note.isMyUpload ? (
          <span className="text-xs font-medium text-gray-300 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
            Your note
          </span>
        ) : liked ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl">
            <Heart size={12} className="fill-red-500" /> Liked
          </span>
        ) : (
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Heart size={12} /> Like
          </button>
        )}
      </div>
    </div>
  </div>
);

const SelectFilter = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none bg-white border border-gray-200 text-sm text-gray-700 font-medium pl-4 pr-9 py-2.5 rounded-xl cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 hover:border-gray-300 transition-all"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

const TabBtn = ({ active, label, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all font-medium
      ${active ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon} {label}
  </button>
);

export default StuHome;