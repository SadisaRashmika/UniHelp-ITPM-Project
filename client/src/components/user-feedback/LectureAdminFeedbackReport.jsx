import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileBarChart, History, Star, Users, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const LectureAdminFeedbackReport = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/user-feedback/feedback');
                setFeedbacks(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);


    const avgRating = feedbacks.length > 0
        ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
        : 0;


    const ratingDist = [
        { name: '5 Stars', value: feedbacks.filter(f => f.rating === 5).length, color: '#2563eb' },
        { name: '4 Stars', value: feedbacks.filter(f => f.rating === 4).length, color: '#3b82f6' },
        { name: '3 Stars', value: feedbacks.filter(f => f.rating === 3).length, color: '#60a5fa' },
        { name: '2 Stars', value: feedbacks.filter(f => f.rating === 2).length, color: '#93c5fd' },
        { name: '1 Star', value: feedbacks.filter(f => f.rating === 1).length, color: '#bfdbfe' },
    ];


    const lecturerDataMap = feedbacks.reduce((acc, f) => {
        if (!acc[f.lecturer_name]) acc[f.lecturer_name] = { name: f.lecturer_name, sum: 0, count: 0 };
        acc[f.lecturer_name].sum += f.rating;
        acc[f.lecturer_name].count += 1;
        return acc;
    }, {});

    const lecturerChartData = Object.values(lecturerDataMap).map(l => ({
        name: l.name.split(' ').pop(),
        fullName: l.name,
        avg: parseFloat((l.sum / l.count).toFixed(1))
    })).sort((a, b) => b.avg - a.avg).slice(0, 5);

    const exportToPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235);
        doc.text('Uni-Help Analytical Report', 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(156, 163, 175);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Total Feedbacks: ${feedbacks.length} | Global Average: ${avgRating}/5.0`, 14, 35);
        
        doc.line(14, 40, 196, 40);

        const tableColumn = ["Student", "Lecturer", "Subject", "Rating", "Comment", "Date"];
        const tableRows = feedbacks.map(f => [
            f.student_name,
            f.lecturer_name,
            f.subject,
            f.rating,
            f.comment,
            new Date(f.created_at).toLocaleDateString()
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'striped',
            headStyles: { fillStyle: 'dark', fillColor: [37, 99, 235], fontSize: 10 },
            bodyStyles: { fontSize: 9 },
            alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        doc.save(`UniHelp_Report_${new Date().getTime()}.pdf`);
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-5 grow animate-in fade-in slide-in-from-bottom-5 duration-700 pb-6">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-none">Analytical Insights</h2>
                    <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest leading-none">Node: Global • Auth: Lecturer</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-all shadow-xs active:scale-95">
                        Refresh
                    </button>
                    <button 
                        onClick={exportToPDF}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <Download size={12} /> Export PDF
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Star size={18} />} label="Unit Performance" val={avgRating} color="blue" suffix="/ 5.0" trend="+0.2" />
                <StatCard icon={<History size={18} />} label="Total Data" val={feedbacks.length} color="indigo" trend="Live" />
                <StatCard icon={<Users size={18} />} label="Faculty Nodes" val={Object.keys(lecturerDataMap).length} color="emerald" trend="Opt" />
                <StatCard icon={<FileBarChart size={18} />} label="24H Velocity" val={feedbacks.filter(f => new Date(f.created_at) > new Date(Date.now() - 86400000)).length} color="amber" trend="New" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <BarChart size={12} className="text-blue-600" /> Merit Leaders
                        </h3>
                        <div className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[8px] font-bold uppercase tracking-widest border border-blue-100/50">
                            Ranked
                        </div>
                    </div>

                    <div className="h-64 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={lecturerChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={8} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={5} />
                                <YAxis fontSize={8} fontWeight={700} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} domain={[0, 5]} tickCount={6} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '700', padding: '8px' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="avg" radius={[4, 4, 4, 4]} barSize={24}>
                                    {lecturerChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#bfdbfe'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative group">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Distribution</h3>
                    <div className="h-56 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ratingDist}
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {ratingDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '9px', fontWeight: '700' }}
                                />
                                <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '8px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-lg font-bold text-gray-900 tracking-tighter leading-none">{avgRating}</span>
                            <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Global</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center bg-gray-50/50 p-4 rounded-xl border border-gray-100 shadow-inner">
                        <p className="text-[9px] font-bold text-blue-600/60 uppercase tracking-widest">Net Sentiment</p>
                        <p className="text-base font-bold text-gray-900 mt-1 tracking-tight">
                            {((ratingDist[0].value + ratingDist[1].value) / (feedbacks.length || 1) * 100).toFixed(0)}% <span className="text-blue-600">POS</span>
                        </p>
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 relative z-10">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 tracking-tight">Activity Stream</h3>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Real-time student submissions</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Filter log..."
                                className="pl-8 pr-3 py-1.5 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 rounded-lg text-[10px] font-bold outline-none transition-all w-40 shadow-inner"
                            />
                            <History size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    {feedbacks.slice(0, 5).map((f) => (
                        <div key={f.id} className="p-4 rounded-xl border border-transparent flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 hover:border-blue-100 transition-all cursor-default group">
                            <div className="flex gap-3 items-center">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all bg-gray-50 border border-transparent 
                                    ${f.rating >= 4 ? 'group-hover:bg-emerald-50 group-hover:text-emerald-600' : 'group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                    <Star size={14} fill={f.rating > 0 ? "currentColor" : "none"} className="opacity-40" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-gray-900 leading-none truncate uppercase tracking-tight">{f.student_name}</p>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ref: <span className="text-gray-600">{f.lecturer_name}</span></p>
                                </div>
                            </div>
                            <div className="md:grow text-[10px] text-gray-500 font-medium italic truncate opacity-70 group-hover:opacity-100 transition-opacity px-4 py-1.5 bg-gray-50/20 rounded-lg">
                                "{f.comment}"
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest border
                                    ${f.rating >= 4 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    {f.rating}.0 VAL
                                </span>
                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter text-right">{new Date(f.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, val, color, suffix, trend }) => (
    <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:translate-y-[-6px] hover:shadow-xl hover:shadow-gray-100/50 transition-all flex items-center gap-6 group relative overflow-hidden">

        <div className={`absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity
            ${color === 'blue' ? 'bg-blue-500' : color === 'indigo' ? 'bg-indigo-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`} />

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xs
            ${color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                color === 'indigo' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' :
                    color === 'emerald' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' :
                        'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'}`}>
            {icon}
        </div>
        <div className="grow">
            <div className="flex items-center justify-between mb-1.5">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</p>
                <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md
                    ${color === 'blue' ? 'bg-blue-50 text-blue-400 font-bold' : 'bg-gray-50 text-gray-400'}`}>
                    {trend}
                </span>
            </div>
            <h4 className="text-3xl font-bold text-gray-900 leading-none tracking-tighter flex items-center gap-1">
                {val} <span className="text-xs text-gray-300 font-bold">{suffix}</span>
            </h4>
        </div>
    </div>
);

export default LectureAdminFeedbackReport;
