import React, { useState, useEffect } from 'react';
import { 
  FileText, Users, Calendar, Clock, CheckCircle, 
  TrendingUp, Award, Upload, Eye, Plus, X, 
  Save, Trash2, Edit, Loader2, ChartColumnBig 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PracticalForm from './PracticalForm';
import axios from "axios";

const API_BASE = "http://localhost:5000/api/academic-ticket";

const Practical = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("practical");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [practicals, setPracticals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lecturer] = useState({ id: "LEC001" });

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/lec-dashboard/overview", key: "overview" },
    { icon: FileText, label: "Create Quiz", link: "/academic-ticket/lec-dashboard/quiz", key: "quiz" },
    { icon: Users, label: "Create Practical", link: "/academic-ticket/lec-dashboard/practical", key: "practical" },
    { icon: Upload, label: "Submissions", link: "/academic-ticket/lec-dashboard/submissions", key: "submissions" },
    { icon: TrendingUp, label: "Analytics", link: "/academic-ticket/lec-dashboard/analytics", key: "analytics" },
    { icon: Award, label: "Grades", link: "/academic-ticket/lec-dashboard/grades", key: "grades" },
  ];

  const fetchPracticals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/quizzes?lecturer_id=${lecturer.id}&type=practical`);
      // The API returns { success: true, data: [...], quizzes: [...] }
      // We need to use the data array which contains the filtered quizzes
      setPracticals(response.data.data || []);
    } catch (error) {
      console.error("Error fetching practicals:", error);
      setPracticals([]); // Set to empty array on error to prevent map issues
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPracticals();
  }, []);

  const handleDeletePractical = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE}/quizzes/${id}`);
      fetchPracticals();
    } catch (error) {
      console.error("Error deleting practical:", error);
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
                  : "text-slate-600 hover:bg-slate-50"
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
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Practical Management</h1>
            <p className="text-slate-500 mt-2 text-lg">Create and track hands-on lab assessments</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={24} />
            New Practical
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {practicals.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
                <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold text-xl">No practicals created yet.</p>
              </div>
            ) : (
              practicals.map(prac => (
                <div key={prac.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all group relative">
                   <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <Users className="text-blue-600" size={32} />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDeletePractical(prac.id)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">
                      {prac.module_code || prac.course_code}
                    </span>
                    <span className="text-xs font-bold text-slate-400">ID: #{prac.id}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{prac.title}</h3>
                  <p className="text-slate-500 mb-8 line-clamp-2 leading-relaxed">{prac.description}</p>
                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      {prac.created_at ? new Date(prac.created_at).toLocaleDateString() : 'No date'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={18} />
                      {prac.total_marks || prac.max_marks || 0} Marks
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      {prac.duration || 0} min
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showCreateForm && (
          <PracticalForm 
            onClose={() => setShowCreateForm(false)} 
            onPracticalCreated={() => fetchPracticals()}
          />
        )}
      </div>
    </div>
  );
};

export default Practical;
