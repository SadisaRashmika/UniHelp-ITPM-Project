import React, { useState } from 'react';
import { FileText, Eye, CheckCircle, XCircle, Clock, Medal, SlidersHorizontal, X } from 'lucide-react';
import { PENDING_SUBMISSIONS } from './SharedData';

const SORT_OPTIONS = [
  { value: 'fifo', label: 'First Uploaded First'   },
  { value: 'rank', label: 'Highest Rank First'     },
];

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const rankStyle = (r) =>
  r === 1 ? 'bg-amber-100 text-amber-700' :
  r === 2 ? 'bg-slate-200 text-slate-600' :
  r === 3 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400';

const LecStudentUploads = ({ onPointsEarned, onPendingChange }) => {
  const [items,       setItems]      = useState(PENDING_SUBMISSIONS);
  const [sort,        setSort]       = useState('fifo');
  const [viewItem,    setViewItem]   = useState(null);
  const [rejectItem,  setRejectItem] = useState(null);
  const [rejectNote,  setRejectNote] = useState('');
  const [toast,       setToast]      = useState(null);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const pending  = items.filter(r => r.status === 'pending');
  const reviewed = items.filter(r => r.status !== 'pending');

  const sorted = (list) => [...list].sort((a, b) =>
    sort === 'rank' ? a.studentRank - b.studentRank : new Date(a.uploadedAt) - new Date(b.uploadedAt)
  );

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
    showToast('❌ Rejected — +5 points earned!');
  };

  return (
    <div className="max-w-5xl space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Student Uploads</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Review submissions · <span className="text-emerald-600 font-bold">+10 pts</span> accept · <span className="text-red-500 font-bold">+5 pts</span> reject
          </p>
        </div>

        {/* Sort */}
        <div className="shrink-0 flex items-center gap-2 mt-1">
          <SlidersHorizontal size={15} className="text-slate-400" />
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-slate-400 text-slate-700 font-bold text-sm px-4 py-2 pr-8 rounded-xl cursor-pointer focus:outline-none transition-all"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Pending"  val={pending.length}  color="bg-amber-50  text-amber-600"  dot="bg-amber-400"  />
        <SummaryCard label="Accepted" val={reviewed.filter(r => r.status === 'accepted').length} color="bg-emerald-50 text-emerald-600" dot="bg-emerald-400" />
        <SummaryCard label="Rejected" val={reviewed.filter(r => r.status === 'rejected').length} color="bg-red-50 text-red-500" dot="bg-red-400" />
      </div>

      {/* ── Pending section ── */}
      {sorted(pending).length > 0 && (
        <Section label={`Pending Review (${pending.length})`} dotColor="bg-amber-400" labelColor="text-amber-600">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {sorted(pending).map(r => (
              <SubmissionCard
                key={r.id} resource={r}
                onView={() => setViewItem(r)}
                onAccept={() => doAccept(r.id)}
                onReject={() => { setRejectItem(r); setRejectNote(''); }}
              />
            ))}
          </div>
        </Section>
      )}

      {/* ── Reviewed section ── */}
      {reviewed.length > 0 && (
        <Section label={`Reviewed (${reviewed.length})`} dotColor="bg-slate-300" labelColor="text-slate-400">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {sorted(reviewed).map(r => (
              <SubmissionCard key={r.id} resource={r} reviewed />
            ))}
          </div>
        </Section>
      )}

      {pending.length === 0 && reviewed.length === 0 && (
        <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm">
          No student submissions yet.
        </div>
      )}

      {/* ── View modal ── */}
      {viewItem && (
        <Overlay onClose={() => setViewItem(null)}>
          <ModalBar label="Submission Preview" onClose={() => setViewItem(null)} />
          <div className="mt-5 space-y-5">
            <div>
              <h3 className="text-xl font-black text-slate-900">{viewItem.title}</h3>
              <p className="text-slate-400 text-sm font-medium mt-0.5">{viewItem.subject}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoCell label="Student"  val={viewItem.studentName} />
              <InfoCell label="Rank"     val={`#${viewItem.studentRank}`} />
              <InfoCell label="Likes"    val={`❤️ ${viewItem.studentLikes}`} />
              <InfoCell label="File"     val={`${viewItem.file} · ${viewItem.fileSize}`} />
              <InfoCell label="Uploaded" val={formatDate(viewItem.uploadedAt)} />
              <InfoCell label="Status"   val="Pending Review" />
            </div>

            {/* File preview zone */}
            <div className="h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2">
              <FileText size={28} className="text-slate-300" />
              <p className="text-sm font-bold text-slate-400">{viewItem.file}</p>
              <button className="text-xs font-black text-blue-500 hover:underline">Open full preview ↗</button>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => { setViewItem(null); setRejectItem(viewItem); setRejectNote(''); }}
                className="flex-1 py-3 border-2 border-red-100 text-red-500 font-black rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-sm">
                <XCircle size={16} /> Reject
              </button>
              <button onClick={() => doAccept(viewItem.id)}
                className="flex-1 py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 text-sm">
                <CheckCircle size={16} /> Accept
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* ── Reject note modal ── */}
      {rejectItem && (
        <Overlay onClose={() => setRejectItem(null)}>
          <ModalBar label="Reject Submission" onClose={() => setRejectItem(null)} />
          <div className="mt-5 space-y-5">
            <div>
              <h3 className="text-xl font-black text-slate-900">{rejectItem.title}</h3>
              <p className="text-slate-400 text-sm font-medium">by {rejectItem.studentName}</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Reason <span className="text-slate-400 font-normal">(optional)</span></label>
              <textarea
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                placeholder="e.g., Content is incomplete or inaccurate..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition-all h-24 placeholder:text-slate-300 font-medium text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRejectItem(null)}
                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={() => doReject(rejectItem.id)}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                <XCircle size={16} /> Confirm Reject
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl font-black text-sm shadow-xl">
          {toast.msg}
        </div>
      )}
    </div>
  );
};

