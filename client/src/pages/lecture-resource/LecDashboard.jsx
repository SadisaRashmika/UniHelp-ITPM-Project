import React, { useState } from 'react';
import LecSidebar        from '../../components/lecture-resource/LecSidebar';
import LecProfile        from '../../components/lecture-resource/LecProfile';
import LecUpload         from '../../components/lecture-resource/LecUpload';
import LecStudentUploads from '../../components/lecture-resource/LecStudentUploads';
import LecExtraMarks     from '../../components/lecture-resource/LecExtraMarks';
import { LECTURER_STATS, PENDING_SUBMISSIONS, BONUS_MARK_REQUESTS } from '../../components/lecture-resource/SharedData';

const LecDashboard = ({ user, onLogout }) => {
  const [activeTab,         setActiveTab]         = useState('profile');
  const [myPoints,          setMyPoints]          = useState(LECTURER_STATS.myPoints);
  const [pendingCount,      setPendingCount]      = useState(PENDING_SUBMISSIONS.length);
  const [extraMarksPending, setExtraMarksPending] = useState(
    BONUS_MARK_REQUESTS.filter(r => r.status === 'pending').length
  );

  // Create lecturer object from authenticated user
  const lecturer = {
    name: user?.name || 'Lecturer',
    initials: user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'LC',
    title: user?.role === 'admin' ? 'Administrator' : 'Lecturer',
    department: 'Faculty of Computing',
    employeeId: user?.employee_id || user?.id,
    subjects: ['Database Design and Development', 'Web and Mobile Technologies'],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <LecSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingCount}
        extraMarksPending={extraMarksPending}
        lecturer={lecturer}
        onLogout={onLogout}
      />

      <main className="flex-1 ml-72 p-10 min-w-0 w-full">
        {activeTab === 'profile' && (
          <LecProfile
            myPoints={myPoints}
            pendingCount={pendingCount}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'upload' && (
          <LecUpload onPublish={() => {}} />
        )}
        {activeTab === 'review' && (
          <LecStudentUploads
            onPointsEarned={(n) => setMyPoints(p => p + n)}
            onPendingChange={(d) => setPendingCount(p => Math.max(0, p + d))}
          />
        )}
        {activeTab === 'extramarks' && (
          <LecExtraMarks
            onPendingChange={(d) => setExtraMarksPending(p => Math.max(0, p + d))}
          />
        )}
      </main>
    </div>
  );
};

export default LecDashboard;