import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Users, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Award, Play, Upload, Download, Eye, Settings, Bell, Search, Filter, Sun, Moon, ChevronRight, ChartColumnBig, Sun as SunIcon, Moon as MoonIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/academic-ticket";

const Overview = () => {
  const navigate = useNavigate();
  const [lightMode, setLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // State for real data
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    pendingSubmissions: 0,
    averageGrade: 0,
    totalQuizzes: 0,
    activeQuizzes: 0,
    pendingQuizzes: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  // Fetch quiz statistics from API
  const fetchQuizStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/quizzes?lecturer_id=LEC001`);
      const data = await response.json();
      
      if (data.quizzes) {
        const quizzes = data.quizzes;
        const totalQuizzes = quizzes.length;
        const activeQuizzes = quizzes.filter(q => q.status === 'active').length;
        const pendingQuizzes = quizzes.filter(q => q.status === 'pending').length;
        
        setStats(prev => ({
          ...prev,
          totalQuizzes,
          activeQuizzes,
          pendingQuizzes
        }));
      }
    } catch (err) {
      console.error('Error fetching quiz stats:', err);
    }
  };

  // Fetch recent activities from API
  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/recent-activities?lecturer_id=LEC001&limit=5`);
      const data = await response.json();
      
      if (data.activities) {
        setRecentActivities(data.activities.map(activity => ({
          id: activity.id,
          type: 'quiz',
          title: activity.title,
          course: activity.course_code,
          students: 0, // Will be updated when we have student data
          date: new Date(activity.created_at).toLocaleDateString(),
          status: activity.status,
          priority: activity.priority,
          due_date: activity.due_date
        })));
      }
    } catch (err) {
      setError('Failed to fetch recent activities');
      console.error('Error fetching recent activities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch upcoming deadlines
  const fetchUpcomingDeadlines = async () => {
    try {
      const response = await fetch(`${API_BASE}/quizzes?lecturer_id=LEC001&status=pending`);
      const data = await response.json();
      
      if (data.quizzes) {
        setUpcomingDeadlines(data.quizzes.map(quiz => ({
          id: quiz.id,
          title: quiz.title,
          course: quiz.course_code,
          deadline: quiz.due_date,
          students: 0,
          priority: quiz.priority
        })));
      }
    } catch (err) {
      console.error('Error fetching upcoming deadlines:', err);
    }
  };

  useEffect(() => {
    fetchQuizStats();
    fetchRecentActivities();
    fetchUpcomingDeadlines();
  }, []);

  return (
    <div className="flex h-screen bg-transparent text-slate-900 ">
      {/* Sidebar */}
      <div className="w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Lec</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-gray-900">Uni-Help System</span>
              <p className="text-xs text-gray-400 mt-0.5">Lecturer Dashboard</p>
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
            <SunIcon
              onClick={() => setLightMode(true)}
              size={20}
              className={`cursor-pointer ${lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <MoonIcon
              onClick={() => setLightMode(false)}
              size={20}
              className={`cursor-pointer ${!lightMode ? "text-yellow-500" : "text-gray-400"}`}
            />
            <span className="text-xs text-gray-400">Theme</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lecturer Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your courses.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Courses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeCourses}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Quizzes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalQuizzes}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Average Grade</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.averageGrade}%</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'quiz' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'assignment' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'quiz' ? <FileText size={16} /> :
                         activity.type === 'assignment' ? <Upload size={16} /> :
                         <Play size={16} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.students} students</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{deadline.title}</p>
                      <p className="text-sm text-gray-600">{deadline.course}</p>
                      <p className="text-sm text-gray-500">{deadline.students} students</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">{deadline.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/academic-ticket/lec-dashboard/quiz')}
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FileText className="text-blue-600" size={20} />
                <span className="text-sm font-medium text-gray-900">Create Quiz</span>
              </button>
              <button
                onClick={() => navigate('/academic-ticket/lec-dashboard/practical')}
                className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Play className="text-green-600" size={20} />
                <span className="text-sm font-medium text-gray-900">Create Practical</span>
              </button>
              <button
                onClick={() => navigate('/academic-ticket/lec-dashboard/submissions')}
                className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <Upload className="text-yellow-600" size={20} />
                <span className="text-sm font-medium text-gray-900">View Submissions</span>
              </button>
              <button
                onClick={() => navigate('/academic-ticket/lec-dashboard/analytics')}
                className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <TrendingUp className="text-purple-600" size={20} />
                <span className="text-sm font-medium text-gray-900">View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