// ── Submission card ───────────────────────────────────────────────────────────
const SubmissionCard = ({ resource: r, onView, onAccept, onReject, reviewed }) => (
  <div className={`bg-white rounded-2xl border p-5 space-y-4 hover:shadow-sm transition-all
    ${r.status === 'accepted' ? 'border-emerald-100' : r.status === 'rejected' ? 'border-red-100' : 'border-slate-100'}`}>

    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2.5 bg-slate-100 rounded-xl shrink-0">
          <FileText size={16} className="text-slate-500" />
        </div>
        <div className="min-w-0">
          <p className="font-black text-slate-900 text-sm truncate">{r.title}</p>
          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{r.subject}</p>
        </div>
      </div>
      <StatusPill status={r.status} />
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-[10px] font-black">
          {r.studentInitials}
        </div>
        <span className="text-sm font-bold text-slate-700">{r.studentName}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${rankStyle(r.studentRank)}`}>
          <Medal size={9} /> #{r.studentRank}
        </span>
        <span className="text-xs text-slate-400 font-semibold">❤️ {r.studentLikes}</span>
      </div>
    </div>

    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
      <span>{r.file} · {r.fileSize}</span>
      <span className="flex items-center gap-1"><Clock size={10} /> {formatDate(r.uploadedAt).split('·')[0].trim()}</span>
    </div>

    {r.status === 'rejected' && r.rejectionNote && (
      <div className="bg-red-50 rounded-lg px-3 py-2">
        <p className="text-xs text-red-600 font-semibold">Note: {r.rejectionNote}</p>
      </div>
    )}

    {!reviewed && (
      <div className="flex gap-2 pt-1">
        <button onClick={onView}   className="flex-1 py-2.5 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all">
          <Eye size={13} /> View
        </button>
        <button onClick={onReject} className="flex-1 py-2.5 border-2 border-red-100 rounded-xl text-xs font-black text-red-500 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-all">
          <XCircle size={13} /> Reject
        </button>
        <button onClick={onAccept} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black flex items-center justify-center gap-1.5 transition-all">
          <CheckCircle size={13} /> Accept
        </button>
      </div>
    )}
  </div>
);

// ── Small reusables ───────────────────────────────────────────────────────────
const SummaryCard = ({ label, val, color, dot }) => (
  <div className={`${color} rounded-xl px-5 py-4 flex items-center gap-3`}>
    <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
    <div>
      <p className="text-2xl font-black">{val}</p>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
    </div>
  </div>
);

const Section = ({ label, dotColor, labelColor, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      <p className={`text-xs font-black uppercase tracking-widest ${labelColor}`}>{label}</p>
    </div>
    {children}
  </div>
);

const StatusPill = ({ status }) => {
  const map = { accepted: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-600', pending: 'bg-amber-100 text-amber-700' };
  return <span className={`shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${map[status]}`}>{status}</span>;
};

const Overlay = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-7" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const ModalBar = ({ label, onClose }) => (
  <div className="flex items-center justify-between">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition-colors"><X size={18} /></button>
  </div>
);

const InfoCell = ({ label, val }) => (
  <div className="bg-slate-50 rounded-xl px-4 py-3">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-slate-800 mt-0.5">{val}</p>
  </div>
);

export default LecStudentUploads;