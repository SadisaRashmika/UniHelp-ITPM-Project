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
    FileText
} from 'lucide-react';

const AdminTicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

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

    useEffect(() => {
        fetchTickets();
        const interval = setInterval(fetchTickets, 30000);
        return () => clearInterval(interval);
    }, []);

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
                                        <div className="max-w-xs">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">Category:</span>
                                                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none bg-blue-50 px-1.5 py-0.5 rounded">
                                                    {ticket.category}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-900 group-hover:text-blue-500 transition-colors">{ticket.subject}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 italic font-medium opacity-80">"{ticket.description}"</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <span className={`px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${getStatusStyles(ticket.status)}`}>
                                                <div className={`w-1 h-1 rounded-full animate-pulse ${ticket.status === 'pending' ? 'bg-amber-500' : ticket.status === 'in-review' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            {ticket.screenshot_url && (
                                                <a 
                                                    href={`http://localhost:5000${ticket.screenshot_url}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-500 hover:scale-110 transition-all border border-gray-100"
                                                    title="Analyze Screenshot"
                                                >
                                                    <Eye size={14} />
                                                </a>
                                            )}
                                            
                                            <div className="relative group/menu">
                                                <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-all border border-gray-100">
                                                    <MoreVertical size={14} />
                                                </button>
                                                
                                                <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl p-1 z-20 hidden group-hover/menu:block animate-in fade-in zoom-in-95 duration-200">
                                                    <button 
                                                        onClick={() => handleStatusUpdate(ticket.id, 'in-review')}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors uppercase tracking-widest"
                                                    >
                                                        <Clock size={12} /> Diagnostic
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(ticket.id, 'resolved')}
                                                        className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors uppercase tracking-widest"
                                                    >
                                                        <CheckCircle2 size={12} /> Resolve
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
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

export default AdminTicketList;
