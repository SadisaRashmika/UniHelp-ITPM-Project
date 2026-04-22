import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Trophy, 
    MessageSquare, 
    Target, 
    Zap, 
    Star, 
    ChevronRight,
    Clock,
    Award,
    TrendingUp,
    Shield
} from 'lucide-react';

const StudentOverview = ({ studentId = 1 }) => {
    const [stats, setStats] = useState({
        feedbackCount: 0,
        recentFeedback: [],
        points: 320,
        rank: 24
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/user-feedback/feedback');
                const studentReviews = res.data.filter(f => f.student_id === studentId);
                
                setStats(prev => ({
                    ...prev,
                    feedbackCount: studentReviews.length,
                    recentFeedback: studentReviews.slice(0, 4)
                }));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentStats();
    }, [studentId]);

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-4">
            
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 p-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3 ml-2">
                    <div className="relative">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-900 leading-none">Perspective Node Active</p>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5 tracking-wide uppercase">Syncing your contribution metrics...</p>
                    </div>
                </div>
                <div className="flex gap-4 mr-4">
                    <StatusMini label="Profile" active={true} icon={<Shield size={10} />} />
                    <StatusMini label="Rewards" active={true} icon={<Award size={10} />} />
                    <StatusMini label="Activity" active={true} icon={<Clock size={10} />} />
                </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewCard 
                    title="Experience Points" 
                    value={stats.points} 
                    trend="+12%" 
                    icon={<Trophy size={16} />} 
                    color="blue"
                    suffix="XP"
                />
                <OverviewCard 
                    title="Academic Level" 
                    value="Year 03" 
                    trend="Stable" 
                    icon={<Target size={16} />} 
                    color="indigo"
                />
                <OverviewCard 
                    title="Total Feedbacks" 
                    value={stats.feedbackCount} 
                    trend="Active" 
                    icon={<MessageSquare size={16} />} 
                    color="emerald"
                />
                <OverviewCard 
                    title="Global Rank" 
                    value={`#${stats.rank}`} 
                    trend="Top 10%" 
                    icon={<Award size={16} />} 
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden group border-t-2 border-t-blue-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-5 relative z-10">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <TrendingUp size={12} className="text-blue-600" /> Milestone Trajectory
                        </h3>
                        <div className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[8px] font-bold uppercase tracking-widest border border-blue-100/50">
                            80% Towards Goal
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">University Knowledge Contributor</h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                                    <span>Current: 8 Submissions</span>
                                    <span className="text-blue-600">Monthly Target: 10</span>
                                </div>
                                <div className="w-full h-2 bg-blue-50 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full w-[80%] transition-all duration-1000"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <MiniGoal label="Module Clarity" active={true} />
                                <MiniGoal label="Session Depth" active={true} />
                                <MiniGoal label="Resource Feedback" active={false} />
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="lg:col-span-4 bg-gray-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group border-t-2 border-t-indigo-500 h-full flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="relative z-10">
                        <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Entity Prestige</p>
                        <h3 className="text-3xl font-bold tracking-tighter mb-1">Master Class</h3>
                        <p className="text-[10px] text-gray-400 font-medium italic">Level 24 • Next: Uni-Legend</p>
                    </div>

                    <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-3">Unlocked Achievements</p>
                        <div className="flex flex-wrap gap-2">
                            <Badge icon="🔥" label="7 Streak" />
                            <Badge icon="🌟" label="Elite" />
                            <Badge icon="🚀" label="Pioneer" />
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-t-2 border-t-emerald-500">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} className="text-emerald-600" /> Recent Node Updates
                    </h3>
                    <button className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:bg-blue-50/50 px-2.5 py-1 rounded-lg transition-all border border-transparent hover:border-blue-100">
                        Historical Log
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {stats.recentFeedback.length > 0 ? stats.recentFeedback.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-transparent hover:border-blue-100 hover:bg-white transition-all group shadow-xs">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-xs border border-gray-100 group-hover:scale-110 transition-transform">
                                    <Star size={14} fill={f.rating > 0 ? "currentColor" : "none"} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-gray-900 truncate uppercase tracking-tight">{f.subject}</p>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">{f.lecturer_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{f.rating}.0</span>
                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">{new Date(f.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-2 py-10 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest italic opacity-60">
                            Zero Knowledge Nodes Detected. Initialize your first feedback protocols.
                        </div>
                    )}
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

const StatusMini = ({ label, active, icon }) => (
    <div className="flex items-center gap-2 group cursor-default">
        <div className={`p-1 rounded-md ${active ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-300'}`}>
            {icon}
        </div>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">{label}</span>
    </div>
);

const MiniGoal = ({ label, active }) => (
    <div className={`p-2 rounded-lg border text-center transition-all ${active ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
        <p className="text-[7.5px] font-bold uppercase tracking-widest whitespace-nowrap">{label}</p>
        <div className={`w-1 h-1 rounded-full mx-auto mt-1 ${active ? 'bg-emerald-500' : 'bg-gray-200'}`} />
    </div>
);

const Badge = ({ icon, label }) => (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-all cursor-default group">
        <span className="text-xs">{icon}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-white">{label}</span>
    </div>
);

export default StudentOverview;
