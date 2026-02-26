import React, { useState } from 'react';
import { FileText, Video, Upload, ChevronDown, ChevronUp, PenTool } from 'lucide-react';

// CHANGES FROM ORIGINAL (design untouched):
// 1. Props changed: receives `lecture` object instead of loose title/lecturer/files
// 2. Tags rendered from lecture.tags array (were hardcoded)
// 3. Student notes rendered from lecture.studentNotes (were hardcoded to Sarah & Tom)
// 4. onUpload(lecture) — passes lecture up so modal shows correct title
// 5. onQuiz(lecture)  — passes lecture up so modal runs the correct quiz
const StuResourceCard = ({ lecture, onUpload, onQuiz }) => {
  const [showStudents, setShowStudents] = useState(false);

  const studentCount = lecture.studentNotes.length;

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white/20">
        <Video size={64} />
      </div>

      <div className="p-8 space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-900">{lecture.title}</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {lecture.tags.map(tag => (
              <Badge key={tag} label={tag} />
            ))}
          </div>
          <p className="text-sm font-bold text-slate-400 mt-4 flex items-center gap-2">
            <span className="text-lg">🎓</span> {lecture.lecturer}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Lecture Files:</p>
          {lecture.files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline cursor-pointer">
              <FileText size={16} />
              {file}
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => onUpload(lecture)}
            className="w-full py-3.5 border-2 border-slate-100 rounded-2xl font-black text-slate-700 text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Upload size={18} /> Upload Note for this Lecture
          </button>

          <button
            onClick={() => setShowStudents(!showStudents)}
            className="w-full py-3.5 border-2 border-slate-100 rounded-2xl font-black text-slate-700 text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
          >
            {showStudents ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
            {showStudents ? `Hide Student Files (${studentCount})` : `Show Student Files (${studentCount})`}
          </button>

          <button
            onClick={() => onQuiz(lecture)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-200"
          >
            <PenTool size={18} /> Take Quiz — {lecture.quizTitle}
          </button>
        </div>

        {showStudents && (
          <div className="mt-4 pt-6 border-t border-slate-50 space-y-4 animate-in slide-in-from-top-2 duration-300">
            {studentCount === 0 ? (
              <p className="text-sm text-center text-slate-400 font-bold py-2">
                No student notes yet — be the first to upload!
              </p>
            ) : (
              lecture.studentNotes.map(note => (
                <MiniStudentNote key={note.id} name={note.author} title={note.title} likes={note.likes} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Badge = ({ label }) => (
  <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight">
    {label}
  </span>
);

const MiniStudentNote = ({ name, title, likes }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
        <FileText size={18} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">by {name}</p>
      </div>
    </div>
    <div className="flex items-center gap-1.5 text-red-500 font-black text-xs">
      ❤️ {likes}
    </div>
  </div>
);

export default StuResourceCard;