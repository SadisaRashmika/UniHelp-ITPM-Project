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
    ChevronRight,
    Eye,
    MessageSquare,
    ArrowLeft,
    Zap
} from 'lucide-react';

const StudentTicketForm = ({ studentId = 1, onTicketSubmitted }) => {
    const [tickets, setTickets] = useState([]);
    const [view, setView] = useState('list'); 
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [chats, setChats] = useState([]);
    const [chatMessage, setChatMessage] = useState('');
    const [sendingChat, setSendingChat] = useState(false);
    
    const [lecturers, setLecturers] = useState([]);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        category: 'Technical Support',
        contact_number: '',
        lecturer_id: ''
    });
    const [screenshot, setScreenshot] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [status, setStatus] = useState({ type: '', msg: '' });

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

    const fetchLecturers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user-feedback/users');
            setLecturers(res.data.filter(u => u.role === 'Lecturer'));
        } catch (err) {
            console.error('Error fetching lecturers:', err);
        }
    };

    const fetchChats = async (ticketId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user-feedback/tickets/${ticketId}/chats`);
            setChats(res.data);
        } catch (err) {
            console.error('Error fetching chats:', err);
        }
    };

    useEffect(() => {
        if (selectedTicket) {
            fetchChats(selectedTicket.id);
            const interval = setInterval(() => fetchChats(selectedTicket.id), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedTicket]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim() || !selectedTicket) return;

        setSendingChat(true);
        try {
            await axios.post(`http://localhost:5000/api/user-feedback/tickets/${selectedTicket.id}/chats`, {
                sender_id: studentId,
                sender_role: 'student',
                message: chatMessage
            });
            setChatMessage('');
            fetchChats(selectedTicket.id);
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSendingChat(false);
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchLecturers();
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
        data.append('contact_number', formData.contact_number);
        if (formData.lecturer_id) {
            data.append('lecturer_id', formData.lecturer_id);
        }
        if (screenshot) {
            data.append('screenshot', screenshot);
        }

        try {
            await axios.post('http://localhost:5000/api/user-feedback/tickets', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ type: 'success', msg: 'Inquiry submitted successfully!' });
            setFormData({ subject: '', description: '', category: 'Technical Support', contact_number: '', lecturer_id: '' });
            setScreenshot(null);
            setPreviewUrl(null);
            setView('list');
            fetchTickets();
            if (onTicketSubmitted) onTicketSubmitted();
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
            case 'closed': return 'bg-emerald-500';
            default: return 'bg-gray-400';
        }
    };

    if (view === 'create') {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Plus size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold tracking-tight text-gray-900 leading-none">Open Inquiry</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Submit a support or academic request</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setView('list')}
                        className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Subject / Header</label>
                            <input 
                                type="text"
                                placeholder="Brief subject of inquiry"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Inquiry Category</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all appearance-none cursor-pointer"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option>Technical Support</option>
                                <option>Academic Assistance</option>
                                <option>Examination & Results</option>
                                <option>System Access (Login)</option>
                                <option>Other / General</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                            <input 
                                type="tel"
                                placeholder="07XXXXXXXX"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all font-mono"
                                value={formData.contact_number}
                                onChange={(e) => setFormData({...formData, contact_number: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                                required
                            />
                        </div>
                        <div className="space-y-1.5 relative">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Direct to Lecturer</label>
                            <select 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all appearance-none cursor-pointer"
                                value={formData.lecturer_id}
                                onChange={(e) => setFormData({...formData, lecturer_id: e.target.value})}
                                required
                            >
                                <option value="">Select Target Lecturer</option>
                                {lecturers.map(l => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
                        <textarea 
                            placeholder="Describe your technical or academic issue in detail..."
                            rows="3"
                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                        <div className="relative group/file">
                            <input 
                                type="file" 
                                id="ticket-screenshot" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <label 
                                htmlFor="ticket-screenshot"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-[10px] font-black text-gray-500 hover:text-blue-600 rounded-xl cursor-pointer border border-dashed border-gray-200 hover:border-blue-200 transition-all"
                            >
                                <Zap size={14} />
                                {screenshot ? screenshot.name : 'Attach Diagnostic Image'}
                            </label>
                        </div>
                        {previewUrl && (
                            <div className="relative group">
                                <img src={previewUrl} alt="Preview" className="h-10 w-10 rounded-lg object-cover border border-gray-200 shadow-sm" />
                                <button 
                                    type="button"
                                    onClick={() => {setScreenshot(null); setPreviewUrl(null);}}
                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Plus size={10} className="rotate-45" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                            <button 
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {submitting ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={16} />
                                    Transmit Inquiry
                                </>
                            )}
                        </button>
                    </div>
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
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                    <Plus size={14} /> Open Inquiry
                </button>
            </div>

            {status.msg && (
                <div className={`p-3 rounded-lg text-[10px] font-bold text-center border flex items-center justify-center gap-2 uppercase tracking-tight
                    ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {status.msg}
                </div>
            )}

            {loading ? (
                <div className="p-20 text-center text-[10px] font-bold text-blue-500 uppercase tracking-widest italic opacity-50">Synchronizing Ticket Archives...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-xs hover:shadow-md transition-all group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-20 h-20 opacity-5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:scale-150 ${getStatusColor(ticket.status)}`} />
                            
                            <div className="relative z-10 lg:flex items-center gap-4">
                                <div className="lg:w-8/12 flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0 ${getStatusColor(ticket.status)}`}>
                                        <AlertCircle size={14} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest text-nowrap">TKT-{ticket.id.toString().padStart(4, '0')}</span>
                                            <div className="w-0.5 h-0.5 bg-gray-100 rounded-full" />
                                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest text-nowrap bg-blue-50/50 px-1.5 py-0.5 rounded leading-none border border-blue-100/20">
                                                {ticket.category.split(' ')[0]}
                                            </span>
                                            <div className="w-0.5 h-0.5 bg-gray-100 rounded-full" />
                                            <h4 className="text-[10px] font-black text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors uppercase truncate">{ticket.subject}</h4>
                                        </div>
                                        <p className="text-[9px] text-gray-400 font-medium line-clamp-1 opacity-70 italic leading-none">"{ticket.description}"</p>
                                    </div>
                                </div>

                                <div className="hidden lg:flex flex-1 items-center justify-center">
                                    <div className={`px-2 py-0.5 rounded-md border flex items-center gap-1.5
                                        ${ticket.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100/30' : 
                                          ticket.status === 'in-review' ? 'bg-blue-50 text-blue-600 border-blue-100/30' : 
                                          'bg-emerald-50 text-emerald-600 border-emerald-100/30'}`}>
                                        <div className={`w-1 h-1 rounded-full animate-pulse ${getStatusColor(ticket.status)}`} />
                                        <span className="text-[8px] font-black uppercase tracking-widest">{ticket.status}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 lg:w-3/12 mt-3 lg:mt-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                                    <div className="flex flex-col items-end mr-1">
                                        <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none">Logged</span>
                                        <span className="text-[8px] font-bold text-gray-400 mt-0.5">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {ticket.screenshot_url && (
                                            <a 
                                                href={`http://localhost:5000${ticket.screenshot_url}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="relative w-10 h-7 rounded-md overflow-hidden border border-gray-200 hover:border-blue-400 hover:ring-4 hover:ring-blue-50 transition-all shrink-0 group/img shadow-xs"
                                                title="View Submitted Evidence"
                                            >
                                                <img 
                                                    src={`http://localhost:5000${ticket.screenshot_url}`} 
                                                    alt="Evidence" 
                                                    className="w-full h-full object-cover group-hover/img:scale-125 transition-transform"
                                                />
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
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/55 backdrop-blur-sm text-left">
                            <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl overflow-hidden border border-white/20">
                            {/* Header */}
                            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg ${getStatusColor(selectedTicket.status)}`}>
                                        <AlertCircle size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Inquiry Overview</h4>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">REF-{selectedTicket.id.toString().padStart(4, '0')}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedTicket(null)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Body Split View */}
                            <div className="flex h-[550px] overflow-hidden">
                                {/* Left: Details */}
                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-5 border-r border-gray-100 bg-white">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-widest border border-blue-100/50">
                                            {selectedTicket.category}
                                        </span>
                                        <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-tighter">
                                            <Clock size={10} /> {new Date(selectedTicket.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Contact Number</span>
                                            <span className="text-[10px] font-mono font-bold text-gray-700">{selectedTicket.contact_number || 'N/A'}</span>
                                        </div>
                                        <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Current Status</span>
                                            <span className={`text-[8px] font-black uppercase text-white px-2.5 py-0.5 rounded shadow-xs ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-base font-black text-gray-900 tracking-tight leading-tight uppercase border-l-4 border-blue-500 pl-4">{selectedTicket.subject}</h3>
                                        <div className="bg-gray-50/30 rounded-2xl p-5 border border-gray-100 shadow-inner">
                                            <p className="text-[11px] text-gray-600 leading-relaxed font-semibold italic whitespace-pre-wrap">
                                                "{selectedTicket.description}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Evidence Area */}
                                    {selectedTicket.screenshot_url && (
                                        <div className="mt-6 pt-6 border-t border-gray-50">
                                            <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <ImageIcon size={12} className="text-blue-500" /> Evidence Capture Archive
                                            </h5>
                                            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 group cursor-zoom-in relative">
                                                <img 
                                                    src={`http://localhost:5000${selectedTicket.screenshot_url}`} 
                                                    alt="Evidence" 
                                                    className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onClick={() => window.open(`http://localhost:5000${selectedTicket.screenshot_url}`, '_blank')}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white gap-1" onClick={() => window.open(`http://localhost:5000${selectedTicket.screenshot_url}`, '_blank')}>
                                                    <Eye size={20} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest mt-1">Enlarge Node</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="pt-6 border-t border-gray-50 space-y-4">
                                        <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">System Processing Trajectory</h5>
                                        <div className="relative pt-1">
                                            <div className="flex mb-3 items-center justify-between px-3">
                                                {['Log', 'Review', 'Closed'].map((label, i) => (
                                                    <div key={label} className="text-center">
                                                        <span className={`text-[8px] font-black uppercase tracking-widest inline-block py-1.5 px-3 rounded-lg shadow-sm ${getStatusStep(selectedTicket.status) > i ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-gray-300 bg-gray-50 border border-gray-100'}`}>
                                                            {label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="overflow-hidden h-2.5 mb-4 flex rounded-full bg-gray-100 shadow-inner">
                                                <div 
                                                    style={{ width: `${(getStatusStep(selectedTicket.status) / 3) * 100}%` }}
                                                    className={`shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${getStatusColor(selectedTicket.status)}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Chat */}
                                <div className="w-[400px] flex flex-col bg-gray-50/50">
                                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5 bg-white">
                                        <MessageSquare size={14} className="text-blue-500" />
                                        <h5 className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Communication History</h5>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gray-50/30">
                                        {chats.map((chat) => (
                                            <div key={chat.id} className={`flex ${chat.sender_role === 'student' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[10px] shadow-sm
                                                    ${chat.sender_role === 'student' 
                                                        ? 'bg-blue-600 text-white rounded-br-none border border-blue-700' 
                                                        : chat.sender_role === 'system'
                                                            ? 'bg-amber-50 text-amber-900 italic text-center w-full mx-auto font-black uppercase tracking-tighter border border-amber-100'
                                                            : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                                                    }`}>
                                                    <p className="leading-relaxed font-bold">{chat.message}</p>
                                                    <p className={`text-[7px] mt-1.5 font-black uppercase opacity-60 ${chat.sender_role === 'student' ? 'text-right' : 'text-left'}`}>
                                                        {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {selectedTicket.status === 'resolved' ? (
                                        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center space-y-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                <CheckCircle2 size={12} /> Inquiry Closed
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">This communication channel is archived. <br/> Further assistance requires a new protocol.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
                                            <div className="relative flex items-center gap-2">
                                                <input 
                                                    type="text"
                                                    value={chatMessage}
                                                    onChange={(e) => setChatMessage(e.target.value)}
                                                    placeholder="Transmit response node..."
                                                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all"
                                                />
                                                <button 
                                                    type="submit"
                                                    disabled={sendingChat || !chatMessage.trim()}
                                                    className="shrink-0 p-3 bg-blue-600 text-white rounded-2xl hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {selectedTicket.status !== 'resolved' && (
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await axios.patch(`http://localhost:5000/api/user-feedback/tickets/${selectedTicket.id}`, { status: 'resolved' });
                                                    setSelectedTicket(prev => ({ ...prev, status: 'resolved' }));
                                                    fetchTickets();
                                                } catch (err) {
                                                    console.error('Error closing ticket:', err);
                                                }
                                            }}
                                            className="px-4 py-2.5 bg-white text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm flex items-center gap-2 active:scale-95"
                                        >
                                            <CheckCircle2 size={12} /> Close Inquiry
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setSelectedTicket(null)}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-black transition-all shadow-2xl active:scale-95 border border-white/10"
                                >
                                    Close Overview
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
