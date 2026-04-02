import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LecSidebar from '../../components/lecture-resource/LecSidebar';
import LecProfile from '../../components/lecture-resource/LecProfile';
import LecStudentUploads from '../../components/lecture-resource/LecStudentUploads';
import LecUpload from '../../components/lecture-resource/LecUpload';
import LecExtraMarks from '../../components/lecture-resource/LecExtraMarks';

const LecDashboard = ({ userId = 'LEC001' }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [lecturer, setLecturer] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [extraMarksPending, setExtraMarksPending] = useState(0);
  const [myPoints, setMyPoints] = useState(0);

  // Fetch lecturer data and other necessary data from the backend
  useEffect(() => {
    const fetchLecturerData = async () => {
      try {
        // Use the correct API endpoint to get the lecturer profile
        const response = await axios.get(`http://localhost:5000/api/lecturer/profile?lecturerId=${userId}`);
        console.log('Lecturer Profile:', response.data); // Log data for debugging
        setLecturer(response.data); // Set the lecturer data in state
        setMyPoints(response.data.points); // Set the points for the lecturer
      } catch (error) {
        console.error('Error fetching lecturer data:', error);
      }
    };

    const fetchPendingCounts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/lecturer/pending-counts?lecturerId=${userId}`);
        console.log('Pending Counts:', response.data); // Log pending counts for debugging
        setPendingCount(response.data.submissions);
        setExtraMarksPending(response.data.bonusMarks);
      } catch (error) {
        console.error('Error fetching pending counts:', error);
      }
    };

    fetchLecturerData();
    fetchPendingCounts();
  }, [userId]);

  if (!lecturer) return <div>Loading...</div>; // Loading state

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <LecSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingCount}
        extraMarksPending={extraMarksPending}
        lecturer={lecturer}
      />
      <main className="flex-1 ml-72 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 min-w-0 w-full">
        {activeTab === 'profile' && (
          <LecProfile
            lecturerId={userId}
            myPoints={myPoints}
            pendingCount={pendingCount}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'review' && (
          <LecStudentUploads
            lecturerId={lecturer?.employee_id || userId}
            onPointsEarned={(pts) => setMyPoints((prev) => prev + pts)}
            onPendingChange={(delta) => {
              setPendingCount((prev) => Math.max(0, prev + delta));
            }}
          />
        )}
        {activeTab === 'upload' && (
          <LecUpload
            lecturer={lecturer}
            onPublish={() => {
              // For now only local refresh; API-based list will be wired next.
            }}
          />
        )}
        {activeTab === 'extramarks' && (
          <LecExtraMarks
            lecturerId={lecturer?.employee_id || userId}
            onPendingChange={(delta) => {
              setExtraMarksPending((prev) => Math.max(0, prev + delta));
            }}
          />
        )}
      </main>
    </div>
  );
};

export default LecDashboard;