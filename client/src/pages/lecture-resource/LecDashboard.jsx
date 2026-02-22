import React, { useState } from 'react';
import LecSidebar from '../../components/lecture-resource/LecSidebar';
import LecHome from '../../components/lecture-resource/LecHome';
import LecResources from '../../components/lecture-resource/LecResources';
import LecQuiz from '../../components/lecture-resource/LecQuiz';
import LecProfile from '../../components/lecture-resource/LecProfile';

const LecDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Logic to switch between components based on sidebar selection
  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <LecHome />;
      case 'resources': return <LecResources />;
      case 'quiz': return <LecQuiz />;
      case 'profile': return <LecProfile />;
      default: return <LecHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Fixed Sidebar */}
      <LecSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Dynamic Content Area */}
      <main className="flex-1 ml-64 p-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default LecDashboard;