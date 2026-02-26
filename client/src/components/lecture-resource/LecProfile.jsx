import React from 'react';
import { Download, Clock, Upload, Coins, TrendingUp, CheckCircle2, XCircle, BookOpen, Layers } from 'lucide-react';
import { LECTURER, INITIAL_QUIZZES } from './lecData';

const LecProfile = ({ myPoints, pendingCount }) => {
  return (
    <div className="space-y-8">

      {/* Page title */}
      <header>
        <h2 className="text-3xl font-black text-slate-900">My Profile</h2>
        <p className="text-slate-500 font-medium mt-1">Your teaching overview, stats, and reward summary</p>
      </header>

      {/* Welcome banner — matches student side gradient style */}
      <div className="bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 rounded-[32px] p-8 text-white flex items-center gap-6 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -right-4 bottom-0 w-32 h-32 bg-white/5 rounded-full" />
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black shrink-0 backdrop-blur-sm">
          {LECTURER.initials}
        </div>
        <div className="relative">
          <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">{LECTURER.department}</p>
          <h3 className="text-2xl font-black">{LECTURER.name}</h3>
          <p className="text-white/70 font-semibold mt-1 text-sm">{LECTURER.title} · {LECTURER.employeeId}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {LECTURER.subjects.map(s => (
              <span key={s} className="bg-white/15 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tight backdrop-blur-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4 stat cards — same pattern as StuSidebar StatItems but as big cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Download size={20} className="text-blue-500"  />} label="Total Downloads"    val={LECTURER.stats.downloads}         bg="bg-blue-50"   border="border-blue-100"   />
        <StatCard icon={<Clock    size={20} className="text-amber-500" />} label="Pending Reviews"    val={pendingCount}                     bg="bg-amber-50"  border="border-amber-100"  />
        <StatCard icon={<Upload   size={20} className="text-green-500" />} label="Resources Uploaded" val={LECTURER.stats.uploadedResources} bg="bg-green-50"  border="border-green-100"  />
        <StatCard icon={<Coins    size={20} className="text-violet-500"/>} label="My Points"          val={myPoints}                         bg="bg-violet-50" border="border-violet-100" />
      </div>

      {/* Points system explanation */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-violet-50 rounded-xl">
            <Coins size={20} className="text-violet-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">How My Points Work</h3>
            <p className="text-sm text-slate-500 font-medium">Reviewing student resources earns you points redeemable as bonus salary</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PointCard color="bg-green-50 border-green-100"  icon="✅" action="Accept a resource" pts="+10 pts" note="Approve a student's uploaded note" />
          <PointCard color="bg-red-50 border-red-100"      icon="❌" action="Reject a resource" pts="+5 pts"  note="Reject with optional feedback"     />
          <PointCard color="bg-violet-50 border-violet-100" icon="💰" action="Redeem Points"    pts="Salary"  note="Convert accumulated points to bonus pay" />
        </div>
      </div>

      {/* Two-column: activity + quizzes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Activity summary */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Activity Summary</h3>
          </div>
          <div className="space-y-3">
            <ActivityRow label="Resources reviewed this week" val="12" />
            <ActivityRow label="Student notes accepted"       val="9"  />
            <ActivityRow label="Student notes rejected"       val="3"  />
            <ActivityRow label="Points earned this month"     val="95" />
          </div>
        </div>

        {/* Quiz overview */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <BookOpen size={20} className="text-indigo-500" />
            </div>
            <h3 className="text-lg font-black text-slate-900">My Quizzes</h3>
          </div>
          <div className="space-y-3">
            {INITIAL_QUIZZES.map(q => (
              <div key={q.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <CheckCircle2 size={15} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{q.title}</p>
                    <p className="text-xs text-slate-400 font-semibold">{q.questionCount} questions · {q.attempts} attempts</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-green-100 text-green-700 px-2.5 py-1 rounded-full uppercase">Live</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, val, bg, border }) => (
  <div className={`${bg} border ${border} rounded-[24px] p-5`}>
    <div className="mb-3">{icon}</div>
    <p className="text-2xl font-black text-slate-900">{val}</p>
    <p className="text-sm font-semibold text-slate-500 mt-0.5">{label}</p>
  </div>
);

const PointCard = ({ color, icon, action, pts, note }) => (
  <div className={`${color} border rounded-2xl p-5`}>
    <div className="text-2xl mb-3">{icon}</div>
    <p className="font-black text-slate-900 text-sm">{action}</p>
    <p className="text-lg font-black text-slate-700 mt-0.5">{pts}</p>
    <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">{note}</p>
  </div>
);

const ActivityRow = ({ label, val }) => (
  <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
    <span className="text-sm font-semibold text-slate-600">{label}</span>
    <span className="font-black text-slate-900">{val}</span>
  </div>
);

export default LecProfile;