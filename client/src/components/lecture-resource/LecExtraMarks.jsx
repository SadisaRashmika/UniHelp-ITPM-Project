import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Copy, Check, ListChecks, X, AlertCircle } from 'lucide-react';
import { BONUS_MARK_REQUESTS } from './SharedData';

const generateCode = (studentId, subject) => {
  const subCode = subject.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4);
  const rand    = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BONUS-2026-${(studentId || '').split('-').pop()?.slice(-4) || '0001'}-${subCode}-${rand}`;
};

const formatDate = (iso) => iso?.split('T')[0] ?? '';

const LecExtraMarks = ({ onPendingChange = () => {} }) => {
  const [requests, setRequests] = useState(BONUS_MARK_REQUESTS);
  const [toast,    setToast]    = useState(null);
  const [copied,   setCopied]   = useState(null);

  const pending  = requests.filter(r => r.status === 'pending');
  const approved = requests.filter(r => r.status === 'approved');
  const rejected = requests.filter(r => r.status === 'rejected');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    const req = requests.find(r => r.id === id);
    const code = generateCode(req.studentId, req.subject);
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'approved', uniqueCode: code, approvedAt: new Date().toISOString() } : r
    ));
    onPendingChange(-1);
    showToast(`✅ Approved — code sent to ${req.studentName.split(' ')[0]}'s email`);
  };

  const handleReject = (id) => {
    const req = requests.find(r => r.id === id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    onPendingChange(-1);
    showToast(`Request from ${req.studentName.split(' ')[0]} rejected.`);
  };

  const handleMarkAdded = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, marksAdded: true } : r));
    showToast('✅ Marks recorded as added to the student\'s grade.');
  };

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Extra Marks Approval</h1>
        <p className="text-gray-400 text-sm mt-1">Review student requests to exchange likes for marks (100 likes = 3 marks)</p>
      </div>

      {/* Pending section */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
            <div className="bg-gray-100 rounded-xl px-4 py-2 text-sm font-semibold text-gray-600">
              {pending.length} Pending
            </div>
          </div>

          {pending.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between gap-4">
                {/* Student info */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {r.studentInitials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{r.studentName}</p>
                    <p className="text-sm text-gray-400">ID: {r.studentId}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">{r.subject}</span>
                      <span className="text-sm text-gray-500">
                        Current Likes: <span className="font-medium text-gray-700">{r.totalLikes || 100}</span>
                      </span>
                      <span className="text-sm">
                        Requested Marks: <span className="font-semibold text-green-600">+3</span>
                      </span>
                      <span className="text-sm text-gray-400">{formatDate(r.requestedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleApprove(r.id)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all">
                    <CheckCircle size={15} /> Approve
                  </button>
                  <button onClick={() => handleReject(r.id)}
                    className="flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all">
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approved section */}
      {approved.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Approved Extra Marks</h2>

          {/* Table header */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>Student Name</span>
              <span>Student ID</span>
              <span>Subject</span>
              <span>Extra Marks</span>
              <span>Approved Date</span>
            </div>
            {approved.map(r => (
              <div key={r.id} className="grid grid-cols-5 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {r.studentInitials}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{r.studentName}</span>
                </div>
                <span className="text-sm text-gray-500">{r.studentId}</span>
                <div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{r.subject}</span>
                </div>
                <div>
                  {r.marksAdded ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold bg-green-500 text-white px-2.5 py-1.5 rounded-full w-fit">
                      <CheckCircle size={11} /> +3 marks
                    </span>
                  ) : (
                    <button onClick={() => handleMarkAdded(r.id)}
                      className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition-all">
                      +3 marks
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{formatDate(r.approvedAt || r.requestedAt)}</span>
                  {r.uniqueCode && (
                    <button onClick={() => handleCopy(r.id, r.uniqueCode)}
                      className="text-gray-300 hover:text-gray-600 transition-colors"
                      title="Copy code">
                      {copied === r.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected section */}
      {rejected.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Rejected Requests</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {rejected.map(r => (
              <div key={r.id} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                    {r.studentInitials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{r.studentName}</p>
                    <p className="text-xs text-gray-400">{r.subject} · {formatDate(r.requestedAt)}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-red-100 text-red-600 px-3 py-1.5 rounded-full">Rejected</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {pending.length === 0 && approved.length === 0 && rejected.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 text-sm font-medium">No extra marks requests yet.</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default LecExtraMarks;