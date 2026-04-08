import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LifeBuoy, Clock, ShieldCheck, AlertCircle, ArrowUpRight } from 'lucide-react';
import StudentTicketForm from './StudentTicketForm';

const StudentSupportDashboard = ({ studentId }) => {
    const [stats, setStats] = useState({
        totalTickets: 0,
        pendingTickets: 0,
        resolvedTickets: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchTicketStats = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user-feedback/tickets/student/${studentId}`);
            const tickets = res.data;
            
            setStats({
                totalTickets: tickets.length,
                pendingTickets: tickets.filter(t => t.status === 'pending').length,
                resolvedTickets: tickets.filter(t => t.status === 'resolved').length
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketStats();
    }, [studentId]);

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Overview - Support Specific */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <OverviewCard 
                    title="Total Inquiries" 
                    value={stats.totalTickets} 
                    trend="Historical" 
                    icon={<LifeBuoy size={16} />} 
                    color="blue"
                />
                <OverviewCard 
                    title="Pending Support" 
                    value={stats.pendingTickets} 
                    trend="In Progress" 
                    icon={<Clock size={16} />} 
                    color="amber"
                />
                <OverviewCard 
                    title="Resolved Nodes" 
                    value={stats.resolvedTickets} 
                    trend="Verified" 
                    icon={<ShieldCheck size={16} />} 
                    color="emerald"
                />
            </div>

            {/* Active Support Protocol Info */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden group shadow-xl shadow-blue-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Technical Assistance Gateway</h3>
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Operational 24/7 for Academic Support</p>
                    </div>
                    <AlertCircle size={32} className="text-blue-200 opacity-40" />
                </div>
                <div className="mt-6 flex gap-4 relative z-10">
                    <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold">Standard Response: &lt; 24h</span>
                    </div>
                </div>
            </div>

            {/* Form Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                     <StudentTicketForm studentId={studentId} onTicketSubmitted={fetchTicketStats} />
                </div>
            </div>
        </div>
    );
};

const OverviewCard = ({ title, value, trend, icon, color }) => (
    <div className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group border-l-4 
        ${color === 'blue' ? 'border-l-blue-500' : color === 'amber' ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
        <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center 
                ${color === 'blue' ? 'bg-blue-50 text-blue-600' : color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {icon}
            </div>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-gray-50 text-gray-400">
                {trend}
            </span>
        </div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{title}</p>
        <h4 className="text-xl font-bold text-gray-900 tracking-tighter leading-none">
            {value}
        </h4>
    </div>
);

export default StudentSupportDashboard;
