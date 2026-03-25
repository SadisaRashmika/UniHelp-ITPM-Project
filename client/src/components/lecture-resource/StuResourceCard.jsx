import React, { useState } from 'react';
import { FileText, Video, Upload, ChevronDown, ChevronUp, PenTool, Heart, GraduationCap } from 'lucide-react';

const getYoutubeThumbnail = (url) => {
  if (!url) return null;
  const idMatch = url.match(/(?:v=|be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  const videoId = idMatch?.[1];
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const StuResourceCard = ({ lecture, onUpload, onQuiz, noteLikes, likedSet, onLike, onExploreStudentNotes }) => {
  const [showStudents, setShowStudents] = useState(false);
  const studentCount = lecture.studentNotes.length;
  const latestNote = studentCount > 0 ? lecture.studentNotes[0] : null;
  const youtubeThumb = getYoutubeThumbnail(lecture.youtubeUrl);
  const hasQuiz = lecture?.quiz && Array.isArray(lecture.quiz.questions) && lecture.quiz.questions.length > 0;

  const openYoutube = () => {
    if (!lecture?.youtubeUrl) return;
    window.open(lecture.youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadFile = async (file) => {
    if (!file?.url) {
      console.error('Missing file URL for download:', file);
      return;
    }
    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = file.name || 'lecture-file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      window.open(file.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition-all">
      {/* Header image area */}
      <div
        className={`h-36 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden ${lecture.youtubeUrl ? 'cursor-pointer' : ''}`}
        onClick={openYoutube}
        title={lecture.youtubeUrl ? 'Open YouTube video' : ''}
      >
        {youtubeThumb ? (
          <img
            src={youtubeThumb}
            alt={`${lecture.title} thumbnail`}
            className="w-full h-full object-cover"
          />
        ) : (
          <Video size={48} className="text-white/20" />
        )}
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
          <p className="text-sm text-gray-400 font-medium mt-2.5"><GraduationCap size={16} /> {lecture.lecturer}</p>
          {lecture.lecturerEmail && (
            <p className="text-xs text-blue-400 mt-0.5">{lecture.lecturerEmail}</p>
          )}
        </div>

        {/* Files */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Lecture Files:</p>
          <div className="space-y-1">
            {lecture.files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => handleDownloadFile(file)}
                className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline cursor-pointer"
              >
                <FileText size={14} className="shrink-0" /> {file.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => onUpload?.(lecture)}
            className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            <Upload size={15} /> Upload Note for this Lecture
          </button>

          <button
            onClick={() => setShowStudents(!showStudents)}
            className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            {showStudents ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}
            {showStudents ? 'Hide Student Notes' : 'Show Student Note'}
          </button>

          <button
            onClick={() => hasQuiz && onQuiz?.(lecture)}
            disabled={!hasQuiz}
            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
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
              <>
                <MiniStudentNote
                  note={latestNote}
                  likes={noteLikes?.[latestNote.id] ?? latestNote.likes}
                  liked={likedSet?.has(latestNote.id) ?? false}
                  onLike={() => onLike?.(latestNote.id, latestNote.isMyUpload)}
                />
                <button
                  onClick={() => {
                    setShowStudents(false);
                    onExploreStudentNotes?.();
                  }}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Explore More
                </button>
              </>
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
        <FileText size={13} className="text-blue-600" />
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