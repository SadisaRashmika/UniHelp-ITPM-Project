import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Calendar, BookOpen, Clock, User, Sun, Moon, ChartColumnBig, FileText, Briefcase, Award } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [lightMode, setLightMode] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const navigate = useNavigate();

  // Sidebar items
  const sidebarItems = [
    { icon: ChartColumnBig, label: "Overview", link: "/academic-ticket/student-dashboard/overview", key: "overview" },
    { icon: BookOpen, label: "Quiz", link: "/academic-ticket/student-dashboard/tasks", key: "tasks" },
    { icon: FileText, label: "Practicals", link: "/academic-ticket/student-dashboard/submissions", key: "submissions" },
    { icon: Award, label: "Grades", link: "/academic-ticket/student-dashboard/grades", key: "grades" },
    { icon: Briefcase, label: "Career", link: "/academic-ticket/student-dashboard/career", key: "career" },
    { icon: User, label: "Resume", link: "/academic-ticket/student-dashboard/resume", key: "resume" },
    { icon: Bell, label: "Notifications", link: "/academic-ticket/student-dashboard/notifications", key: "notifications" },
  ];

  const handleSidebarClick = (item) => {
    setActiveTab(item.key);
    navigate(item.link);
  };

  const markAsRead = async (notificationId) => {
    try {
      // Update local state to mark as read (mock implementation)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true } 
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Redirect based on notification type
    if (notification.type === 'quiz') {
      navigate('/academic-ticket/student-dashboard/tasks');
    } else if (notification.type === 'assignment') {
      navigate('/academic-ticket/student-dashboard/submissions');
    } else if (notification.type === 'career') {
      navigate('/academic-ticket/student-dashboard/career');
    } else {
      navigate('/academic-ticket/studentdashboard');
    }
  };

  useEffect(() => {
    // Load notifications using mock data for now
    const fetchNotifications = async () => {
      try {
        // Mock notifications data (in production, this would fetch from API)
        const mockNotifications = [
          {
            id: 1,
            type: 'assignment',
            title: 'New Assignment Available',
            message: 'Database Design Assignment has been posted for DBMS',
            course: 'DBMS',
            deadline: '2026-04-01',
            timestamp: '2026-03-25T10:00:00Z',
            read: false
          },
          {
            id: 2,
            type: 'career',
            title: 'Career Fair Next Week',
            message: 'Annual career fair will be held next week. Don\'t miss it!',
            course: 'General',
            deadline: null,
            timestamp: '2026-03-24T15:30:00Z',
            read: false
          },
          {
            id: 3,
            type: 'system',
            title: 'System Maintenance',
            message: 'System will undergo maintenance this weekend',
            course: 'General',
            deadline: null,
            timestamp: '2026-03-23T09:00:00Z',
            read: true
          }
        ];
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]); // Set to empty array on error
      }
    };
    
    fetchNotifications();
  }, []);

  
  const markAllAsRead = async () => {
    try {
      // Update local state to mark all as read (mock implementation)
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    }
  };

  const deleteNotification = async (id) => {
    try {
      // Update local state to remove notification (mock implementation)
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Fallback to local state update
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'assignment':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'career':
        return <User className="w-5 h-5 text-green-600" />;
      case 'system':
        return <Info className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-purple-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'quiz':
        return 'bg-blue-50 border-blue-200';
      case 'assignment':
        return 'bg-orange-50 border-orange-200';
      case 'career':
        return 'bg-green-50 border-green-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = !search || notification.title.toLowerCase().includes(search.toLowerCase()) || 
                         notification.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="flex h-screen bg-transparent text-slate-900  text-left">
      {/* Sidebar */}
      <div className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Not</span>
            </div>
            <div>
              <span className="text-xl  font-bold text-slate-900">Uni-Help System</span>
              <p className="text-xs text-slate-400 mt-0.5">Notifications</p>
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
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
              }`}
            >
              <item.icon size={17} className={activeTab === item.key ? "text-blue-500" : "text-slate-400"} />
              <span className="flex-1">{item.label}</span>
              {item.key === "notifications" && unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-black rounded-full px-2 py-0.5 shadow-lg shadow-blue-200">
                  {unreadCount}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Notifications</h1>
              <p className="text-slate-500 mt-2 text-lg">
                {unreadCount > 0 
                  ? `You have ${unreadCount} new alert${unreadCount > 1 ? 's' : ''} to review` 
                  : 'You\'re all caught up with your academic updates'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-100"
              >
                <CheckCircle size={18} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search updates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-12 pr-10 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold cursor-pointer appearance-none min-w-[160px]"
              >
                <option value="all">All Types</option>
                <option value="quiz">Quizzes</option>
                <option value="assignment">Assignments</option>
                <option value="career">Career</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-10 h-10 text-slate-200" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Inbox is empty</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative p-6 rounded-[32px] border transition-all cursor-pointer ${
                    notification.read 
                      ? 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100' 
                      : 'bg-blue-50/50 border-blue-100 shadow-xl shadow-blue-50/50 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl shrink-0 transition-colors ${getTypeColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`text-xl font-black tracking-tight ${!notification.read ? 'text-blue-700' : 'text-slate-900'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-200" />
                            )}
                          </div>
                          <p className="text-slate-500 font-bold mt-1 text-sm leading-relaxed">{notification.message}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-4 opacity-0 group-hover:opacity-100"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-slate-100/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {notification.deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-300" />
                            Due: {new Date(notification.deadline).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-300" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                        {notification.course && (
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-slate-300" />
                            {notification.course}
                          </div>
                        )}
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="ml-auto text-blue-600 hover:text-blue-700 underline underline-offset-4"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import { Search, Filter, MapPin } from "lucide-react";

export default Notifications;
