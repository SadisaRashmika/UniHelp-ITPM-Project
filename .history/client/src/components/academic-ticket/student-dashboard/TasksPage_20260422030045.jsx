import React, { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChartColumnBig,
  Briefcase,
  Users,
  Bell,
  Sun,
  Moon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TasksPage = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const [lightMode, setLightMode] = useState(true);

  // Sidebar items (same as submissions)
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

  // Mock Data
  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: "Data Structures Assignment",
        course: "CS201",
        type: "practical",
        description: "Binary search tree implementation",
        due_date: "2026-04-25",
        status: "pending",
      },
      {
        id: 2,
        title: "Database Quiz",
        course: "CS203",
        type: "quiz",
        due_date: "2026-04-23",
        status: "pending",
      },
      {
        id: 3,
        title: "React Practical",
        course: "IT213",
        type: "practical",
        due_date: "2026-04-20",
        status: "completed",
      },
    ];

    setTasks(mockTasks);
  }, []);

  const quizzes = tasks.filter(t => t.type === "quiz");
  const practicals = tasks.filter(t => t.type === "practical");

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      
      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b">
          <h1 className="text-xl font-bold">Uni-Help System</h1>
          <p className="text-xs text-gray-400">Tasks</p>
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
              <item.icon size={18} />
              {item.label}
            </div>
          ))}
        </nav>

        {/* Theme toggle */}
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

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-gray-600">View and manage your assignments</p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total" value={tasks.length} icon={BookOpen} color="blue" />
          <StatCard title="Pending" value={tasks.filter(t => t.status === "pending").length} icon={Clock} color="yellow" />
          <StatCard title="Completed" value={tasks.filter(t => t.status === "completed").length} icon={CheckCircle} color="green" />
          <StatCard
            title="Due Soon"
            value={tasks.filter(t => {
              const diff = (new Date(t.due_date) - new Date()) / (1000 * 60 * 60 * 24);
              return diff <= 3 && diff >= 0;
            }).length}
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* QUIZZES */}
        <Section title="Quizzes">
          {quizzes.length === 0 ? (
            <Empty />
          ) : (
            quizzes.map(q => <TaskCard key={q.id} task={q} />)
          )}
        </Section>

        {/* PRACTICALS */}
        <Section title="Practical Assignments">
          {practicals.length === 0 ? (
            <Empty />
          ) : (
            practicals.map(p => <TaskCard key={p.id} task={p} />)
          )}
        </Section>

      </div>
    </div>
  );
};

/* COMPONENTS */

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow border-l-4 border-${color}-500`}>
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <Icon className={`text-${color}-500`} />
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const TaskCard = ({ task }) => (
  <div className="border rounded-lg p-4 hover:bg-gray-50">
    <div className="flex justify-between">
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.course}</p>
        {task.description && (
          <p className="text-sm mt-1">{task.description}</p>
        )}
        <p className="text-sm mt-2">
          Due: <span className="font-medium">{task.due_date}</span>
        </p>
      </div>

      <div>
        {task.status === "pending" ? (
          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            Start
          </button>
        ) : (
          <button className="bg-gray-600 text-white px-3 py-1 rounded">
            View
          </button>
        )}
      </div>
    </div>
  </div>
);

const Empty = () => (
  <p className="text-gray-500 text-center py-6">No data available</p>
);

export default TasksPage;