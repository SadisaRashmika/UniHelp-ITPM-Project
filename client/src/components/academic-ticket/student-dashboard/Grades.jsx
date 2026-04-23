import React, { useState, useEffect } from "react";
import {
  FileText, CheckCircle, Clock, ChartColumnBig, 
  BookOpen, Briefcase, Users, Bell, Award, 
  Loader2, Calendar, MessageSquare, TrendingUp,
  Activity, Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/academic-ticket";

const Grades = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("grades");

  const student = { id: "STU001" };

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Quiz", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Practicals", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Award, label: "Grades", link: "/academic-ticket/student-dashboard/grades", key: "grades" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: Users, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/submissions?student_id=${student.id}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-900 ">
      {/* SIDEBAR */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UH</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help</span>
              <p className="text-xs text-slate-400 mt-0.5">Academic Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer transition-all ${
                activeTab === item.key
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon size={17} className={activeTab === item.key ? "text-blue-500" : "text-slate-400"} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col p-8 overflow-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Academic Grades</h1>
            <p className="text-slate-500 mt-2 text-lg">Detailed performance review and feedback</p>
          </div>
          <div className="flex gap-4">
             <StatCard label="Avg Grade" value={submissions.filter(s => s.grade).length ? (submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / submissions.filter(s => s.grade).length).toFixed(1) + "%" : "N/A"} icon={TrendingUp} color="blue" />
             <StatCard label="Completed" value={submissions.length} icon={CheckCircle} color="green" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.length === 0 ? (
              <div className="bg-white rounded-[32px] p-20 text-center border-2 border-dashed border-slate-100">
                <Award size={64} className="mx-auto text-slate-100 mb-4" />
                <p className="text-slate-400 font-bold text-2xl tracking-tight">No grades recorded yet.</p>
                <p className="text-slate-400">Complete assessments to see your performance here.</p>
              </div>
            ) : (
              submissions.map(sub => (
                <div key={sub.id} className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 hover:shadow-lg transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                          sub.quiz_type === 'practical' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {sub.quiz_type || 'quiz'}
                        </span>
                        <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <Calendar size={14} />
                          {new Date(sub.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4">{sub.quiz_title}</h3>
                      
                      <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <MessageSquare size={14} />
                          Your Submission
                        </p>
                        <p className="text-slate-600 font-medium line-clamp-2 italic">
                          "{sub.answer}"
                        </p>
                      </div>
                    </div>

                    <div className="md:w-72 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-50 pt-6 md:pt-0 md:pl-8">
                      {sub.grade !== null ? (
                        <div className="text-center md:text-right w-full">
                          <div className="inline-flex flex-col items-center md:items-end mb-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Result</p>
                            <div className="flex items-center gap-2">
                              <span className="text-5xl font-black text-slate-900 tracking-tighter">{sub.grade}</span>
                              <span className="text-2xl font-black text-blue-500">%</span>
                            </div>
                          </div>
                          
                          {sub.feedback && (
                            <div className="bg-blue-50/50 p-5 rounded-2xl text-left border border-blue-100/50 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-2">
                                <Star size={16} className="text-blue-200 fill-blue-200" />
                              </div>
                              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Award size={12} />
                                Lecturer Feedback
                              </p>
                              <p className="text-sm text-blue-900 font-bold leading-relaxed">{sub.feedback}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center md:text-right">
                          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto md:ml-auto mb-4">
                            <Clock className="text-orange-500 animate-pulse" size={32} />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                          <span className="text-xl font-black text-orange-500 italic">Evaluating...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white px-8 py-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6">
    <div className={`p-4 bg-${color}-50 rounded-2xl`}>
      <Icon className={`text-${color}-600`} size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900 leading-tight">{value}</p>
    </div>
  </div>
);

export default Grades;
