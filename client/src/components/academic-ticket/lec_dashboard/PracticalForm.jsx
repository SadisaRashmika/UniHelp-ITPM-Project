import React, { useState } from 'react';
import { Plus, X, Calendar, Clock, BookOpen, Target, Settings, Upload, FileText, Link2, Code, Monitor, Cpu } from 'lucide-react';
import axios from 'axios';

const API_BASE = "http://localhost:5000/api/academic-ticket";

const PracticalForm = ({ onClose, onPracticalCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    course_code: '',
    lecturer_id: 'LEC001',
    total_marks: 100, // Use total_marks to match backend database schema
    duration: 60,
    type: 'practical', // Unified type for backend
    status: 'active',
    module_id: 1 // Add required module_id (default to 1 for testing)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.course_code.trim()) errs.course_code = "Course code is required";
    if (!formData.due_date) errs.due_date = "Due date is required";
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE}/quizzes`, formData);
      if (onPracticalCreated) onPracticalCreated(response.data);
      onClose();
    } catch (err) {
      console.error('Error creating practical:', err);
      setError(err.response?.data?.message || 'Failed to create practical. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Practical Task</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Configure practical assessment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2">
              <X size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Practical Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold ${validationErrors.title ? 'border-red-500' : ''}`}
                placeholder="e.g. Database Connectivity Lab"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Code</label>
              <input
                type="text"
                name="course_code"
                value={formData.course_code}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-bold ${validationErrors.course_code ? 'border-red-500' : ''}`}
                placeholder="e.g. CS301"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description & Instructions</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-medium resize-none"
              placeholder="Provide clear steps for students to follow..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl transition-all outline-none font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Marks</label>
              <input
                type="number"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleInputChange}
                className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl transition-all outline-none font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl transition-all outline-none font-bold text-sm cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Publishing...' : <><Plus size={20} /> Publish Practical</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PracticalForm;
