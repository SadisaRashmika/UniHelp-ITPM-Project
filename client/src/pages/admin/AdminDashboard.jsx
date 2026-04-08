import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, LogOut, Settings, Users, BookOpen } from 'lucide-react';
import AdminTimetableContent from '../../components/timetable/AdminTimetableContent';

const NAV = [
  { key: 'timetable', label: 'Timetable Management', icon: Calendar },
  { key: 'users', label: 'User Management', icon: Users },
  { key: 'subjects', label: 'Subjects', icon: BookOpen },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('timetable');
  const navigate = useNavigate();

  // Check if authenticated
  const token = localStorage.getItem('unihelp_token');
  if (!token) {
    navigate('/', { replace: true });
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('unihelp_token');
    navigate('/', { replace: true });
  };

  // Admin display info
  const admin = {
    name: 'Administrator',
    initials: 'AD',
    title: 'System Administrator',
    email: 'admin@unihelp.com',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm">
        {/* App branding */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Uni-Help System</h1>
          <p className="text-xs text-gray-400 mt-0.5">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAV.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all text-left
                  ${active
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={active ? 'text-blue-500' : 'text-gray-400'} />
                  <span>{label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* User footer with logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {admin.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">{admin.name}</p>
              <p className="text-xs text-gray-400 truncate">{admin.title}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-72 p-10 min-w-0 w-full">
        {activeTab === 'timetable' && (
          <AdminTimetableContent />
        )}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Management</h2>
            <p className="text-gray-600">User management features coming soon...</p>
          </div>
        )}
        {activeTab === 'subjects' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Subject Management</h2>
            <p className="text-gray-600">Subject management features coming soon...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">System Settings</h2>
            <p className="text-gray-600">System settings coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
