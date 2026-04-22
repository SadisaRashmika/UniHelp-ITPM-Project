import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Edit, Save, X, Loader2, Calendar, 
  Clock, AlertCircle, CheckCircle, Send, Users, ChartColumnBig,
  TrendingUp, Award, Upload, List, Globe, BookOpen, Layers,
  ChevronRight, Filter, Search, MoreVertical, LayoutGrid
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/academic-ticket";

const QuizManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("quiz");
  
  // Structure Selection State
  const [faculties, setFaculties] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [modules, setModules] = useState([]);
  
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedIntake, setSelectedIntake] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  
  // Quizzes State
  const [quizzes, setQuizzes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const initialForm = { 
    title: "", 
    description: "", 
    duration: 30,
    total_marks: 100,
    questions: [
      { question: "", options: ["", "", "", ""], correct_answer: "" }
    ]
  };
  const [form, setForm] = useState(initialForm);

  const [successMsg, setSuccessMsg] = useState("");

  // Lecturer Info
  const lecturer = { id: "LEC001" };

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/lec-dashboard/overview", key: "overview" },
    { icon: LayoutGrid, label: "Quiz Management", link: "/academic-ticket/lec-dashboard/quiz", key: "quiz" },
    { icon: Upload, label: "Submissions", link: "/academic-ticket/lec-dashboard/submissions", key: "submissions" },
    { icon: TrendingUp, label: "Analytics", link: "/academic-ticket/lec-dashboard/analytics", key: "analytics" },
    { icon: Award, label: "Grades", link: "/academic-ticket/lec-dashboard/grades", key: "grades" },
  ];

  // Fetch Faculties on Mount
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await axios.get(`${API_BASE}/quiz-structure/faculties`);
        setFaculties(res.data.data);
      } catch (err) {
        console.error("Error fetching faculties:", err);
      }
    };
    fetchFaculties();
  }, []);

  // Cascade: Faculty -> Intakes
  useEffect(() => {
    if (!selectedFaculty) {
      setIntakes([]);
      setSelectedIntake("");
      return;
    }
    const fetchIntakes = async () => {
      try {
        const res = await axios.get(`${API_BASE}/quiz-structure/faculty/${selectedFaculty}/intakes`);
        setIntakes(res.data.data);
        setSelectedIntake("");
      } catch (err) {
        console.error("Error fetching intakes:", err);
      }
    };
    fetchIntakes();
  }, [selectedFaculty]);

  // Cascade: Intake -> Semesters
  useEffect(() => {
    if (!selectedIntake || !selectedFaculty) {
      setSemesters([]);
      setSelectedSemester("");
      return;
    }
    const fetchSemesters = async () => {
      try {
        const res = await axios.get(`${API_BASE}/quiz-structure/faculty/${selectedFaculty}/intake/${selectedIntake}/semesters`);
        setSemesters(res.data.data);
        setSelectedSemester("");
      } catch (err) {
        console.error("Error fetching semesters:", err);
      }
    };
    fetchSemesters();
  }, [selectedIntake, selectedFaculty]);

  // Cascade: Semester -> Modules
  useEffect(() => {
    if (!selectedSemester || !selectedIntake || !selectedFaculty) {
      setModules([]);
      setSelectedModule("");
      return;
    }
    const fetchModules = async () => {
      try {
        const res = await axios.get(`${API_BASE}/quiz-structure/faculty/${selectedFaculty}/intake/${selectedIntake}/semester/${selectedSemester}/modules`);
        setModules(res.data.data);
        setSelectedModule("");
      } catch (err) {
        console.error("Error fetching modules:", err);
      }
    };
    fetchModules();
  }, [selectedSemester, selectedIntake, selectedFaculty]);

  // Fetch Quizzes when Module is selected
  const fetchQuizzes = async (module = selectedModule, faculty = selectedFaculty, intake = selectedIntake, semester = selectedSemester) => {
    if (!module) {
      setQuizzes([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/quiz-jobs`, {
        params: {
          lecturer_id: lecturer.id,
          faculty_id: faculty,
          intake_id: intake,
          semester_id: semester,
          module_id: module
        }
      });
      setQuizzes(res.data.data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [selectedModule, selectedFaculty, selectedIntake, selectedSemester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await axios.post(`${API_BASE}/quiz-jobs`, {
        title: form.title,
        description: form.description,
        due_date: form.due_date,
        priority: form.priority,
        course_code: form.course_code,
        lecturer_id: lecturer.id,
        max_marks: form.max_marks,
        duration: form.duration,
        questions: form.questions,
        type: form.type,
        module_id: selectedModule ? parseInt(selectedModule) : null,
        faculty_id: selectedFaculty ? parseInt(selectedFaculty) : null,
        intake_id: selectedIntake ? parseInt(selectedIntake) : null,
        semester_id: selectedSemester ? parseInt(selectedSemester) : null,
        total_marks: form.total_marks,
        job_status: 'active',
        job_priority: form.priority === 'urgent' ? 'urgent' : form.priority === 'high' ? 'high' : 'normal',
        completion_status: 'incomplete'
      });
      
      // Success - show success message and refresh
      setSuccessMsg('Quiz created successfully!');
      
      // Reset form properly
      setForm({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
        course_code: "",
        max_marks: 100,
        duration: 60,
        questions: [],
        type: "quiz",
        total_marks: 100
      });
      
      // Clear selections
      setSelectedFaculty("");
      setSelectedIntake("");
      setSelectedSemester("");
      setSelectedModule("");
      
      // Hide form
      setShowForm(false);
      
      // Refresh quiz list
      fetchQuizzes();
      
      // Refresh quiz list is already handled by fetchQuizzes() above
    } catch (err) {
      console.error("Error creating quiz job:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [...form.questions, { question: "", options: ["", "", "", ""], correct_answer: "" }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...form.questions];
    newQuestions.splice(index, 1);
    setForm({ ...form, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...form.questions];
    newQuestions[index][field] = value;
    setForm({ ...form, questions: newQuestions });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const newQuestions = [...form.questions];
    newQuestions[qIdx].options[oIdx] = value;
    setForm({ ...form, questions: newQuestions });
  };

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axios.delete(`${API_BASE}/quizzes/${id}`);
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (err) {
      console.error("Error deleting quiz:", err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* SIDEBAR */}
      <div className="w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <BookOpen className="text-white" size={20} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900">UniHelp</span>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Lecturer Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(item)}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl mb-2 cursor-pointer transition-all duration-200 group ${
                activeTab === item.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <item.icon size={20} className={activeTab === item.key ? "text-white" : "group-hover:scale-110 transition-transform"} />
              <span className="font-bold text-sm">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div>
              <p className="text-xs font-bold">Dr. Smith</p>
              <p className="text-[10px] text-slate-400">Senior Lecturer</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quiz Management</h1>
            <p className="text-xs font-bold text-slate-400">Manage assessments and track student progress</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search quizzes..." 
                className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium w-64 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10">
          {/* SELECTION STRUCTURE */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Filter size={18} />
              </div>
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Filter Structure</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Faculty</label>
                <select 
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none"
                >
                  <option value="">Select Faculty</option>
                  {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intake</label>
                <select 
                  value={selectedIntake}
                  disabled={!selectedFaculty || intakes.length === 0}
                  onChange={(e) => setSelectedIntake(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="">Select Intake</option>
                  {intakes.map(i => <option key={i.id} value={i.id}>{i.year}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Semester</label>
                <select 
                  value={selectedSemester}
                  disabled={!selectedIntake}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="">Select Semester</option>
                  {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Module</label>
                <select 
                  value={selectedModule}
                  disabled={!selectedSemester}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-700 transition-all cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="">Select Module</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.code} - {m.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* QUIZ LIST OR EMPTY STATE */}
          {!selectedModule ? (
            <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Layers className="text-slate-300" size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Select a Module</h3>
              <p className="text-slate-400 font-medium text-center max-w-sm">Please select a faculty, intake, semester and module to manage its quizzes.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Quizzes for {modules.find(m => m.id == selectedModule)?.code}</h2>
                  <p className="text-sm font-bold text-indigo-500">{quizzes.length} assessments active</p>
                </div>
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create New Quiz
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-indigo-600" size={40} />
                </div>
              ) : quizzes.length === 0 ? (
                <div className="bg-white rounded-[32px] p-16 flex flex-col items-center border border-slate-100">
                  <p className="text-slate-400 font-bold mb-4">No quizzes found for this module.</p>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="text-indigo-600 font-black hover:underline"
                  >
                    Click here to create the first one
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black">
                          {quiz.id}
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                      <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{quiz.description}</p>
                      
                      <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">{quiz.duration} mins</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">{quiz.total_marks} marks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">{quiz.questions?.length || 0} questions</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* CREATE QUIZ MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[48px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-12 py-10 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Assessment</h2>
                <p className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">New Quiz Configuration</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Quiz Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Advanced Algorithms - Phase 1"
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-bold text-slate-700 transition-all"
                      value={form.title}
                      onChange={e => setForm({...form, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Description</label>
                    <textarea 
                      placeholder="Briefly describe the quiz objectives..."
                      className="w-full h-40 px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-medium text-slate-600 transition-all resize-none"
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Duration (Min)</label>
                      <input 
                        type="number" 
                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-bold text-slate-700 transition-all"
                        value={form.duration}
                        onChange={e => setForm({...form, duration: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Total Marks</label>
                      <input 
                        type="number" 
                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-3xl outline-none font-bold text-slate-700 transition-all"
                        value={form.total_marks}
                        onChange={e => setForm({...form, total_marks: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="text-white" size={16} />
                      </div>
                      <h4 className="font-black text-indigo-900 uppercase tracking-widest text-[10px]">Placement Context</h4>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-indigo-700 flex justify-between">
                        <span>Faculty:</span> 
                        <span>{faculties.find(f => f.id == selectedFaculty)?.name}</span>
                      </p>
                      <p className="text-xs font-bold text-indigo-700 flex justify-between">
                        <span>Intake:</span> 
                        <span>{intakes.find(i => i.id == selectedIntake)?.name}</span>
                      </p>
                      <p className="text-xs font-bold text-indigo-700 flex justify-between">
                        <span>Module:</span> 
                        <span>{modules.find(m => m.id == selectedModule)?.code}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QUESTIONS */}
              <div className="pt-12 border-t border-slate-100">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900">Questions Pool</h3>
                  <button 
                    onClick={addQuestion}
                    className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-all flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Question
                  </button>
                </div>

                <div className="space-y-8">
                  {form.questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-slate-50/50 border-2 border-slate-100 rounded-[32px] p-8 relative group/q">
                      <button 
                        onClick={() => removeQuestion(qIdx)}
                        className="absolute -top-3 -right-3 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover/q:opacity-100"
                      >
                        <X size={20} />
                      </button>
                      
                      <div className="mb-8">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Question {qIdx + 1}</label>
                        <input 
                          type="text" 
                          placeholder="Enter your question here..."
                          className="w-full px-6 py-5 bg-white border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none font-bold text-slate-700 shadow-sm"
                          value={q.question}
                          onChange={e => updateQuestion(qIdx, 'question', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name={`correct-${qIdx}`}
                              checked={q.correct_answer === opt && opt !== ""}
                              onChange={() => updateQuestion(qIdx, 'correct_answer', opt)}
                              className="w-5 h-5 accent-indigo-600"
                            />
                            <input 
                              type="text" 
                              placeholder={`Option ${oIdx + 1}`}
                              className={`flex-1 px-5 py-4 bg-white border-2 rounded-2xl outline-none font-medium transition-all ${
                                q.correct_answer === opt && opt !== "" ? "border-indigo-500 shadow-lg shadow-indigo-50" : "border-transparent"
                              }`}
                              value={opt}
                              onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-12 py-10 border-t border-slate-100 bg-slate-50/50 flex gap-6">
              <button 
                onClick={() => setShowForm(false)}
                className="flex-1 py-5 text-slate-400 font-bold hover:text-slate-600 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isCreating || !form.title}
                className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                Publish Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
