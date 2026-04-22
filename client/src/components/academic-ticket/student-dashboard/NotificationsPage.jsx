import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertCircle, Clock, Calendar, FileText, Users, Settings } from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.id;

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Use mock data for now to avoid API errors
      const mockNotifications = [
        {
          id: 1,
          title: "Assignment Due Soon",
          message: "Data Structures assignment is due in 2 days",
          type: "assignment",
          status: "unread",
          date: "2024-04-08",
          time: "10:30 AM"
        },
        {
          id: 2,
          title: "New Grade Posted",
          message: "Your Web Development project has been graded",
          type: "grade",
          status: "read",
          date: "2024-04-07",
          time: "2:15 PM"
        },
        {
          id: 3,
          title: "Course Announcement",
          message: "Database Systems class moved to Room 405 tomorrow",
          type: "announcement",
          status: "unread",
          date: "2024-04-07",
          time: "4:00 PM"
        },
        {
          id: 4,
          title: "Study Group Reminder",
          message: "Study group meeting at 6 PM in Library",
          type: "reminder",
          status: "read",
          date: "2024-04-06",
          time: "3:30 PM"
        }
      ];

      // Ensure data is an array before filtering
      const notificationsData = Array.isArray(mockNotifications) ? mockNotifications : [];
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => n.status === 'unread').length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Error loading notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [studentId]);

  const markAsRead = async (notificationId) => {
    try {
      // Mock API call for now
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, status: 'read' } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'grade':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'announcement':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    return status === 'unread' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">Stay updated with your academic activities</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
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

      <main className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-500">Loading notifications...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-500">Error loading notifications</p>
              <button 
                onClick={fetchNotifications}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Total</h3>
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                <p className="text-sm text-gray-500">All notifications</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Read</h3>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{notifications.filter(n => n.status === 'read').length}</p>
                <p className="text-sm text-gray-500">Viewed notifications</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Unread</h3>
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
                <p className="text-sm text-gray-500">New notifications</p>
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications found</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.status === 'unread' ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(notification.status)}`}>
                              {notification.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{notification.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
