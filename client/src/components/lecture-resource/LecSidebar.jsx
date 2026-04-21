import React from 'react';
import { User, FileCheck, BookOpen, Award, Calendar } from 'lucide-react';

const getInitials = (lecturer) => {
  if (lecturer?.initials) return lecturer.initials;
  const parts = (lecturer?.name || '').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase() || 'L';
};

const NAV = [
  { key: 'profile',    label: 'Profile',                icon: User      },
  { key: 'review',     label: 'Check Student Uploads',  icon: FileCheck },
  { key: 'upload',     label: 'Resources and Quiz',     icon: BookOpen  },
  { key: 'extramarks', label: 'Extra Marks Approve',    icon: Award     },
];

const LecSidebar = ({ activeTab, onTabChange, pendingCount, extraMarksPending, lecturer, profilePhoto }) => (
  <aside className="w-72 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm">

    {/* App branding */}
    <div className="px-6 py-5 border-b border-gray-100">
      <h1 className="text-lg font-bold text-gray-900">Uni-Help System</h1>
      <p className="text-xs text-gray-400 mt-0.5">Lecturer Dashboard</p>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-4 py-4 space-y-1">
      {NAV.map(({ key, label, icon: Icon }) => {
        const active = activeTab === key;
        const badge = key === 'review' ? pendingCount : key === 'extramarks' ? extraMarksPending : 0;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
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
            {badge > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                ${active ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-700'}`}>
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    {/* User footer */}
    {lecturer && (
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-9 h-9 rounded-full border border-indigo-200 object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(lecturer)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{lecturer.name}</p>
            <p className="text-xs text-gray-400 truncate">{lecturer.employee_id}</p>
          </div>
        </div>
      </div>
    )}
  </aside>
);

export default LecSidebar;