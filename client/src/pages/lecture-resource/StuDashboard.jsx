import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StuSidebar from '../../components/lecture-resource/StuSidebar';
import StuHome from '../../components/lecture-resource/StuHome';
import StuNoteUploadModal from '../../components/lecture-resource/StuNoteUploadModal';
import StuQuizModal from '../../components/lecture-resource/StuQuizModal';
import StuBonusMarksModal from '../../components/lecture-resource/StuBonusMarkModal';

const StuDashboard = () => {
  const [likes, setLikes] = useState(0);
  const [quizzes, setQuizzes] = useState(0);
  const [notes, setNotes] = useState(0);
  const [level, setLevel] = useState('');
  const [studentData, setStudentData] = useState(null);

  // Fetch student data from the backend
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('/api/student/profile'); // Adjust to your backend endpoint
        setStudentData(response.data);
        setLikes(response.data.likes);
        setLevel(response.data.rank);
        setQuizzes(response.data.quizzes);
        setNotes(response.data.notes);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  if (!studentData) return <div>Loading...</div>; // Loading state

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StuSidebar points={likes} quizzes={quizzes} notes={notes} level={level} />
      <main className="flex-1 ml-72 p-10 min-w-0 w-full">
        <StuHome onUploadClick={(lecture) => setActiveTab('upload')} />
        {/* You can add other sections here like uploading notes or quizzes */}
      </main>
    </div>
  );
};

export default StuDashboard;