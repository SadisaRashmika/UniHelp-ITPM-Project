import React, { useState } from 'react';
import { Search, BookOpen, Users, FileText, Heart, Sparkles } from 'lucide-react';
import StuResourceCard from './StuResourceCard';
import { LECTURES, STUDENT_NOTES } from './stuData';

const StuHome = ({ onUploadClick, onTakeQuiz, onBonusMarks }) => {
  const [view, setView]       = useState('lecturer');
  const [search, setSearch]   = useState('');
  const [yearFilter, setYear] = useState('all');
  const [semFilter,  setSem]  = useState('all');

  const YEAR_OPTIONS = [
    { value: 'all',      label: 'All Years'  },
    { value: '1st Year', label: '1st Year'   },
    { value: '2nd Year', label: '2nd Year'   },
    { value: '3rd Year', label: '3rd Year'   },
  ];

  const SEM_OPTIONS = [
    { value: 'all',          label: 'All Semesters' },
    { value: '1st Semester', label: '1st Semester'  },
    { value: '2nd Semester', label: '2nd Semester'  },
  ];

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

  const filteredLectures = LECTURES.filter(lectureMatches);
  const filteredNotes    = STUDENT_NOTES.filter(noteMatches);

  return (
    <div className="space-y-7">

      {/* Header row — title left, Bonus Marks button right */}
      <div className="flex items-start justify-between gap-4">
        <header>
          <h2 className="text-3xl font-black text-slate-900">Resources and Notes</h2>
          <p className="text-slate-500 font-medium mt-1">
            Access lecture materials, upload your notes, and test your knowledge
          </p>
        </header>

        <button
          onClick={onBonusMarks}
          className="shrink-0 mt-1 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-md shadow-amber-100"
        >
          <Sparkles size={16} />
          Bonus Marks
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by lecture name, subject, topic, or lecturer..."
          className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-600 outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <StyledSelect value={yearFilter} onChange={setYear} options={YEAR_OPTIONS} />
        <StyledSelect value={semFilter}  onChange={setSem}  options={SEM_OPTIONS}  />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <TabBtn active={view === 'lecturer'} label={`Lecture Resources (${filteredLectures.length})`} onClick={() => setView('lecturer')} icon={<BookOpen size={16}/>} />
        <TabBtn active={view === 'student'}  label={`Student Notes (${filteredNotes.length})`}        onClick={() => setView('student')}  icon={<Users size={16}/>} />
      </div>

      {/* Cards — 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
        {view === 'lecturer' ? (
          filteredLectures.length > 0 ? (
            filteredLectures.map(lecture => (
              <StuResourceCard
                key={lecture.id}
                lecture={lecture}
                onUpload={onUploadClick}
                onQuiz={onTakeQuiz}
              />
            ))
          ) : (
            <div className="col-span-3 p-10 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-[32px]">
              No lectures match your search.
            </div>
          )
        ) : (
          filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <StudentNoteCard key={note.id} note={note} />
            ))
          ) : (
            <div className="col-span-3 p-10 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-[32px]">
              No student notes match your search.
            </div>
          )
        )}
      </div>
    </div>
  );
};

// ── Green student note card ───────────────────────────────────────────────────
const StudentNoteCard = ({ note }) => (
  <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
    <div className="h-40 bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white/20">
      <FileText size={56} />
    </div>
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-black text-slate-900">{note.title}</h3>
        {note.isMyUpload && (
          <span className="shrink-0 mt-1 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
            My Upload
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {note.tags.map(tag => (
          <span key={tag} className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
        <span>👤</span> Uploaded by {note.uploader}
      </p>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Files:</p>
        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline cursor-pointer">
          <FileText size={15} /> {note.file}
        </div>
      </div>
      <div className="flex items-center justify-between bg-red-50 rounded-2xl px-4 py-3">
        <span className="text-sm font-bold text-slate-600">Total Likes</span>
        <div className="flex items-center gap-1.5 text-red-500 font-black">
          <Heart size={14} className="fill-red-500" /> {note.likes}
        </div>
      </div>
    </div>
  </div>
);

// ── Styled select with proper border + arrow ──────────────────────────────────
const StyledSelect = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-blue-400 text-slate-700 font-bold text-sm px-5 py-2.5 pr-10 rounded-xl cursor-pointer focus:outline-none transition-all"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>
);

// ── Tab button ────────────────────────────────────────────────────────────────
const TabBtn = ({ active, label, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-black transition-all ${active ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
  >
    {icon} {label}
  </button>
);

export default StuHome;