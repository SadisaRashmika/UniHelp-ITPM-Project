import React, { useState } from "react";
import {
  Upload, FileText, X, CheckCircle, Clock,
  ChartColumnBig, BookOpen, Briefcase, Users, Bell,
  Sun, Moon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Submissions = () => {
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("submissions");
  const [lightMode, setLightMode] = useState(true);

  const navigate = useNavigate();

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
      size: "2MB",
      type: "PDF",
      lecturer: "Dr. John Smith",
      marks: null
    },
    {
      id: 2,
      task: "React Project",
      course: "Web Dev",
      date: "2026-03-12",
      status: "graded",
      size: "5MB",
      type: "ZIP",
      lecturer: "Dr. John Smith",
      marks: 85
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
      size: (file.size / 1000000).toFixed(2) + "MB",
      type: file.name.split(".").pop()
    };

    setSubmissions([newSubmission, ...submissions]);
    setFile(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "graded":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    (filter === "all" || sub.status === filter) &&
    (courseFilter === "all" || sub.course === courseFilter)
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">

      {/* SIDEBAR (MATCHED WITH TASK PAGE STYLE) */}
      <div className="w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SUB</span>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 cursor-pointer ${
                activeTab === item.key
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={17} />
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col p-6 overflow-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
            <p className="text-gray-600 mt-1">Upload and track assignments</p>
          </div>
        </div>

        {/* UPLOAD CARD (TASK STYLE) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload Assignment</h2>

          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />

          <button
            onClick={handleUpload}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload
          </button>
        </div>

        {/* CARDS (TASK STYLE MATCHED COLORS ONLY) */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">

          <Card title="Total" value={submissions.length} bg="bg-blue-100" />
          <Card title="Submitted" value={submissions.filter(s => s.status === "submitted").length} bg="bg-yellow-100" />
          <Card title="Graded" value={submissions.filter(s => s.status === "graded").length} bg="bg-green-100" />

        </div>

        {/* FILTERS */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 flex gap-4">
          <select onChange={e => setFilter(e.target.value)} className="border px-3 py-2 rounded">
            <option value="all">All</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>

          <select onChange={e => setCourseFilter(e.target.value)} className="border px-3 py-2 rounded">
            <option value="all">All Courses</option>
            <option value="DBMS">DBMS</option>
            <option value="Web Dev">Web Dev</option>
          </select>
        </div>

        {/* TABLE (UNCHANGED STRUCTURE) */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3">Task</th>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Lecturer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Marks</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubmissions.map(sub => (
                <tr key={sub.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{sub.task}</td>
                  <td className="px-6 py-4">{sub.course}</td>
                  <td className="px-6 py-4">{sub.lecturer}</td>
                  <td className="px-6 py-4">{sub.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {sub.marks ? sub.marks + "/100" : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

/* CARD (TASK STYLE COLORS ONLY CHANGED) */
const Card = ({ title, value, bg }) => (
  <div className={`${bg} p-5 rounded-xl shadow`}>
    <div>
      <p className="text-gray-700 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
);

export default Submissions;