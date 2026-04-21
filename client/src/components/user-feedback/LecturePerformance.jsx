import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Star, 
    TrendingUp, 
    Users, 
    BookOpen, 
    BarChart3, 
    PieChart as PieChartIcon,
    ArrowUpRight,
    ArrowDownRight,
    Search
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell,
    Legend
} from 'recharts';

const LecturePerformance = ({ lecturerId = 1 }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedback = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user-feedback/feedback/lecturer/${lecturerId}`);
            setFeedbacks(res.data);
        } catch (err) {
            console.error('Error fetching performance data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [lecturerId]);

    const stats = {
        avgRating: feedbacks.length > 0 ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) : 0,
        totalReviews: feedbacks.length,
        uniqueSubjects: new Set(feedbacks.map(f => f.subject)).size,
        engagementIndex: (feedbacks.length * 1.5).toFixed(0) 
    };

    const ratingDist = [
        { name: 'Excellent', value: feedbacks.filter(f => f.rating === 5).length, color: '#2563eb' },
        { name: 'Good', value: feedbacks.filter(f => f.rating === 4).length, color: '#3b82f6' },
        { name: 'Average', value: feedbacks.filter(f => f.rating === 3).length, color: '#60a5fa' },
        { name: 'Below Avg', value: feedbacks.filter(f => f.rating <= 2).length, color: '#bfdbfe' },
    ].filter(d => d.value > 0);

    const subjectMetrics = feedbacks.reduce((acc, f) => {
        if (!acc[f.subject]) acc[f.subject] = { name: f.subject, sum: 0, count: 0 };
        acc[f.subject].sum += f.rating;
        acc[f.subject].count += 1;
        return acc;
    }, {});

    const chartData = Object.values(subjectMetrics).map(s => ({
        name: s.name.length > 15 ? s.name.substring(0, 12) + '...' : s.name,
        fullLabel: s.name,
        avg: parseFloat((s.sum / s.count).toFixed(1))
    })).sort((a, b) => b.avg - a.avg);

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <PerformanceCard 
                    label="Academic Merit" 
                    val={stats.avgRating} 
                    sub="Average Rating" 
                    icon={<Star className="text-blue-500" size={18} />} 
                    suffix="/ 5.0"
                    trend="+0.3" 
                />
                <PerformanceCard 
                    label="Student Engagement" 
                    val={stats.totalReviews} 
                    sub="Total Reviews" 
                    icon={<Users className="text-indigo-500" size={18} />} 
                    trend="Live" 
                />
                <PerformanceCard 
                    label="Module Reach" 
                    val={stats.uniqueSubjects} 
                    sub="Active Modules" 
                    icon={<BookOpen className="text-emerald-500" size={18} />} 
                />
                <PerformanceCard 
                    label="Impact Score" 
                    val={stats.engagementIndex} 
                    sub="Aggregate Sentiment" 
                    icon={<TrendingUp className="text-amber-500" size={18} />} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 size={16} className="text-blue-500" /> Module Performance Delta
                            </h3>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Cross-subject analytical breakdown</p>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    fontSize={8} 
                                    fontWeight={800} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8' }} 
                                    dy={10}
                                />
                                <YAxis 
                                    fontSize={8} 
                                    fontWeight={800} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8' }} 
                                    domain={[0, 5]} 
                                    tickCount={6} 
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.avg > 4 ? '#2563eb' : entry.avg > 3 ? '#3b82f6' : '#93c5fd'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col h-full border-t-2 border-t-blue-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                        <PieChartIcon size={16} className="text-blue-500" /> Student Sentiment Analytics
                    </h3>
                    
                    <div className="space-y-2.5 flex-1 relative z-10">
                        {ratingDist.length > 0 ? (
                            ratingDist.map((d, i) => {
                                const percentage = ((d.value / feedbacks.length) * 100).toFixed(0);
                                return (
                                    <div key={i} className="group/row">
                                        <div className="flex items-center justify-between mb-1 px-0.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{d.name}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-900 tracking-tighter leading-none">{percentage}% <span className="text-gray-300 font-bold ml-1">({d.value})</span></span>
                                        </div>
                                        <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 group-hover/row:border-blue-100 transition-colors">
                                            <div 
                                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%`, backgroundColor: d.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 italic text-[10px] font-bold uppercase tracking-widest py-10">
                                No records found.
                            </div>
                        )}
                    </div>

                    {ratingDist.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-dashed border-gray-100 flex items-center justify-between relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Aggregate Index</span>
                                <span className="text-xl font-black text-blue-600 tracking-tight leading-none italic">{stats.avgRating} <span className="text-[10px] text-blue-200">/ 5.0</span></span>
                            </div>
                            <div className="px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2">
                                <TrendingUp size={12} className="text-blue-600" />
                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Growth Phase</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PerformanceCard = ({ label, val, sub, icon, suffix, trend }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:border-blue-100 transition-all group">
        <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter
                    ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                    {trend === 'Live' ? <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse mr-0.5" /> : trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {trend}
                </div>
            )}
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900 tracking-tight">{val}</span>
            {suffix && <span className="text-[10px] font-bold text-gray-400">{suffix}</span>}
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{label}</p>
        <p className="text-[8px] text-gray-300 font-bold uppercase tracking-tighter mt-0.5">{sub}</p>
    </div>
);

export default LecturePerformance;
