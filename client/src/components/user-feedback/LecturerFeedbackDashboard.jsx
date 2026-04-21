import React, { useState } from 'react';
import { LayoutDashboard, Users, FileBarChart, Presentation } from 'lucide-react';
import LectureOverview from './LectureOverview';
import LectureFeedbackView from './LectureFeedbackView';
import LecturePerformance from './LecturePerformance';
import LectureAdminFeedbackReport from './LectureAdminFeedbackReport';

const LecturerFeedbackDashboard = ({ lecturerId }) => {
    const [activeSubView, setActiveSubView] = useState('overview');

    const subTabs = [
        { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={14} /> },
        { key: 'reviews', label: 'My Reviews', icon: <Users size={14} /> },
        { key: 'performance', label: 'My Performance', icon: <FileBarChart size={14} /> },
        { key: 'reports', label: 'Analytical Reports', icon: <Presentation size={14} /> },
    ];

    return (
        <div className="space-y-6">
            {/* Sub Navigation for Feedback Section */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm w-fit">
                {subTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveSubView(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all
                            ${activeSubView === tab.key 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-gray-500 hover:bg-blue-50 hover:text-blue-700'}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Rendering based on Sub-view */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[500px]">
                {activeSubView === 'overview' && <LectureOverview lecturerId={lecturerId} />}
                {activeSubView === 'reviews' && <LectureFeedbackView lecturerId={lecturerId} />}
                {activeSubView === 'performance' && <LecturePerformance lecturerId={lecturerId} />}
                {activeSubView === 'reports' && <LectureAdminFeedbackReport lecturerId={lecturerId} />}
            </div>
        </div>
    );
};

export default LecturerFeedbackDashboard;
