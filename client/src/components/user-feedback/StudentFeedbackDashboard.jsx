import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Trophy, Star, TrendingUp, Zap } from 'lucide-react';
import StudentFeedbackForm from './StudentFeedbackForm';

const StudentFeedbackDashboard = ({ studentId }) => {
    const [stats, setStats] = useState({
        feedbackCount: 0,
        points: 320,
        recentFeedback: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/user-feedback/feedback');
                const studentReviews = res.data.filter(f => f.student_id === studentId || f.student_reg_id === studentId);
                
                setStats({
                    feedbackCount: studentReviews.length,
                    points: 320 + (studentReviews.length * 10), // Example logic
                    recentFeedback: studentReviews.slice(0, 3)
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [studentId]);

    if (loading) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Overview - Feedback Specific */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <OverviewCard 
                    title="Experience Points" 
                    value={stats.points} 
                    trend="+10 XP / Node" 
                    icon={<Trophy size={16} />} 
                    color="blue"
                    suffix="XP"
                />
                <OverviewCard 
                    title="Total Feedbacks" 
                    value={stats.feedbackCount} 
                    trend="Active Nodes" 
                    icon={<MessageSquare size={16} />} 
                    color="emerald"
                />
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center border-l-4 border-l-indigo-500">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Trajectory</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[65%] rounded-full" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-900">65%</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                     <StudentFeedbackForm studentId={studentId} />
                </div>
            </div>
        </div>
    );
};

const OverviewCard = ({ title, value, trend, icon, color, suffix }) => (
    <div className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group border-l-4 
        ${color === 'blue' ? 'border-l-blue-500' : 'border-l-emerald-500'}`}>
        <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center 
                ${color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {icon}
            </div>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-gray-50 text-gray-400">
                {trend}
            </span>
        </div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{title}</p>
        <h4 className="text-xl font-bold text-gray-900 tracking-tighter leading-none flex items-baseline gap-1">
            {value} <span className="text-[9px] text-gray-300 font-bold">{suffix}</span>
        </h4>
    </div>
);

export default StudentFeedbackDashboard;
