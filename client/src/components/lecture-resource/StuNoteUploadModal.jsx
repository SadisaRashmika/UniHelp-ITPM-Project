import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

const StuNoteUploadModal = ({ isOpen, onClose, lecture }) => {
  const [file, setFile] = useState(null);

  const handleClose = () => { setFile(null); onClose(); };

  if (!isOpen || !lecture) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* max-h + overflow-y-auto prevents the modal going off screen */}
      <div className="bg-white rounded-[40px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="p-10">

          <button
            onClick={handleClose}
            className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>

          <header className="mb-8">
            <h3 className="text-2xl font-black text-slate-900">Upload Note</h3>
            <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Uploading to:</p>
              <p className="font-bold text-slate-900 leading-tight">{lecture.title}</p>
              <p className="text-xs text-slate-500 font-medium">{lecture.tags[0]} • {lecture.lecturer}</p>
            </div>
          </header>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Note Title</label>
              <input
                type="text"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300 font-medium"
                placeholder="e.g., ML Summary Notes"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
              <textarea
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24 placeholder:text-slate-300 font-medium resize-none"
                placeholder="Brief description of your note"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Upload File</label>
              <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-slate-100 border-dashed rounded-2xl bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer group">
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">{file ? file.name : 'Choose File'}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{file ? 'Click to change' : 'No file chosen'}</p>
                </div>
                <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
              </label>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
              >
                Upload
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StuNoteUploadModal;