import React, { useState } from 'react';
import { FileText, Eye, CheckCircle, XCircle, Clock, Medal, Filter, X } from 'lucide-react';
import { PENDING_RESOURCES } from './lecData';

const SORT_OPTIONS = [
  { value: 'fifo', label: 'First Uploaded First' },
  { value: 'rank', label: 'Higher Student Rank First' },
];

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Rank medal colours matching student side badge style
const rankStyle = (rank) => {
  if (rank === 1) return 'bg-amber-100 text-amber-700';
  if (rank === 2) return 'bg-slate-200 text-slate-600';
  if (rank === 3) return 'bg-orange-100 text-orange-600';
  return 'bg-slate-100 text-slate-400';
};

const LecResources = ({ onPointsEarned, onPendingChange }) => {
  const [resources, setResources] = useState(PENDING_RESOURCES);
  const [sort, setSort]           = useState('fifo');
  const [viewItem, setViewItem]   = useState(null);
  const [rejectItem, setRejectItem] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [toast, setToast]         = useState(null);

  const showToast = (msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3200);
  };

  const pending  = resources.filter(r => r.status === 'pending');
  const reviewed = resources.filter(r => r.status !== 'pending');

  const sorted = (list) => [...list].sort((a, b) =>
    sort === 'rank'
      ? a.studentRank - b.studentRank
      : new Date(a.uploadedAt) - new Date(b.uploadedAt)
  );

  const doAccept = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
    setViewItem(null);
    const earned = 10;
    onPointsEarned(earned);
    onPendingChange(-1);
    showToast(`✅ Resource accepted — +${earned} points earned!`, 'bg-green-600');
  };

  const doReject = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected', rejectionNote: rejectNote } : r));
    setRejectItem(null);
    setViewItem(null);
    setRejectNote('');
    const earned = 5;
    onPointsEarned(earned);
    onPendingChange(-1);
    showToast(`❌ Resource rejected — +${earned} points earned!`, 'bg-red-500');
  };

  return (
    <div className="space-y-8">

      {/* Header + sort control */}
      <div className="flex items-start justify-between gap-4">
        <header>
          <h2 className="text-3xl font-black text-slate-900">Student Resources</h2>
          <p className="text-slate-500 font-medium mt-1">
            Review, accept or reject student-uploaded notes · Earn <span className="font-black text-green-600">+10 pts</span> per accept, <span className="font-black text-red-500">+5 pts</span> per reject
          </p>
        </header>

        {/* Sort — proper styled select matching StuHome */}
        <div className="shrink-0 flex items-center gap-2 mt-1">
          <Filter size={15} className="text-slate-400" />
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none bg-white border-2 border-slate-200 hover:border-slate-300 focus:border-violet-400 text-slate-700 font-bold text-sm px-4 py-2.5 pr-9 rounded-xl cursor-pointer focus:outline-none transition-all"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>

      {/* ── Pending section ── */}
      {sorted(pending).length > 0 && (
        <div>
          <SectionLabel text={`Pending Review (${pending.length})`} dotColor="bg-amber-500" textColor="text-amber-600" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-4">
            {sorted(pending).map(r => (
              <ResourceCard
                key={r.id}
                resource={r}
                onView={() => setViewItem(r)}
                onAccept={() => doAccept(r.id)}
                onReject={() => { setRejectItem(r); setRejectNote(''); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Reviewed section ── */}
      {reviewed.length > 0 && (
        <div>
          <SectionLabel text={`Reviewed (${reviewed.length})`} dotColor="bg-slate-300" textColor="text-slate-400" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-4">
            {sorted(reviewed).map(r => (
              <ResourceCard key={r.id} resource={r} reviewed />
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && reviewed.length === 0 && (
        <div className="p-16 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-[32px]">
          No student resources to review.
        </div>
      )}

      {/* ── View modal ── */}
      {viewItem && (
        <Overlay onClose={() => setViewItem(null)}>
          <div className="space-y-6">
            <ModalHeader label="Previewing Resource" onClose={() => setViewItem(null)} />
            <div>
              <h3 className="text-2xl font-black text-slate-900">{viewItem.title}</h3>
              <p className="text-slate-400 font-semibold text-sm mt-1">{viewItem.subject}</p>
            </div>

            {/* Student info card */}
            <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
              <InfoRow label="Student"  val={viewItem.studentName} />
              <InfoRow label="Rank"     val={`#${viewItem.studentRank}`} />
              <InfoRow label="Likes"    val={`❤️ ${viewItem.studentLikes}`} />
              <InfoRow label="File"     val={viewItem.file} />
              <InfoRow label="Size"     val={viewItem.fileSize} />
              <InfoRow label="Uploaded" val={formatDate(viewItem.uploadedAt)} />
            </div>

            {/* File preview placeholder — same style as StuResourceCard gradient */}
            <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200">
              <FileText size={34} className="text-slate-300" />
              <p className="text-sm font-bold text-slate-400">{viewItem.file}</p>
              <button className="text-xs font-black text-violet-500 hover:underline">Open full preview ↗</button>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => { setViewItem(null); setRejectItem(viewItem); setRejectNote(''); }}
                className="flex-1 py-3.5 border-2 border-red-100 text-red-500 font-black rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                <XCircle size={17} /> Reject
              </button>
              <button onClick={() => doAccept(viewItem.id)}
                className="flex-1 py-3.5 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                <CheckCircle size={17} /> Accept
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* ── Reject note modal ── */}
      {rejectItem && (
        <Overlay onClose={() => setRejectItem(null)}>
          <div className="space-y-6">
            <ModalHeader label="Rejecting Resource" onClose={() => setRejectItem(null)} />
            <div>
              <h3 className="text-2xl font-black text-slate-900">{rejectItem.title}</h3>
              <p className="text-slate-400 font-semibold text-sm">by {rejectItem.studentName}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Reason for rejection (optional)</label>
              <textarea
                value={rejectNote}
                onChange={e => setRejectNote(e.target.value)}
                placeholder="e.g., Content is incomplete or inaccurate..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-red-400 transition-all h-28 placeholder:text-slate-300 font-medium resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRejectItem(null)}
                className="flex-1 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={() => doReject(rejectItem.id)}
                className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                <XCircle size={17} /> Confirm Reject
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 ${toast.color} text-white px-6 py-4 rounded-2xl font-black shadow-xl text-sm animate-in slide-in-from-bottom-4 duration-300`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

// ── Resource card ─────────────────────────────────────────────────────────────
const ResourceCard = ({ resource: r, onView, onAccept, onReject, reviewed }) => (
  <div className={`bg-white rounded-[28px] border shadow-sm p-6 space-y-4 hover:shadow-md transition-all
    ${r.status === 'accepted' ? 'border-green-100' : r.status === 'rejected' ? 'border-red-100' : 'border-slate-100'}`}
  >
    {/* Top row: file info + status badge */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2.5 bg-violet-50 rounded-xl shrink-0">
          <FileText size={18} className="text-violet-500" />
        </div>
        <div className="min-w-0">
          <p className="font-black text-slate-900 text-sm truncate">{r.title}</p>
          <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">{r.subject}</p>
        </div>
      </div>
      <StatusBadge status={r.status} />
    </div>

    {/* Student row */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">
          {r.studentInitials}
        </div>
        <span className="text-sm font-bold text-slate-700">{r.studentName}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${rankStyle(r.studentRank)}`}>
          <Medal size={10} /> #{r.studentRank}
        </span>
        <span className="text-xs font-bold text-slate-400">❤️ {r.studentLikes}</span>
      </div>
    </div>

    {/* File meta */}
    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
      <span className="flex items-center gap-1"><FileText size={11} /> {r.file} · {r.fileSize}</span>
      <span className="flex items-center gap-1"><Clock size={11} /> {formatDate(r.uploadedAt).split('·')[0].trim()}</span>
    </div>

    {/* Rejection note (if any) */}
    {r.status === 'rejected' && r.rejectionNote && (
      <div className="bg-red-50 rounded-xl px-3 py-2">
        <p className="text-xs font-semibold text-red-600">Note: {r.rejectionNote}</p>
      </div>
    )}

    {/* Action buttons — only for pending */}
    {!reviewed && (
      <div className="flex gap-2 pt-1">
        <button onClick={onView}
          className="flex-1 py-2.5 border-2 border-slate-100 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all">
          <Eye size={14} /> View
        </button>
        <button onClick={onReject}
          className="flex-1 py-2.5 border-2 border-red-100 rounded-xl text-sm font-black text-red-500 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-all">
          <XCircle size={14} /> Reject
        </button>
        <button onClick={onAccept}
          className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-black flex items-center justify-center gap-1.5 transition-all">
          <CheckCircle size={14} /> Accept
        </button>
      </div>
    )}
  </div>
);

// ── Small reusables ───────────────────────────────────────────────────────────
const SectionLabel = ({ text, dotColor, textColor }) => (
  <div className="flex items-center gap-2.5">
    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
    <h3 className={`text-xs font-black uppercase tracking-widest ${textColor}`}>{text}</h3>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    accepted: 'bg-green-100 text-green-700',
    rejected:  'bg-red-100 text-red-600',
    pending:   'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${map[status]}`}>
      {status}
    </span>
  );
};

const Overlay = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-[40px] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-10 relative" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const ModalHeader = ({ label, onClose }) => (
  <div className="flex items-center justify-between">
    <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">{label}</p>
    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
      <X size={20} />
    </button>
  </div>
);

const InfoRow = ({ label, val }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-bold text-slate-400">{label}</span>
    <span className="text-sm font-black text-slate-800">{val}</span>
  </div>
);

export default LecResources;