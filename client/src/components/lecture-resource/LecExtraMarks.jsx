import React, { useState } from 'react';
import {
  Sparkles, CheckCircle, XCircle, Clock, X,
  Copy, Check, BookOpen, ListChecks, AlertCircle
} from 'lucide-react';
import { BONUS_MARK_REQUESTS } from './SharedData';

// Generate a unique code for approved requests
const generateCode = (studentId, subject) => {
  const subCode = subject.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4);
  const rand    = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BONUS-2026-${studentId.split('-').pop() || studentId.slice(-4)}-${subCode}-${rand}`;
};

const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
}) + ' · ' + new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const LecExtraMarks = ({ onPendingChange = () => {} }) => {
  const [requests, setRequests] = useState(BONUS_MARK_REQUESTS);
  const [viewReq,  setViewReq]  = useState(null);
  const [toast,    setToast]    = useState(null);
  const [copied,   setCopied]   = useState(null); // id of copied code

  const pending  = requests.filter(r => r.status === 'pending');
  const approved = requests.filter(r => r.status === 'approved');
  const rejected = requests.filter(r => r.status === 'rejected');

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (id) => {
    const req       = requests.find(r => r.id === id);
    const code      = generateCode(req.studentId, req.subject);
    const approvedAt = new Date().toISOString();
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'approved', uniqueCode: code, approvedAt } : r
    ));
    setViewReq(null);
    onPendingChange(-1);
    showToast(`✅ Approved — unique code generated and sent to ${req.studentName.split(' ')[0]}'s email`);
  };

  const handleReject = (id) => {
    const req = requests.find(r => r.id === id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setViewReq(null);
    onPendingChange(-1);
    showToast(`Request from ${req.studentName.split(' ')[0]} rejected.`, 'err');
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
    <div className="max-w-5xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Extra Marks Requests</h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          Students spend 100 likes to request +3 bonus marks on one subject per semester
        </p>
      </div>

      {/* How it works strip */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-6 py-4 flex items-start gap-3">
        <AlertCircle size={17} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800 font-medium leading-relaxed">
          <span className="font-black">How it works: </span>
          Student spends 100 likes → request arrives here → you approve or reject → if approved, a unique code is auto-generated and emailed to the student → student shows you the code → you tick <strong>"Marks Added"</strong> after entering the +3 in the grade system.
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard icon={<Clock size={16}/>}       label="Pending"  val={pending.length}  bg="bg-amber-50"   text="text-amber-600"   />
        <SummaryCard icon={<CheckCircle size={16}/>} label="Approved" val={approved.length} bg="bg-emerald-50" text="text-emerald-600" />
        <SummaryCard icon={<XCircle size={16}/>}     label="Rejected" val={rejected.length} bg="bg-red-50"     text="text-red-500"     />
      </div>

      {/* ── Pending requests ── */}
      {pending.length > 0 && (
        <Section label={`Pending (${pending.length})`} dot="bg-amber-400" color="text-amber-600">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {pending.map(r => (
              <RequestCard
                key={r.id} req={r}
                onView={() => setViewReq(r)}
                onApprove={() => handleApprove(r.id)}
                onReject={() => handleReject(r.id)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* ── Approved list — lecturer uses this to track who to add marks for ── */}
      {approved.length > 0 && (
        <Section label={`Approved — Mark Tracking (${approved.length})`} dot="bg-emerald-400" color="text-emerald-600">
          <div className="space-y-3">
            {approved.map(r => (
              <ApprovedRow
                key={r.id}
                req={r}
                onMarkAdded={() => handleMarkAdded(r.id)}
                onCopy={() => handleCopy(r.id, r.uniqueCode)}
                copied={copied === r.id}
              />
            ))}
          </div>

          {/* Mark-adding guide */}
          <div className="mt-4 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 flex items-start gap-3">
            <ListChecks size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              When a student presents their code, verify it matches, add +3 to their grade in the grade system, then click <strong className="text-slate-700">"Mark as Added"</strong> to record it here.
            </p>
          </div>
        </Section>
      )}

      {/* ── Rejected ── */}
      {rejected.length > 0 && (
        <Section label={`Rejected (${rejected.length})`} dot="bg-red-300" color="text-red-400">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {rejected.map(r => (
              <RequestCard key={r.id} req={r} reviewed />
            ))}
          </div>
        </Section>
      )}

      {pending.length === 0 && approved.length === 0 && rejected.length === 0 && (
        <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl">
          <Sparkles size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-bold text-sm">No extra marks requests yet.</p>
        </div>
      )}

      {/* ── View / Confirm modal ── */}
      {viewReq && (
        <Overlay onClose={() => setViewReq(null)}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 rounded-xl">
                <Sparkles size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extra Marks Request</p>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">Review Request</h3>
              </div>
            </div>
            <button onClick={() => setViewReq(null)} className="text-slate-300 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5">
            <InfoCell label="Student"    val={viewReq.studentName}  />
            <InfoCell label="Student ID" val={viewReq.studentId}    />
            <InfoCell label="Subject"    val={viewReq.subject}      />
            <InfoCell label="Likes Spent" val="100 ❤️"             />
            <InfoCell label="Bonus Marks" val="+3 marks"            />
            <InfoCell label="Requested"  val={formatDate(viewReq.requestedAt).split('·')[0].trim()} />
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              Approving will auto-generate a unique code and send it to the student's email. The student must present this code to you before you add the marks.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleReject(viewReq.id)}
              className="flex-1 py-3 border-2 border-red-100 text-red-500 font-black rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <XCircle size={16} /> Reject
            </button>
            <button
              onClick={() => handleApprove(viewReq.id)}
              className="flex-1 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle size={16} /> Approve & Send Code
            </button>
          </div>
        </Overlay>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3.5 rounded-xl font-black text-sm shadow-xl text-white
          ${toast.type === 'err' ? 'bg-red-500' : 'bg-slate-900'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

// ── Pending / Rejected request card ──────────────────────────────────────────
const RequestCard = ({ req: r, onView, onApprove, onReject, reviewed }) => (
  <div className={`bg-white rounded-2xl border p-5 space-y-4 hover:shadow-sm transition-all
    ${r.status === 'rejected' ? 'border-red-100' : 'border-slate-100'}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-black shrink-0">
          {r.studentInitials}
        </div>
        <div>
          <p className="font-black text-slate-900 text-sm">{r.studentName}</p>
          <p className="text-xs text-slate-400 font-medium">{r.studentId}</p>
        </div>
      </div>
      <StatusPill status={r.status} />
    </div>

    <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <BookOpen size={13} className="text-slate-400" />
        <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{r.subject}</span>
      </div>
      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">+3 marks</span>
    </div>

    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
      <span>100 ❤️ spent</span>
      <span><Clock size={10} className="inline mr-1" />{formatDate(r.requestedAt).split('·')[0].trim()}</span>
    </div>

    {!reviewed && (
      <div className="flex gap-2 pt-1">
        <button onClick={onView}    className="flex-1 py-2.5 border-2 border-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all">
          Review
        </button>
        <button onClick={onReject}  className="flex-1 py-2.5 border-2 border-red-100 rounded-xl text-xs font-black text-red-500 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-all">
          <XCircle size={12} /> Reject
        </button>
        <button onClick={onApprove} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black flex items-center justify-center gap-1.5 transition-all">
          <CheckCircle size={12} /> Approve
        </button>
      </div>
    )}
  </div>
);

// ── Approved row with code + mark-added toggle ────────────────────────────────
const ApprovedRow = ({ req: r, onMarkAdded, onCopy, copied }) => (
  <div className={`bg-white rounded-2xl border p-5 transition-all
    ${r.marksAdded ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 hover:shadow-sm'}`}
  >
    <div className="flex items-center justify-between gap-4 flex-wrap">

      {/* Student info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-black shrink-0">
          {r.studentInitials}
        </div>
        <div className="min-w-0">
          <p className="font-black text-slate-900 text-sm">{r.studentName}</p>
          <p className="text-xs text-slate-400 font-medium truncate">{r.subject}</p>
        </div>
      </div>

      {/* Code block */}
      <div className="flex items-center gap-2 bg-slate-900 rounded-xl px-4 py-2.5 shrink-0">
        <span className="text-white font-black text-xs tracking-wider">{r.uniqueCode}</span>
        <button
          onClick={onCopy}
          className="text-white/50 hover:text-white transition-colors ml-1"
          title="Copy code"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        </button>
      </div>

      {/* Mark added toggle */}
      {r.marksAdded ? (
        <div className="flex items-center gap-1.5 text-emerald-600 font-black text-xs bg-emerald-100 px-3 py-2 rounded-xl shrink-0">
          <CheckCircle size={13} /> Marks Added
        </div>
      ) : (
        <button
          onClick={onMarkAdded}
          className="flex items-center gap-1.5 text-xs font-black bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-all shrink-0"
        >
          <ListChecks size={13} /> Mark as Added
        </button>
      )}
    </div>

    {r.approvedAt && (
      <p className="text-[10px] text-slate-400 font-medium mt-3">
        Approved {formatDate(r.approvedAt)} · Code sent to student's email
      </p>
    )}
  </div>
);

// ── Reusables ─────────────────────────────────────────────────────────────────
const SummaryCard = ({ icon, label, val, bg, text }) => (
  <div className={`${bg} rounded-xl px-5 py-4 flex items-center gap-3 ${text}`}>
    {icon}
    <div>
      <p className="text-2xl font-black">{val}</p>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
    </div>
  </div>
);

const Section = ({ label, dot, color, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <p className={`text-xs font-black uppercase tracking-widest ${color}`}>{label}</p>
    </div>
    {children}
  </div>
);

const StatusPill = ({ status }) => {
  const map = {
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-600',
    pending:  'bg-amber-100 text-amber-700',
  };
  return <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase shrink-0 ${map[status]}`}>{status}</span>;
};

const Overlay = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-7" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const InfoCell = ({ label, val }) => (
  <div className="bg-slate-50 rounded-xl px-4 py-3">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-slate-800 mt-0.5">{val}</p>
  </div>
);

export default LecExtraMarks;