import React, { useState } from 'react';
import { Search, ChevronDown, CheckCircle, XCircle, Eye, FileText, Medal } from 'lucide-react';
import { PENDING_SUBMISSIONS } from './SharedData';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent First'        },
  { value: 'fifo',   label: 'First Uploaded First' },
  { value: 'rank',   label: 'Highest Rank First'  },
];

const rankLabel = (r) =>
  r === 1 ? { text: 'Gold',   cls: 'bg-yellow-100 text-yellow-700' } :
  r === 2 ? { text: 'Silver', cls: 'bg-gray-200 text-gray-600' } :
  r === 3 ? { text: 'Bronze', cls: 'bg-orange-100 text-orange-600' } :
            { text: `#${r}`,  cls: 'bg-gray-100 text-gray-400' };

const formatDate = (iso) => iso?.split('T')[0] ?? '';

const LecStudentUploads = ({ onPointsEarned, onPendingChange }) => {
  const [items,      setItems]     = useState(PENDING_SUBMISSIONS);
  const [sort,       setSort]      = useState('recent');
  const [search,     setSearch]    = useState('');
  const [viewItem,   setViewItem]  = useState(null);
  const [rejectItem, setRejectItem]= useState(null);
  const [rejectNote, setRejectNote]= useState('');
  const [toast,      setToast]     = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const pending  = items.filter(r => r.status === 'pending');
  const reviewed = items.filter(r => r.status !== 'pending');
  const pendingCount = pending.length;

  const filtered = (list) => {
    let out = [...list];
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.studentName?.toLowerCase().includes(q) ||
        r.subject?.toLowerCase().includes(q)
      );
    }
    if (sort === 'rank')   out.sort((a, b) => a.studentRank - b.studentRank);
    if (sort === 'fifo')   out.sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
    if (sort === 'recent') out.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    return out;
  };

  const doAccept = (id) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
    setViewItem(null);
    onPointsEarned(10);
    onPendingChange(-1);
    showToast('✅ Accepted — +10 points earned!');
  };

  const doReject = (id) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', rejectionNote: rejectNote } : r));
    setRejectItem(null);
    setViewItem(null);
    setRejectNote('');
    onPointsEarned(5);
    onPendingChange(-1);
    showToast('Rejected — +5 points earned.');
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check Student Uploads</h1>
          <p className="text-gray-400 text-sm mt-1">Review and approve student-submitted resources</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-gray-100 rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
            {pendingCount} Pending
          </div>
        )}
      </div>

      {/* Search + sort bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, student, or subject..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-sm text-gray-700 font-medium pl-4 pr-9 py-2.5 rounded-xl cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 hover:border-gray-300 transition-all"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* All items */}
      <div className="space-y-4">
        {filtered([...pending, ...reviewed]).map(r => (
          <SubmissionCard
            key={r.id}
            resource={r}
            onView={() => setViewItem(r)}
            onAccept={() => doAccept(r.id)}
            onReject={() => { setRejectItem(r); setRejectNote(''); }}
          />
        ))}
        {filtered([...pending, ...reviewed]).length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm">No submissions found.</div>
        )}
      </div>

      {/* View modal */}
      {viewItem && (
        <Modal onClose={() => setViewItem(null)}>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{viewItem.title}</h3>
          <p className="text-sm text-gray-400 mb-4">{viewItem.subject}</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <InfoCell label="Student"  val={viewItem.studentName} />
            <InfoCell label="Rank"     val={`#${viewItem.studentRank}`} />
            <InfoCell label="Likes"    val={`❤️ ${viewItem.studentLikes}`} />
            <InfoCell label="Uploaded" val={formatDate(viewItem.uploadedAt)} />
          </div>
          <div className="h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 mb-5">
            <FileText size={24} className="text-gray-300" />
            <p className="text-sm text-gray-400">{viewItem.file}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setViewItem(null); setRejectItem(viewItem); setRejectNote(''); }}
              className="flex-1 py-2.5 border border-red-200 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-50 flex items-center justify-center gap-2"
            >
              <XCircle size={15} /> Reject (+5pts)
            </button>
            <button
              onClick={() => doAccept(viewItem.id)}
              className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <CheckCircle size={15} /> Accept (+10pts)
            </button>
          </div>
        </Modal>
      )}

      {/* Reject note modal */}
      {rejectItem && (
        <Modal onClose={() => setRejectItem(null)}>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Reject Submission</h3>
          <p className="text-sm text-gray-400 mb-4">by {rejectItem.studentName}</p>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            Reason <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={rejectNote}
            onChange={e => setRejectNote(e.target.value)}
            placeholder="e.g., Content is incomplete or inaccurate..."
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-100 h-24 resize-none placeholder:text-gray-300"
          />
          <div className="flex gap-3 mt-4">
            <button onClick={() => setRejectItem(null)}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={() => doReject(rejectItem.id)}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 flex items-center justify-center gap-2">
              <XCircle size={15} /> Confirm Reject
            </button>
          </div>
        </Modal>
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

const SubmissionCard = ({ resource: r, onView, onAccept, onReject }) => {
  const rank = rankLabel(r.studentRank);
  const reviewed = r.status !== 'pending';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        {/* Left: avatar + info */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
            {r.studentInitials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900">{r.title}</p>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{r.subject}</span>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">{r.description || `Notes by ${r.studentName}`}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>By {r.studentName}</span>
              <span className={`font-semibold px-2 py-0.5 rounded-full ${rank.cls}`}>{rank.text}</span>
              <span>❤️ {r.studentLikes} likes</span>
              <span>{formatDate(r.uploadedAt)}</span>
            </div>
            {/* File tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(r.files || [r.file]).filter(Boolean).map((f, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-col gap-2 shrink-0">
          {!reviewed ? (
            <>
              <button onClick={onView}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                Preview
              </button>
              <button onClick={onAccept}
                className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-all flex items-center gap-1.5">
                <CheckCircle size={14} /> Accept (+10pts)
              </button>
              <button onClick={onReject}
                className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all flex items-center gap-1.5">
                <XCircle size={14} /> Reject (+5pts)
              </button>
            </>
          ) : (
            <StatusBadge status={r.status} />
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
    pending:  'bg-yellow-100 text-yellow-700',
  };
  return <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${map[status]}`}>{status}</span>;
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const InfoCell = ({ label, val }) => (
  <div className="bg-gray-50 rounded-xl px-3 py-2.5">
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-0.5">{val}</p>
  </div>
);

export default LecStudentUploads;