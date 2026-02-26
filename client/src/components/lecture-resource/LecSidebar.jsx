import React from 'react';
import { LayoutDashboard, BookPlus, Inbox, Sparkles } from 'lucide-react';

const NAV = [
  { key: 'profile',    label: 'Profile',            icon: LayoutDashboard },
  { key: 'upload',     label: 'Resources & Quiz',   icon: BookPlus        },
  { key: 'review',     label: 'Student Uploads',    icon: Inbox           },
  { key: 'extramarks', label: 'Extra Marks',        icon: Sparkles        },
];

const LecSidebar = ({ activeTab, onTabChange, pendingCount, extraMarksPending }) => (
  <aside className="w-60 h-screen bg-white border-r border-slate-100 fixed left-0 top-0 flex flex-col">

    {/* App name */}
    <div className="px-6 h-16 flex items-center border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
          <span className="text-white text-[10px] font-black">UH</span>
        </div>
        <span className="font-black text-slate-900 text-sm tracking-tight">Uni-Help System</span>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-5 space-y-0.5">
      {NAV.map(({ key, label, icon: Icon }) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-all
              ${active ? 'bg-slate-900 text-white font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold'}`}
          >
            <div className="flex items-center gap-3">
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </div>
            {/* Pending badge for Student Uploads */}
            {key === 'review' && pendingCount > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                ${active ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                {pendingCount}
              </span>
            )}
            {/* Pending badge for Extra Marks */}
            {key === 'extramarks' && extraMarksPending > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                ${active ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                {extraMarksPending}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    {/* Footer */}
    <div className="px-5 py-4 border-t border-slate-100">
      <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">Lecturer Portal</p>
    </div>
  </aside>
);

export default LecSidebar;