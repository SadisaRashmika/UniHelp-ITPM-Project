import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Star, 
    MessageCircle, 
    Calendar, 
    Filter, 
    Search,
    ChevronRight,
    User,
    BookOpen,
    Inbox,
    Quote,
    ShieldCheck
} from 'lucide-react';

const LectureFeedbackView = ({ lecturerId = 1 }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState(null);

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

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesFilter = filter === 'all' || 
            (filter === 'excellent' && f.rating === 5) ||
            (filter === 'critical' && f.rating <= 3);
        const matchesSearch = f.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.comment.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <Inbox size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Feedback Inbox</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Direct student commentary channel</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input 
                            type="text" 
                            placeholder="Search feedback..."
                            className="pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50/50 transition-all w-48"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest outline-none focus:bg-white transition-all cursor-pointer"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Logs</option>
                        <option value="excellent">Excellent Only</option>
                        <option value="critical">Critical Only</option>
                    </select>
                </div>
            </div>

            
            <div className="grid grid-cols-1 gap-3">
                {filteredFeedbacks.length > 0 ? filteredFeedbacks.map((f) => (
                    <div 
                        key={f.id} 
                        onClick={() => setSelectedFeedback(f)}
                        className="bg-white rounded-xl border border-gray-100 p-3 shadow-xs hover:shadow-md hover:border-blue-100 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.995]"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                            
                            <div className="flex items-center gap-3 lg:w-1/5 shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shadow-sm group-hover:scale-105 transition-transform">
                                    {f.student_name[0]}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-[10px] font-black text-gray-900 tracking-tight leading-none truncate uppercase">{f.student_name}</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        <BookOpen size={8} className="text-gray-300" />
                                        <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-widest truncate">{f.subject}</span>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={9} fill={s <= f.rating ? "#3b82f6" : "none"} stroke={s <= f.rating ? "none" : "#f1f5f9"} />
                                    ))}
                                    <span className={`text-[8px] font-black ml-1.5 uppercase tracking-tighter ${f.rating >= 4 ? 'text-emerald-500' : f.rating <= 2 ? 'text-rose-500' : 'text-blue-500'}`}>
                                        {f.rating.toFixed(1)}
                                    </span>
                                </div>
                                <p className="text-[10.5px] text-gray-500 font-medium italic leading-tight truncate">
                                    "{f.comment}"
                                </p>
                            </div>

                            
                            <div className="lg:w-1/6 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-1 shrink-0">
                                <div className="flex items-center gap-1 text-gray-300">
                                    <Calendar size={9} />
                                    <span className="text-[7.5px] font-black uppercase tracking-widest">
                                        {new Date(f.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="p-1 bg-gray-50 text-gray-400 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs group-hover:translate-x-0.5 transition-transform">
                                    <ChevronRight size={12} />
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center">
                        <Inbox size={40} className="text-gray-100 mb-4" />
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic text-center">No matching feedback nodes found in archive</p>
                    </div>
                )}
            </div>

            {selectedFeedback && (
                <div 
                    onClick={() => setSelectedFeedback(null)}
                    className="fixed inset-0 bg-gray-900/55 backdrop-blur-sm flex items-center justify-center z-[100] p-6"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl w-full max-w-xl shadow-xl overflow-hidden border border-gray-100"
                    >
                        <div className="bg-blue-50/80 border-b border-blue-100 p-8 text-slate-900 relative">
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl font-bold border border-blue-100 shadow-sm text-blue-600">
                                        {selectedFeedback.student_name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-tight text-gray-900">{selectedFeedback.student_name}</h3>
                                        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mt-1 opacity-80 flex items-center gap-2">
                                            <BookOpen size={12} /> {selectedFeedback.subject}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-4 py-4 px-6 bg-white rounded-2xl border border-blue-100 shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</span>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} size={14} fill={s <= selectedFeedback.rating ? "#2563eb" : "none"} stroke={s <= selectedFeedback.rating ? "none" : "#e5e7eb"} className={s <= selectedFeedback.rating ? 'text-blue-600' : 'text-gray-200'} />
                                            ))}
                                            <span className="text-lg font-bold text-gray-900 ml-2 mt-0.5">{selectedFeedback.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block h-10 w-px bg-gray-100 mx-4" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</span>
                                        <span className="text-xs font-bold tracking-widest uppercase flex items-center gap-2 text-gray-700">
                                            {new Date(selectedFeedback.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedFeedback(null)} 
                                className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center transition-colors text-2xl font-light border border-gray-100 z-50 text-gray-500"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-10 bg-white">
                            <div className="relative">
                                <Quote size={40} className="text-blue-100 absolute -top-4 -left-6 -z-10" />
                                <p className="text-sm font-semibold text-gray-700 leading-relaxed italic">
                                    "{selectedFeedback.comment}"
                                </p>
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verified Academic Entity</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedFeedback(null)}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                                >
                                    Acknowledge
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureFeedbackView;
