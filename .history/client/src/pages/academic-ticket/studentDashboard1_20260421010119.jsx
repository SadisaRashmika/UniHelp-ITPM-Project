```jsx
import React, { useState, useEffect } from "react";
import {
  ChartColumnBig, Users, Settings, Sun, Moon, Bell, BookOpen, Briefcase, FileText,
  Trophy, Calendar, TrendingUp, Clock, User, Mail, MapPin, Activity,
  GraduationCap, AlertTriangle, Info, Search, Plus, Upload
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lightMode, setLightMode] = useState(false);
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      setStudentData({
        name: "Alex Johnson",
        studentId: "2024001",
        program: "Computer Science",
        gpa: 3.75,
        avatar: "AJ"
      });

      setUpcomingDeadlines([
        { id: 1, title: "Data Structures Assignment", course: "CS201", dueDate: "2024-04-10", priority: "high" },
        { id: 2, title: "Web Dev Quiz", course: "IT213", dueDate: "2024-04-12", priority: "medium" }
      ]);

      setRecentGrades([
        { id: 1, course: "CS201", grade: "A-" },
        { id: 2, course: "IT213", grade: "A" }
      ]);

      setAnnouncements([
        { id: 1, title: "Registration Open", type: "important" },
        { id: 2, title: "Library Extended", type: "info" }
      ]);

      setTodaySchedule([
        { id: 1, title: "Data Structures", time: "8:00 AM", room: "301" }
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className={`flex h-screen ${lightMode ? "bg-white text-slate-900" : "bg-slate-100 text-slate-800"}`}>

      {/* Sidebar */}
      <div className="w-72 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">Student Portal</h1>
        </div>

        <nav className="p-4 space-y-2">
          {["dashboard", "tasks", "submissions"].map((item) => (
            <div
              key={item}
              onClick={() => setActiveTab(item)}
              className={`p-3 rounded-lg cursor-pointer ${
                activeTab === item ? "bg-blue-600" : "hover:bg-slate-700"
              }`}
            >
              {item}
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              {studentData?.avatar}
            </div>
            <div>
              <p>{studentData?.name}</p>
              <p className="text-xs text-slate-400">{studentData?.studentId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>

          <div className="flex gap-3 items-center">
            <Search size={18} />
            <input className="border border-slate-300 px-2 py-1 rounded" />
          </div>
        </header>

        {/* Content */}
        <main className="p-6 overflow-auto">
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : (
            <div className="space-y-6">

              {/* Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-slate-500">GPA</p>
                  <h2 className="text-2xl font-bold">{studentData.gpa}</h2>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-slate-500">Program</p>
                  <h2 className="font-bold">{studentData.program}</h2>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-slate-500">Student ID</p>
                  <h2 className="font-bold">{studentData.studentId}</h2>
                </div>
              </div>

              {/* Deadlines */}
              <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-bold mb-3">Deadlines</h2>
                {upcomingDeadlines.map((d) => (
                  <div key={d.id} className="flex justify-between p-2 bg-slate-50 rounded mb-2">
                    <span>{d.title}</span>
                    <span className="text-slate-500">{d.dueDate}</span>
                  </div>
                ))}
              </div>

              {/* Grades */}
              <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-bold mb-3">Grades</h2>
                {recentGrades.map((g) => (
                  <div key={g.id} className="flex justify-between p-2 bg-slate-50 rounded mb-2">
                    <span>{g.course}</span>
                    <span>{g.grade}</span>
                  </div>
                ))}
              </div>

              {/* Announcements */}
              <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-bold mb-3">Announcements</h2>
                {announcements.map((a) => (
                  <div key={a.id} className="p-2 bg-slate-50 rounded mb-2">
                    {a.title}
                  </div>
                ))}
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
```
