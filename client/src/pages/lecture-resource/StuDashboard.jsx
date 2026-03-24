import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StuSidebar from '../../components/lecture-resource/StuSidebar';
import StuHome from '../../components/lecture-resource/StuHome';
import StuQuizModal from '../../components/lecture-resource/StuQuizModal';
import StuNoteUploadModal from '../../components/lecture-resource/StuNoteUploadModal';
import StuMyUploadsModal from '../../components/lecture-resource/StuMyUploadsModal';
import StuBonusMarksModal from '../../components/lecture-resource/StuBonusMarkModal';

const API_BASE = 'http://localhost:5000';

const StuDashboard = () => {
  const [myNotesCount, setMyNotesCount] = useState(0);
  const [studentData, setStudentData] = useState(null);
  const [quizLecture, setQuizLecture] = useState(null);
  const [uploadLecture, setUploadLecture] = useState(null);
  const [myUploadsOpen, setMyUploadsOpen] = useState(false);
  const [bonusOpen, setBonusOpen] = useState(false);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/student/profile?studentId=STU001`);
      setStudentData(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  // Fetch student data from the backend
  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    refreshMyUploadsCount();
  }, [studentData?.student_id, uploadLecture]);

  const refreshMyUploadsCount = async () => {
    if (!studentData?.student_id) return;
    try {
      const response = await axios.get(`${API_BASE}/api/student/notes/my-uploads?studentId=${studentData.student_id}`);
      const uploads = response.data || [];
      // Active notes in feed should only count accepted notes.
      setMyNotesCount(uploads.filter((u) => u.status === 'accepted').length);
    } catch (error) {
      console.error('Error fetching upload stats:', error);
    }
  };

  const refreshDashboardData = async () => {
    await fetchStudentData();
    await refreshMyUploadsCount();
  };

  if (!studentData) return <div>Loading...</div>; // Loading state

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StuSidebar
        student={studentData}
        fullLikes={studentData?.full_likes ?? 0}
        points={studentData?.points ?? 0}
        notes={myNotesCount}
      />
      <main className="flex-1 ml-72 p-10 min-w-0 w-full">
        <StuHome
          student={studentData}
          onUploadClick={(lecture) => setUploadLecture(lecture)}
          onTakeQuiz={(lecture) => setQuizLecture(lecture)}
          onMyUploads={() => setMyUploadsOpen(true)}
          onBonusMarks={() => setBonusOpen(true)}
        />
        {/* You can add other sections here like uploading notes or quizzes */}
      </main>
      <StuNoteUploadModal
        isOpen={Boolean(uploadLecture)}
        onClose={() => setUploadLecture(null)}
        lecture={uploadLecture}
        student={studentData}
        onUploaded={() => {
          setUploadLecture(null);
        }}
      />
      {quizLecture && (
        <StuQuizModal
          lecture={quizLecture}
          onClose={() => setQuizLecture(null)}
        />
      )}
      <StuMyUploadsModal
        isOpen={myUploadsOpen}
        onClose={() => setMyUploadsOpen(false)}
        studentId={studentData?.student_id || 'STU001'}
        onChanged={refreshDashboardData}
      />
      <StuBonusMarksModal
        isOpen={bonusOpen}
        onClose={async () => {
          setBonusOpen(false);
          await fetchStudentData();
        }}
        student={studentData}
        pointsBalance={studentData?.points ?? 0}
      />
    </div>
  );
};

export default StuDashboard;