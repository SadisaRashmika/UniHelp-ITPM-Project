import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Users, 
    Star, 
    BookOpen, 
    Zap, 
    TrendingUp, 
    MessageSquare,
    ChevronRight,
    TrendingDown,
    Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LectureOverview = ({ lecturerId = 1 }) => {
    const [summary, setSummary] = useState({
        totalStudents: 0,
        avgRating: 0,
        activeModules: 0,
        rewardPoints: 0,
        recentFeedback: []
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLecturerData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/user-feedback/feedback/lecturer/${lecturerId}`);
                const myFeedback = res.data;
                
                const avg = myFeedback.length > 0
                    ? (myFeedback.reduce((acc, f) => acc + f.rating, 0) / myFeedback.length).toFixed(1)
                    : 0;

                // Process chart data from actual feedback over time
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayMap = myFeedback.reduce((acc, f) => {
                    const day = days[new Date(f.created_at).getDay()];
                    if (!acc[day]) acc[day] = { count: 0, sum: 0 };
                    acc[day].count++;
                    acc[day].sum += f.rating;
                    return acc;
                }, {});

                const processedChartData = days.map(day => ({
                    name: day,
                    rating: dayMap[day] ? parseFloat((dayMap[day].sum / dayMap[day].count).toFixed(1)) : 0
                }));

                setChartData(processedChartData);

                setSummary({
                    totalStudents: [...new Set(myFeedback.map(f => f.student_id))].length,
                    avgRating: avg,
                    activeModules: [...new Set(myFeedback.map(f => f.module_id))].length,
                    rewardPoints: myFeedback.length * 10, // Dynamic calculation
                    recentFeedback: myFeedback.slice(0, 3)
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLecturerData();
    }, [lecturerId]);

    if (loading) return <div className="p-20 text-center animate-pulse text-blue-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Academic Analytics...</div>;

    return (
        <div className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={<Users />} label="Total Students" val={summary.totalStudents} color="blue" />
                <StatCard icon={<Star />} label="Average Merit" val={summary.avgRating} color="emerald" />
                <StatCard icon={<BookOpen />} label="Active Modules" val={summary.activeModules} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative group hover:shadow-md transition-shadow">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                    <Activity size={14} className="text-blue-500" /> Momentum Trend
                                </h3>
                                <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tighter">Rolling performance metrics</p>
                            </div>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[8px] font-bold uppercase tracking-widest border border-blue-100">Synchronized</span>
                        </div>

                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}}
                                        dy={5}
                                    />
                                    <YAxis hide domain={[0, 5]} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '10px'}}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="rating" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorRating)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-linear-to-br from-blue-600 to-indigo-800 rounded-2xl p-8 text-white shadow-lg relative h-full flex flex-col justify-center overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mb-4 italic">Sentiment Index</h4>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-black tracking-tight text-white">{summary.avgRating}</span>
                                <span className="text-xs font-bold text-blue-200 mb-1.5 opacity-60">/ 5.0</span>
                                <div className="mb-2.5 flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-tighter bg-emerald-400/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                                    <TrendingUp size={10} /> +0.2
                                </div>
                            </div>
                            <p className="text-[10px] font-medium text-blue-100 opacity-90 leading-tight">Your current academic trajectory is rated as "Optimal" based on recent transmissions.</p>
                            
                            <button className="mt-8 px-6 py-3 bg-white text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                Export Analytics
                            </button>
                        </div>
                        <Activity size={160} className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, val, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all group">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 
            ${color === 'blue' ? 'bg-blue-50 text-blue-500' : 
              color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : 
              color === 'purple' ? 'bg-purple-50 text-purple-500' : 
              'bg-orange-50 text-orange-500'}`}>
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-xl font-bold text-gray-900 tracking-tight">{val}</h4>
    </div>
);

const IndicatorRow = ({ label, val }) => (
    <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-tight">{label}</span>
        <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: val }}></div>
            </div>
            <span className="text-[9px] font-black text-gray-900">{val}</span>
        </div>
    </div>
);

export default LectureOverview;
