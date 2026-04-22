import React, { useState, useEffect } from "react";
import { 
  ChartColumnBig, Users, Settings, Sun, Moon, Bell, BookOpen, Briefcase, FileText, 
  Trophy, Award, Calendar, Target, TrendingUp, Clock, Star, MessageSquare, Heart, 
  Share2, Download, Upload, Edit, Eye, CheckCircle, AlertCircle, Info, Video, Play, 
  Brain, GraduationCap, User, Mail, Phone, MapPin, Activity, BarChart3, 
  BookMarked, Timer, AlertTriangle, ChevronRight, Plus, Search, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = ({ embedded = false }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lightMode, setLightMode] = useState(false);
  const navigate = useNavigate();

  // State for dashboard data
  const [studentData, setStudentData] = useState(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.id;

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Mock data for now - replace with actual API calls
        const mockStudentData = {
          name: "Alex Johnson",
          studentId: "2024001",
          email: "alex.johnson@university.edu",
          phone: "+1 234 567 8900",
          program: "Computer Science & Engineering",
          year: "Year 2",
          semester: "Spring 2024",
          gpa: 3.75,
          totalCredits: 45,
          currentCredits: 15,
          avatar: "AJ"
        };

        const mockDeadlines = [
          {
            id: 1,
            title: "Data Structures Assignment",
            course: "CS201",
            type: "assignment",
            dueDate: "2024-04-10",
            dueTime: "11:59 PM",
            priority: "high",
            submitted: false
          },
          {
            id: 2,
            title: "Web Development Quiz",
            course: "IT213",
            type: "quiz",
            dueDate: "2024-04-12",
            dueTime: "2:00 PM",
            priority: "medium",
            submitted: false
          },
          {
            id: 3,
            title: "Database Lab Report",
            course: "CS203",
            type: "practical",
            dueDate: "2024-04-15",
            dueTime: "5:00 PM",
            priority: "medium",
            submitted: false
          }
        ];

        const mockGrades = [
          {
            id: 1,
            course: "CS201",
            assignment: "Midterm Exam",
            grade: "A-",
            score: 88,
            total: 100,
            date: "2024-03-28"
          },
          {
            id: 2,
            course: "IT213",
            assignment: "Project 1",
            grade: "A",
            score: 95,
            total: 100,
            date: "2024-03-25"
          },
          {
            id: 3,
            course: "CS203",
            assignment: "Quiz 3",
            grade: "B+",
            score: 82,
            total: 100,
            date: "2024-03-22"
          }
        ];

        const mockAnnouncements = [
          {
            id: 1,
            title: "Spring Semester Registration Open",
            content: "Registration for Spring 2024 courses is now open. Please register before April 15.",
            type: "important",
            date: "2024-04-08",
            author: "Academic Affairs"
          },
          {
            id: 2,
            title: "Library Hours Extended",
            content: "Library hours extended during final exam period. Open until 11 PM daily.",
            type: "info",
            date: "2024-04-07",
            author: "Library Services"
          },
          {
            id: 3,
            title: "Career Fair Next Week",
            content: "Annual career fair will be held on April 20. Don't miss this opportunity!",
            type: "event",
            date: "2024-04-06",
            author: "Career Services"
          }
        ];

        const mockSchedule = [
          {
            id: 1,
            course: "CS201",
            title: "Data Structures & Algorithms",
            time: "8:00 AM - 9:30 AM",
            room: "Room 301",
            type: "lecture",
            instructor: "Dr. Smith"
          },
          {
            id: 2,
            course: "IT213",
            title: "Web Development",
            time: "10:00 AM - 11:30 AM",
            room: "Lab 205",
            type: "lab",
            instructor: "Prof. Johnson"
          },
          {
            id: 3,
            course: "CS203",
            title: "Database Systems",
            time: "2:00 PM - 3:30 PM",
            room: "Room 402",
            type: "lecture",
            instructor: "Dr. Brown"
          }
        ];

        setStudentData(mockStudentData);
        setUpcomingDeadlines(mockDeadlines);
        setRecentGrades(mockGrades);
        setAnnouncements(mockAnnouncements);
        setTodaySchedule(mockSchedule);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [studentId]);

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Tasks", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Submissions", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Briefcase, label: "Jobs", link: "/academic-ticket/student-dashboard/jobs", key: "jobs" },
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div
      className={
        embedded
          ? "w-full bg-gray-50 text-gray-900 rounded-2xl"
          : "flex w-full min-h-[700px] bg-gray-50 text-gray-900 rounded-2xl overflow-hidden"
      }
    >
      {/* Header Sidebar */}
      {!embedded && (
      <div className="w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
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
      )}

      {/* Main Content Area */}
      <div className={embedded ? "w-full flex flex-col overflow-auto min-w-0" : "flex-1 flex flex-col overflow-auto min-w-0"}>

        {/* Page Content */}
        <main className={embedded ? "p-4 md:p-5 overflow-auto" : "flex-1 p-5 md:p-6 overflow-auto"}>
          {embedded && (
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-gray-900">Student Jobs Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, {studentData?.name || "Alex Johnson"}!</p>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-500">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
                {/* Student Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* GPA Card */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Trophy className="text-blue-600" size={24} />
                      </div>
                      <span className="text-sm text-gray-500">Current</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{studentData?.gpa || "3.75"}</h3>
                    <p className="text-sm text-gray-600">GPA</p>
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <TrendingUp size={12} className="mr-1" />
                      <span>+0.2 from last semester</span>
                    </div>
                  </div>

                  {/* Credits Card */}
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <GraduationCap className="text-green-600" size={24} />
                      </div>
                      <span className="text-sm text-gray-500">This Semester</span>
                    </div>
                  <h3 className="text-3xl font-bold text-gray-900">{studentData?.currentCredits || "15"}</h3>
                  <p className="text-sm text-gray-600">Credits</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Total: {studentData?.totalCredits || "45"} credits
                  </div>
                </div>

                {/* Semester Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="text-purple-600" size={24} />
                    </div>
                    <span className="text-sm text-gray-500">Academic Year</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{studentData?.year || "Year 2"}</h3>
                  <p className="text-sm text-gray-600">{studentData?.semester || "Spring 2024"}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {studentData?.program || "Computer Science"}
                  </div>
                </div>

                {/* Overview Completion Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <User className="text-orange-600" size={24} />
                    </div>
                    <span className="text-sm text-gray-500">Overview</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">85%</h3>
                  <p className="text-sm text-gray-600">Complete</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Deadlines */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Upcoming Deadlines</h2>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View All
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {upcomingDeadlines.map((deadline) => (
                          <div key={deadline.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${getPriorityColor(deadline.priority)}`}>
                                {deadline.type === 'assignment' && <FileText size={20} />}
                                {deadline.type === 'quiz' && <Brain size={20} />}
                                {deadline.type === 'practical' && <Activity size={20} />}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{deadline.title}</h4>
                                <p className="text-sm text-gray-600">{deadline.course}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{deadline.dueDate}</p>
                              <p className="text-xs text-gray-500">{deadline.dueTime}</p>
                              <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                                {deadline.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {todaySchedule.map((schedule) => (
                        <div key={schedule.id} className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            schedule.type === 'lecture' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {schedule.type === 'lecture' ? <BookOpen size={16} /> : <Activity size={16} />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{schedule.title}</h4>
                            <p className="text-sm text-gray-600">{schedule.course}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <Clock size={12} />
                              <span>{schedule.time}</span>
                              <MapPin size={12} />
                              <span>{schedule.room}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Grades */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Recent Grades</h2>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentGrades.map((grade) => (
                        <div key={grade.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                            <p className="text-sm text-gray-600">{grade.course}</p>
                            <p className="text-xs text-gray-500">{grade.date}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${getGradeColor(grade.grade)}`}>{grade.grade}</p>
                            <p className="text-sm text-gray-600">{grade.score}/{grade.total}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Announcements */}
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              announcement.type === 'important' ? 'bg-red-100 text-red-600' :
                              announcement.type === 'event' ? 'bg-purple-100 text-purple-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {announcement.type === 'important' && <AlertTriangle size={16} />}
                              {announcement.type === 'event' && <Calendar size={16} />}
                              {announcement.type === 'info' && <Info size={16} />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                <span>{announcement.date}</span>
                                <span>by {announcement.author}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Plus className="text-blue-600 mb-2" size={24} />
                    <span className="text-sm font-medium text-gray-900">Register Course</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <Upload className="text-green-600 mb-2" size={24} />
                    <span className="text-sm font-medium text-gray-900">Submit Assignment</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <Calendar className="text-purple-600 mb-2" size={24} />
                    <span className="text-sm font-medium text-gray-900">View Schedule</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <Mail className="text-orange-600 mb-2" size={24} />
                    <span className="text-sm font-medium text-gray-900">Contact Advisor</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const StatItem = ({ icon, iconBg, label, val }) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-blue-100/70 bg-white/75 transition-colors hover:bg-white">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-900">{val}</span>
  </div>
);

export default StudentDashboard;
