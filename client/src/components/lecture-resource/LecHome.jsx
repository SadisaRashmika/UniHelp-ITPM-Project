import React from 'react';
import { Heart, Hourglass, UploadCloud, ShieldCheck } from 'lucide-react';

const LecHome = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header>
        <h2 className="text-3xl font-black text-slate-900">Welcome Back, Dr. Smith</h2>
        <p className="text-slate-500 font-medium">Here's what's happening with your courses today.</p>
      </header>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <LecStatCard title="Likes" val="1,234" icon={<Heart className="text-red-500 fill-red-50"/>} />
        <LecStatCard title="Pending Resources" val="8" icon={<Hourglass className="text-amber-500"/>} />
        <LecStatCard title="Uploaded Resources" val="42" icon={<UploadCloud className="text-blue-500"/>} />
        <LecStatCard title="Active Tests" val="3" icon={<ShieldCheck className="text-green-500"/>} />
      </div>

      {/* Quick Actions */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
        <div className="flex gap-4">
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-200">
            <UploadCloud size={18} /> Upload Resource
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200">
            + Create Quiz
          </button>
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50">
            Review Submissions
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
        <div className="space-y-6">
          <ActivityRow label="New resource submitted" user="by John Doe" time="2 hours ago" />
          <ActivityRow label="Quiz completed" user="by Jane Smith" time="5 hours ago" />
          <ActivityRow label="Resource liked" user="by Alex Johnson" time="Yesterday" />
        </div>
      </section>
    </div>
  );
};

const LecStatCard = ({ title, val, icon }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-50 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-3xl font-black text-slate-900">{val}</p>
    </div>
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
      {icon}
    </div>
  </div>
);

const ActivityRow = ({ label, user, time }) => (
  <div className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
    <div>
      <p className="font-bold text-slate-800">{label}</p>
      <p className="text-sm text-slate-400 font-medium">{user}</p>
    </div>
    <span className="text-xs font-bold text-slate-300">{time}</span>
  </div>
);

export default LecHome;