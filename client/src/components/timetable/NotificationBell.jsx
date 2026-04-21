import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, BookOpen } from 'lucide-react';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);

  // Connect to Socket.IO for real-time notifications
  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications (async, so setState is not synchronous in effect body)
    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem('unihelp_token');
        const response = await fetch(`${API_URL}/timetable/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter(n => !n.is_read).length);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    loadNotifications();

    // Set up Socket.IO connection
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Connected to notification server');
      setSocketConnected(true);
      // Join the user's notification room
      socket.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from notification server');
      setSocketConnected(false);
    });

    // Listen for real-time notifications
    socket.on('notification', (notification) => {
      console.log('🔔 New notification received:', notification);
      // Add the new notification to the list
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('unihelp_token');
      const response = await fetch(`${API_URL}/timetable/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {socketConnected && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full" title="Connected"></span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-72">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 p-1 rounded ${!notification.is_read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <BookOpen size={12} className={!notification.is_read ? 'text-blue-600' : 'text-gray-400'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.is_read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      {notification.subject_code && (
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.subject_code} • {DAYS[notification.day_of_week]} {notification.start_time?.substring(0, 5)}
                        </p>
                      )}
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              {socketConnected ? '🟢 Real-time connected' : '🔴 Offline'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
