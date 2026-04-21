import React from 'react';
import { Heart, Trophy, FileText, GraduationCap, Calendar } from 'lucide-react';

const getInitials = (student) => {
  if (student?.initials) return student.initials;
  const parts = (student?.name || '').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase() || 'S';
};

const StuSidebar = ({ student, fullLikes, points, notes, profilePhoto }) => {
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
    <aside className="w-72 h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-sky-100 border-r border-blue-200 fixed left-0 top-0 flex flex-col shadow-sm">

      {/* App branding */}
      <div className="px-6 py-5 border-b border-blue-200/80">
        <h1 className="text-lg font-bold text-gray-900">Uni-Help System</h1>
        <p className="text-xs text-blue-700 mt-0.5">Student Dashboard</p>
      </div>

      {/* Profile section */}
      <div className="mx-4 mt-4 rounded-2xl border border-blue-200 bg-white/75 px-4 py-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-12 h-12 rounded-full border border-blue-200 object-cover shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white text-base font-bold shrink-0">
              {getInitials(student)}
            </div>
          )}
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
      <div className="flex-1 mx-4 mt-4 mb-4 rounded-2xl border border-blue-200 bg-white/80 px-4 py-5 space-y-2 backdrop-blur-sm">
        <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-widest px-2 mb-3">Statistics</p>
        <StatItem icon={<Heart size={16} className="text-red-500" />}   iconBg="bg-red-50"   label="Full Like Count" val={fullLikes}  />
        <StatItem icon={<Trophy size={16} className="text-blue-500" />}  iconBg="bg-blue-50"  label="Points"          val={safePoints} />
        <StatItem icon={<FileText size={16} className="text-green-500" />} iconBg="bg-green-50" label="My Notes"  val={notes}   />
      </div>

      {/* Level footer */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-white/80 px-3 py-3">
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

export default StuSidebar;