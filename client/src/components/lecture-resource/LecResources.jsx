import React, { useState } from 'react';
import { FileText, Eye, Download, Check, X, Upload } from 'lucide-react';

const LecResources = () => {
  const [subTab, setSubTab] = useState('my'); // 'my' or 'pending'

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Resources</h2>
          <p className="text-slate-500 font-medium">Manage your course materials and student submissions</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-200">
          <Upload size={18} /> Upload Resource
        </button>
      </div>

      {/* Sub-tab Toggle */}
      <div className="flex space-x-2 bg-slate-200/50 p-1.5 rounded-[20px] w-fit">
        <button 
          onClick={() => setSubTab('my')}
          className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${subTab === 'my' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          My Resources (2)
        </button>
        <button 
          onClick={() => setSubTab('pending')}
          className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${subTab === 'pending' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Pending Review (2)
        </button>
      </div>

      {/* List Content */}
      <div className="space-y-4">
        {subTab === 'my' ? (
          <>
            <MyResourceCard title="Introduction to Machine Learning" desc="Comprehensive guide to ML basics" date="2026-02-20" type="PDF" />
            <MyResourceCard title="Data Structures Notes" desc="Advanced data structures concepts" date="2026-02-19" type="PDF" />
          </>
        ) : (
          <>
            <PendingResourceCard title="Algorithm Analysis" student="John Doe" date="2026-02-22" type="DOCX" />
            <PendingResourceCard title="Database Design" student="Jane Smith" date="2026-02-21" type="PDF" />
          </>
        )}
      </div>
    </div>
  );
};

// Internal component for Lecturer's own files
const MyResourceCard = ({ title, desc, date, type }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
    <div className="flex items-center gap-5">
      <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
        <FileText size={24} />
      </div>
      <div>
        <h4 className="font-bold text-lg text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500 mb-2">{desc}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Uploaded: {date} • <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{type}</span>
        </p>
      </div>
    </div>
    <div className="flex gap-3">
      <button className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
        <Eye size={20} />
      </button>
      <button className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
        <Download size={20} />
      </button>
    </div>
  </div>
);

// Internal component for Student Notes (Approval Logic)
const PendingResourceCard = ({ title, student, date, type }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between group">
    <div className="flex items-center gap-5">
      <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
        <FileText size={24} />
      </div>
      <div>
        <h4 className="font-bold text-lg text-slate-900">{title}</h4>
        <p className="text-sm text-slate-400 font-medium">Student submission for review</p>
        <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Submitted by: {student}</span>
          <span>Date: {date}</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{type}</span>
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Pending Review</span>
        </div>
      </div>
    </div>
    <div className="flex gap-3">
      <button className="px-5 py-2.5 bg-white border border-green-200 text-green-600 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 transition-all">
        <Check size={18} /> Accept
      </button>
      <button className="px-5 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl font-bold flex items-center gap-2 hover:bg-red-50 transition-all">
        <X size={18} /> Reject
      </button>
    </div>
  </div>
);

export default LecResources;