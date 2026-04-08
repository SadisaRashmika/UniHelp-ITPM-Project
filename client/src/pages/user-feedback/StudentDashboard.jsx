import React, { useState } from 'react';
import { LayoutDashboard, MessageSquarePlus, History, Trophy, LogOut, ArrowLeft, GraduationCap, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentFeedbackForm from '../../components/user-feedback/StudentFeedbackForm';
import StudentOverview from '../../components/user-feedback/StudentOverview';
import StudentTicketForm from '../../components/user-feedback/StudentTicketForm';
import { LifeBuoy } from 'lucide-react';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('overview');

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm">
                
                <div className="px-5 py-4 border-b border-gray-100">
                    <h1 className="text-base font-extrabold text-gray-900 tracking-tight leading-none">Uni-Help</h1>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold opacity-60">Student Portal</p>
                </div>

                
                <div className="px-5 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm shadow-blue-100">
                            AT
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate tracking-tight">Alex Thompson</p>
                            <p className="text-[10px] text-gray-400 font-medium truncate italic tracking-tighter">STU-2024-001</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-1.5">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold tracking-tight">
                            <GraduationCap size={12} className="text-gray-400" /> Academic Level 03
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold tracking-tight">
                            <Calendar size={12} className="text-gray-400" /> Final Semester
                        </div>
                    </div>
                </div>

                
                <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 opacity-50">Operational Hub</p>
                    <SidebarItem 
                        icon={<LayoutDashboard size={14} className="text-blue-500" />} 
                        iconBg="bg-blue-50"
                        label="My Overview" 
                        active={view === 'overview'} 
                        onClick={() => setView('overview')}
                    />
                    <SidebarItem 
                        icon={<MessageSquarePlus size={14} className="text-emerald-500" />} 
                        iconBg="bg-emerald-50"
                        label="Feedback Manage" 
                        active={view === 'submit'} 
                        onClick={() => setView('submit')}
                    />
                    <SidebarItem 
                        icon={<LifeBuoy size={14} className="text-blue-500" />} 
                        iconBg="bg-blue-50"
                        label="Inquiry Support" 
                        active={view === 'support'} 
                        onClick={() => setView('support')}
                    />
                </div>

                
                <div className="p-3 border-t border-gray-100 space-y-1">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-all font-semibold text-[11px]"
                    >
                        <span className="flex items-center gap-2">
                            <ArrowLeft size={13} /> Return to Portal
                        </span>
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all font-bold text-[11px]"
                    >
                        <span className="flex items-center gap-2">
                            <LogOut size={13} /> Exit Session
                        </span>
                    </button>
                </div>
            </aside>

            
            <main className="grow ml-64 p-8 min-w-0 w-full">
                <header className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">
                            {view === 'overview' && 'Personal Perspective'}
                            {view === 'submit' && 'Feedback Operations'}
                            {view === 'support' && 'Support Inquiries'}
                        </h2>
                        <p className="text-gray-400 text-[11px] mt-1.5 font-medium italic opacity-80">
                            {view === 'overview' && 'Review your analytical contributions and reward trajectories.'}
                            {view === 'submit' && 'Manage your active feedback nodes and submission windows.'}
                            {view === 'support' && 'Direct technical and academic troubleshooting gateway.'}
                        </p>
                    </div>
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                    {view === 'overview' && <StudentOverview studentId={1} />}
                    {view === 'submit' && <StudentFeedbackForm studentId={1} />}
                    {view === 'support' && <StudentTicketForm studentId={1} />}
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

const StatsWidget = ({ icon, label, val }) => (
    <div className="bg-white px-5 py-4 rounded-2xl border border-gray-200 flex items-center gap-4 hover:shadow-sm transition-shadow">
        <div className="w-9 h-9 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center">
            {React.cloneElement(icon, { size: 16 })}
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-black text-gray-900 leading-none mt-0.5">{val}</p>
        </div>
    </div>
);

export default StudentDashboard;
