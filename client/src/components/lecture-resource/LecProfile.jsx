import React from 'react';
import { Download, Clock, BookOpen, Coins, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { LECTURER, LECTURER_STATS, LECTURES } from './SharedData';

const LecProfile = ({ myPoints, pendingCount, onNavigate }) => {
  const myLectures = LECTURES.filter(l => l.lecturer === LECTURER.name);

  return (
    <div className="max-w-5xl space-y-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">Welcome back, {LECTURER.name.split(' ')[0]} 👋</p>
      </div>

      {/* Profile banner */}
      <div className="relative bg-slate-900 rounded-2xl p-7 overflow-hidden">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'24px 24px'}} />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl font-black text-white shrink-0">
            {LECTURER.initials}
          </div>
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">{LECTURER.department}</p>
            <h2 className="text-white text-xl font-black mt-0.5">{LECTURER.name}</h2>
            <p className="text-white/50 text-sm font-medium mt-0.5">{LECTURER.title} · {LECTURER.employeeId}</p>
          </div>
          <div className="ml-auto flex gap-2 flex-wrap justify-end">
            {LECTURER.subjects.map(s => (
              <span key={s} className="bg-white/10 text-white/70 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-tight">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: <Download size={18} />, label: 'Downloads',      val: LECTURER_STATS.downloads,         color: 'text-blue-500',   bg: 'bg-blue-50'   },
          { icon: <Clock    size={18} />, label: 'Pending Review', val: pendingCount,                     color: 'text-amber-500',  bg: 'bg-amber-50'  },
          { icon: <BookOpen size={18} />, label: 'My Resources',   val: LECTURER_STATS.uploadedResources, color: 'text-emerald-500',bg: 'bg-emerald-50'},
          { icon: <Coins    size={18} />, label: 'My Points',      val: myPoints,                         color: 'text-violet-500', bg: 'bg-violet-50' },
        ].map(({ icon, label, val, color, bg }) => (
          <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
            <div className={`${bg} ${color} w-9 h-9 rounded-xl flex items-center justify-center mb-4`}>{icon}</div>
            <p className="text-2xl font-black text-slate-900">{val}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionCard
          title="Upload New Resource"
          desc="Add lecture notes, slides, and a quiz for your students"
          cta="Go to Resources & Quiz"
          color="bg-slate-900 text-white"
          onClick={() => onNavigate('upload')}
        />
        <ActionCard
          title="Review Student Uploads"
          desc={`${pendingCount} submission${pendingCount !== 1 ? 's' : ''} waiting for your review`}
          cta="Review Now"
          color="bg-amber-50 text-slate-900 border border-amber-100"
          onClick={() => onNavigate('review')}
        />
      </div>

      {/* Points info */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Coins size={17} className="text-violet-500" />
          <h3 className="font-black text-slate-900 text-sm">How Points Work</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniCard icon="✅" label="Accept" pts="+10 pts" sub="per approved note" />
          <MiniCard icon="❌" label="Reject" pts="+5 pts"  sub="per rejected note" />
          <MiniCard icon="💰" label="Redeem" pts="Salary"  sub="convert to bonus pay" />
        </div>
      </div>

      {/* My published lectures */}
      {myLectures.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={17} className="text-slate-400" />
              <h3 className="font-black text-slate-900 text-sm">My Published Lectures</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">{myLectures.length} total</span>
          </div>
          <div className="space-y-2.5">
            {myLectures.map(l => (
              <div key={l.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{l.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{l.year} · {l.semester}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase">Live</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ActionCard = ({ title, desc, cta, color, onClick }) => (
  <button onClick={onClick} className={`${color} rounded-2xl p-6 text-left hover:opacity-90 transition-opacity group`}>
    <p className="font-black text-base">{title}</p>
    <p className="text-sm opacity-60 font-medium mt-1 mb-4">{desc}</p>
    <div className="flex items-center gap-1.5 text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">
      {cta} <ArrowRight size={14} />
    </div>
  </button>
);

const MiniCard = ({ icon, label, pts, sub }) => (
  <div className="bg-slate-50 rounded-xl p-4">
    <div className="text-xl mb-2">{icon}</div>
    <p className="font-black text-slate-900 text-sm">{label}</p>
    <p className="font-black text-slate-700 text-base">{pts}</p>
    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>
  </div>
);

export default LecProfile;