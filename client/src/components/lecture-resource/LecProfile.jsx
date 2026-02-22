import React from 'react';
import { Heart, MessageSquare, Star, BarChart3 } from 'lucide-react';

const LecProfile = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Professor Profile</h2>
        <p className="text-slate-500 font-medium">View your teaching performance and student feedback</p>
      </header>

      {/* Profile Header Card */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-10">
          <div className="w-28 h-28 bg-blue-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-100">
            DR
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Dr. Robert Smith</h3>
              <p className="text-slate-500 font-bold">Professor of Computer Science</p>
            </div>
            <div className="flex gap-12 border-t border-slate-50 pt-4">
              <ProfileMetaItem label="Department" val="Computer Science" />
              <ProfileMetaItem label="Email" val="robert.smith@university.edu" />
              <ProfileMetaItem label="Office" val="Room 305, CS Building" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <LecStatBox icon={<Heart className="text-red-500 fill-red-50"/>} label="Total Likes" val="1234" />
        <LecStatBox icon={<MessageSquare className="text-blue-500 fill-blue-50"/>} label="Total Comments" val="4" />
        <LecStatBox icon={<Star className="text-amber-500 fill-amber-50"/>} label="Average Rating" val="4.8" />
      </div>

      {/* Resource Insights */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <h4 className="font-black text-lg text-slate-900 flex items-center gap-3 mb-8">
          <BarChart3 className="text-slate-400" size={20} /> Resource Performance
        </h4>
        <div className="space-y-6">
          <PerformanceItem title="Introduction to Machine Learning" likes="456" comments="34" views="1234" />
          <PerformanceItem title="Data Structures Notes" likes="389" comments="28" views="987" />
        </div>
      </div>
    </div>
  );
};

const ProfileMetaItem = ({ label, val }) => (
  <div>
    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-700">{val}</p>
  </div>
);

const LecStatBox = ({ icon, label, val }) => (
  <div className="bg-white p-8 rounded-[36px] border border-slate-50 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-black text-slate-900">{val}</p>
    </div>
    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-2xl group-hover:bg-white transition-colors">
      {icon}
    </div>
  </div>
);

const PerformanceItem = ({ title, likes, comments, views }) => (
  <div className="p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white transition-all cursor-pointer">
    <h5 className="font-bold text-slate-800 text-lg mb-3">{title}</h5>
    <div className="flex gap-8">
      <div className="flex items-center gap-2 text-xs font-bold text-red-500/70">
        <Heart size={14} /> {likes} likes
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-blue-500/70">
        <MessageSquare size={14} /> {comments} comments
      </div>
      <div className="text-xs font-bold text-slate-400">
        {views} views
      </div>
    </div>
  </div>
);

export default LecProfile;