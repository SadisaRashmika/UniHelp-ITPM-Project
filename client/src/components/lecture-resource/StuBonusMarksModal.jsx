import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Mail } from 'lucide-react';
import { LECTURES } from './stuData';

// Flow:
// Step 1 — Student picks a subject and confirms (costs 100 likes, one time per semester)
// Step 2 — Pending: waiting for lecturer to accept
// Step 3 — Accepted: unique code shown, student emails/shows it to get +3 marks

const StuBonusMarksModal = ({ isOpen, onClose, studentLikes, onSpendLikes, bonusUsed, setBonusUsed }) => {
  const [step, setStep]             = useState(1); // 1=pick, 2=pending, 3=accepted
  const [selectedLecture, setSelected] = useState('');
  const [error, setError]           = useState('');

  // Fake unique code — in real app this comes from backend after lecturer accepts
  const uniqueCode = 'BONUS-2026-AJ-' + (selectedLecture ? LECTURES.find(l => l.id === parseInt(selectedLecture))?.title.slice(0,3).toUpperCase() : 'XXX') + '-K9F2';

  const handleClose = () => {
    setStep(1);
    setSelected('');
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedLecture) { setError('Please select a subject first.'); return; }
    if (studentLikes < 100) { setError('You need at least 100 likes to use this.'); return; }
    setError('');
    onSpendLikes(); // deduct 100 likes
    setBonusUsed(true);
    setStep(2);
    // Simulate lecturer accepting after 2 seconds (in real app this is a backend event)
    setTimeout(() => setStep(3), 2000);
  };

  if (!isOpen) return null;

  const selectedTitle = selectedLecture
    ? LECTURES.find(l => l.id === parseInt(selectedLecture))?.title
    : '';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl relative">
        <div className="p-10">

          {/* Close */}
          <button onClick={handleClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>

          {/* ── Step 1: Pick subject ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <Sparkles size={22} className="text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Bonus Marks</h3>
                </div>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Spend <span className="font-black text-slate-800">100 likes</span> to request <span className="font-black text-slate-800">+3 bonus marks</span> on one subject this semester. The lecturer must approve — you'll get a unique code to claim your marks.
                </p>
              </div>

              {/* Likes balance */}
              <div className="flex items-center justify-between bg-red-50 rounded-2xl px-5 py-3.5">
                <span className="text-sm font-bold text-slate-600">Your Likes Balance</span>
                <div className="flex items-center gap-1.5 font-black text-red-500">
                  ❤️ {studentLikes} likes
                </div>
              </div>

              {bonusUsed ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center">
                  <p className="text-sm font-bold text-slate-400">You have already used your bonus marks this semester.</p>
                </div>
              ) : (
                <>
                  {/* Subject picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Select Subject</label>
                    <div className="relative">
                      <select
                        value={selectedLecture}
                        onChange={e => { setSelected(e.target.value); setError(''); }}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 px-4 py-3.5 pr-10 rounded-2xl text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                      >
                        <option value="">Choose a subject...</option>
                        {LECTURES.map(l => (
                          <option key={l.id} value={l.id}>{l.title}</option>
                        ))}
                      </select>
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  {error && <p className="text-sm font-bold text-red-500">{error}</p>}

                  {/* Warning */}
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700 font-medium">
                    ⚠️ This will deduct <strong>100 likes</strong> from your profile and can only be used <strong>once per semester</strong>.
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={handleClose} className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={studentLikes < 100}
                      className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Use 100 Likes
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Step 2: Waiting for lecturer ── */}
          {step === 2 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Request Sent!</h3>
                <p className="text-slate-500 font-medium text-sm">
                  Your request for <span className="font-bold text-slate-800">{selectedTitle}</span> has been sent to the lecturer for approval. Please wait...
                </p>
              </div>
            </div>
          )}

          {/* ── Step 3: Accepted, show code ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Approved! 🎉</h3>
                <p className="text-slate-500 font-medium text-sm">
                  Your lecturer approved the bonus marks for <span className="font-bold text-slate-800">{selectedTitle}</span>. Show the code below to claim your +3 marks.
                </p>
              </div>

              {/* Unique code */}
              <div className="bg-slate-900 rounded-2xl p-5 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Unique Code</p>
                <p className="text-2xl font-black text-white tracking-widest">{uniqueCode}</p>
              </div>

              {/* Email note */}
              <div className="flex items-start gap-3 bg-blue-50 rounded-2xl p-4">
                <Mail size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-blue-700">
                  This code has also been sent to your registered email address. Present it to your lecturer or exam office to have your +3 marks added.
                </p>
              </div>

              <button onClick={handleClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all">
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