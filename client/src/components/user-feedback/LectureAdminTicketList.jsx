import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Search, 
    ExternalLink, 
    MessageSquare, 
    User, 
    Filter,
    MoreVertical,
    Eye,
    RefreshCcw,
    FileText,
    X,
    Send as SendIcon
} from 'lucide-react';

const LectureAdminTicketList = ({ lecturerId = 1 }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [chats, setChats] = useState([]);
    const [chatMessage, setChatMessage] = useState('');
    const [sendingChat, setSendingChat] = useState(false);

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

    const fetchTickets = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user-feedback/tickets');
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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

    useEffect(() => {
        fetchTickets();
        const interval = setInterval(fetchTickets, 30000);

        const handleClickOutside = () => setMenuOpenId(null);
        window.addEventListener('click', handleClickOutside);

        return () => {
            clearInterval(interval);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim() || !selectedTicket) return;

        setSendingChat(true);
        try {
            await axios.post(`http://localhost:5000/api/user-feedback/tickets/${selectedTicket.id}/chats`, {
                sender_id: lecturerId,
                sender_role: 'lecturer',
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

    const handleStatusUpdate = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await axios.patch(`http://localhost:5000/api/user-feedback/tickets/${id}`, { status: newStatus });
            fetchTickets();
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesFilter = filter === 'all' || t.status === filter || t.category === filter;
        const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.student_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'in-review': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between group hover:border-amber-200 transition-all">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pending Intake</p>
                        <h4 className="text-xl font-black text-gray-900 leading-none mt-1.5">{tickets.filter(t => t.status === 'pending').length} <span className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter">Nodes</span></h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <Clock size={18} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between group hover:border-blue-200 transition-all">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Diagnostic Phase</p>
                        <h4 className="text-xl font-black text-gray-900 leading-none mt-1.5">{tickets.filter(t => t.status === 'in-review').length} <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Nodes</span></h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <RefreshCcw size={18} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between group hover:border-emerald-200 transition-all">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cycle Resolved</p>
                        <h4 className="text-xl font-black text-gray-900 leading-none mt-1.5">{tickets.filter(t => t.status === 'resolved').length} <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Nodes</span></h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <CheckCircle2 size={18} />
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by student or subject..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:bg-white focus:border-blue-200 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <Filter size={14} className="text-gray-400 mr-2" />
                    {['all', 'pending', 'in-review', 'resolved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all
                                ${filter === f ? 'bg-blue-500 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                        >
                            {f}
                        </button>
                    ))}
                    <div className="h-4 w-px bg-gray-100 mx-1" />
                    {['Technical Support', 'Academic Assistance', 'Examination & Results', 'System Access (Login)'].map((c) => (
                        <button
                            key={c}
                            onClick={() => setFilter(c)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all
                                ${filter === c ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                        >
                            {c.split(' ')[0]}
                        </button>
                    ))}
                    <button 
                        onClick={fetchTickets}
                        className="p-2.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-all border border-gray-100 ml-2"
                        title="Force Refresh"
                    >
                        <RefreshCcw size={14} />
                    </button>
                </div>
            </div>

            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiry Source</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Node</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Lifecycle Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action Gate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                                                {ticket.student_name[0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 leading-none">{ticket.student_name}</p>
                                                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter italic">{ticket.student_reg_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="max-w-xl">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Category:</span>
                                                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none bg-blue-50 px-1.5 py-0.5 rounded">
                                                    {ticket.category}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{ticket.subject}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 italic font-medium opacity-80">"{ticket.description}"</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <span className={`px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${getStatusStyles(ticket.status)}`}>
                                                <div className={`w-1 h-1 rounded-full animate-pulse ${ticket.status === 'pending' ? 'bg-amber-500' : ticket.status === 'in-review' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-3">
                                            {ticket.screenshot_url && (
                                                <a 
                                                    href={`http://localhost:5000${ticket.screenshot_url}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="relative w-10 h-7 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 hover:ring-4 hover:ring-blue-50 transition-all shrink-0 group/img"
                                                    title="View Full Evidence Archive"
                                                >
                                                    <img 
                                                        src={`http://localhost:5000${ticket.screenshot_url}`} 
                                                        alt="Evidence" 
                                                        className="w-full h-full object-cover group-hover/img:scale-125 transition-transform"
                                                    />
                                                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Eye size={10} className="text-white" />
                                                    </div>
                                                </a>
                                            )}

                                            <button 
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="p-2 bg-gray-50 text-blue-500 rounded-lg hover:bg-blue-50 transition-all border border-blue-50/50 shadow-xs"
                                                title="Open Inquiry Details Modal"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            
                                            <div className="relative">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuOpenId(menuOpenId === ticket.id ? null : ticket.id);
                                                    }}
                                                    className={`p-2 rounded-lg transition-all border ${menuOpenId === ticket.id ? 'bg-blue-500 text-white border-blue-400 shadow-lg' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100 hover:text-gray-600'}`}
                                                >
                                                    <MoreVertical size={14} className={menuOpenId === ticket.id ? 'animate-pulse' : ''} />
                                                </button>
                                                
                                                {menuOpenId === ticket.id && (
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-200">
                                                        <div className="px-3 py-1.5 mb-1.5 border-b border-gray-50">
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Deployment Ops</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => {
                                                                handleStatusUpdate(ticket.id, 'pending');
                                                                setMenuOpenId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-[9px] font-black text-amber-600 hover:bg-amber-50 rounded-xl transition-colors uppercase tracking-widest mb-1"
                                                        >
                                                            <RefreshCcw size={12} /> Pending Phase
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                handleStatusUpdate(ticket.id, 'in-review');
                                                                setMenuOpenId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-[9px] font-black text-blue-600 hover:bg-blue-50 rounded-xl transition-colors uppercase tracking-widest mb-1"
                                                        >
                                                            <Clock size={12} /> Diagnostic Action
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                handleStatusUpdate(ticket.id, 'resolved');
                                                                setMenuOpenId(null);
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-[9px] font-black text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors uppercase tracking-widest"
                                                        >
                                                            <CheckCircle2 size={12} /> Resolve Node
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedTicket && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300 text-left">
                        <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                            {/* Header */}
                            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg ${getStatusColor(selectedTicket.status)}`}>
                                        <AlertCircle size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Inquiry Details</h4>
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

                                    {/* Evidence View Area */}
                                    {selectedTicket.screenshot_url && (
                                        <div className="mt-6 pt-6 border-t border-gray-50">
                                            <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <ImageIcon size={12} className="text-blue-500" /> Attached Evidence Capture
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
                                        <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Inquiry Progress Tracking</h5>
                                        <div className="relative pt-1">
                                            <div className="flex mb-3 items-center justify-between px-3">
                                                {['Log', 'Review', 'Resolved'].map((label, i) => (
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
                                    
                                    <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                                        {chats.map((chat) => (
                                            <div key={chat.id} className={`flex ${chat.sender_role === 'lecturer' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-[10px] shadow-sm transform transition-all hover:scale-[1.02]
                                                    ${chat.sender_role === 'lecturer' 
                                                        ? 'bg-indigo-600 text-white rounded-br-none border border-indigo-700' 
                                                        : chat.sender_role === 'system'
                                                            ? 'bg-gray-100 text-gray-400 italic text-center w-full mx-auto font-black uppercase tracking-tighter border border-gray-200'
                                                            : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-xs'
                                                    }`}>
                                                    <p className="leading-relaxed font-semibold">{chat.message}</p>
                                                    <p className={`text-[7px] mt-1.5 font-bold opacity-60 ${chat.sender_role === 'lecturer' ? 'text-right' : 'text-left'}`}>
                                                        {new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {chats.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3">
                                                <MessageSquare size={40} className="text-gray-300" />
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Zero active signals detected</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 shadow-2xl">
                                        <div className="relative flex items-center gap-2">
                                            <input 
                                                type="text"
                                                value={chatMessage}
                                                onChange={(e) => setChatMessage(e.target.value)}
                                                placeholder="Broadcast command..."
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-300 transition-all placeholder:text-gray-300"
                                            />
                                            <button 
                                                type="submit"
                                                disabled={sendingChat || !chatMessage.trim()}
                                                className="shrink-0 p-3 bg-indigo-600 text-white rounded-2xl hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 active:scale-95"
                                            >
                                                <SendIcon size={16} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {selectedTicket.status !== 'pending' && (
                                        <button 
                                            onClick={() => {
                                                handleStatusUpdate(selectedTicket.id, 'pending');
                                                setSelectedTicket(prev => ({ ...prev, status: 'pending' }));
                                            }}
                                            className="px-4 py-2.5 bg-white text-amber-600 border border-amber-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all shadow-sm flex items-center gap-2 active:scale-95"
                                        >
                                            <RefreshCcw size={12} /> Reset Status
                                        </button>
                                    )}
                                    {selectedTicket.status !== 'in-review' && (
                                        <button 
                                            onClick={() => {
                                                handleStatusUpdate(selectedTicket.id, 'in-review');
                                                setSelectedTicket(prev => ({ ...prev, status: 'in-review' }));
                                            }}
                                            className="px-4 py-2.5 bg-white text-blue-600 border border-blue-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-sm flex items-center gap-2 active:scale-95"
                                        >
                                            <Clock size={12} /> Mark as In-Review
                                        </button>
                                    )}
                                    {selectedTicket.status !== 'resolved' && (
                                        <button 
                                            onClick={() => {
                                                handleStatusUpdate(selectedTicket.id, 'resolved');
                                                setSelectedTicket(prev => ({ ...prev, status: 'resolved' }));
                                            }}
                                            className="px-4 py-2.5 bg-emerald-600 text-white border border-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2 active:scale-95"
                                        >
                                            <CheckCircle2 size={12} /> Resolve Inquiry
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setSelectedTicket(null)}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-95 border border-white/10"
                                >
                                    Close Overview
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {filteredTickets.length === 0 && !loading && (
                    <div className="p-20 text-center">
                        <FileText size={40} className="mx-auto text-gray-100 mb-4" />
                        <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest italic">No matching inquiries identified within the audit log.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LectureAdminTicketList;
