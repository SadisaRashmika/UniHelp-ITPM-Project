import React from 'react';
import { Heart, Trophy, FileText, GraduationCap, Calendar } from 'lucide-react';

const StuSidebar = ({ points, quizzes, notes, level }) => {
  return (
    <aside className="w-80 h-screen bg-white border-r border-slate-100 fixed left-0 top-0 flex flex-col p-8">
      <div className="mb-10">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
          AJ
        </div>
        <h2 className="text-xl font-black text-center text-slate-900">Alex Johnson</h2>
        <p className="text-sm text-center text-slate-400 font-bold mb-2">2024001</p>
        <div className="bg-slate-50 text-slate-600 text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit mx-auto tracking-widest">
          Computer Science
        </div>
      </div>

      <div className="space-y-3 mb-10 text-slate-500 font-bold text-sm">
        <div className="flex items-center gap-3"><GraduationCap size={18}/> 2nd Year</div>
        <div className="flex items-center gap-3"><Calendar size={18}/> Spring 2026</div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Statistics</h3>
        <StatItem icon={<Heart size={18} className="text-red-500"/>} label="Total Likes" val={points} color="bg-red-50" />
        <StatItem icon={<Trophy size={18} className="text-blue-500"/>} label="Quizzes" val={quizzes} color="bg-blue-50" />
        <StatItem icon={<FileText size={18} className="text-green-500"/>} label="My Notes" val={notes} color="bg-green-50" />
      </div>

      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-500">Level</span>
        <span className="bg-orange-500 text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
          {level}
        </span>
      </div>
    </aside>
  );
};

const StatItem = ({ icon, label, val, color }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl ${color}`}>
    <div className="flex items-center gap-3">
      {icon} <span className="text-sm font-bold text-slate-700">{label}</span>
    </div>
    <span className="font-black text-slate-900">{val}</span>
  </div>
);

export default StuSidebar;