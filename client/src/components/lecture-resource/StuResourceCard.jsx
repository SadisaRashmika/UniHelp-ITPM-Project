import React, { useState } from 'react';
import { FileText, Video, Upload, ChevronDown, ChevronUp, PenTool, Heart } from 'lucide-react';

const StuResourceCard = ({ lecture, onUpload, onQuiz, noteLikes, likedSet, onLike }) => {
  const [showStudents, setShowStudents] = useState(false);
  const studentCount = lecture.studentNotes.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition-all">
      {/* Header image area */}
      <div className="h-36 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <Video size={48} className="text-white/20" />
      </div>

      <div className="p-5 space-y-4">
        {/* Title + tags */}
        <div>
          <h3 className="font-semibold text-gray-900">{lecture.title}</h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {lecture.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-400 font-medium mt-2.5">🎓 {lecture.lecturer}</p>
        </div>

        {/* Files */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Lecture Files:</p>
          <div className="space-y-1">
            {lecture.files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline cursor-pointer">
                <FileText size={14} className="shrink-0" /> {file}
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => onUpload(lecture)}
            className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            <Upload size={15} /> Upload Note for this Lecture
          </button>

          <button
            onClick={() => setShowStudents(!showStudents)}
            className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            {showStudents ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
            {showStudents ? `Hide Student Notes (${studentCount})` : `Show Student Notes (${studentCount})`}
          </button>

          <button
            onClick={() => onQuiz(lecture)}
            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            <PenTool size={15} /> Take Quiz — {lecture.quizTitle}
          </button>
        </div>

        {/* Expanded student notes with like buttons */}
        {showStudents && (
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {studentCount === 0 ? (
              <p className="text-sm text-center text-gray-400 font-medium py-2">
                No student notes yet — be the first to upload!
              </p>
            ) : (
              lecture.studentNotes.map(note => (
                <MiniStudentNote
                  key={note.id}
                  note={note}
                  likes={noteLikes?.[note.id] ?? note.likes}
                  liked={likedSet?.has(note.id) ?? false}
                  onLike={() => onLike?.(note.id, note.isMyUpload)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const MiniStudentNote = ({ note, likes, liked, onLike }) => (
  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 gap-3">
    {/* Left: icon + info */}
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="p-1.5 bg-green-50 rounded-lg shrink-0">
        <FileText size={13} className="text-green-600" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{note.title}</p>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">by {note.author}</p>
      </div>
    </div>

    {/* Right: like count + button */}
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
        <Heart size={11} className="text-red-400 fill-red-400" /> {likes}
      </span>

      {note.isMyUpload ? (
        <span className="text-[10px] font-medium text-gray-300 bg-white border border-gray-100 px-2 py-1 rounded-lg">
          Yours
        </span>
      ) : liked ? (
        <span className="text-[10px] font-semibold text-red-500 bg-red-50 border border-red-100 px-2 py-1 rounded-lg flex items-center gap-1">
          <Heart size={10} className="fill-red-500" /> Liked
        </span>
      ) : (
        <button
          onClick={onLike}
          className="text-[10px] font-semibold text-gray-500 border border-gray-200 bg-white px-2 py-1 rounded-lg hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-1"
        >
          <Heart size={10} /> Like
        </button>
      )}
    </div>
  </div>
);

export default StuResourceCard;