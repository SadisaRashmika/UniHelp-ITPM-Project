import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

const StuNoteUploadModal = ({ isOpen, onClose, lecture }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  if (!isOpen) return null;

  const lectureTitle = lecture?.title || 'Unknown Lecture';
  const lecturer = lecture?.lecturer || '';
  const subject = lecture?.tags?.[0] || '';

  const handleClose = () => {
    setTitle(''); setDesc(''); setFile(null);
    onClose();
  };

  const baseFont = { fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,10,30,0.6)',
        backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...baseFont,
          background: '#fff', borderRadius: '32px',
          width: '100%', maxWidth: '500px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          padding: '36px', position: 'relative',
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .upload-input {
            width: 100%; padding: 12px 16px;
            border: 1.5px solid #e8e8f0; border-radius: 14px;
            font-size: 0.9rem; font-weight: 500; color: #2a2a4a;
            background: #fafafa; outline: none;
            font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
            transition: border-color 0.15s;
            box-sizing: border-box;
          }
          .upload-input:focus { border-color: #a5b4fc; background: #fff; }
          .upload-input::placeholder { color: #c0c0d0; }
        `}</style>

        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: '20px', right: '20px',
            background: '#f5f5fb', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a7a9a',
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0d0d1a', margin: '0 0 20px' }}>
          Upload Note
        </h3>

        {/* Target lecture info */}
        <div style={{
          background: 'linear-gradient(135deg, #f0f4ff 0%, #faf0ff 100%)',
          border: '1.5px solid #e0e7ff', borderRadius: '16px',
          padding: '16px 18px', marginBottom: '24px',
        }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>
            Uploading to:
          </p>
          <p style={{ fontWeight: 800, color: '#0d0d1a', fontSize: '0.95rem', margin: '0 0 2px' }}>{lectureTitle}</p>
          {(subject || lecturer) && (
            <p style={{ fontSize: '0.82rem', color: '#7a7a9a', fontWeight: 500, margin: 0 }}>
              {[subject, lecturer].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3a3a5a', marginBottom: '8px' }}>
              Note Title
            </label>
            <input
              className="upload-input"
              type="text"
              placeholder="e.g., ML Summary Notes"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3a3a5a', marginBottom: '8px' }}>
              Description
            </label>
            <textarea
              className="upload-input"
              style={{ height: '90px', resize: 'vertical' }}
              placeholder="Brief description of your note"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#3a3a5a', marginBottom: '8px' }}>
              Upload File
            </label>
            <label
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '28px 20px', border: `2px dashed ${dragging ? '#6366f1' : '#e0e0f0'}`,
                borderRadius: '18px', background: dragging ? '#f8f7ff' : '#fafafa',
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center',
              }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
            >
              <div style={{
                padding: '12px', background: '#fff', borderRadius: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '12px',
              }}>
                {file
                  ? <FileText size={24} color="#6366f1" />
                  : <Upload size={24} color="#6366f1" />}
              </div>
              {file ? (
                <>
                  <p style={{ fontWeight: 800, color: '#0d0d1a', fontSize: '0.88rem', margin: '0 0 2px' }}>{file.name}</p>
                  <p style={{ fontSize: '0.78rem', color: '#9090aa', fontWeight: 500, margin: 0 }}>Click to change</p>
                </>
              ) : (
                <>
                  <p style={{ fontWeight: 800, color: '#3a3a5a', fontSize: '0.88rem', margin: '0 0 2px' }}>Choose File</p>
                  <p style={{ fontSize: '0.78rem', color: '#b0b0c8', fontWeight: 500, margin: 0 }}>or drag &amp; drop here</p>
                </>
              )}
              <input type="file" hidden onChange={e => setFile(e.target.files[0])} />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1, padding: '13px', border: '1.5px solid #e8e8f0', borderRadius: '14px',
              background: '#fff', color: '#5a5a8a', fontWeight: 700, fontSize: '0.92rem',
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleClose}
            style={{
              flex: 1, padding: '13px', border: 'none', borderRadius: '14px',
              background: '#0d0d1a', color: '#fff', fontWeight: 800, fontSize: '0.92rem',
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1e1e3a'}
            onMouseLeave={e => e.currentTarget.style.background = '#0d0d1a'}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default StuNoteUploadModal;