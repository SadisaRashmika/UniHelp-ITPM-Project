import React, { useState, useEffect } from 'react';
import { 
  FileText, Calendar, Clock, CheckCircle, AlertCircle, 
  TrendingUp, Award, Eye, Search, Filter, X, Check,
  Loader2, User, BookOpen, Upload, Users, ChartColumnBig
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/academic-ticket";

const Submissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingData, setGradingData] = useState({ grade: '', feedback: '' });
  const [activeTab, setActiveTab] = useState("submissions");
  const [isGrading, setIsGrading] = useState(false);

  // Get current lecturer info
  const lecturer = { id: "LEC001" };

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/lec-dashboard/overview", key: "overview" },
    { icon: FileText, label: "Create Quiz", link: "/academic-ticket/lec-dashboard/quiz", key: "quiz" },
    { icon: Users, label: "Create Practical", link: "/academic-ticket/lec-dashboard/practical", key: "practical" },
    { icon: Upload, label: "Submissions", link: "/academic-ticket/lec-dashboard/submissions", key: "submissions" },
    { icon: TrendingUp, label: "Analytics", link: "/academic-ticket/lec-dashboard/analytics", key: "analytics" },
    { icon: Award, label: "Grades", link: "/academic-ticket/lec-dashboard/grades", key: "grades" },
  ];

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/submissions?lecturer_id=${lecturer.id}`);
      // The submissions API returns an array directly, not wrapped in a data property
      setSubmissions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissions([]); // Set to empty array on error to prevent map issues
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradingData({
      grade: submission.grade || '',
      feedback: submission.feedback || ''
    });
    setShowGradingModal(true);
  };

  const handleSaveGrading = async () => {
    try {
      setIsGrading(true);
      await axios.put(`${API_BASE}/submissions/${selectedSubmission.id}/grade`, gradingData);
      setShowGradingModal(false);
      fetchSubmissions();
    } catch (error) {
      console.error("Error grading submission:", error);
    } finally {
      setIsGrading(false);
    }
  };

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
              <span className="text-white font-bold">LEC</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help</span>
              <p className="text-xs text-slate-400 mt-0.5">Lecturer Panel</p>
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Submissions</h1>
          <p className="text-slate-500 mt-2 text-lg">Review and grade student assessments</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
          </div>
        ) : (
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Student</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Assessment</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Grade</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {sub.student_id.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{sub.student_id}</p>
                          <p className="text-xs text-slate-400">ID: {sub.student_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900">{sub.quiz_title}</p>
                      <p className="text-xs text-slate-400">Assessment ID: #{sub.quiz_id}</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      {sub.grade !== null ? (
                        <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-black">
                          {sub.grade}%
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-black">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleGradeSubmission(sub)}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GRADING MODAL */}
        {showGradingModal && selectedSubmission && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] shadow-2xl max-w-xl w-full p-10 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Grade Assessment</h2>
                  <p className="text-slate-400 font-bold mt-1">{selectedSubmission.quiz_title}</p>
                </div>
                <button onClick={() => setShowGradingModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <X size={28} className="text-slate-400" />
                </button>
              </div>

              <div className="mb-8 p-6 bg-slate-50 rounded-3xl border-2 border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Student's Answer</p>
                <p className="text-slate-900 font-medium leading-relaxed">{selectedSubmission.answer}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Marks (%)</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none text-lg font-bold"
                    placeholder="0-100"
                    value={gradingData.grade}
                    onChange={e => setGradingData({...gradingData, grade: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Feedback</label>
                  <textarea
                    className="w-full h-32 px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none text-lg font-medium resize-none"
                    placeholder="Add comments for the student..."
                    value={gradingData.feedback}
                    onChange={e => setGradingData({...gradingData, feedback: e.target.value})}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => setShowGradingModal(false)}
                    className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGrading}
                    disabled={isGrading || !gradingData.grade}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
                  >
                    {isGrading ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                    Finalize Grade
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;
