import React, { useState, useEffect } from "react";
import {
  ChartColumnBig,
  BookOpen,
  FileText,
  Trophy,
  Calendar,
  Clock,
  CheckCircle,
  Users,
  Activity,
  Bell,
  Briefcase,
  Sun,
  Moon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [lightMode, setLightMode] = useState(false);

  const [studentStats, setStudentStats] = useState({});
  const [courseProgress, setCourseProgress] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [deadlines, setDeadlines] = useState([]);

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

  useEffect(() => {
    setStudentStats({
      totalCourses: 6,
      completed: 12,
      average: 85,
      active: 3
    });

    setCourseProgress([
      { course: "DBMS", progress: 75, grade: 88 },
      { course: "Web Dev", progress: 60, grade: 85 },
      { course: "DSA", progress: 85, grade: 90 }
    ]);

    setRecentActivities([
      { title: "Database Assignment", course: "DBMS", status: "submitted" },
      { title: "React Quiz", course: "Web Dev", status: "completed" }
    ]);

    setDeadlines([
      { title: "Algorithm Assignment", course: "DSA", date: "2026-04-22" },
      { title: "Database Quiz", course: "DBMS", date: "2026-04-24" }
    ]);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">

      {/* SIDEBAR (same style as TasksPage) */}
      <div className="w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Uni-Help System</h1>
            <p className="text-xs text-gray-400 mt-0.5">Overview</p>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-600 mt-1">Your academic dashboard</p>
        </div>

        {/* STATS CARDS (MATCHED STYLE) */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card title="Courses" value={studentStats.totalCourses} bg="bg-blue-100" icon={BookOpen} />
          <Card title="Completed" value={studentStats.completed} bg="bg-green-100" icon={CheckCircle} />
          <Card title="Average" value={studentStats.average + "%"} bg="bg-purple-100" icon={Trophy} />
          <Card title="Active Tasks" value={studentStats.active} bg="bg-yellow-100" icon={FileText} />
        </div>

        {/* COURSE PROGRESS */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Course Progress</h2>

          <div className="space-y-4">
            {courseProgress.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span>{c.course}</span>
                  <span>{c.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TWO COLUMN */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            {recentActivities.map((a, i) => (
              <div key={i} className="p-3 border rounded-lg mb-3">
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-gray-500">{a.course}</p>
                <span className="text-xs text-blue-600">{a.status}</span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
            {deadlines.map((d, i) => (
              <div key={i} className="p-3 border rounded-lg mb-3">
                <p className="font-medium">{d.title}</p>
                <p className="text-sm text-gray-500">{d.course}</p>
                <span className="text-xs text-red-600">Due: {d.date}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

/* SAME CARD STYLE AS TASKS PAGE */
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

export default Overview;