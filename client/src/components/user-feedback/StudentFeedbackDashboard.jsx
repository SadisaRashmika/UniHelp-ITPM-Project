import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    MessageSquare, Trophy, Star, TrendingUp, Zap, 
    ShieldCheck, Sparkles, Clock, User, BookOpen, 
    ArrowRight, BarChart3, Activity, PieChart 
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import StudentFeedbackForm from './StudentFeedbackForm';

const StudentFeedbackDashboard = ({ studentId }) => {
    const [stats, setStats] = useState({
        feedbackCount: 0,
        avgRating: 0,
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user-feedback/feedback/student/${studentId}`);
            const studentReviews = res.data;
            
            const totalRating = studentReviews.reduce((sum, f) => sum + f.rating, 0);
            const avg = studentReviews.length > 0 ? (totalRating / studentReviews.length).toFixed(1) : 0;
            
            // Generate chart data: Count per Lecturer
            const lecturerCounts = {};
            studentReviews.forEach(f => {
                const name = f.lecturer_name || `Lec ID: ${f.lecturer_id}`;
                lecturerCounts[name] = (lecturerCounts[name] || 0) + 1;
            });

            const chartData = Object.keys(lecturerCounts).map(name => ({
                name,
                count: lecturerCounts[name]
            })).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5

            setStats({
                feedbackCount: studentReviews.length,
                avgRating: avg,
                chartData: chartData,
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

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] animate-pulse">Analyzing feedback nodes...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            
            {/* Top Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Lecturer Distribution Chart Card */}
                <div className="lg:col-span-8 bg-white rounded-4xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50 group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-gray-900">Lecturer Feedback Matrix</h2>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Distribution across academic staff</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <BarChart3 size={24} />
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        {stats.chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 9, fontWeight: 800, fill: '#9ca3af' }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 9, fontWeight: 800, fill: '#9ca3af' }}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc', radius: 12 }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={40}>
                                        {stats.chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                <Activity className="text-gray-200 mb-2" size={32} />
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Awaiting contribution data</p>
                            </div>
                        )}
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

