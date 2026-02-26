import React, { useState } from 'react';
import StuSidebar         from '../../components/lecture-resource/StuSidebar';
import StuHome            from '../../components/lecture-resource/StuHome';
import StuNoteUploadModal from '../../components/lecture-resource/StuNoteUploadModal';
import StuQuizModal       from '../../components/lecture-resource/StuQuizModal';
import StuBonusMarksModal from '../../components/lecture-resource/StuBonusMarkModal';

const StuDashboard = () => {
  const [uploadLecture, setUploadLecture] = useState(null);
  const [quizLecture,   setQuizLecture]   = useState(null);
  const [bonusOpen,     setBonusOpen]     = useState(false);

  const [likes,     setLikes]     = useState(45);
  const [bonusUsed, setBonusUsed] = useState(false);

  const handleSpendLikes  = () => setLikes(prev => prev - 100);
  // Each time the student likes someone else's note, their own likes counter goes up
  const handleLikeEarned  = () => setLikes(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StuSidebar
        points={likes}
        quizzes={12}
        notes={8}
        level="Bronze"
      />

      <main className="flex-1 ml-72 p-10 min-w-0 w-full">
        <StuHome
          onUploadClick={(lecture) => setUploadLecture(lecture)}
          onTakeQuiz={(lecture)    => setQuizLecture(lecture)}
          onBonusMarks={()         => setBonusOpen(true)}
          onLikeEarned={handleLikeEarned}
        />
      </main>

      <StuNoteUploadModal
        isOpen={!!uploadLecture}
        onClose={() => setUploadLecture(null)}
        lecture={uploadLecture}
      />

      {quizLecture && (
        <StuQuizModal
          lecture={quizLecture}
          onClose={() => setQuizLecture(null)}
        />
      )}

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