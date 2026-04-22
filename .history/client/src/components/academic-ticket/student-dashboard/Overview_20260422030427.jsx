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

  // SAME SIDEBAR
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

  // MOCK DATA
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

      {/* SIDEBAR (IDENTICAL STYLE) */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b">
          <h1 className="text-xl font-bold">Uni-Help System</h1>
          <p className="text-xs text-gray-400">Overview</p>
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
              {item.label}
            </div>
          ))}
        </nav>

        {/* THEME */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <Sun
              onClick={() => setLightMode(true)}
              className={`cursor-pointer ${lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <Moon
              onClick={() => setLightMode(false)}
              className={`cursor-pointer ${!lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-auto">

        {/* HEADER (MATCHED) */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-gray-600">Your academic dashboard</p>
        </div>

        {/* SUMMARY CARDS (SAME STYLE AS SUBMISSIONS) */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">

          <Card title="Courses" value={studentStats.totalCourses} color="blue" icon={BookOpen} />
          <Card title="Completed" value={studentStats.completed} color="green" icon={CheckCircle} />
          <Card title="Average" value={studentStats.average + "%"} color="purple" icon={Trophy} />
          <Card title="Active Tasks" value={studentStats.active} color="yellow" icon={FileText} />

        </div>

        {/* COURSE PROGRESS (SAME CARD STYLE) */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Course Progress</h2>

          <div className="space-y-4">
            {courseProgress.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span>{c.course}</span>
                  <span>{c.progress}%</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TWO COLUMN SECTION */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* RECENT */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>

            <div className="space-y-3">
              {recentActivities.map((a, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-gray-500">{a.course}</p>
                  <span className="text-xs text-blue-600">{a.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DEADLINES */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>

            <div className="space-y-3">
              {deadlines.map((d, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <p className="font-medium">{d.title}</p>
                  <p className="text-sm text-gray-500">{d.course}</p>
                  <span className="text-xs text-red-600">Due: {d.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

/* SAME CARD COMPONENT */
const Card = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-${color}-500`}>
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        <Icon className={`text-${color}-600`} />
      </div>
    </div>
  </div>
);

export default Overview;