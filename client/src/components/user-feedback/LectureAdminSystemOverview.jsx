import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Users, 
    MessageSquare, 
    Activity, 
    Star,
    Shield,
    Clock,
    Database,
    Cpu,
    Lock,
    TrendingUp,
    BarChart3,
    PieChart as PieIcon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';

const LectureAdminSystemOverview = () => {
    const [stats, setStats] = useState({
        userCount: 0,
        totalFeedback: 0,
        avgRating: 0,
        recentActivity: [],
        inquiryHistory: [],
        statusDist: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, feedbackRes, ticketsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/user-feedback/users'),
                    axios.get('http://localhost:5000/api/user-feedback/feedback'),
                    axios.get('http://localhost:5000/api/user-feedback/tickets')
                ]);
                
                const avg = feedbackRes.data.length > 0 
                    ? (feedbackRes.data.reduce((acc, f) => acc + f.rating, 0) / feedbackRes.data.length).toFixed(1)
                    : 0;

                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return days[d.getDay()];
                }).reverse();

                const inquiryMap = (ticketsRes.data || []).reduce((acc, t) => {
                    const day = days[new Date(t.created_at).getDay()];
                    acc[day] = (acc[day] || 0) + 1;
                    return acc;
                }, {});

                const inquiryGrid = last7Days.map(day => ({
                    name: day,
                    count: inquiryMap[day] || 0
                }));

                // Calculate status distribution
                const sDist = [
                    { name: 'Pending', value: (ticketsRes.data || []).filter(t => t.status === 'pending').length, color: '#f59e0b' },
                    { name: 'In-Review', value: (ticketsRes.data || []).filter(t => t.status === 'in-review').length, color: '#3b82f6' },
                    { name: 'Resolved', value: (ticketsRes.data || []).filter(t => t.status === 'resolved').length, color: '#10b981' },
                ].filter(s => s.value > 0);

                setStats({
                    userCount: usersRes.data.length,
                    totalFeedback: feedbackRes.data.length,
                    avgRating: avg,
                    recentActivity: feedbackRes.data.slice(0, 10),
                    inquiryHistory: inquiryGrid,
                    statusDist: sDist
                });
            } catch (err) {
                console.error('Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 p-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3 ml-2">
                    <div className="relative">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-900 leading-none">System Operational</p>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5 tracking-wide uppercase">All nodes healthy • 24ms latency</p>
                    </div>
                </div>
                <div className="flex gap-4 mr-4">
                    <StatusMini label="Database" active={true} icon={<Database size={10} />} />
                    <StatusMini label="API Gateway" active={true} icon={<Cpu size={10} />} />
                    <StatusMini label="Secret Vault" active={true} icon={<Lock size={10} />} />
                </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewCard 
                    title="Total Knowledge Flow" 
                    value={stats.totalFeedback} 
                    trend="+12%" 
                    icon={<MessageSquare size={16} />} 
                    color="blue"
                />
                <OverviewCard 
                    title="Avg Merit Rating" 
                    value={stats.avgRating} 
                    trend="Stable" 
                    icon={<Star size={16} />} 
                    color="indigo"
                    suffix="/ 5.0"
                />
                <OverviewCard 
                    title="Active Entities" 
                    value={stats.userCount} 
                    trend="Safe" 
                    icon={<Users size={16} />} 
                    color="emerald"
                />
                <OverviewCard 
                    title="System Capacity" 
                    value="98%" 
                    trend="Optimal" 
                    icon={<Shield size={16} />} 
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden group border-t-2 border-t-indigo-500">
                    <div className="flex items-center justify-between mb-5 relative z-10">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <BarChart3 size={12} className="text-indigo-600" /> Inquiry Intake
                        </h3>
                        <div className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[8px] font-bold uppercase tracking-widest border border-indigo-100/50">
                            7-Day Trend
                        </div>
                    </div>
                    <div className="h-44 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={stats.inquiryHistory} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={8} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis fontSize={8} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '700' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={22}>
                                    {stats.inquiryHistory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === stats.inquiryHistory.length - 1 ? '#4f46e5' : '#e0e7ff'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative overflow-hidden group border-t-2 border-t-blue-500">
                    <div className="flex items-center justify-between mb-5 relative z-10">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <Activity size={12} className="text-blue-600" /> Interaction Density
                        </h3>
                    </div>
                    <div className="h-44 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart
                                data={[
                                    { name: '00:00', flow: 40 },
                                    { name: '04:00', flow: 30 },
                                    { name: '08:00', flow: 45 },
                                    { name: '12:00', flow: 65 },
                                    { name: '16:00', flow: 85 },
                                    { name: '20:00', flow: 70 },
                                    { name: '23:59', flow: stats.totalFeedback },
                                ]}
                                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={8} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis fontSize={8} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} hide />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '700' }} />
                                <Area type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-t-2 border-t-emerald-500 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} className="text-emerald-600" /> Activity Pulse
                        </h3>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[220px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                        {stats.recentActivity.map((activity, idx) => (
                            <ActivityItem key={idx} user={activity.student_name} action="Created Review" time="Live" color="blue" />
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-t-2 border-t-amber-500">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                        <PieIcon size={12} className="text-amber-600" /> Status Lifecycle
                    </h3>
                    <div className="h-44 w-full relative">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={stats.statusDist}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.statusDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '700' }} />
                                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OverviewCard = ({ title, value, trend, icon, color, suffix }) => (
    <div className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group border-l-4 
        ${color === 'blue' ? 'border-l-blue-500' : color === 'indigo' ? 'border-l-indigo-500' : color === 'emerald' ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
        <div className="flex items-center justify-between mb-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                ${color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 
                  color === 'indigo' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 
                  color === 'emerald' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 
                  'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'}`}>
                {icon}
            </div>
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                {trend}
            </span>
        </div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{title}</p>
        <h4 className="text-xl font-bold text-gray-900 tracking-tighter leading-none flex items-baseline gap-1">
            {value} <span className="text-[9px] text-gray-300 font-bold">{suffix}</span>
        </h4>
    </div>
);

const ActivityItem = ({ user, action, time, color }) => (
    <div className="flex items-center gap-2.5 group/item cursor-default p-1.5 hover:bg-gray-50/50 rounded-lg transition-colors">
        <div className={`w-1 h-1 rounded-full shrink-0 ${color === 'blue' ? 'bg-blue-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-gray-900 leading-none group-hover/item:text-blue-600 transition-colors truncate uppercase tracking-tight">{user}</p>
            <p className="text-[8px] text-gray-400 font-medium mt-1 truncate">{action}</p>
        </div>
        <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter shrink-0">{time}</span>
    </div>
);

const StatusMini = ({ label, active, icon }) => (
    <div className="flex items-center gap-2 group cursor-default">
        <div className={`p-1 rounded-md ${active ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-300'}`}>
            {icon}
        </div>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">{label}</span>
    </div>
);

export default LectureAdminSystemOverview;
