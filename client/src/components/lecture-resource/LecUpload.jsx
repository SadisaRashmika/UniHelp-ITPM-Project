import React, { useState } from 'react';
import {
  Plus, Trash2, CheckCircle2, FileText, Upload, X,
  BookOpen, ChevronDown, Eye, Layers
} from 'lucide-react';
import { LECTURER, SUBJECTS, YEARS, SEMESTERS, LECTURES } from './SharedData';

const EMPTY_Q = () => ({ id: Date.now() + Math.random(), question: '', options: ['', '', '', ''], answer: 0 });

// ─────────────────────────────────────────────────────────────────────────────
const LecUpload = ({ onPublish }) => {
  const [lectures, setLectures]     = useState(LECTURES.filter(l => l.lecturer === LECTURER.name));
  const [viewLec,  setViewLec]      = useState(null);
  const [toast,    setToast]        = useState(null);

  // ── Form fields ──
  const [title,    setTitle]    = useState('');
  const [subject,  setSubject]  = useState('');
  const [topic,    setTopic]    = useState('');
  const [year,     setYear]     = useState('');
  const [semester, setSemester] = useState('');
  const [files,    setFiles]    = useState([]);           // { name, size }
  const [addQuiz,  setAddQuiz]  = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQs]       = useState([EMPTY_Q()]);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  // File pick simulation
  const handleFilePick = (e) => {
    const picked = Array.from(e.target.files || []);
    const mapped = picked.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(0) + ' KB' }));
    setFiles(prev => [...prev, ...mapped]);
    e.target.value = '';
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  // Quiz helpers
  const addQ       = ()            => setQs(prev => [...prev, EMPTY_Q()]);
  const removeQ    = (id)          => { if (questions.length > 1) setQs(prev => prev.filter(q => q.id !== id)); };
  const updateQ    = (id, f, v)    => setQs(prev => prev.map(q => q.id === id ? { ...q, [f]: v } : q));
  const updateOpt  = (id, i, v)    => setQs(prev => prev.map(q => q.id === id ? { ...q, options: q.options.map((o, j) => j === i ? v : o) } : q));

  const resetForm = () => {
    setTitle(''); setSubject(''); setTopic(''); setYear(''); setSemester('');
    setFiles([]); setAddQuiz(false); setQuizTitle(''); setQs([EMPTY_Q()]);
  };

  const handlePublish = () => {
    if (!title.trim())    { showToast('Please enter a lecture title.', 'err');  return; }
    if (!subject)         { showToast('Please select a subject.', 'err');       return; }
    if (!year)            { showToast('Please select a year.', 'err');          return; }
    if (!semester)        { showToast('Please select a semester.', 'err');      return; }

    if (addQuiz) {
      if (!quizTitle.trim()) { showToast('Please enter a quiz title.', 'err'); return; }
      const bad = questions.find(q => !q.question.trim() || q.options.some(o => !o.trim()));
      if (bad) { showToast('Fill in all quiz questions and options.', 'err'); return; }
    }

    const tags = [subject, topic, year, semester].filter(Boolean);
    const newLecture = {
      id: Date.now(),
      title: title.trim(),
      lecturer: LECTURER.name,
      subject,
      topic: topic.trim(),
      year,
      semester,
      tags,
      files: files.length > 0 ? files.map(f => f.name) : ['(No files uploaded)'],
      publishedAt: new Date().toISOString().split('T')[0],
      studentNotes: [],
      quizTitle: addQuiz ? quizTitle.trim() : null,
      quiz: addQuiz ? {
        title: quizTitle.trim(),
        questions: questions.map(q => ({ question: q.question, options: q.options, answer: q.answer })),
      } : null,
    };

    setLectures(prev => [newLecture, ...prev]);
    onPublish(newLecture);
    resetForm();
    showToast('✅ Lecture published successfully!');
  };

  return (
    <div className="max-w-4xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Resources & Quiz</h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">Upload lecture materials and optionally attach a quiz</p>
      </div>

      {/* ── Upload form card ── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">

        {/* Form header bar */}
        <div className="bg-slate-900 px-7 py-5">
          <h2 className="text-white font-black text-base">New Lecture Resource</h2>
          <p className="text-white/50 text-xs font-medium mt-0.5">Fill in the details below and publish to students</p>
        </div>

        <div className="p-7 space-y-7">

          {/* ── Row 1: Title + Lecturer (autofill) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Lecture Title" required>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Machine Learning"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all placeholder:text-slate-300"
              />
            </Field>
            <Field label="Lecturer Name" hint="Auto-filled">
              <input
                value={LECTURER.name}
                readOnly
                className="input bg-slate-50 text-slate-400 cursor-not-allowed"
              />
            </Field>
          </div>

          {/* ── Row 2: Subject + Topic ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Subject" required>
              <SelectField value={subject} onChange={setSubject} placeholder="Select subject...">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </SelectField>
            </Field>
            <Field label="Topic">
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g., ML Basics, Graph Algorithms…"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all placeholder:text-slate-300"
              />
            </Field>
          </div>

          {/* ── Row 3: Year + Semester ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Year" required>
              <SelectField value={year} onChange={setYear} placeholder="Select year...">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </SelectField>
            </Field>
            <Field label="Semester" required>
              <SelectField value={semester} onChange={setSemester} placeholder="Select semester...">
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </SelectField>
            </Field>
          </div>

          {/* ── File upload ── */}
          <Field label="Lecture Files">
            <label className="flex items-center justify-center gap-3 w-full p-5 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/60 hover:border-slate-300 transition-all cursor-pointer group">
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                <Upload size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-600">Click to upload files</p>
                <p className="text-xs text-slate-400 font-medium">PDF, PPTX, DOCX supported</p>
              </div>
              <input type="file" multiple className="hidden" onChange={handleFilePick} />
            </label>

            {/* Uploaded file list */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <FileText size={14} className="text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">{f.name}</span>
                      <span className="text-xs text-slate-400">{f.size}</span>
                    </div>
                    <button onClick={() => removeFile(i)} className="text-slate-300 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          {/* ── Divider ── */}
          <div className="border-t border-slate-100" />

          {/* ── Quiz section ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <BookOpen size={16} className="text-slate-400" />
                <span className="font-black text-slate-800 text-sm">Attach a Quiz</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Optional</span>
              </div>
              <button
                onClick={() => setAddQuiz(v => !v)}
                className={`text-xs font-black px-4 py-2 rounded-xl transition-all
                  ${addQuiz ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white'}`}
              >
                {addQuiz ? '− Remove Quiz' : '+ Add Quiz'}
              </button>
            </div>

            {addQuiz && (
              <div className="space-y-6 bg-slate-50 rounded-xl p-6 border border-slate-100">

                {/* Quiz title */}
                <Field label="Quiz Title" required>
                  <input
                    value={quizTitle}
                    onChange={e => setQuizTitle(e.target.value)}
                    placeholder="e.g., ML Basics Quiz"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all placeholder:text-slate-300"
                  />
                </Field>

                {/* Questions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Questions ({questions.length})
                    </p>
                  </div>

                  {questions.map((q, qi) => (
                    <QuestionBlock
                      key={q.id}
                      q={q} qi={qi}
                      onUpdateQ={(f, v) => updateQ(q.id, f, v)}
                      onUpdateOpt={(i, v) => updateOpt(q.id, i, v)}
                      onRemove={() => removeQ(q.id)}
                      canRemove={questions.length > 1}
                    />
                  ))}

                  <button
                    onClick={addQ}
                    className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Question
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="flex gap-3 pt-2">
            <button onClick={resetForm} className="px-6 py-3.5 border border-slate-200 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all">
              Clear Form
            </button>
            <button onClick={handlePublish} className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
              <CheckCircle2 size={17} /> Publish Lecture
            </button>
          </div>
        </div>
      </div>

      {/* ── My published lectures ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Layers size={16} className="text-slate-400" />
          <h3 className="font-black text-slate-900 text-sm">My Published Lectures</h3>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{lectures.length}</span>
        </div>

        {lectures.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm">
            No lectures published yet.
          </div>
        ) : (
          <div className="space-y-3">
            {lectures.map(l => (
              <LectureRow key={l.id} lecture={l} onView={() => setViewLec(l)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Preview modal ── */}
      {viewLec && (
        <Modal onClose={() => setViewLec(null)}>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lecture Preview</p>
                <h3 className="text-xl font-black text-slate-900">{viewLec.title}</h3>
                <p className="text-slate-400 text-sm font-medium mt-0.5">{viewLec.subject} · {viewLec.year} · {viewLec.semester}</p>
              </div>
              <button onClick={() => setViewLec(null)} className="text-slate-300 hover:text-slate-600 transition-colors shrink-0">
                <X size={20} />
              </button>
            </div>

            <InfoGrid>
              <InfoItem label="Lecturer"  val={viewLec.lecturer}  />
              <InfoItem label="Topic"     val={viewLec.topic || '—'} />
              <InfoItem label="Published" val={viewLec.publishedAt} />
              <InfoItem label="Files"     val={`${viewLec.files.length} file${viewLec.files.length !== 1 ? 's' : ''}`} />
            </InfoGrid>

            {viewLec.files.length > 0 && (
              <div className="space-y-2">
                {viewLec.files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-2.5">
                    <FileText size={14} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {viewLec.quiz && (
              <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Quiz: {viewLec.quiz.title}</p>
                {viewLec.quiz.questions.map((q, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-bold text-slate-800 mb-1.5">Q{i + 1}. {q.question}</p>
                    {q.options.map((opt, j) => (
                      <p key={j} className={`pl-3 py-0.5 text-xs rounded font-medium
                        ${q.answer === j ? 'text-green-700 font-black' : 'text-slate-400'}`}>
                        {String.fromCharCode(65 + j)}. {opt} {q.answer === j ? '✓' : ''}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3.5 rounded-xl font-black text-sm shadow-xl
          ${toast.type === 'err' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

// ── Question block ────────────────────────────────────────────────────────────
const QuestionBlock = ({ q, qi, onUpdateQ, onUpdateOpt, onRemove, canRemove }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {qi + 1}</span>
      {canRemove && (
        <button onClick={onRemove} className="text-slate-300 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      )}
    </div>
    <input
      value={q.question}
      onChange={e => onUpdateQ('question', e.target.value)}
      placeholder="Type your question here..."
      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all placeholder:text-slate-300"
    />
    <div className="space-y-2.5">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Options — <span className="text-emerald-600">circle = correct answer</span>
      </p>
      {q.options.map((opt, i) => {
        const correct = q.answer === i;
        return (
          <div key={i} className="flex items-center gap-3">
            <button
              onClick={() => onUpdateQ('answer', i)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                ${correct ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 hover:border-emerald-400'}`}
            >
              {correct && <div className="w-2 h-2 rounded-full bg-white" />}
            </button>
            <span className="text-[11px] font-black text-slate-300 w-4 shrink-0">{String.fromCharCode(65 + i)}</span>
            <input
              value={opt}
              onChange={e => onUpdateOpt(i, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              className={`flex-1 px-3.5 py-2.5 rounded-lg text-sm font-medium outline-none border transition-all placeholder:text-slate-300
                ${correct ? 'border-emerald-200 bg-emerald-50/60 focus:ring-1 focus:ring-emerald-300' : 'border-slate-200 bg-white focus:ring-1 focus:ring-slate-300'}`}
            />
          </div>
        );
      })}
    </div>
  </div>
);

// ── Published lecture row ─────────────────────────────────────────────────────
const LectureRow = ({ lecture: l, onView }) => (
  <div className="bg-white border border-slate-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-slate-200 hover:shadow-sm transition-all group">
    <div className="flex items-center gap-4 min-w-0">
      <div className="p-2.5 bg-slate-100 group-hover:bg-slate-200 rounded-xl transition-colors shrink-0">
        <BookOpen size={16} className="text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="font-black text-slate-900 text-sm truncate">{l.title}</p>
        <p className="text-xs text-slate-400 font-medium truncate">{l.subject} · {l.year} · {l.semester}</p>
      </div>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      {l.quiz && <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2 py-1 rounded-full uppercase">Quiz</span>}
      <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase">Live</span>
      <button onClick={onView} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-slate-50">
        <Eye size={13} /> Preview
      </button>
    </div>
  </div>
);

// ── Reusable form pieces ──────────────────────────────────────────────────────
const Field = ({ label, required, hint, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2 ml-0.5">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      {required && <span className="text-red-400 text-xs">*</span>}
      {hint     && <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{hint}</span>}
    </div>
    {children}
  </div>
);

const SelectField = ({ value, onChange, placeholder, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="input appearance-none pr-9 cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl p-7" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid grid-cols-2 gap-2">{children}</div>
);

const InfoItem = ({ label, val }) => (
  <div className="bg-slate-50 rounded-xl px-4 py-3">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-slate-800 mt-0.5">{val}</p>
  </div>
);

export default LecUpload;