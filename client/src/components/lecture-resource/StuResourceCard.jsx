import React, { useState } from 'react';
import { FileText, Video, Upload, Users, PenSquare, Heart, ChevronDown, ChevronUp, Download } from 'lucide-react';

const StuResourceCard = ({ lecture, onUpload, onQuiz }) => {
  const [showStudents, setShowStudents] = useState(false);

  const studentCount = lecture.studentNotes?.length || 0;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '28px',
      border: '1px solid #f0f0f5',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      transition: 'box-shadow 0.25s, transform 0.25s',
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Thumbnail */}
      <div style={{
        height: '168px',
        background: lecture.type === 'video'
          ? 'linear-gradient(135deg, #667eea 0%, #9b59b6 55%, #e91e8c 100%)'
          : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ opacity: 0.15, position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)' }} />
        {lecture.type === 'video'
          ? <Video size={52} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
          : <FileText size={52} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />}
      </div>

      <div style={{ padding: '24px 26px 26px' }}>
        {/* Title & Badges */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0d0d1a', margin: 0, lineHeight: 1.3, flex: 1 }}>
              {lecture.title}
            </h3>
            {lecture.isMyUpload && (
              <span style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', fontSize: '0.68rem', fontWeight: 800,
                padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
              }}>MY UPLOAD</span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {lecture.tags?.map(tag => (
              <span key={tag} style={{
                background: '#f5f5fb', color: '#5a5a8a',
                fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '8px',
                letterSpacing: '0.01em',
              }}>{tag}</span>
            ))}
            {lecture.year && <span style={{ background: '#ede9fe', color: '#6d28d9', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '8px' }}>{lecture.year}</span>}
            {lecture.semester && <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '8px' }}>{lecture.semester}</span>}
          </div>
        </div>

        {/* Lecturer or Uploader */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px', color: '#7a7a9a', fontSize: '0.84rem', fontWeight: 600 }}>
          <span style={{ fontSize: '1rem' }}>{lecture.lecturer ? '🎓' : '👤'}</span>
          {lecture.lecturer || `Uploaded by ${lecture.uploader}`}
        </div>

        {/* Files */}
        {lecture.files?.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b0b0c8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              {lecture.lecturer ? 'Lecture Files' : 'Files'}:
            </p>
            {lecture.files.map((file, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
                <FileText size={14} color="#6366f1" />
                <a href="#" style={{ color: '#6366f1', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}>
                  {file}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Student note likes row (for student note cards) */}
        {lecture.likes !== undefined && !lecture.lecturer && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#fff5f5', borderRadius: '12px', padding: '10px 14px', marginBottom: '0',
          }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748b' }}>Total Likes</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444', fontWeight: 800 }}>
              <Heart size={15} fill="#ef4444" /> {lecture.likes}
            </span>
          </div>
        )}

        {/* Lecture-only actions */}
        {lecture.lecturer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
            <button
              onClick={() => onUpload(lecture)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '11px 16px', border: '1.5px solid #e8e8f0', borderRadius: '14px',
                background: '#fff', color: '#444466', fontSize: '0.84rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8f7ff'; e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.color = '#6366f1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8e8f0'; e.currentTarget.style.color = '#444466'; }}
            >
              <Upload size={16} /> Upload Note for this Lecture
            </button>

            <button
              onClick={() => setShowStudents(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '11px 16px', border: '1.5px solid #e8e8f0', borderRadius: '14px',
                background: showStudents ? '#f0fdf4' : '#fff',
                borderColor: showStudents ? '#6ee7b7' : '#e8e8f0',
                color: showStudents ? '#059669' : '#444466',
                fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {showStudents ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <Users size={16} />
              {showStudents ? 'Hide' : 'Show'} Student Files ({studentCount})
            </button>

            {/* Expandable Student Notes */}
            {showStudents && (
              <div style={{
                background: '#fafafa', borderRadius: '16px', padding: '14px 16px',
                border: '1.5px solid #f0f0f5', display: 'flex', flexDirection: 'column', gap: '10px',
                animation: 'fadeSlideIn 0.2s ease',
              }}>
                {studentCount === 0 ? (
                  <p style={{ textAlign: 'center', color: '#b0b0c8', fontSize: '0.84rem', fontWeight: 600, padding: '8px 0' }}>
                    No student notes yet — be the first!
                  </p>
                ) : (
                  lecture.studentNotes.map((note) => (
                    <div key={note.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', background: '#fff', borderRadius: '12px',
                      border: '1px solid #f0f0f5', cursor: 'pointer', transition: 'box-shadow 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '7px', background: '#f0fdf4', borderRadius: '9px' }}>
                          <FileText size={16} color="#10b981" />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{note.title}</p>
                          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9090aa', margin: 0 }}>by {note.author}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: 800, fontSize: '0.82rem' }}>
                        <Heart size={13} fill="#ef4444" /> {note.likes}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <button
              onClick={() => onQuiz(lecture)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '13px 16px', border: 'none', borderRadius: '14px',
                background: '#0d0d1a', color: '#fff',
                fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', transition: 'background 0.15s',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e1e3a'}
              onMouseLeave={e => e.currentTarget.style.background = '#0d0d1a'}
            >
              <PenSquare size={16} /> Take Quiz — {lecture.quizTitle}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StuResourceCard;