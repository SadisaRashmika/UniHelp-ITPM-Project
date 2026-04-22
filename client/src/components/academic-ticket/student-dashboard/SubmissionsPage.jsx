import React, { useState, useEffect } from "react";
import { ChartColumnBig, Users, Settings, Sun, Moon, Bell, BookOpen, Briefcase, FileText, Trophy, Award, Calendar, Target, TrendingUp, Clock, Star, MessageSquare, Heart, Share2, Download, Upload, Edit, Eye, CheckCircle, AlertCircle, Info, Video, Play, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubmissionsPage = () => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [lightMode, setLightMode] = useState(false);
  const navigate = useNavigate();

  // State for submissions
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.id;

  // Fetch submissions from API
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/modules/students/${studentId}/submissions`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        setError('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Error loading submissions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, [studentId]);

  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Quiz", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Practicals", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
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
    // Navigate to academic records page
    navigate('/academic-ticket/student-dashboard/academic-records');
  };

  const handleEditProfileClick = () => {
    // Navigate to profile edit page
    navigate('/academic-ticket/student-dashboard/edit-profile');
  };

  const handleEventsClick = () => {
    // Navigate to events page
    navigate('/academic-ticket/student-dashboard/events');
  };

  const handleAnnouncementsClick = () => {
    // Navigate to announcements page
    navigate('/academic-ticket/student-dashboard/announcements');
  };

  return (
    <div className={`flex h-screen ${lightMode ? "bg-white text-black" : "bg-gray-100 text-gray-900"}`}>
      {/* Header Sidebar */}
      <div className={`w-72 h-screen flex flex-col overflow-y-auto ${lightMode ? "bg-gray-800" : "bg-gray-900 text-white"}`}>
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
                className={`cursor-pointer ${lightMode ? "text-yellow-500" : "text-gray-400"}`}
              />
              <Moon
                onClick={() => setLightMode(false)}
                size={16}
                className={`cursor-pointer ${!lightMode ? "text-yellow-500" : "text-gray-400"}`}
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
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SUBMISSIONS</h1>
              <p className="text-sm text-gray-500 mt-1">View and manage your submitted work</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
                <p className="text-xs text-gray-500">Computer Science</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                AJ
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-500">Loading submissions...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-500">Error loading submissions</p>
                <button 
                  onClick={fetchSubmissions}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Total Submissions</h3>
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
                  <p className="text-sm text-gray-500">All submitted work</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Graded</h3>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{submissions.filter(s => s.status === 'graded').length}</p>
                  <p className="text-sm text-gray-500">With feedback</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{submissions.filter(s => s.status === 'pending').length}</p>
                  <p className="text-sm text-gray-500">Awaiting review</p>
                </div>
              </div>

              {/* Submissions List */}
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                  Recent Submissions
                </h3>
                
                {submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No submissions found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div 
                        key={submission.id} 
                        className="border-l-4 border-blue-500 pl-4 py-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{submission.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                submission.status === 'graded' 
                                  ? 'bg-green-100 text-green-700'
                                  : submission.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {submission.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{submission.course}</p>
                            <p className="text-sm text-gray-700 mb-2">{submission.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Submitted Date</p>
                                <p className="font-semibold text-gray-900">{submission.submittedDate}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Grade</p>
                                <p className="font-semibold text-gray-900">
                                  {submission.grade ? `${submission.grade}/100` : 'Not graded'}
                                </p>
                              </div>
                            </div>
                            {submission.feedback && (
                              <div className="mt-2 p-2 bg-white rounded">
                                <p className="text-sm text-gray-700">
                                  <strong>Feedback:</strong> {submission.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                              View Details
                            </button>
                            {submission.grade && (
                              <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                View Feedback
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SubmissionsPage;
