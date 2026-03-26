import React, { useState } from 'react';
import { ShieldCheck, BarChart3, Users, Settings, LogOut, ArrowLeft, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminUserList from '../../components/user-feedback/AdminUserList';
import AdminFeedbackReport from '../../components/user-feedback/AdminFeedbackReport';
import AdminSystemOverview from '../../components/user-feedback/AdminSystemOverview';
import AdminTicketList from '../../components/user-feedback/AdminTicketList';
import { LifeBuoy } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('overview');

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm">
                
                <div className="px-5 py-4 border-b border-gray-100">
                    <h1 className="text-base font-bold text-gray-900 leading-tight tracking-tight">Uni-Help System</h1>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Admin Portal</p>
                </div>

                
                <div className="px-5 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm shadow-blue-100">
                            AD
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">App Admin</p>
                            <p className="text-[10px] text-gray-400 font-medium tracking-wide italic truncate">@admin_portal</p>
                        </div>
                    </div>
                </div>

                
                <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 opacity-60">System Core</p>
                    <SidebarItem 
                        icon={<BarChart3 size={14} className="text-blue-500" />} 
                        iconBg="bg-blue-50"
                        label="Overview" 
                        active={view === 'overview'} 
                        onClick={() => setView('overview')}
                    />
                    <SidebarItem 
                        icon={<Users size={14} className="text-emerald-500" />} 
                        iconBg="bg-emerald-50"
                        label="Users" 
                        active={view === 'users'} 
                        onClick={() => setView('users')}
                    />
                    <SidebarItem 
                        icon={<PieChart size={14} className="text-purple-500" />} 
                        iconBg="bg-purple-50"
                        label="Reports" 
                        active={view === 'reports'} 
                        onClick={() => setView('reports')}
                    />
                    <SidebarItem 
                        icon={<LifeBuoy size={14} className="text-blue-500" />} 
                        iconBg="bg-blue-50"
                        label="Inquiries" 
                        active={view === 'inquiries'} 
                        onClick={() => setView('inquiries')}
                    />
                </div>

                
                <div className="p-3 border-t border-gray-100 space-y-1">
                    <button 
                        onClick={() => navigate('/VimoHome')}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 transition-all font-semibold text-xs"
                    >
                        <span className="flex items-center gap-2">
                            <ArrowLeft size={14} /> Back
                        </span>
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all font-bold text-xs"
                    >
                        <span className="flex items-center gap-2">
                            <LogOut size={14} /> Logout
                        </span>
                    </button>
                </div>
            </aside>

            
            <main className="grow ml-64 p-8 min-w-0 w-full">
                {view !== 'overview' && (
                    <header className="mb-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-none italic uppercase">
                                {view === 'users' && 'Identity Core'}
                                {view === 'reports' && 'Feedback Intelligence'}
                                {view === 'inquiries' && 'Support Logistics'}
                            </h2>
                            <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest opacity-60">
                                {view === 'users' && 'Managing authenticated university entities and access levels.'}
                                {view === 'reports' && 'Quantitative and qualitative student feedback analysis.'}
                                {view === 'inquiries' && 'Processing student technical and academic help tickets.'}
                            </p>
                        </div>
                    </header>
                )}

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {view === 'overview' && <AdminSystemOverview />}
                    {view === 'users' && <AdminUserList />}
                    {view === 'reports' && <AdminFeedbackReport />}
                    {view === 'inquiries' && <AdminTicketList />}

                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, iconBg, label, active = false, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all font-medium text-sm group
          ${active ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-white shadow-xs' : iconBg}`}>
                {icon}
            </div>
            <span className={active ? "font-bold" : ""}>{label}</span>
        </div>
    </button>
);

export default AdminDashboard;
