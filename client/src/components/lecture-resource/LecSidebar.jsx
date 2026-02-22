import React from 'react';
import { LayoutDashboard, BookCopy, FileQuestion, UserCircle2 } from 'lucide-react';

const LecSidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <LayoutDashboard size={22} /> },
    { id: 'resources', label: 'Resources', icon: <BookCopy size={22} /> },
    { id: 'quiz', label: 'Quiz', icon: <FileQuestion size={22} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle2 size={22} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 flex flex-col">
      <div className="p-8">
        <h1 className="text-xl font-black text-slate-900 leading-tight">University of<br/>Excellence</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
              activeTab === item.id 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Professor Identity at the Bottom */}
      <div className="p-6 border-t border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold">DR</div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-slate-900 truncate">Dr. Robert Smith</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professor</p>
        </div>
      </div>
    </aside>
  );
};

export default LecSidebar;