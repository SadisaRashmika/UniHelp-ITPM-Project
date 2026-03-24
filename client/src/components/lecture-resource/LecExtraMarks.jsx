import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Copy, Check } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';
const formatDate = (iso) => (iso ? new Date(iso).toISOString().split('T')[0] : '');

const mapReq = (r) => ({
  id: r.id,
  studentName: r.student_name,
  studentInitials: r.student_initials,
  studentId: r.student_id,
  totalLikes: r.total_likes,
  subject: r.subject,
  status: r.status,
  uniqueCode: r.unique_code,
  marksAdded: r.marks_added,
  requestedAt: r.requested_at,
  approvedAt: r.approved_at,
});

const LecExtraMarks = ({ lecturerId = 'LEC001', onPendingChange = () => {} }) => {
  const [requests, setRequests] = useState([]);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(null);

  const loadRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/lecturer/bonus-requests?lecturerId=${lecturerId}`);
      setRequests((res.data || []).map(mapReq));
    } catch (error) {
      console.error('Error loading bonus requests:', error);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [lecturerId]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReview = async (id, action) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/lecturer/bonus-requests/${id}/review`, {
        lecturerId,
        action,
      });
      await loadRequests();
      if (action === 'approved') {
        onPendingChange(-1);
        showToast('Approved. Student likes deducted by 100.');
      } else {
        onPendingChange(-1);
        showToast('Request rejected. Student likes unchanged.');
      }
    } catch (error) {
      console.error('Error reviewing bonus request:', error);
      showToast(error?.response?.data?.message || 'Failed to review request');
    }
  };

  const handleMarkAdded = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/lecturer/bonus-requests/${id}/mark-added`, { lecturerId });
      await loadRequests();
      showToast('Marked as added.');
    } catch (error) {
      console.error('Error marking added:', error);
      showToast('Failed to mark as added');
    }
  };

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code || '').catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const pending = requests.filter((r) => r.status === 'pending');
  const approved = requests.filter((r) => r.status === 'approved');
  const rejected = requests.filter((r) => r.status === 'rejected');

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Extra Marks Approval</h1>
        <p className="text-gray-400 text-sm mt-1">Approve or reject student requests (100 likes = +3 marks)</p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
            <div className="bg-gray-100 rounded-xl px-4 py-2 text-sm font-semibold text-gray-600">{pending.length} Pending</div>
          </div>

          {pending.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {r.studentInitials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{r.studentName}</p>
                    <p className="text-sm text-gray-400">ID: {r.studentId}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">{r.subject}</span>
                      <span className="text-sm text-gray-500">Current Likes: <span className="font-medium text-gray-700">{r.totalLikes}</span></span>
                      <span className="text-sm">Requested Marks: <span className="font-semibold text-green-600">+3</span></span>
                      <span className="text-sm text-gray-400">{formatDate(r.requestedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleReview(r.id, 'approved')}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600">
                    <CheckCircle size={15} /> Approve
                  </button>
                  <button onClick={() => handleReview(r.id, 'rejected')}
                    className="flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50">
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {approved.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Approved Extra Marks</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-5 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>Student Name</span>
              <span>Student ID</span>
              <span>Subject</span>
              <span>Extra Marks</span>
              <span>Approved Date</span>
            </div>
            {approved.map((r) => (
              <div key={r.id} className="grid grid-cols-5 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50">
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
                      className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200">
                      +3 marks
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{formatDate(r.approvedAt || r.requestedAt)}</span>
                  {r.uniqueCode && (
                    <button onClick={() => handleCopy(r.id, r.uniqueCode)} className="text-gray-300 hover:text-gray-600" title="Copy code">
                      {copied === r.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rejected.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Rejected Requests</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {rejected.map((r) => (
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

      {pending.length === 0 && approved.length === 0 && rejected.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-400 text-sm font-medium">No extra marks requests yet.</p>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default LecExtraMarks;
