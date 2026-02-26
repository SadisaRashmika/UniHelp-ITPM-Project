import React, { useState } from 'react';
import LecSidebar   from '../../components/lecture-resource/LecSidebar';
import LecProfile   from '../../components/lecture-resource/LecProfile';
import LecResources from '../../components/lecture-resource/LecResources';
import LecQuiz      from '../../components/lecture-resource/LecQuiz';
import { LECTURER, PENDING_RESOURCES } from '../../components/lecture-resource/lecData';

// ── Root lecturer page ────────────────────────────────────────────────────────
// All live state (points, pending count) lives here so sidebar stays in sync
const LecDashboard = () => {
  const [activeTab,    setActiveTab]    = useState('profile');
  const [myPoints,     setMyPoints]     = useState(LECTURER.stats.myPoints);
  const [pendingCount, setPendingCount] = useState(PENDING_RESOURCES.length);

  const handlePointsEarned  = (amount) => setMyPoints(prev => prev + amount);
  const handlePendingChange = (delta)  => setPendingCount(prev => Math.max(0, prev + delta));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">

      {/* Fixed left sidebar */}
      <LecSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        myPoints={myPoints}
        pendingCount={pendingCount}
      />

      {/* Scrollable main content — offset by sidebar width */}
      <main className="flex-1 ml-64 p-10">
        {activeTab === 'profile' && (
          <LecProfile myPoints={myPoints} pendingCount={pendingCount} />
        )}
        {activeTab === 'resources' && (
          <LecResources
            onPointsEarned={handlePointsEarned}
            onPendingChange={handlePendingChange}
          />
        )}
        {activeTab === 'quiz' && (
          <LecQuiz />
        )}
      </main>
    </div>
  );
};

export default LecDashboard;