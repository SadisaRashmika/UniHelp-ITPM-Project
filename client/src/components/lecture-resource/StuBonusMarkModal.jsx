import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { SUBJECTS } from './SharedData';

const API_BASE = 'http://localhost:5000';

const StuBonusMarksModal = ({ isOpen, onClose, student, pointsBalance }) => {
  const [subject, setSubject] = useState('');
  const [lecturerEmail, setLecturerEmail] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleClose = () => {
    setSubject('');
    setLecturerEmail('');
    setError('');
    setSaving(false);
    setDone(false);
    onClose();
  };
// Simple email validation function
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

  const handleSubmit = async () => {
    if (!subject.trim() || !lecturerEmail.trim()) {
      setError('Please provide subject and lecturer email.');
      return;
    }
// Additional validation can be added here (e.g., check if subject is valid)
    if (!isValidEmail(lecturerEmail)) {
      setError('Please enter a valid lecturer email address.');
      return;
    }

    if (Number(pointsBalance || 0) < 100) {
      setError('You need at least 100 points to request bonus marks.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await axios.post(`${API_BASE}/api/student/bonus-requests`, {
        studentId: student?.student_id || 'STU001',
        subject: subject.trim(),
        lecturerEmail: lecturerEmail.trim(),
      });
      setDone(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit request');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Bonus Marks</h3>
            </div>
            <button onClick={handleClose} className="text-gray-300 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          {!done ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                Request <span className="font-semibold text-gray-800">+3 marks</span> for your final exam by using
                <span className="font-semibold text-gray-800"> 100 points</span>. Points are deducted only if lecturer approves.
              </p>

              <div className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-gray-600">Your Point Count</span>
                <span className="text-red-500 font-bold text-sm">{pointsBalance ?? 0} points</span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Subject Name</label>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Lecturer Email</label>
                <input
                  value={lecturerEmail}
                  onChange={(e) => {
                    setLecturerEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g., chamara@uni.edu"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button onClick={handleClose}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 disabled:opacity-40"
                >
                  {saving ? 'Submitting...' : 'Request +3 Marks'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} className="text-green-500" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Request Sent</h4>
              <p className="text-sm text-gray-500">
                Your bonus marks request is pending lecturer approval. Points will be deducted only if approved.
              </p>
              <button onClick={handleClose}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StuBonusMarksModal;
