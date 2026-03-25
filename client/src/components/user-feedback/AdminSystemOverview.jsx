import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Users, 
    MessageSquare, 
    Activity, 
    Star,
    Shield,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Database,
    Cpu,
    Lock
} from 'lucide-react';

const AdminSystemOverview = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        totalFeedback: 0,
        avgRating: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, feedbackRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/user-feedback/users'),
                    axios.get('http://localhost:5000/api/user-feedback/feedback')
                ]);
                
                const avg = feedbackRes.data.length > 0 
                    ? (feedbackRes.data.reduce((acc, f) => acc + f.rating, 0) / feedbackRes.data.length).toFixed(1)
                    : 0;

                setStats({
                    userCount: usersRes.data.length,
                    totalFeedback: feedbackRes.data.length,
                    avgRating: avg,
                    recentActivity: feedbackRes.data.slice(0, 5)
                });
            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 p-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3 ml-2">
                    <div className="relative">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-900 leading-none">System Operational</p>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5 tracking-wide uppercase">All nodes healthy • 24ms latency</p>
                    </div>
                </div>
                <div className="flex gap-4 mr-4">
                    <StatusMini label="Database" active={true} icon={<Database size={10} />} />
                    <StatusMini label="API Gateway" active={true} icon={<Cpu size={10} />} />
                    <StatusMini label="Secret Vault" active={true} icon={<Lock size={10} />} />
                </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewCard 
                    title="Total Knowledge Flow" 
                    value={stats.totalFeedback} 
                    trend="+12%" 
                    icon={<MessageSquare size={16} />} 
                    color="blue"
                />
                <OverviewCard 
                    title="Avg Merit Rating" 
                    value={stats.avgRating} 
                    trend="Stable" 
                    icon={<Star size={16} />} 
                    color="indigo"
                    suffix="/ 5.0"
                />
                <OverviewCard 
                    title="Active Entities" 
                    value={stats.userCount} 
                    trend="Safe" 
                    icon={<Users size={16} />} 
                    color="emerald"
                />
                <OverviewCard 
                    title="System Capacity" 
                    value="98%" 
                    trend="Optimal" 
                    icon={<Shield size={16} />} 
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden group border-t-2 border-t-blue-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-5 relative z-10">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <Activity size={12} className="text-blue-600" /> Interaction Density
                        </h3>
                        <div className="flex gap-1 p-0.5 bg-gray-50 rounded-lg border border-gray-100">
                            {['24H', '7D', '30D'].map(t => (
                                <button key={t} className={`px-2.5 py-1 rounded-md text-[8px] font-bold transition-all ${t === '7D' ? 'bg-white text-blue-600 shadow-xs border border-blue-50' : 'text-gray-400 hover:text-gray-600'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    
                    <div className="h-44 bg-linear-to-b from-gray-50/50 to-white rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center relative z-10 group-hover:border-blue-100 transition-colors">
                        <Activity className="text-gray-200 mb-2 group-hover:text-blue-100 transition-colors" size={32} />
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic group-hover:text-blue-400 transition-colors">Analytical Engine Syncing...</p>
                    </div>
                </div>

                
                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col h-full min-h-[240px] border-t-2 border-t-emerald-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} className="text-emerald-600" /> Activity Log
                        </h3>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    
                    <div className="space-y-3 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                        {stats.recentActivity.map((activity, idx) => (
                            <ActivityItem key={idx} user={activity.student_name} action="Created Review" time="Live" color="blue" />
                        ))}
                    </div>

                    <button className="mt-4 w-full py-2 rounded-xl text-[9px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100">
                        View Audit Stream
                    </button>
                </div>
            </div>
        </div>
    );
};

const OverviewCard = ({ title, value, trend, icon, color, suffix }) => (
    <div className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group border-l-4 
        ${color === 'blue' ? 'border-l-blue-500' : color === 'indigo' ? 'border-l-indigo-500' : color === 'emerald' ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
        <div className="flex items-center justify-between mb-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                ${color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 
                  color === 'indigo' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 
                  color === 'emerald' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 
                  'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'}`}>
                {icon}
            </div>
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                {trend}
            </span>
        </div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{title}</p>
        <h4 className="text-xl font-bold text-gray-900 tracking-tighter leading-none flex items-baseline gap-1">
            {value} <span className="text-[9px] text-gray-300 font-bold">{suffix}</span>
        </h4>
    </div>
);

const ActivityItem = ({ user, action, time, color }) => (
    <div className="flex items-center gap-2.5 group/item cursor-default p-1.5 hover:bg-gray-50/50 rounded-lg transition-colors">
        <div className={`w-1 h-1 rounded-full shrink-0 ${color === 'blue' ? 'bg-blue-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-900 leading-none group-hover/item:text-blue-600 transition-colors truncate uppercase tracking-tight">{user}</p>
            <p className="text-[8px] text-gray-400 font-medium mt-1 truncate">{action}</p>
        </div>
        <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter shrink-0">{time}</span>
    </div>
);

const StatusMini = ({ label, active, icon }) => (
    <div className="flex items-center gap-2 group cursor-default">
        <div className={`p-1 rounded-md ${active ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-300'}`}>
            {icon}
        </div>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">{label}</span>
    </div>
);

export default AdminSystemOverview;
