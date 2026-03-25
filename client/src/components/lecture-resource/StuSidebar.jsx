import React from 'react';
import { Heart, Trophy, FileText, GraduationCap, Calendar, LogOut, Clock } from 'lucide-react';

const StuSidebar = ({ points, quizzes, notes, level, user, onLogout }) => {
  const levelColor =
    level === 'Gold'     ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
    level === 'Silver'   ? 'bg-gray-100 text-gray-700 border border-gray-300' :
    level === 'Platinum' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                           'bg-orange-100 text-orange-700 border border-orange-200';

  // Get student initials from user name
  const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
  const studentName = user?.name || 'Student';
  const studentId = user?.student_id || user?.id || 'N/A';

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm">

      {/* App branding */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Uni-Help System</h1>
        <p className="text-xs text-gray-400 mt-0.5">Student Dashboard</p>
      </div>

      {/* Profile section */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-base font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{studentName}</p>
            <p className="text-xs text-gray-400">{studentId}</p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <GraduationCap size={15} className="text-gray-400" /> 2nd Year · Computer Science
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Calendar size={15} className="text-gray-400" /> Spring 2026
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-3 border-b border-gray-100">
        <a href="/timetable" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-medium hover:from-blue-100 hover:to-purple-100 transition-colors">
          <Clock size={18} className="text-blue-500" />
          <span>My Timetable</span>
        </a>
      </div>

      {/* Stats */}
      <div className="flex-1 px-4 py-5 space-y-2">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-3">Statistics</p>
        <StatItem icon={<Heart size={16} className="text-red-500" />}   iconBg="bg-red-50"   label="Total Likes" val={points}  />
        <StatItem icon={<Trophy size={16} className="text-blue-500" />}  iconBg="bg-blue-50"  label="Quizzes"     val={quizzes} />
        <StatItem icon={<FileText size={16} className="text-green-500" />} iconBg="bg-green-50" label="My Notes"  val={notes}   />
      </div>

      {/* Level footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-gray-500">Performance Level</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-xl ${levelColor}`}>
            {level}
          </span>
        </div>
      </div>
    </aside>
  );
};

const StatItem = ({ icon, iconBg, label, val }) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-900">{val}</span>
  </div>
);

export default StuSidebar;