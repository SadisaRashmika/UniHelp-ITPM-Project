import React, { useState } from 'react';
import StuSidebar from '../../components/lecture-resource/StuSidebar';
import StuHome from '../../components/lecture-resource/StuHome';
import StuNoteUploadModal from '../../components/lecture-resource/StuNoteUploadModal';
import StuQuizModal from '../../components/lecture-resource/StuQuizModal';

const StuDashboard = () => {
  // Holds the full lecture object so modals know which lecture they're for
  const [uploadLecture, setUploadLecture] = useState(null);
  const [quizLecture, setQuizLecture] = useState(null);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: '#f7f7fc',
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
    }}>
      <StuSidebar
        points={45}
        quizzes={12}
        notes={8}
        level="Bronze"
      />

      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '40px 44px',
      }}>
        <StuHome
          // Pass the full lecture object to the modals
          onUploadClick={(lecture) => setUploadLecture(lecture)}
          onTakeQuiz={(lecture) => setQuizLecture(lecture)}
        />
      </main>

      {/* Upload modal — knows which lecture */}
      <StuNoteUploadModal
        isOpen={!!uploadLecture}
        onClose={() => setUploadLecture(null)}
        lecture={uploadLecture}
      />

      {/* Quiz modal — knows which lecture's quiz to run */}
      {quizLecture && (
        <StuQuizModal
          lecture={quizLecture}
          onClose={() => setQuizLecture(null)}
        />
      )}
    </div>
  );
};

export default StuDashboard;