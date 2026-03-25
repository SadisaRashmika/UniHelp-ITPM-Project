import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Star, User, BookOpen, MessageSquare, ShieldCheck, Sparkles, Trash2, Edit3, Clock, Plus, ArrowLeft, History, Lock, Unlock, Calendar } from 'lucide-react';

const StudentFeedbackForm = ({ studentId = 1 }) => {
    const [lecturers, setLecturers] = useState([]);
    const [mySubmissions, setMySubmissions] = useState([]);
    const [view, setView] = useState('list'); 
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        lecturer_id: '',
        subject: '',
        rating: 0,
        comment: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [submitting, setSubmitting] = useState(false);
    const [hover, setHover] = useState(0);

    const fetchData = async () => {
        try {
            const [lecturersRes, myFeedbackRes] = await Promise.all([
                axios.get('http://localhost:5000/api/user-feedback/users'),
                axios.get(`http://localhost:5000/api/user-feedback/feedback/student/${studentId}`)
            ]);
            setLecturers(lecturersRes.data.filter(u => u.role === 'lecturer'));
            setMySubmissions(myFeedbackRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            if (view === 'list') fetchData();
        }, 15000);
        return () => clearInterval(interval);
    }, [studentId, view]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/user-feedback/feedback/${editingId}`, formData);
                setStatus({ type: 'success', msg: 'Update Successful.' });
            } else {
                await axios.post('http://localhost:5000/api/user-feedback/feedback', {
                    ...formData,
                    student_id: studentId
                });
                setStatus({ type: 'success', msg: 'Injection Successful.' });
            }
            setFormData({ lecturer_id: '', subject: '', rating: 0, comment: '' });
            setEditingId(null);
            setView('list');
            fetchData();
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.error || 'Operation failed.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/user-feedback/feedback/${id}`);
            setStatus({ type: 'success', msg: 'Deletion Successful.' });
            fetchData();
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.error || 'Deletion failed.' });
        }
    };

    const startEdit = (fb) => {
        setEditingId(fb.id);
        setFormData({
            lecturer_id: fb.lecturer_id,
            subject: fb.subject,
            rating: fb.rating,
            comment: fb.comment
        });
        setView('form');
    };

    const getTimeRemaining = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffMins = (now - created) / 60000;
        const remaining = 10 - diffMins;
        return remaining > 0 ? Math.ceil(remaining) : 0;
    };

    if (view === 'form') {
        return (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                <button 
                    onClick={() => { setView('list'); setEditingId(null); setFormData({lecturer_id:'', subject:'', rating:0, comment:''}); }}
                    className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 hover:text-blue-500 transition-colors"
                >
                    <ArrowLeft size={12} /> Return to Index
                </button>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-blue-500">
                    <div className="bg-linear-to-br from-blue-500 to-indigo-700 p-5 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold tracking-tight">{editingId ? 'Modify Strategy' : 'New Feedback Node'}</h3>
                                <p className="text-blue-100 text-[9px] font-bold uppercase tracking-[0.2em] mt-1 opacity-80">Operational Submission Portal</p>
                            </div>
                            <Sparkles size={24} className="text-blue-200 opacity-30 animate-pulse" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Staff Identity</label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                                    <select 
                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all appearance-none cursor-pointer disabled:opacity-50"
                                        value={formData.lecturer_id}
                                        onChange={(e) => setFormData({...formData, lecturer_id: e.target.value})}
                                        required
                                        disabled={!!editingId}
                                    >
                                        <option value="">Select Target</option>
                                        {lecturers.map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Knowledge Module</label>
                                <div className="relative group">
                                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                                    <input 
                                        type="text"
                                        placeholder="e.g. System Control"
                                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all shadow-xs"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block text-center">Merit Quantification</label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({...formData, rating: star})}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="transform hover:scale-110 active:scale-90 transition-all"
                                    >
                                        <Star size={28} className={`transition-all duration-300 ${star <= (hover || formData.rating) ? 'text-blue-500 fill-blue-500 drop-shadow-sm' : 'text-gray-100'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Analytical Remarks</label>
                            <div className="relative group">
                                <MessageSquare className="absolute left-3.5 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                                <textarea 
                                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-medium text-gray-900 h-24 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all resize-none shadow-xs"
                                    placeholder="Execute deep-dive analysis..."
                                    value={formData.comment}
                                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => { setView('list'); setEditingId(null); setFormData({lecturer_id:'', subject:'', rating:0, comment:''}); }}
                                className="px-5 py-2.5 bg-gray-100 rounded-lg text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Decouple
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-2.5 bg-linear-to-br from-blue-500 to-indigo-700 rounded-lg text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-blue-50 hover:shadow-xl transition-all disabled:opacity-50"
                                disabled={submitting || !formData.rating}
                            >
                                {submitting ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> : <>{editingId ? 'Modify Node' : 'Initialize Transmission'}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
                
                <div className="relative z-10">
                    <h3 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <History size={18} className="text-blue-500" /> Perspective Archive
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-70">Synchronized Nodes: {mySubmissions.length}</p>
                </div>

                <button 
                    onClick={() => setView('form')}
                    className="relative z-10 px-5 py-2.5 bg-linear-to-br from-blue-500 to-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> Add Review
                </button>
            </div>

            {status.msg && (
                <div className={`p-2.5 rounded-lg text-[10px] font-bold text-center border-2 animate-pulse flex items-center justify-center gap-2 uppercase tracking-tighter ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    <ShieldCheck size={14} /> {status.msg}
                </div>
            )}

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
                {mySubmissions.map((fb) => {
                    const timeRemaining = getTimeRemaining(fb.created_at);
                    const isLocked = timeRemaining <= 0;

                    return (
                        <div key={fb.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs hover:shadow-md transition-all duration-300 group relative flex flex-col justify-between border-t-4 hover:-translate-y-1 
                            ${isLocked ? 'border-t-gray-50' : 'border-t-blue-500' }">
                            
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isLocked ? 'bg-gray-50 text-gray-200' : 'bg-blue-50 text-blue-500'}`}>
                                        <BookOpen size={18} />
                                    </div>
                                    
                                    {!isLocked ? (
                                        <div className="bg-blue-50/50 px-2 py-1 rounded-md border border-blue-50 flex items-center gap-1.5 animate-pulse">
                                            <Unlock size={10} className="text-blue-500" />
                                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">{timeRemaining}m Left</span>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100 opacity-60">
                                            <Lock size={10} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-0.5">
                                    <h4 className="text-[11px] font-bold text-gray-900 leading-none truncate tracking-tight">{fb.subject}</h4>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate italic">@{fb.lecturer_name}</p>
                                </div>

                                <div className="flex items-center gap-0.5 my-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < fb.rating ? "currentColor" : "none"} className={i < fb.rating ? "text-amber-400" : "text-gray-100"} />
                                    ))}
                                    <span className="text-[9px] font-bold text-gray-300 ml-1.5">{fb.rating.toFixed(1)}</span>
                                </div>

                                <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-50 group-hover:bg-white transition-colors">
                                    <p className="text-[10px] text-gray-500 leading-relaxed italic line-clamp-2">"{fb.comment}"</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-gray-300">
                                    <Calendar size={10} />
                                    <span className="text-[8px] font-bold uppercase tracking-widest">
                                        {new Date(fb.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                
                                <div className="flex gap-1.5">
                                    {!isLocked && (
                                        <>
                                            <button 
                                                onClick={() => startEdit(fb)}
                                                className="w-7 h-7 rounded-md bg-white border border-gray-100 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-xs flex items-center justify-center"
                                                title="Modify"
                                            >
                                                <Edit3 size={12} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(fb.id)}
                                                className="w-7 h-7 rounded-md bg-white border border-gray-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xs flex items-center justify-center"
                                                title="Abolish"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </>
                                    )}
                                    {isLocked && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-500 rounded border border-emerald-100">
                                            <ShieldCheck size={10} />
                                            <span className="text-[7px] font-black uppercase tracking-widest">Node Verified</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {mySubmissions.length === 0 && (
                <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <History size={40} className="text-gray-100 mb-4" />
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center">Knowledge Archive Offline</p>
                    <button 
                        onClick={() => setView('form')}
                        className="mt-6 px-8 py-2.5 bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-50"
                    >
                        Initialize Entry
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentFeedbackForm;
