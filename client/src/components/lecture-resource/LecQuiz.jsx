import React, { useState } from 'react';
import { Plus, Edit3, Power, X } from 'lucide-react';

const LecQuiz = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quiz Management</h2>
          <p className="text-slate-500 font-medium">Create and manage quizzes for your students</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-200"
        >
          <Plus size={18} /> <span>Create Quiz</span>
        </button>
      </div>

      {/* Quiz List Item */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:border-blue-100 transition-all">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900">Week 1: Introduction to Programming</h3>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-slate-500 font-medium">Basic programming concepts</p>
            <div className="flex gap-4 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="bg-slate-50 px-3 py-1 rounded-lg">Created: 2026-02-15</span>
              <span className="bg-slate-50 px-3 py-1 rounded-lg">1 questions</span>
              <span className="bg-slate-50 px-3 py-1 rounded-lg text-blue-600">Total Points: 2</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-100 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              <Edit3 size={16}/> Edit
            </button>
            <button className="px-4 py-2 border border-slate-100 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
              <Power size={16}/> Deactivate
            </button>
          </div>
        </div>
      </div>

      {/* Create New Quiz Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-black text-slate-900 mb-8">Create New Quiz</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Quiz Title</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300 font-medium" 
                  placeholder="e.g., Week 2: Data Structures" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 placeholder:text-slate-300 font-medium resize-none" 
                  placeholder="Brief description of the quiz topic"
                ></textarea>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200">
                  Create & Add Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecQuiz;