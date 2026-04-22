import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ChevronRight, GraduationCap, Calendar, 
  Layers, Search, Loader2, Globe, Clock, ArrowRight,
  Filter, Grid, List as ListIcon, X
} from 'lucide-react';
import axios from 'axios';

const API_BASE = "http://localhost:5000/api/academic-ticket";

const ModuleBrowser = ({ onModuleSelect }) => {
    const [faculties, setFaculties] = useState([]);
    const [intakes, setIntakes] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [modules, setModules] = useState([]);
    
    const [selection, setSelection] = useState({
        faculty_id: '',
        intake_id: '',
        semester_id: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(true);

    // Initial load of faculties
    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const res = await axios.get(`${API_BASE}/quiz-structure/faculties`);
                setFaculties(res.data.data);
            } catch (err) {
                console.error("Error fetching faculties:", err);
            }
        };
        fetchFaculties();
    }, []);

    // Cascade: Faculty -> Intakes
    useEffect(() => {
        if (!selection.faculty_id) {
            setIntakes([]);
            setSelection(prev => ({ ...prev, intake_id: '', semester_id: '' }));
            return;
        }
        const fetchIntakes = async () => {
            try {
                const res = await axios.get(`${API_BASE}/quiz-structure/faculty/${selection.faculty_id}/intakes`);
                setIntakes(res.data.data);
                setSelection(prev => ({ ...prev, intake_id: '', semester_id: '' }));
            } catch (err) {
                console.error("Error fetching intakes:", err);
            }
        };
        fetchIntakes();
    }, [selection.faculty_id]);

    // Cascade: Intake -> Semesters
    useEffect(() => {
        if (!selection.intake_id) {
            setSemesters([]);
            setSelection(prev => ({ ...prev, semester_id: '' }));
            return;
        }
        const fetchSemesters = async () => {
            try {
                const res = await axios.get(`${API_BASE}/quiz-structure/faculty/${selection.faculty_id}/intake/${selection.intake_id}/semesters`);
                setSemesters(res.data.data);
                setSelection(prev => ({ ...prev, semester_id: '' }));
            } catch (err) {
                console.error("Error fetching semesters:", err);
            }
        };
        fetchSemesters();
    }, [selection.intake_id, selection.faculty_id]);

    // Fetch Modules when Semester is selected
    useEffect(() => {
        if (selection.semester_id) {
            fetchModules();
        } else {
            setModules([]);
        }
    }, [selection.semester_id, selection.intake_id, selection.faculty_id]);

    const fetchModules = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/quiz-structure/faculty/${selection.faculty_id}/intake/${selection.intake_id}/semester/${selection.semester_id}/modules`);
            setModules(res.data.data);
        } catch (err) {
            console.error("Error fetching modules:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HIERARCHY SELECTORS */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                    <Globe size={120} />
                </div>
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Layers className="text-indigo-600" size={24} />
                            Course Explorer
                        </h2>
                        <p className="text-slate-500 font-bold text-sm mt-1">Navigate through university hierarchy</p>
                    </div>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                    >
                        {showFilters ? <X size={20} /> : <Filter size={20} />}
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <GraduationCap size={12} /> Faculty
                            </label>
                            <select 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none"
                                value={selection.faculty_id}
                                onChange={e => setSelection({...selection, faculty_id: e.target.value})}
                            >
                                <option value="">Select Faculty</option>
                                {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Calendar size={12} /> Intake Year
                            </label>
                            <select 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none disabled:opacity-50"
                                value={selection.intake_id}
                                disabled={!selection.faculty_id}
                                onChange={e => setSelection({...selection, intake_id: e.target.value})}
                            >
                                <option value="">Select Intake</option>
                                {intakes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Clock size={12} /> Semester
                            </label>
                            <select 
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none disabled:opacity-50"
                                value={selection.semester_id}
                                disabled={!selection.intake_id}
                                onChange={e => setSelection({...selection, semester_id: e.target.value})}
                            >
                                <option value="">Select Semester</option>
                                {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* MODULES LIST */}
            <div>
                <div className="flex items-center justify-between mb-6 px-4">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Available Modules</h3>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Grid size={18} className="cursor-pointer hover:text-indigo-600 transition-colors" />
                        <ListIcon size={18} className="cursor-pointer hover:text-indigo-600 transition-colors" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                    </div>
                ) : !selection.semester_id ? (
                    <div className="bg-white rounded-[32px] p-20 text-center border-2 border-dashed border-slate-100">
                        <Filter size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold text-lg">Please select a structure to view modules.</p>
                    </div>
                ) : modules.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-20 text-center border-2 border-dashed border-slate-100">
                        <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold text-lg">No modules found for this selection.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.map(module => (
                            <div 
                                key={module.id} 
                                onClick={() => onModuleSelect(module)}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 -mr-8 -mt-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <BookOpen size={24} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                        {module.code}
                                    </span>
                                </div>
                                
                                <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors relative z-10">
                                    {module.name}
                                </h4>
                                <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                                    Access course materials, quizzes, and assignments for this module.
                                </p>
                                
                                <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all relative z-10">
                                    Open Module <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModuleBrowser;
