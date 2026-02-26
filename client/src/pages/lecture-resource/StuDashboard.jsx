import React, { useState } from 'react';
import StuSidebar from '../../components/lecture-resource/StuSidebar';
import StuHome from '../../components/lecture-resource/StuHome';
import StuNoteUploadModal from '../../components/lecture-resource/StuNoteUploadModal';
import StuQuizModal from '../../components/lecture-resource/StuQuizModal';
import StuBonusMarksModal from '../../components/lecture-resource/StuBonusMarksModal';

const StuDashboard = () => {
  const [uploadLecture,   setUploadLecture]   = useState(null);
  const [quizLecture,     setQuizLecture]     = useState(null);
  const [bonusOpen,       setBonusOpen]       = useState(false);

  // Likes live here so sidebar updates when 100 are spent on bonus marks
  const [likes,     setLikes]     = useState(45);
  const [bonusUsed, setBonusUsed] = useState(false);

  const handleSpendLikes = () => setLikes(prev => prev - 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar — receives live likes count so it updates after bonus spend */}
      <StuSidebar
        points={likes}
        quizzes={12}
        notes={8}
        level="Bronze"
      />

      <main className="flex-1 ml-80 p-10">
        <StuHome
          onUploadClick={(lecture) => setUploadLecture(lecture)}
          onTakeQuiz={(lecture)    => setQuizLecture(lecture)}
          onBonusMarks={()         => setBonusOpen(true)}
        />
      </main>

      {/* Upload note modal */}
      <StuNoteUploadModal
        isOpen={!!uploadLecture}
        onClose={() => setUploadLecture(null)}
        lecture={uploadLecture}
      />

      {/* Quiz modal */}
      {quizLecture && (
        <StuQuizModal
          lecture={quizLecture}
          onClose={() => setQuizLecture(null)}
        />
      )}

      {/* Bonus marks modal */}
      <StuBonusMarksModal
        isOpen={bonusOpen}
        onClose={() => setBonusOpen(false)}
        studentLikes={likes}
        onSpendLikes={handleSpendLikes}
        bonusUsed={bonusUsed}
        setBonusUsed={setBonusUsed}
      />
    </div>
  );
};

export default StuDashboard;