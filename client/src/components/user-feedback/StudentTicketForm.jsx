import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Send, 
    Image as ImageIcon, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Search, 
    Plus, 
    X, 
    FileText,
    Loader2,
    ChevronRight
} from 'lucide-react';

const StudentTicketForm = ({ studentId = 1 }) => {
    const [tickets, setTickets] = useState([]);
    const [view, setView] = useState('list'); 
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        category: 'Technical Support'
    });
    const [screenshot, setScreenshot] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user-feedback/tickets/student/${studentId}`);
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [studentId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const data = new FormData();
        data.append('student_id', studentId);
        data.append('subject', formData.subject);
        data.append('description', formData.description);
        data.append('category', formData.category);
        if (screenshot) {
            data.append('screenshot', screenshot);
        }

        try {
            await axios.post('http://localhost:5000/api/user-feedback/tickets', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ type: 'success', msg: 'Inquiry submitted successfully!' });
            setFormData({ subject: '', description: '', category: 'Technical Support' });
            setScreenshot(null);
            setPreviewUrl(null);
            setView('list');
            fetchTickets();
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to submit inquiry.' });
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStep = (status) => {
        switch (status) {
            case 'pending': return 1;
            case 'in-review': return 2;
            case 'resolved': return 3;
            default: return 1;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-500';
            case 'in-review': return 'bg-blue-500';
            case 'resolved': return 'bg-emerald-500';
            default: return 'bg-gray-400';
        }
    };

    if (view === 'create') {
        return (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Open New Inquiry</h3>
                        <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest leading-none opacity-60">Technical & Academic Support Hub</p>
                    </div>
                    <button 
                        onClick={() => setView('list')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Inquiry Category</label>
                                <select 
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all appearance-none cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option>Technical Support</option>
                                    <option>Academic Assistance</option>
                                    <option>Examination & Results</option>
                                    <option>System Access (Login)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Inquiry Subject</label>
                                <input 
                                    type="text"
                                    placeholder="Summarize your issue..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
                            <div className="relative">
                                <textarea 
                                    placeholder="Explain the technical or academic roadblock in detail..."
                                    className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl text-xs font-medium text-gray-900 h-48 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                                <div className="absolute bottom-4 right-4 text-gray-300 pointer-events-none">
                                    <FileText size={24} opacity={0.15} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Visual Evidence (Screenshot)</label>
                            <div className="flex gap-4">
                                <label className="flex-1 cursor-pointer">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    <div className="w-full px-4 py-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:bg-blue-50 hover:border-blue-200 transition-all">
                                        <ImageIcon size={14} /> {screenshot ? screenshot.name : 'Select Screenshot'}
                                    </div>
                                </label>
                                {previewUrl && (
                                    <div className="relative w-12 h-12">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl border border-gray-100 shadow-sm" />
                                        <button 
                                            onClick={() => { setScreenshot(null); setPreviewUrl(null); }}
                                            className="absolute -top-2 -right-2 p-1 bg-white border border-gray-100 rounded-full text-rose-500 shadow-sm"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full py-4 bg-linear-to-br from-blue-500 to-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {submitting ? 'Executing Transmission...' : 'Deploy Inquiry Node'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-none">Support Lifecycle</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">Active Structural Nodes: {tickets.length}</p>
                </div>
                <button 
                    onClick={() => setView('create')}
                    className="px-6 py-2.5 bg-linear-to-br from-blue-500 to-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-blue-50 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus size={14} /> Open Inquiry
                </button>
            </div>

            {status.msg && (
                <div className={`p-3 rounded-lg text-[10px] font-bold text-center border animate-pulse flex items-center justify-center gap-2 uppercase tracking-tight
                    ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {status.msg}
                </div>
            )}

            {loading ? (
                <div className="p-20 text-center animate-pulse text-[10px] font-bold text-blue-500 uppercase tracking-widest italic opacity-50">Synchronizing Ticket Archives...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition-all group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full blur-3xl -mr-12 -mt-12 transition-all duration-500 group-hover:scale-150 ${getStatusColor(ticket.status)}`} />
                            
                            <div className="relative z-10 lg:flex items-center gap-6">
                                <div className="lg:w-2/5 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ${getStatusColor(ticket.status)}`}>
                                        <AlertCircle size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest text-nowrap">TKT-{ticket.id.toString().padStart(4, '0')}</span>
                                            <div className="w-1 h-1 bg-gray-100 rounded-full" />
                                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest text-nowrap bg-blue-50/50 px-2 py-0.5 rounded leading-none border border-blue-100/20">
                                                {ticket.category.split(' ')[0]}
                                            </span>
                                            <div className="w-1 h-1 bg-gray-100 rounded-full" />
                                            <h4 className="text-[11px] font-black text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors uppercase truncate">{ticket.subject}</h4>
                                        </div>
                                        <p className="text-[9px] text-gray-400 font-medium mt-1.5 italic line-clamp-1 opacity-70">"{ticket.description}"</p>
                                    </div>
                                </div>

                                <div className="hidden lg:flex flex-1 items-center justify-center">
                                    <div className={`px-3 py-1 rounded-lg border flex items-center gap-2
                                        ${ticket.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100/30' : 
                                          ticket.status === 'in-review' ? 'bg-blue-50 text-blue-600 border-blue-100/30' : 
                                          'bg-emerald-50 text-emerald-600 border-emerald-100/30'}`}>
                                        <div className={`w-1 h-1 rounded-full animate-pulse ${getStatusColor(ticket.status)}`} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{ticket.status}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 lg:w-1/4 mt-4 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                                    <div className="flex flex-col items-end mr-2">
                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Logged</span>
                                        <span className="text-[9px] font-bold text-gray-500 mt-1">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {ticket.screenshot_url && (
                                            <a 
                                                href={`http://localhost:5000${ticket.screenshot_url}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all border border-gray-100 shadow-sm"
                                            >
                                                <ImageIcon size={12} />
                                            </a>
                                        )}
                                        <button 
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all border border-blue-100/50 shadow-sm"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {selectedTicket && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${getStatusColor(selectedTicket.status)}`}>
                                            <AlertCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Inquiry Details</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">TKT-{selectedTicket.id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedTicket(null)}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100/50">
                                                {selectedTicket.category}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase">
                                                <Clock size={12} /> {new Date(selectedTicket.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight leading-tight uppercase">{selectedTicket.subject}</h3>
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                            <p className="text-xs text-gray-600 leading-relaxed font-medium italic whitespace-pre-wrap">
                                                "{selectedTicket.description}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Structural Progress Bar</h5>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                {['Deployment', 'Diagnostic', 'Resolved'].map((label, i) => (
                                                    <div key={label} className="text-center">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest inline-block py-1 px-2 rounded-full ${getStatusStep(selectedTicket.status) > i ? 'text-blue-600 bg-blue-50' : 'text-gray-300 bg-gray-50'}`}>
                                                            {label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100 shadow-inner">
                                                <div 
                                                    style={{ width: `${(getStatusStep(selectedTicket.status) / 3) * 100}%` }}
                                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${getStatusColor(selectedTicket.status)}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {selectedTicket.screenshot_url && (
                                        <div className="space-y-4">
                                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visual Evidence Archive</h5>
                                            <div className="rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 group cursor-zoom-in">
                                                <img 
                                                    src={`http://localhost:5000${selectedTicket.screenshot_url}`} 
                                                    alt="Evidence" 
                                                    className="w-full h-auto max-h-96 object-contain transition-transform duration-500 group-hover:scale-105"
                                                    onClick={() => window.open(`http://localhost:5000${selectedTicket.screenshot_url}`, '_blank')}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                                    <button 
                                        onClick={() => setSelectedTicket(null)}
                                        className="px-8 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
                                    >
                                        Synchronize & Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {tickets.length === 0 && (
                        <div className="p-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200 mb-6 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <AlertCircle size={32} />
                            </div>
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">No Active Inquiries</h4>
                            <p className="text-[11px] text-gray-300 font-medium italic">Mission state is clear. Direct technical support is not required at this time.</p>
                            <button 
                                onClick={() => setView('create')}
                                className="mt-8 px-8 py-3 bg-linear-to-br from-blue-500 to-indigo-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-blue-50"
                            >
                                Submit First Ticket
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentTicketForm;
