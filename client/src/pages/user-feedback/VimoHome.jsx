import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, GraduationCap, Presentation, ArrowRight, Trophy } from 'lucide-react';

const DashboardCard = ({ title, desc, icon, color, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`relative flex flex-col items-start bg-white rounded-2xl border border-gray-200 p-8 text-left transition-all duration-300 hover:shadow-md hover:border-blue-300 group`}
        >
            <div className={`mb-6 w-14 h-14 rounded-xl ${color} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 grow">
                {desc}
            </p>
            <div className="flex items-center gap-2 text-blue-500 text-sm font-bold tracking-tight group-hover:gap-3 transition-all">
                Access Portal <ArrowRight size={16} />
            </div>
        </button>
    );
};

const VimoHome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-6xl w-full">
                <header className="mb-12">
                     <div className="flex items-center gap-2 mb-4">
                        <GraduationCap size={24} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-xs">
                            Academic Feedback Ecosystem
                        </span>
                     </div>
                     <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                        Quality Management <span className="text-blue-500">Portal</span>
                     </h1>
                     <p className="text-gray-400 text-sm mt-3 max-w-2xl font-medium">
                        Access specialized portals to submit feedback, monitor academic performance, and manage institution-wide sentiment metrics.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                    <DashboardCard 
                        title="Student Portal" 
                        desc="Submit feedback, track points, and view your academic achievements in a single unified dashboard."
                        icon={<Trophy size={28} />}
                        color="bg-gradient-to-br from-blue-500 to-indigo-600"
                        onClick={() => navigate('/student')}
                    />
                    <DashboardCard 
                        title="Academic Portal" 
                        desc="The central hub for lecturers to manage student sentiment, analyze performance, and institutional logistics."
                        icon={<Presentation size={28} />}
                        color="bg-gradient-to-br from-purple-500 to-purple-700"
                        onClick={() => navigate('/lecture')}
                    />
                </div>

                <footer className="mt-16 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Uni-Help Project • 2026 Edition</p>
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-bold text-gray-400 hover:text-blue-500 cursor-pointer transition-colors uppercase tracking-widest">Documentation</span>
                            <span className="text-[10px] font-bold text-gray-400 hover:text-blue-500 cursor-pointer transition-colors uppercase tracking-widest">Support</span>
                            <span className="text-[10px] font-bold text-gray-400 hover:text-blue-500 cursor-pointer transition-colors uppercase tracking-widest">Privacy</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default VimoHome;
