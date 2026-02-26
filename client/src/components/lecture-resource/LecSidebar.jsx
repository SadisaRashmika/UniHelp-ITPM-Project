import React from 'react';
import { User, FolderOpen, ClipboardList } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'profile',   label: 'Profile',   icon: User          },
  { key: 'resources', label: 'Resources', icon: FolderOpen    },
  { key: 'quiz',      label: 'Quiz',      icon: ClipboardList },
];

const LecSidebar = ({ activeTab, onTabChange, pendingCount }) => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-100 fixed left-0 top-0 flex flex-col">

      {/* App name */}
      <div className="px-7 py-7 border-b border-slate-100">
        <h1 className="text-lg font-black text-slate-900 tracking-tight">Uni-Help System</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-black transition-all
                ${isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </div>
              {key === 'resources' && pendingCount > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full
                  ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default LecSidebar;