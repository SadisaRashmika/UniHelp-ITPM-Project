import React, { useState } from "react";
import { Upload, FileText, X, CheckCircle, Clock, Palette, ChartColumnBig, BookOpen, Briefcase, Users, Bell, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Submissions = () => {
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("submissions");
  const [lightMode, setLightMode] = useState(false);

  const navigate = useNavigate();

  // Sidebar items
  const sidebarItems = [  
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Tasks", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Submissions", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: Users, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  const [submissions, setSubmissions] = useState([
    { 
      id: 1, 
      task: "Database Design Assignment", 
      course: "DBMS", 
      date: "2026-03-10", 
      status: "submitted", 
      version: 1, 
      size: "2MB", 
      type: "PDF",
      lecturer: "Dr. John Smith",
      marks: null,
      feedback: null,
      deadline: "2026-04-01"
    },
    { 
      id: 2, 
      task: "React E-commerce Project", 
      course: "Web Dev", 
      date: "2026-03-12", 
      status: "graded", 
      version: 2, 
      size: "5MB", 
      type: "ZIP",
      lecturer: "Dr. John Smith",
      marks: 85,
      feedback: "Excellent work on frontend implementation. Consider improving backend API documentation.",
      deadline: "2026-04-05"
    },
    { 
      id: 3, 
      task: "IT Project Plan", 
      course: "ITPM", 
      date: "2026-03-15", 
      status: "submitted", 
      version: 1, 
      size: "3MB", 
      type: "DOCX",
      lecturer: "Dr. Sarah Johnson",
      marks: null,
      feedback: null,
      deadline: "2026-04-10"
    },
    { 
      id: 4, 
      task: "Node.js API Development", 
      course: "Backend", 
      date: "2026-03-18", 
      status: "pending", 
      version: 1, 
      size: "4MB", 
      type: "ZIP",
      lecturer: "Dr. John Smith",
      marks: null,
      feedback: null,
      deadline: "2026-04-15"
    },
    { 
      id: 5, 
      task: "UI/UX Design Portfolio", 
      course: "Frontend", 
      date: "2026-03-20", 
      status: "graded", 
      version: 1, 
      size: "6MB", 
      type: "PSD",
      lecturer: "Dr. Sarah Johnson",
      marks: 92,
      feedback: "Outstanding design work! Very creative and professional portfolio presentation.",
      deadline: "2026-04-20"
    }
  ]);

  const handleUpload = () => {
    if (!file) return alert("Select a file first");

    const newSubmission = {
      id: submissions.length + 1,
      task: "New Task",
      course: "General",
      date: new Date().toISOString().split("T")[0],
      status: "submitted",
      version: 1,
      size: file.size / 1000000 + "MB",
      type: file.name.split(".").pop()
    };

    setSubmissions([newSubmission, ...submissions]);
    setFile(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'graded':
        return 'bg-purple-100 text-purple-800';
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    (filter === "all" || sub.status === filter) &&
    (courseFilter === "all" || sub.course === courseFilter)
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div className="w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Sub</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Uni-Help System</span>
              <p className="text-xs text-gray-400 mt-0.5">Submissions</p>
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
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
              }`}
            >
              <item.icon size={17} className={activeTab === item.key ? "text-blue-500" : "text-gray-400"} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Sun
              onClick={() => setLightMode(true)}
              size={20}
              className={`cursor-pointer ${lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <Moon
              onClick={() => setLightMode(false)}
              size={20}
              className={`cursor-pointer ${!lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <span className="text-xs text-gray-400">Theme</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assignment Submissions</h1>
            <p className="text-gray-600 mt-1">Upload and track your assignments</p>
          </div>
      </div>
        {/* UPLOAD SECTION */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upload Assignment</h2>
            <p className="text-sm text-gray-600 mt-1">Submit your work for grading</p>
          </div>
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="mb-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Click to upload or drag and drop
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    PDF, DOC, DOCX, ZIP up to 100MB
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setFile(e.target.files[0])} 
                  />
                </label>
              </div>
              {file && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1000000).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              <button 
                onClick={handleUpload} 
                className="mt-4 px-6 py-3 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{submissions.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Submitted</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{submissions.filter(s => s.status === "submitted").length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Graded</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{submissions.filter(s => s.status === "graded").length}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{submissions.filter(s => s.status === "pending").length}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Filter</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setCourseFilter(e.target.value)}>
                <option value="all">All Courses</option>
                <option value="DBMS">DBMS</option>
                <option value="Web Dev">Web Dev</option>
                <option value="ITPM">ITPM</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
              </select>
            </div>
          </div>
        </div>

        {/* SUBMISSIONS TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Submission History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lecturer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Info</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{sub.task}</div>
                        {sub.feedback && (
                          <div className="text-xs text-gray-500 mt-1 italic">"{sub.feedback.substring(0, 50)}..."</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {sub.course}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{sub.lecturer}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{sub.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {sub.marks ? (
                        <div>
                          <span className="font-semibold text-green-600">{sub.marks}/100</span>
                          <div className="text-xs text-gray-500">Grade: {sub.marks >= 90 ? 'A' : sub.marks >= 80 ? 'B' : sub.marks >= 70 ? 'C' : sub.marks >= 60 ? 'D' : 'F'}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span>{sub.size} {sub.type}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submissions;
