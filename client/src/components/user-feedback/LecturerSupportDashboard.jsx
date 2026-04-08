import React, { useState } from 'react';
import { BarChart3, ShieldCheck, LifeBuoy } from 'lucide-react';
import LectureAdminSystemOverview from './LectureAdminSystemOverview';
import LectureAdminUserList from './LectureAdminUserList';
import LectureAdminTicketList from './LectureAdminTicketList';

const LecturerSupportDashboard = ({ lecturerId }) => {
    const [activeSubView, setActiveSubView] = useState('sys-overview');

    const subTabs = [
        { key: 'sys-overview', label: 'System Overview', icon: <BarChart3 size={14} /> },
        { key: 'sys-users', label: 'User Management', icon: <ShieldCheck size={14} /> },
        { key: 'sys-inquiries', label: 'System Inquiries', icon: <LifeBuoy size={14} /> },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Sub Navigation for Support/Admin Section */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm w-fit">
                {subTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveSubView(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all
                            ${activeSubView === tab.key 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Rendering based on Sub-view */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[500px]">
                {activeSubView === 'sys-overview' && <LectureAdminSystemOverview />}
                {activeSubView === 'sys-users' && <LectureAdminUserList />}
                {activeSubView === 'sys-inquiries' && <LectureAdminTicketList lecturerId={lecturerId} />}
            </div>
        </div>
    );
};

export default LecturerSupportDashboard;
