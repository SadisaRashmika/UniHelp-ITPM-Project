import React, { useState, useEffect } from 'react';
import { 
  FileText, BookOpen, Bell, Send, ChevronLeft, 
  Clock, Calendar, Award, MessageSquare, Download,
  ExternalLink, Play, CheckCircle, AlertCircle, Plus
} from 'lucide-react';
import axios from 'axios';

const API_BASE = "http://localhost:5000/api/academic-ticket";

const ModuleDetail = ({ module, onBack, role = 'student' }) => {
    const [activeTab, setActiveTab] = useState('resources');
    const [content, setContent] = useState({
        quizzes: [],
        practicals: [],
        notices: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchModuleContent = async () => {
            try {
                setLoading(true);
                const [qRes, pRes, nRes] = await Promise.all([
                    axios.get(`${API_BASE}/quizzes`, { params: { module_id: module.id, type: 'quiz' } }),
                    axios.get(`${API_BASE}/quizzes`, { params: { module_id: module.id, type: 'practical' } }),
                    axios.get(`${API_BASE}/quiz-structure/modules/${module.id}/notices`)
                ]);
                setContent({
                    quizzes: qRes.data.data || [],
                    practicals: pRes.data.data || [],
                    notices: nRes.data.data || []
                });
            } catch (err) {
                console.error("Error fetching module content:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchModuleContent();
    }, [module.id]);

    const tabs = [
        { id: 'resources', label: 'Resources', icon: FileText },
        { id: 'quizzes', label: 'Quizzes', icon: BookOpen },
        { id: 'practicals', label: 'Assignments', icon: Send },
        { id: 'notices', label: 'Notices', icon: Bell }
    ];

    return (
        <div className="animate-in slide-in-from-right-4 duration-500">
            {/* HEADER */}
            <div className="mb-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm mb-6 transition-all group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Module Explorer
                </button>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {module.code}
                            </span>
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} /> 2026 Intake
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{module.name}</h1>
                    </div>
                    
                    {role === 'lecturer' && (
                        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-2">
                            <Plus size={20} /> Create Content
                        </button>
                    )}
                </div>
            </div>

            {/* TABS */}
            <div className="flex flex-wrap gap-2 mb-10 bg-slate-50/50 p-2 rounded-[24px] w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                            activeTab === tab.id
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activeTab === 'resources' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ResourceCard title="Lecture 01: Introduction" type="pdf" date="Oct 12, 2025" />
                                <ResourceCard title="Database Design Patterns" type="video" date="Oct 15, 2025" />
                                <ResourceCard title="Module Syllabus" type="doc" date="Oct 10, 2025" />
                            </div>
                        )}

                        {activeTab === 'quizzes' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {content.quizzes.map(q => (
                                    <AssessmentCard key={q.id} assessment={q} type="quiz" />
                                ))}
                                {content.quizzes.length === 0 && <EmptyState icon={BookOpen} text="No quizzes available for this module." />}
                            </div>
                        )}

                        {activeTab === 'practicals' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {content.practicals.map(p => (
                                    <AssessmentCard key={p.id} assessment={p} type="practical" />
                                ))}
                                {content.practicals.length === 0 && <EmptyState icon={Send} text="No assignments available for this module." />}
                            </div>
                        )}

                        {activeTab === 'notices' && (
                            <div className="space-y-6 max-w-3xl">
                                {content.notices.map(notice => (
                                    <div key={notice.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-xl font-black text-slate-900">{notice.title}</h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                                {new Date(notice.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed font-medium">
                                            {notice.content}
                                        </p>
                                    </div>
                                ))}
                                {content.notices.length === 0 && <EmptyState icon={Bell} text="No notices published for this module." />}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ResourceCard = ({ title, type, date }) => {
    const icons = {
        pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
        video: { icon: Play, color: 'text-blue-500', bg: 'bg-blue-50' },
        doc: { icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' }
    };
    const { icon: Icon, color, bg } = icons[type] || icons.pdf;

    return (
        <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h5 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h5>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Uploaded {date}</p>
                </div>
            </div>
            <button className="p-3 text-slate-300 hover:text-blue-600 transition-colors">
                <Download size={20} />
            </button>
        </div>
    );
};

const AssessmentCard = ({ assessment, type }) => (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 ${type === 'quiz' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'} rounded-2xl`}>
                {type === 'quiz' ? <BookOpen size={24} /> : <Send size={24} />}
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                assessment.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
            }`}>
                {assessment.priority || 'medium'}
            </span>
        </div>
        <h4 className="text-xl font-black text-slate-900 mb-2">{assessment.title}</h4>
        <p className="text-slate-500 text-sm mb-8 line-clamp-2">{assessment.description}</p>
        
        <div className="flex items-center justify-between border-t border-slate-50 pt-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Calendar size={14} /> Due {new Date(assessment.due_date).toLocaleDateString()}
            </div>
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-blue-600 transition-all shadow-lg shadow-slate-100">
                {type === 'quiz' ? 'Take Quiz' : 'Submit Now'}
            </button>
        </div>
    </div>
);

const EmptyState = ({ icon: Icon, text }) => (
    <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100">
        <Icon size={48} className="mx-auto text-slate-200 mb-4" />
        <p className="text-slate-400 font-bold">{text}</p>
    </div>
);

export default ModuleDetail;
