import React from 'react';
import { Heart, Trophy, FileText, GraduationCap, Calendar } from 'lucide-react';

const getInitials = (student) => {
  if (student?.initials) return student.initials;
  const parts = (student?.name || '').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase() || 'S';
};

const StuSidebar = ({ student, fullLikes, points, notes }) => {
  const safePoints = Number(points || 0);
  const level =
    safePoints >= 200 ? 'Platinum' :
    safePoints >= 100 ? 'Gold' :
    safePoints >= 50 ? 'Silver' :
    'Bronze';

  const levelColor =
    level === 'Gold' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
    level === 'Silver' ? 'bg-gray-100 text-gray-700 border border-gray-300' :
    level === 'Platinum' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
    'bg-orange-100 text-orange-700 border border-orange-200';

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
            {getInitials(student)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{student?.name || 'Student'}</p>
            <p className="text-xs text-gray-400">{student?.student_id || '-'}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span className="text-gray-400">@</span> {student?.email || '-'}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <GraduationCap size={15} className="text-gray-400" /> {student?.year || '-'}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Calendar size={15} className="text-gray-400" /> {student?.semester || '-'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-1 px-4 py-5 space-y-2">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-3">Statistics</p>
        <StatItem icon={<Heart size={16} className="text-red-500" />}   iconBg="bg-red-50"   label="Full Like Count" val={fullLikes}  />
        <StatItem icon={<Trophy size={16} className="text-blue-500" />}  iconBg="bg-blue-50"  label="Points"          val={safePoints} />
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