import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChartColumnBig,
  BookOpen,
  Briefcase,
  Users,
  Bell,
  Sun,
  Moon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubmissionsPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("submissions");
  const [lightMode, setLightMode] = useState(false);
  const [filter, setFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

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

  const [submissions] = useState([
    {
      id: 1,
      task: "Database Design Assignment",
      course: "DBMS",
      date: "2026-03-10",
      status: "submitted",
      lecturer: "Dr. John Smith",
      marks: null
    },
    {
      id: 2,
      task: "React Project",
      course: "Web Dev",
      date: "2026-03-12",
      status: "graded",
      lecturer: "Dr. John Smith",
      marks: 85
    }
  ]);

  const filteredSubmissions = submissions.filter(sub =>
    (filter === "all" || sub.status === filter) &&
    (courseFilter === "all" || sub.course === courseFilter)
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "graded":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">

      {/* SIDEBAR (SAME AS TASK PAGE) */}
      <div className="w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TSK</span>
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
            <p className="text-gray-600 mt-1">Manage your assignment submissions</p>
          </div>
        </div>

        {/* CARDS (EXACT TASK STYLE) */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card title="Total" value={submissions.length} bg="bg-blue-100" icon={FileText} />
          <Card title="Submitted" value={submissions.filter(s => s.status === "submitted").length} bg="bg-yellow-100" icon={Clock} />
          <Card title="Graded" value={submissions.filter(s => s.status === "graded").length} bg="bg-green-100" icon={CheckCircle} />
          <Card title="Pending" value={submissions.filter(s => s.marks === null).length} bg="bg-red-100" icon={AlertCircle} />
        </div>

        {/* FILTERS */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">

            <div className="flex-1">
              <label className="text-sm font-medium">Status Filter</label>
              <select
                className="w-full mt-2 px-4 py-2 border rounded-lg"
                onChange={e => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium">Course Filter</label>
              <select
                className="w-full mt-2 px-4 py-2 border rounded-lg"
                onChange={e => setCourseFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="DBMS">DBMS</option>
                <option value="Web Dev">Web Dev</option>
              </select>
            </div>

          </div>
        </div>

        {/* TABLE (SAME STRUCTURE STYLE AS TASKS) */}
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
                    {sub.marks ? `${sub.marks}/100` : "-"}
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

/* CARD (EXACT TASK STYLE) */
const Card = ({ title, value, icon: Icon, bg }) => (
  <div className={`${bg} p-5 rounded-xl shadow`}>
    <div className="flex justify-between">
      <div>
        <p className="text-gray-700 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <Icon className="text-gray-700" />
    </div>
  </div>
);

export default SubmissionsPage;