import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Users, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Award, Play, Upload, Download, Eye, Settings, Bell, Search, Filter, Sun, Moon, ChevronRight, ChartColumnBig, Sun as SunIcon, Moon as MoonIcon, X, Edit, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Grades = () => {
  const navigate = useNavigate();
  const [lightMode, setLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState("grades");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [search, setSearch] = useState("");

  // Sidebar items
  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/lec-dashboard/overview", key: "overview" },
    { icon: FileText, label: "Create Quiz", link: "/academic-ticket/lec-dashboard/quiz", key: "quiz" },
    { icon: Users, label: "Create Practical", link: "/academic-ticket/lec-dashboard/practical", key: "practical" },
    { icon: Upload, label: "Submissions", link: "/academic-ticket/lec-dashboard/submissions", key: "submissions" },
    { icon: TrendingUp, label: "Analytics", link: "/academic-ticket/lec-dashboard/analytics", key: "analytics" },
    { icon: Award, label: "Grades", link: "/academic-ticket/lec-dashboard/grades", key: "grades" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  // Mock grades data
  const [grades, setGrades] = useState([]);

  const courses = [
    { id: "all", name: "All Courses" },
    { id: "CS301", name: "Database Management Systems" },
    { id: "CS302", name: "Web Development" },
    { id: "IT201", name: "IT Project Management" }
  ];

  const getGradeColor = (grade) => {
    if (grade >= 85) return 'text-green-600';
    if (grade >= 75) return 'text-blue-600';
    if (grade >= 65) return 'text-yellow-600';
    if (grade >= 55) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBadge = (grade) => {
    if (grade >= 85) return 'bg-green-100 text-green-800';
    if (grade >= 75) return 'bg-blue-100 text-blue-800';
    if (grade >= 65) return 'bg-yellow-100 text-yellow-800';
    if (grade >= 55) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredGrades = grades.filter(grade => {
    const matchesCourse = selectedCourse === "all" || grade.course === selectedCourse;
    const matchesSearch = !search || 
      grade.studentName.toLowerCase().includes(search.toLowerCase()) ||
      grade.studentId.toLowerCase().includes(search.toLowerCase()) ||
      grade.courseName.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const calculateStats = () => {
    const filtered = filteredGrades;
    const total = filtered.length;
    const avgGrade = total > 0 ? filtered.reduce((sum, g) => sum + g.overallGrade, 0) / total : 0;
    const highPerformers = filtered.filter(g => g.overallGrade >= 85).length;
    const atRisk = filtered.filter(g => g.overallGrade < 55).length;
    
    return { total, avgGrade, highPerformers, atRisk };
  };

  const stats = calculateStats();

  return (
    <div className="flex h-screen bg-transparent text-slate-900 ">
      {/* Sidebar */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Gra</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help System</span>
              <p className="text-xs text-slate-400 mt-0.5">Grades Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSidebarClick(item)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer transition-all text-left ${
                activeTab === item.key
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`}
            >
              <item.icon size={17} className={activeTab === item.key ? "text-blue-500" : "text-slate-400"} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto text-left">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Grades Management</h1>
            <p className="text-slate-500 mt-2 text-lg">View and manage student grades across all courses</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Students</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Average Grade</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{stats.avgGrade.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-green-50 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 border-l-4 border-l-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">High Performers</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{stats.highPerformers}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-2xl">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 border-l-4 border-l-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">At Risk</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{stats.atRisk}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-2xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students by name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="pl-12 pr-10 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold cursor-pointer appearance-none min-w-[240px]"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grades List */}
          <div className="space-y-6">
            {filteredGrades.map((grade) => (
              <div key={grade.id} className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                <div className="p-8 border-b border-slate-50">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{grade.studentName}</h3>
                      <p className="text-slate-400 font-bold">ID: {grade.studentId}</p>
                      <p className="text-blue-600 font-bold mt-1 uppercase text-xs tracking-widest">{grade.courseName}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="flex items-center md:justify-end gap-4 mb-2">
                        <span className={`text-4xl font-black ${getGradeColor(grade.overallGrade)} tracking-tighter`}>
                          {grade.overallGrade.toFixed(1)}%
                        </span>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getGradeBadge(grade.overallGrade)}`}>
                          Grade {grade.overallGrade >= 85 ? 'A' :
                           grade.overallGrade >= 75 ? 'B' :
                           grade.overallGrade >= 65 ? 'C' :
                           grade.overallGrade >= 55 ? 'D' : 'F'}
                        </span>
                      </div>
                      <div className="flex items-center md:justify-end gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <Users size={14} className="text-slate-300" />
                          <span>Attendance: {grade.attendance}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-slate-50/30">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Assessment Breakdown</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {grade.assignments.map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{assignment.title}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Weight: {(assignment.marks / grade.overallGrade * 100).toFixed(0)}% of total</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className={`text-xl font-black ${getGradeColor((assignment.marks / assignment.maxMarks) * 100)}`}>
                              {assignment.marks}/{assignment.maxMarks}
                            </p>
                            <p className="text-[10px] text-slate-400 font-black">
                              {((assignment.marks / assignment.maxMarks) * 100).toFixed(1)}%
                            </p>
                          </div>
                          <div className="w-20">
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  (assignment.marks / assignment.maxMarks) * 100 >= 85 ? 'bg-green-500' :
                                  (assignment.marks / assignment.maxMarks) * 100 >= 75 ? 'bg-blue-500' :
                                  (assignment.marks / assignment.maxMarks) * 100 >= 65 ? 'bg-yellow-500' :
                                  (assignment.marks / assignment.maxMarks) * 100 >= 55 ? 'bg-orange-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${(assignment.marks / assignment.maxMarks) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;
