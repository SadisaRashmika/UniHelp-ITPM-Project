import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
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
    { id: 1, task: "DB Assignment", course: "DBMS", date: "2026-04-10", status: "submitted", marks: null },
    { id: 2, task: "React Project", course: "Web Dev", date: "2026-04-12", status: "graded", marks: 85 },
    { id: 3, task: "ITPM Report", course: "ITPM", date: "2026-04-15", status: "submitted", marks: null },
    { id: 4, task: "Node API", course: "Backend", date: "2026-04-18", status: "pending", marks: null }
  ]);

  const filtered = submissions.filter(s =>
    filter === "all" || s.status === filter
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "graded":
        return "bg-purple-100 text-purple-800";
      case "submitted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">

      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r flex flex-col">
        <div className="p-5 border-b">
          <h2 className="font-bold text-xl">Uni-Help System</h2>
          <p className="text-xs text-gray-400">Submissions</p>
        </div>

        <nav className="flex-1 p-4">
          {sidebarItems.map((item, i) => (
            <div key={i}
              onClick={() => handleSidebarClick(item)}
              className={`flex gap-3 p-3 rounded-xl cursor-pointer ${
                activeTab === item.key ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
              }`}
            >
              <item.icon size={18}/>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t flex gap-3">
          <Sun onClick={()=>setLightMode(true)} className="cursor-pointer"/>
          <Moon onClick={()=>setLightMode(false)} className="cursor-pointer"/>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        <h1 className="text-3xl font-bold mb-6">Submissions</h1>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card title="Total" value={submissions.length} color="blue" icon={FileText}/>
          <Card title="Submitted" value={submissions.filter(s=>s.status==="submitted").length} color="green" icon={CheckCircle}/>
          <Card title="Pending" value={submissions.filter(s=>s.status==="pending").length} color="yellow" icon={Clock}/>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <select onChange={e=>setFilter(e.target.value)} className="border p-2 rounded">
            <option value="all">All</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="p-3">Task</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{s.task}</td>
                  <td>{s.course}</td>
                  <td>{s.date}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded ${getStatusBadge(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>{s.marks ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const Card = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow border-l-4 border-${color}-500`}>
    <div className="flex justify-between">
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <Icon className={`text-${color}-600`} />
    </div>
  </div>
);

export default SubmissionsPage;