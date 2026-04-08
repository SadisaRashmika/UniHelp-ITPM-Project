import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    MessageSquare, Trophy, Star, TrendingUp, Zap, 
    ShieldCheck, Sparkles, Clock, User, BookOpen, 
    ArrowRight, BarChart3, Activity, PieChart 
} from 'lucide-react';
import StudentFeedbackForm from './StudentFeedbackForm';

const StudentFeedbackDashboard = ({ studentId }) => {
    const [stats, setStats] = useState({
        feedbackCount: 0,
        avgRating: 0,
        points: 0,
        rank: 'Novice Contributor',
        recentFeedback: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user-feedback/feedback');
            const studentReviews = res.data.filter(f => f.student_id === studentId || f.student_reg_id === studentId);
            
            const totalRating = studentReviews.reduce((sum, f) => sum + f.rating, 0);
            const avg = studentReviews.length > 0 ? (totalRating / studentReviews.length).toFixed(1) : 0;
            
            // Determine rank based on count
            let rank = 'Bronze Reviewer';
            if (studentReviews.length > 5) rank = 'Silver Scholar';
            if (studentReviews.length > 15) rank = 'Gold Academic';
            if (studentReviews.length > 30) rank = 'Feedback Maestro';

            setStats({
                feedbackCount: studentReviews.length,
                avgRating: avg,
                points: studentReviews.length * 25, // 25 XP per feedback
                rank: rank,
                recentFeedback: studentReviews.slice(0, 4)
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [studentId]);

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] animate-pulse">Syncing feedback nodes...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            
            {/* Upper Hero Section - Profile & XP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-linear-to-br from-indigo-700 via-indigo-600 to-blue-600 rounded-4xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 group">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 group-hover:scale-125 transition-transform duration-1000" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl -ml-32 -mb-32" />
                    
                    <div className="relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                                    <Sparkles size={40} className="text-yellow-300 drop-shadow-glow" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[8px] font-black uppercase tracking-widest border border-yellow-400/30">
                                            Level {(Math.floor(stats.points / 100)) + 1}
                                        </span>
                                        <ShieldCheck size={14} className="text-blue-300" />
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter mb-1">{stats.rank}</h2>
                                    <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Academic Contribution Matrix</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                                <div className="text-right mb-2">
                                    <span className="text-5xl font-black tracking-tighter">{stats.points}</span>
                                    <span className="text-indigo-200 font-bold ml-2">XP</span>
                                </div>
                                <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
                                    <div 
                                        className="h-full bg-linear-to-r from-yellow-400 to-orange-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" 
                                        style={{ width: `${(stats.points % 100)}%` }}
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-indigo-200 mt-2 uppercase tracking-widest leading-none">
                                    {100 - (stats.points % 100)} xp to next tier
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Reviews', val: stats.feedbackCount, icon: <MessageSquare size={14} />, color: 'bg-white/10' },
                                { label: 'Avg Rating', val: stats.avgRating, icon: <Star size={14} />, color: 'bg-white/10' },
                                { label: 'Impact', val: 'High', icon: <TrendingUp size={14} />, color: 'bg-white/10' },
                                { label: 'Status', val: 'Active', icon: <Activity size={14} />, color: 'bg-emerald-400/20 text-emerald-300' }
                            ].map((item, i) => (
                                <div key={i} className={`${item.color} backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-default group/item`}>
                                    <div className="flex items-center gap-2 mb-2 opacity-70 group-hover/item:opacity-100 transition-opacity">
                                        {item.icon}
                                        <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <div className="text-xl font-black tracking-tight">{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 grid grid-rows-2 gap-6">
                    <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <PieChart size={20} />
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Quality Metrics</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Feedback Authenticity</p>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-700">Detailed Comments</span>
                                        <span className="text-[10px] font-black text-indigo-600">85%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-700">Constructive Bits</span>
                                        <span className="text-[10px] font-black text-emerald-500">72%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6 group hover:border-indigo-100 transition-all">
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-gray-900 mb-1">Weekly Performance</h4>
                            <p className="text-[10px] font-bold text-gray-400 leading-relaxed mb-4">Your contributions are 12% higher than last week's average cycle.</p>
                            <div className="flex gap-2">
                                {[3, 5, 8, 4, 7, 6, 9].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full bg-gray-50 rounded-t-sm group-hover:bg-indigo-50 transition-colors relative h-10 overflow-hidden flex flex-col justify-end">
                                            <div 
                                                className={`w-full rounded-t-sm transition-all duration-1000 delay-${i * 100} ${i === 6 ? 'bg-indigo-500' : 'bg-indigo-200'}`} 
                                                style={{ height: `${h * 10}%` }} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin transition-all duration-3000" />
                    </div>
                </div>
            </div>

            {/* Bottom Section - Full Width Feedback Management */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-indigo-600">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-gray-900 leading-none mb-1">Feedback Management Hub</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submit, Edit, or Analyze your contributions</p>
                    </div>
                </div>

                <div className="bg-white rounded-4xl p-2 border border-gray-100 shadow-xl shadow-gray-100/30 overflow-hidden">
                    <StudentFeedbackForm studentId={studentId} onFeedbackSubmitted={fetchStats} />
                </div>
            </div>
        </div>
    );
};

const OverviewCard = ({ title, value, trend, icon, color, suffix }) => (
    <div className={`bg-white p-6 rounded-4xl border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:-translate-y-1 transition-all group border-l-8 
        ${color === 'blue' ? 'border-l-indigo-600' : 'border-l-emerald-500'}`}>
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 
                ${color === 'blue' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {icon}
            </div>
            <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest
                ${color === 'blue' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                {trend}
            </div>
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
            <h4 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
                {value}
            </h4>
            {suffix && <span className="text-xs font-black text-gray-300 uppercase tracking-widest">{suffix}</span>}
        </div>
        
        <div className="mt-6 flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
            View Analytics <ArrowRight size={10} />
        </div>
    </div>
);

export default StudentFeedbackDashboard;

