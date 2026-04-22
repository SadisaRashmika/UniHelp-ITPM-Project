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
  Moon,
  Award
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
    { icon: BookOpen, label: "Quiz", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Practicals", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Award, label: "Grades", link: "/academic-ticket/student-dashboard/grades", key: "grades" },
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
    <div className="flex h-screen bg-transparent text-slate-900 ">

      {/* SIDEBAR */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UH</span>
            </div>

            <div>
              <h1 className="text-xl  font-bold text-slate-900">Uni-Help System</h1>
              <p className="text-xs text-slate-400 mt-0.5">Overview</p>
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
      <div className="flex-1 p-8 overflow-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Academic Overview</h1>
          <p className="text-slate-500 mt-2 text-lg">Your academic performance at a glance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card title="Courses" value={studentStats.totalCourses} color="blue" icon={BookOpen} />
          <Card title="Completed" value={studentStats.completed} color="green" icon={CheckCircle} />
          <Card title="Average" value={studentStats.average + "%"} color="purple" icon={Trophy} />
          <Card title="Active Tasks" value={studentStats.active} color="orange" icon={FileText} />
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 mb-8 text-left">
          <h2 className="text-xl font-black text-slate-900 mb-6">Course Progress</h2>

          <div className="space-y-6">
            {courseProgress.map((c, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-700">{c.course}</span>
                  <span className="font-black text-blue-600">{c.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${c.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 text-left">
            <h2 className="text-xl font-black text-slate-900 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((a, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:border-blue-200">
                  <p className="font-black text-slate-900">{a.title}</p>
                  <p className="text-sm text-slate-500 font-bold mb-2">{a.course}</p>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">{a.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 text-left">
            <h2 className="text-xl font-black text-slate-900 mb-6">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {deadlines.map((d, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:border-red-200">
                  <p className="font-black text-slate-900">{d.title}</p>
                  <p className="text-sm text-slate-500 font-bold mb-2">{d.course}</p>
                  <div className="flex items-center gap-2 text-red-600">
                    <Clock size={14} />
                    <span className="text-xs font-black">Due: {new Date(d.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

/* CARD */
const Card = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100"
  };
  
  return (
    <div className={`p-6 rounded-[32px] border ${colors[color]} shadow-sm transition-transform hover:scale-[1.02] text-left`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{title}</p>
          <p className="text-3xl font-black">{value}</p>
        </div>
        <div className={`p-3 rounded-2xl bg-white shadow-sm`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default Overview;