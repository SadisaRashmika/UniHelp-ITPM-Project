import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Star, MessageSquare, Quote, TrendingUp, CheckCircle } from 'lucide-react';

const LectureFeedbackView = ({ lecturerId = 1 }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/user-feedback/feedback/lecturer/${lecturerId}`);
                setFeedbacks(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, [lecturerId]);

    const avgRating = feedbacks.length > 0 
        ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) 
        : "0.0";

    const ratingDist = [
        { name: 'Excellent', value: feedbacks.filter(f => f.rating === 5).length, color: '#3b82f6' },
        { name: 'Good', value: feedbacks.filter(f => f.rating === 4).length, color: '#60a5fa' },
        { name: 'Satisfactory', value: feedbacks.filter(f => f.rating === 3).length, color: '#93c5fd' },
        { name: 'Below Avg', value: feedbacks.filter(f => f.rating <= 2).length, color: '#bfdbfe' },
    ].filter(d => d.value > 0);

    if (loading) return (
        <div className="flex items-center justify-center p-20 animate-pulse text-[10px] font-bold text-blue-500 uppercase tracking-widest">
            Aggregating Perspective Nodes...
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 text-blue-50 group-hover:scale-110 transition-transform duration-500">
                            <Star size={80} fill="currentColor" stroke="none" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-3">Academic Score</p>
                            <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-1">{avgRating}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Weight: <span className="text-gray-900">{feedbacks.length} Reviews</span></p>
                            <div className="mt-6 flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                    <Star key={s} size={14} fill={s <= Math.round(avgRating) ? "#3b82f6" : "none"} stroke={s <= Math.round(avgRating) ? "none" : "#e2e8f0"} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                         <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <TrendingUp size={14} className="text-blue-500" /> Distribution
                         </h3>
                         <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={ratingDist} innerRadius={45} outerRadius={65} paddingAngle={8} dataKey="value" stroke="none">
                                        {ratingDist.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="grid grid-cols-2 gap-2 mt-4">
                            {ratingDist.map(d => (
                                <div key={d.name} className="flex flex-col p-2.5 rounded-xl bg-gray-50/50 border border-gray-50 hover:bg-white hover:border-blue-100 transition-all group">
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{d.name}</span>
                                    <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{d.value}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                
                <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
                        <Quote size={12} className="text-blue-500 rotate-180" /> Structural Sentiment Nodes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
                        {feedbacks.length > 0 ? feedbacks.map((f) => (
                            <div key={f.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {f.student_name[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-gray-900 tracking-tight leading-none">{f.student_name}</h4>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 truncate max-w-[100px]">{f.subject}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 mt-1">
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} size={10} fill={s <= f.rating ? "#3b82f6" : "none"} stroke={s <= f.rating ? "none" : "#f1f5f9"} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <p className="text-[10px] font-medium text-gray-500 italic leading-relaxed pl-3 border-l-2 border-blue-100 line-clamp-3">
                                            "{f.comment}"
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-3 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">{new Date(f.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                                    <button className="text-[9px] font-extrabold text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                                        Verify <CheckCircle size={10} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-16 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">No perspective data detected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureFeedbackView;
