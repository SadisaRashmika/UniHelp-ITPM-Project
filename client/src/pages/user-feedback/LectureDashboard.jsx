import React, { useState } from 'react';
import { Presentation, Users, FileBarChart, LogOut, ArrowLeft, BookOpen, LayoutDashboard, History, MessageSquarePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LectureFeedbackView from '../../components/user-feedback/LectureFeedbackView';
import LectureOverview from '../../components/user-feedback/LectureOverview';
import LecturePerformance from '../../components/user-feedback/LecturePerformance';
import LectureAdminSystemOverview from '../../components/user-feedback/LectureAdminSystemOverview';
import LectureAdminUserList from '../../components/user-feedback/LectureAdminUserList';
import LectureAdminFeedbackReport from '../../components/user-feedback/LectureAdminFeedbackReport';
import LectureAdminTicketList from '../../components/user-feedback/LectureAdminTicketList';
import { ShieldCheck, BarChart3, LifeBuoy } from 'lucide-react';

const LectureDashboard = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('overview');

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            
            <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm z-50">
                
                <div className="px-5 py-4 border-b border-gray-100">
                    <h1 className="text-base font-extrabold text-gray-900 tracking-tight leading-none">Uni-Help</h1>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold opacity-60">Academic Portal</p>
                </div>

                
                <div className="px-5 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm shadow-blue-100">
                            SJ
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate tracking-tight">Dr. Sarah Johnson</p>
                            <p className="text-[10px] text-gray-400 font-medium truncate italic tracking-tighter">Academic Head</p>
                        </div>
                    </div>
                </div>

                
                <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 opacity-50">Analytical Hub</p>
                    <SidebarItem 
                        icon={<LayoutDashboard size={14} className="text-blue-500" />} 
                        iconBg="bg-blue-50"
                        label="Personal Overview" 
                        active={view === 'overview'} 
                        onClick={() => setView('overview')}
                    />
                    <SidebarItem 
                        icon={<Users size={14} className="text-emerald-500" />} 
                        iconBg="bg-emerald-50"
                        label="My Reviews" 
                        active={view === 'reviews'} 
                        onClick={() => setView('reviews')}
                    />
                    <SidebarItem 
                        icon={<FileBarChart size={14} className="text-purple-500" />} 
                        iconBg="bg-purple-50"
                        label="My Performance" 
                        active={view === 'analysis'} 
                        onClick={() => setView('analysis')}
                    />

                    <div className="my-4 border-t border-gray-50 pt-4">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 opacity-50">System Administration</p>
                        <SidebarItem 
                            icon={<BarChart3 size={14} className="text-blue-500" />} 
                            iconBg="bg-blue-50"
                            label="System Overview" 
                            active={view === 'sys-overview'} 
                            onClick={() => setView('sys-overview')}
                        />
                        <SidebarItem 
                            icon={<ShieldCheck size={14} className="text-emerald-500" />} 
                            iconBg="bg-emerald-50"
                            label="User Management" 
                            active={view === 'sys-users'} 
                            onClick={() => setView('sys-users')}
                        />
                        <SidebarItem 
                            icon={<Presentation size={14} className="text-purple-500" />} 
                            iconBg="bg-purple-50"
                            label="Analytical Reports" 
                            active={view === 'sys-reports'} 
                            onClick={() => setView('sys-reports')}
                        />
                        <SidebarItem 
                            icon={<LifeBuoy size={14} className="text-amber-500" />} 
                            iconBg="bg-amber-50"
                            label="System Inquiries" 
                            active={view === 'sys-inquiries'} 
                            onClick={() => setView('sys-inquiries')}
                        />
                    </div>
                </div>

                
                <div className="p-3 border-t border-gray-100 space-y-1">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-all font-semibold text-[11px]"
                    >
                        <span className="flex items-center gap-2">
                            <ArrowLeft size={13} /> Back to Portal
                        </span>
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all font-bold text-[11px]"
                    >
                        <span className="flex items-center gap-2">
                            <LogOut size={13} /> End Session
                        </span>
                    </button>
                </div>
            </aside>

            
            <main className="grow ml-64 p-8 min-w-0 w-full overflow-x-hidden">
                <header className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight leading-none bg-linear-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
                            {view === 'overview' && 'Academic Command Center'}
                            {view === 'reviews' && 'Student Sentiment Analytics'}
                            {view === 'analysis' && 'Metric Deep-Dive'}
                            {view === 'sys-overview' && 'System Health & Vitality'}
                            {view === 'sys-users' && 'Identity & Access Management'}
                            {view === 'sys-reports' && 'Institutional Intelligence'}
                            {view === 'sys-inquiries' && 'Technical Support Logistics'}
                        </h2>
                        <p className="text-gray-400 text-[11px] mt-1.5 font-medium italic opacity-80">
                            {view === 'overview' && 'Real-time performance monitoring and engagement trajectories.'}
                            {view === 'reviews' && 'Comprehensive breakdown of student feedback nodes.'}
                            {view === 'analysis' && 'Statistical cross-evaluation of academic impact.'}
                            {view === 'sys-overview' && 'Global system metrics and operational status overview.'}
                            {view === 'sys-users' && 'Managing authenticated university entities and access levels.'}
                            {view === 'sys-reports' && 'Aggregated institutional feedback and performance data.'}
                            {view === 'sys-inquiries' && 'Processing student technical and academic help tickets.'}
                        </p>
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-xs flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Sync</span>
                        </div>
                    </div>
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                    {view === 'overview' && <LectureOverview lecturerId={1} />}
                    {view === 'reviews' && <LectureFeedbackView lecturerId={1} />}
                    {view === 'analysis' && <LecturePerformance lecturerId={1} />}
                    
                    {view === 'sys-overview' && <LectureAdminSystemOverview />}
                    {view === 'sys-users' && <LectureAdminUserList />}
                    {view === 'sys-reports' && <LectureAdminFeedbackReport />}
                    {view === 'sys-inquiries' && <LectureAdminTicketList />}
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, iconBg, label, active = false, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all font-semibold text-xs group
          ${active ? 'bg-blue-50 text-blue-600 border border-blue-100/50 shadow-xs' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
    >
        <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-white shadow-xs' : iconBg}`}>
                {icon}
            </div>
            <span className={active ? "font-bold text-blue-600" : ""}>{label}</span>
        </div>
    </button>
);

export default LectureDashboard;
