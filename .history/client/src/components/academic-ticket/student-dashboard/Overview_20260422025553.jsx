import React, { useState, useEffect } from 'react';
import { 
  ChartColumnBig, BookOpen, FileText, Trophy, Calendar, Clock, 
  TrendingUp, Target, AlertCircle, CheckCircle, Users, Award,
  BarChart3, Activity, Star, Brain, GraduationCap, Settings, Sun, Moon, Bell, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../../../contexts/ThemeContext";

const Overview = () => {
  const { currentTheme, toggleLightMode, updateColorPalette, allPalettes } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  
  // Get current theme colors
  const theme = allPalettes?.[currentTheme] || allPalettes?.default || {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b'
  };
  const isLightMode = theme.background === '#ffffff' || theme.background === '#eff6ff' || theme.background === '#ecfdf5';
  const [loading, setLoading] = useState(true);
  const [studentStats, setStudentStats] = useState({
    totalCourses: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    upcomingQuizzes: 0,
    averageGrade: 0,
    studyStreak: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [courseProgress, setCourseProgress] = useState([]);

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Tasks", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Submissions", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: Users, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const bottomItems = [{ icon: Settings, label: "Settings", link: "/academic-ticket/student-dashboard/settings", key: "settings" }];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    if (item.link) navigate(item.link);
  };

  const handleAcademicRecordsClick = () => {
    navigate('/academic-ticket/student-dashboard/academic-records');
  };

  const handleEditProfileClick = () => {
    navigate('/academic-ticket/student-dashboard/edit-profile');
  };

  const handleEventsClick = () => {
    navigate('/academic-ticket/student-dashboard/events');
  };

  const handleAnnouncementsClick = () => {
    navigate('/academic-ticket/student-dashboard/announcements');
  };

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        
        // Mock data - replace with actual API calls
        const mockStats = {
          totalCourses: 6,
          activeAssignments: 3,
          completedAssignments: 12,
          upcomingQuizzes: 2,
          averageGrade: 85.5,
          studyStreak: 7
        };

        const mockActivities = [
          {
            id: 1,
            type: 'assignment',
            title: 'Database Design Project',
            course: 'CS301',
            status: 'submitted',
            date: '2026-04-18',
            grade: null
          },
          {
            id: 2,
            type: 'quiz',
            title: 'React Fundamentals Quiz',
            course: 'CS302',
            status: 'completed',
            date: '2026-04-17',
            grade: 92
          },
          {
            id: 3,
            type: 'assignment',
            title: 'Web Development Practical',
            course: 'CS302',
            status: 'in-progress',
            date: '2026-04-20',
            grade: null
          }
        ];

        const mockDeadlines = [
          {
            id: 1,
            title: 'Algorithm Analysis Assignment',
            course: 'CS201',
            dueDate: '2026-04-22',
            priority: 'high',
            type: 'assignment'
          },
          {
            id: 2,
            title: 'Database Quiz',
            course: 'CS301',
            dueDate: '2026-04-24',
            priority: 'medium',
            type: 'quiz'
          },
          {
            id: 3,
            title: 'React Project Submission',
            course: 'CS302',
            dueDate: '2026-04-25',
            priority: 'high',
            type: 'project'
          }
        ];

        const mockCourseProgress = [
          {
            course: 'CS301',
            title: 'Database Management Systems',
            progress: 75,
            grade: 88,
            nextClass: 'Tomorrow, 10:00 AM'
          },
          {
            course: 'CS302',
            title: 'Web Development',
            progress: 60,
            grade: 85,
            nextClass: 'Today, 2:00 PM'
          },
          {
            course: 'CS201',
            title: 'Data Structures & Algorithms',
            progress: 85,
            grade: 90,
            nextClass: 'Wednesday, 11:00 AM'
          }
        ];

        setStudentStats(mockStats);
        setRecentActivities(mockActivities);
        setUpcomingDeadlines(mockDeadlines);
        setCourseProgress(mockCourseProgress);
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Header Sidebar */}
      <div className="w-72 h-screen flex flex-col overflow-y-auto bg-gray-900 text-white">
        {/* Logo and Brand */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎓</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">UniHelp</h1>
              <p className="text-xs text-gray-400">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Static Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {sidebarItems.map((item, i) => (
              <div
                key={i}
                onClick={() => handleSidebarClick(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  activeTab === item.key
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <h3 className="text-xs uppercase text-gray-400 mb-3 font-semibold">Quick Access</h3>
            <div className="space-y-1">
              <div
                onClick={handleAcademicRecordsClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-700 text-white"
              >
                <FileText size={20} />
                <span className="font-medium">Academic Records</span>
              </div>
              <div
                onClick={handleEventsClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-700 text-white"
              >
                <Calendar size={20} />
                <span className="font-medium">Events</span>
              </div>
              <div
                onClick={handleAnnouncementsClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-700 text-white"
              >
                <Bell size={20} />
                <span className="font-medium">Announcements</span>
              </div>
            </div>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              AJ
            </div>
            <div>
              <p className="text-sm font-medium text-white">Alex Johnson</p>
              <p className="text-xs text-gray-400">Student ID: 2024001</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-2">
              <Sun
                onClick={() => setLightMode(true)}
                size={16}
                className="cursor-pointer text-yellow-500"
              />
              <Moon
                onClick={() => setLightMode(false)}
                size={16}
                className="cursor-pointer text-gray-400"
              />
              <span className="text-xs text-gray-400">Theme</span>
            </div>
            {bottomItems.map((item, i) => (
              <div
                key={i}
                onClick={() => handleSidebarClick(item)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 text-white transition-colors"
              >
                <item.icon size={16} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h1 className="text-3xl font-bold mb-2">Student Overview</h1>
        <p className="text-blue-100">Welcome back! Here's your academic progress at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Total Courses</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{studentStats.totalCourses}</h3>
          <p className="text-sm text-gray-600">Active this semester</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Completed</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{studentStats.completedAssignments}</h3>
          <p className="text-sm text-gray-600">Assignments done</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Trophy className="text-purple-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Average Grade</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{studentStats.averageGrade}%</h3>
          <p className="text-sm text-gray-600">Across all courses</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Active Tasks</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{studentStats.activeAssignments}</h3>
          <p className="text-sm text-gray-600">Pending completion</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="text-red-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Upcoming</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{studentStats.upcomingQuizzes}</h3>
          <p className="text-sm text-gray-600">Quizzes this week</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Activity className="text-yellow-600" size={24} />
            </div>
            <span className="text-sm text-gray-500">Study Streak</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{studentStats.studyStreak}</h3>
          <p className="text-sm text-gray-600">Days in a row</p>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 size={24} className="text-blue-600" />
          Course Progress
        </h2>
        <div className="space-y-4">
          {courseProgress.map((course, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.course}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">{course.grade}%</span>
                  <p className="text-xs text-gray-500">Grade</p>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Next class: {course.nextClass}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={24} className="text-green-600" />
            Recent Activities
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'quiz' ? 'bg-purple-100' : 
                  activity.type === 'assignment' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'quiz' ? <Brain className="text-purple-600" size={20} /> :
                   activity.type === 'assignment' ? <FileText className="text-blue-600" size={20} /> :
                   <CheckCircle className="text-green-600" size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.course}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      activity.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activity.status}
                    </span>
                    {activity.grade && (
                      <span className="text-xs text-gray-500">Grade: {activity.grade}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-red-600" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`p-2 rounded-lg ${
                  deadline.priority === 'high' ? 'bg-red-100' : 
                  deadline.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <Calendar className={`${
                    deadline.priority === 'high' ? 'text-red-600' : 
                    deadline.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`} size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{deadline.title}</h4>
                  <p className="text-sm text-gray-600">{deadline.course}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">Due: {deadline.dueDate}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
                      deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {deadline.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
        </main>
      </div>
    </div>
  );
};

export default Overview;
