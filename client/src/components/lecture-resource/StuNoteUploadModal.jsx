import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

const StuNoteUploadModal = ({ isOpen, onClose, lecture }) => {
  const [file, setFile] = useState(null);

  const handleClose = () => { setFile(null); onClose(); };

  if (!isOpen || !lecture) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Upload Note</h3>
              <p className="text-sm text-gray-400 mt-0.5">Add your notes for this lecture</p>
            </div>
            <button onClick={handleClose} className="text-gray-300 hover:text-gray-600 transition-colors mt-0.5">
              <X size={20} />
            </button>
          </div>

          {/* Lecture reference */}
          <div className="bg-blue-50 rounded-xl border border-blue-100 px-4 py-3 mb-5">
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide mb-0.5">Uploading to:</p>
            <p className="font-semibold text-gray-900 text-sm">{lecture.title}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{lecture.tags?.[0]} · {lecture.lecturer}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Note Title</label>
              <input
                type="text"
                placeholder="e.g., ML Summary Notes"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
              <textarea
                placeholder="Brief description of your note"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all h-24 resize-none placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Upload File</label>
              <label className="flex items-center gap-3 w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100/60 hover:border-gray-300 cursor-pointer transition-all">
                <Upload size={16} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500">{file ? file.name : 'Choose File'}</span>
                {!file && <span className="text-sm text-gray-400">No file chosen</span>}
                <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
              </label>
              <p className="text-xs text-gray-400 mt-1.5">PDF, DOCX, PPTX supported</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={handleClose}
                className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all">
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