import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Mail } from 'lucide-react';
import { LECTURES } from './stuData';

const StuBonusMarksModal = ({ isOpen, onClose, studentLikes, onSpendLikes, bonusUsed, setBonusUsed }) => {
  const [step,            setStep]    = useState(1);
  const [selectedLecture, setSelected]= useState('');
  const [error,           setError]   = useState('');

  const uniqueCode = 'BONUS-2026-AJ-' + (selectedLecture
    ? LECTURES.find(l => l.id === parseInt(selectedLecture))?.title.slice(0, 3).toUpperCase()
    : 'XXX') + '-K9F2';

  const handleClose = () => { setStep(1); setSelected(''); setError(''); onClose(); };

  const handleSubmit = () => {
    if (!selectedLecture)   { setError('Please select a subject first.'); return; }
    if (studentLikes < 100) { setError('You need at least 100 likes to use this.'); return; }
    setError('');
    onSpendLikes();
    setBonusUsed(true);
    setStep(2);
    setTimeout(() => setStep(3), 2000);
  };

  if (!isOpen) return null;

  const selectedTitle = selectedLecture
    ? LECTURES.find(l => l.id === parseInt(selectedLecture))?.title
    : '';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6">

          {/* Close button */}
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

          {/* ── Step 1: Pick subject ── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                Spend <span className="font-semibold text-gray-800">100 likes</span> to request{' '}
                <span className="font-semibold text-gray-800">+3 bonus marks</span> on one subject this semester.
                The lecturer must approve — you'll get a unique code to claim your marks.
              </p>

              {/* Likes balance */}
              <div className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-gray-600">Your Likes Balance</span>
                <span className="text-red-500 font-bold text-sm">❤️ {studentLikes} likes</span>
              </div>

              {bonusUsed ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-gray-400">You have already used your bonus marks this semester.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Select Subject</label>
                    <div className="relative">
                      <select
                        value={selectedLecture}
                        onChange={e => { setSelected(e.target.value); setError(''); }}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-2.5 pr-9 rounded-xl text-sm font-medium text-gray-700 cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                      >
                        <option value="">Choose a subject...</option>
                        {LECTURES.map(l => (
                          <option key={l.id} value={l.id}>{l.title}</option>
                        ))}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium">
                    ⚠️ This will deduct <strong>100 likes</strong> and can only be used <strong>once per semester</strong>.
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button onClick={handleClose}
                      className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={studentLikes < 100}
                      className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Use 100 Likes
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Step 2: Waiting ── */}
          {step === 2 && (
            <div className="text-center space-y-5 py-6">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                <div className="w-7 h-7 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Request Sent!</h4>
                <p className="text-sm text-gray-500">
                  Your request for <span className="font-semibold text-gray-800">{selectedTitle}</span> has been sent to the lecturer for approval. Please wait...
                </p>
              </div>
            </div>
          )}

          {/* ── Step 3: Approved ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">Approved! 🎉</h4>
                <p className="text-sm text-gray-500">
                  Your lecturer approved bonus marks for{' '}
                  <span className="font-semibold text-gray-800">{selectedTitle}</span>.
                  Show the code below to claim your +3 marks.
                </p>
              </div>

              {/* Code block */}
              <div className="bg-gray-900 rounded-xl p-5 text-center">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Your Unique Code</p>
                <p className="text-xl font-bold text-white tracking-widest">{uniqueCode}</p>
              </div>

              {/* Email note */}
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <Mail size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 font-medium">
                  This code has also been sent to your registered email. Present it to your lecturer to have your +3 marks added.
                </p>
              </div>

              <button onClick={handleClose}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all">
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