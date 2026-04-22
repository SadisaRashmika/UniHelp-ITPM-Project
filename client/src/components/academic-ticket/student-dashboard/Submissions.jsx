import React, { useState, useEffect } from "react";
import {
  FileText, Clock, CheckCircle, AlertCircle, ChartColumnBig,
  BookOpen, Briefcase, Users, Bell, Send, Loader2, X, Activity,
  Calendar, Award, MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/academic-ticket";

const Practicals = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("submissions");
  const [loading, setLoading] = useState(false);
  const [practicals, setPracticals] = useState([]);
  const [selectedPractical, setSelectedPractical] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const student = { id: "STU001", name: "Alex Student" };

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Quiz", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Practicals", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Award, label: "Grades", link: "/academic-ticket/student-dashboard/grades", key: "grades" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: Users, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const fetchPracticals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/quizzes?type=practical`);
      setPracticals(response.data.data || []);
    } catch (error) {
      console.error("Error fetching practicals:", error);
      setPracticals([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPracticals();
  }, []);

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  const handleSubmitPractical = async () => {
    if (!answer.trim()) return;
    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE}/submissions`, {
        quiz_id: selectedPractical.id,
        student_id: student.id,
        answer: answer
      });
      setSuccessMsg("Practical Submitted!");
      setAnswer("");
      setTimeout(() => {
        setSelectedPractical(null);
        setSuccessMsg("");
      }, 2000);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-900 ">
      {/* SIDEBAR */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">STU</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help</span>
              <p className="text-xs text-slate-400 mt-0.5">Student Dashboard</p>
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
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Academic Practicals</h1>
          <p className="text-slate-500 mt-2 text-lg">Complete and submit your hands-on assessments</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practicals.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <Activity size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold text-xl">No active practicals at the moment.</p>
              </div>
            ) : (
              practicals.map(practical => (
                <div key={practical.id} className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all group relative text-left">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <Activity className="text-blue-600" size={32} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full text-slate-400">
                      {practical.course_code}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{practical.title}</h3>
                  <p className="text-slate-500 mb-8 line-clamp-2 leading-relaxed text-sm">{practical.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-8">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      Due {new Date(practical.due_date).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPractical(practical)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                  >
                    <Send size={18} />
                    Start Submission
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* SUBMISSION MODAL */}
        {selectedPractical && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-10 relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setSelectedPractical(null)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={28} />
              </button>
              
              <div className="mb-8 text-left">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                  {selectedPractical.course_code}
                </span>
                <h2 className="text-4xl font-black text-slate-900 mb-2">{selectedPractical.title}</h2>
                <p className="text-slate-500 text-lg leading-relaxed">{selectedPractical.description}</p>
              </div>

              <div className="space-y-6">
                <div className="text-left">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MessageSquare size={14} />
                    Submission Content
                  </label>
                  <textarea
                    className="w-full h-48 px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl transition-all outline-none resize-none text-lg font-medium"
                    placeholder="Enter your practical results, observations or links here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>

                {successMsg ? (
                  <div className="bg-green-50 text-green-700 py-6 px-8 rounded-3xl font-black flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle size={28} />
                    <span className="text-xl">{successMsg}</span>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedPractical(null)}
                      className="flex-1 py-5 text-slate-400 font-bold hover:text-slate-600 transition-all text-lg"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSubmitPractical}
                      disabled={isSubmitting || !answer.trim()}
                      className="flex-[2] py-5 bg-blue-600 text-white rounded-3xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 text-lg"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                      Submit Practical
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practicals;