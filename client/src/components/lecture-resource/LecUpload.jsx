import React, { useState } from 'react';
import { Plus, Trash2, Upload, ChevronDown, Eye, BookOpen, X, FileText, CheckCircle2 } from 'lucide-react';
import { LECTURER, SUBJECTS, YEARS, SEMESTERS, LECTURES } from './SharedData';

const EMPTY_Q = () => ({ id: Date.now() + Math.random(), question: '', options: ['', '', '', ''], answer: 0 });

const LecUpload = ({ onPublish }) => {
  const [lectures,  setLectures]  = useState(LECTURES.filter(l => l.lecturer === LECTURER.name));
  const [viewLec,   setViewLec]   = useState(null);
  const [toast,     setToast]     = useState(null);

  const [title,     setTitle]     = useState('');
  const [subject,   setSubject]   = useState('');
  const [topic,     setTopic]     = useState('');
  const [year,      setYear]      = useState('');
  const [semester,  setSemester]  = useState('');
  const [desc,      setDesc]      = useState('');
  const [files,     setFiles]     = useState([]);
  const [addQuiz,   setAddQuiz]   = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQs]        = useState([EMPTY_Q()]);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFilePick = (e) => {
    const picked = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...picked.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(0) + ' KB' }))]);
    e.target.value = '';
  };

  const addQ      = ()         => setQs(prev => [...prev, EMPTY_Q()]);
  const removeQ   = (id)       => { if (questions.length > 1) setQs(prev => prev.filter(q => q.id !== id)); };
  const updateQ   = (id, f, v) => setQs(prev => prev.map(q => q.id === id ? { ...q, [f]: v } : q));
  const updateOpt = (id, i, v) => setQs(prev => prev.map(q => q.id === id ? { ...q, options: q.options.map((o, j) => j === i ? v : o) } : q));

  const resetForm = () => {
    setTitle(''); setSubject(''); setTopic(''); setYear(''); setSemester('');
    setDesc(''); setFiles([]); setAddQuiz(false); setQuizTitle(''); setQs([EMPTY_Q()]);
  };

  const handlePublish = () => {
    if (!title.trim())  { showToast('Please enter a lecture title.', 'err');  return; }
    if (!subject)       { showToast('Please select a subject.', 'err');       return; }
    if (!year)          { showToast('Please select a year.', 'err');          return; }
    if (!semester)      { showToast('Please select a semester.', 'err');      return; }
    if (addQuiz) {
      if (!quizTitle.trim()) { showToast('Please enter a quiz title.', 'err'); return; }
      const bad = questions.find(q => !q.question.trim() || q.options.some(o => !o.trim()));
      if (bad) { showToast('Fill in all quiz questions and options.', 'err'); return; }
    }

    const newLecture = {
      id: Date.now(), title: title.trim(), lecturer: LECTURER.name,
      subject, topic: topic.trim(), year, semester,
      description: desc.trim(),
      files: files.length > 0 ? files.map(f => f.name) : ['(No files uploaded)'],
      publishedAt: new Date().toISOString().split('T')[0],
      quiz: addQuiz ? { title: quizTitle.trim(), questions: questions.map(q => ({ question: q.question, options: q.options, answer: q.answer })) } : null,
    };
    setLectures(prev => [newLecture, ...prev]);
    onPublish(newLecture);
    resetForm();
    showToast('✅ Lecture published successfully!');
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Resources and Quiz</h1>
        <p className="text-gray-400 text-sm mt-1">Create comprehensive learning materials for students</p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="px-7 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Basic Information</h2>
        </div>
        <div className="p-7 space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-5">
            <Field label="Lecture Title">
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Machine Learning"
                className={inputCls} />
            </Field>
            <Field label="Lecturer Name">
              <input value={LECTURER.name} readOnly className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-5">
            <Field label="Subject">
              <SelectField value={subject} onChange={setSubject} placeholder="e.g., Machine Learning">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </SelectField>
            </Field>
            <Field label="Topic">
              <input value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="e.g., ML Basics"
                className={inputCls} />
            </Field>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-5">
            <Field label="Year">
              <SelectField value={year} onChange={setYear} placeholder="Select year">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </SelectField>
            </Field>
            <Field label="Semester">
              <SelectField value={semester} onChange={setSemester} placeholder="Select semester">
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </SelectField>
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Brief description of the lecture content"
              className={`${inputCls} h-24 resize-none`} />
          </Field>
        </div>

        {/* Upload documents section */}
        <div className="px-7 pb-2 pt-0">
          <div className="border-t border-gray-100 pt-5 pb-3">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Upload Documents</h2>
          </div>

          <Field label="Lecture Files (PDF, ZIP, etc.)">
            <label className="flex items-center gap-3 w-full p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100/60 hover:border-gray-300 cursor-pointer transition-all">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Choose Files</span>
              <span className="text-sm text-gray-400">No file chosen</span>
              <input type="file" multiple className="hidden" onChange={handleFilePick} accept=".pdf,.pptx,.docx,.zip" />
            </label>
            <p className="text-xs text-gray-400 mt-1.5">You can upload multiple files</p>
            {files.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <FileText size={13} className="text-gray-400" />
                      <span className="text-sm text-gray-700 font-medium">{f.name}</span>
                      <span className="text-xs text-gray-400">{f.size}</span>
                    </div>
                    <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                      className="text-gray-300 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </div>

        {/* Create Quiz section */}
        <div className="px-7 pt-4 pb-7">
          <div className="border-t border-gray-100 pt-5 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">Create Quiz</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-500">Add quiz</span>
                <div
                  onClick={() => setAddQuiz(v => !v)}
                  className={`w-10 h-5 rounded-full transition-colors ${addQuiz ? 'bg-blue-500' : 'bg-gray-200'} relative cursor-pointer`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${addQuiz ? 'left-5' : 'left-0.5'}`} />
                </div>
              </label>
            </div>
          </div>

          {addQuiz && (
            <div className="space-y-5">
              <Field label="Quiz Title">
                <input value={quizTitle} onChange={e => setQuizTitle(e.target.value)}
                  placeholder="e.g., ML Basics Quiz"
                  className={inputCls} />
              </Field>

              {questions.map((q, qi) => (
                <QuestionBlock
                  key={q.id} q={q} qi={qi}
                  onUpdateQ={(f, v) => updateQ(q.id, f, v)}
                  onUpdateOpt={(i, v) => updateOpt(q.id, i, v)}
                  onRemove={() => removeQ(q.id)}
                  canRemove={questions.length > 1}
                />
              ))}

              <button onClick={addQ}
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
                <Plus size={15} /> Add Another Question
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
            <button onClick={resetForm}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button onClick={handlePublish}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all flex items-center gap-2">
              <Upload size={15} /> Publish Resource & Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Published lectures */}
      {lectures.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">My Published Lectures</h3>
          <div className="space-y-2">
            {lectures.map(l => (
              <div key={l.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <BookOpen size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{l.title}</p>
                    <p className="text-xs text-gray-400">{l.subject} · {l.year} · {l.semester}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {l.quiz && <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full uppercase">Quiz</span>}
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase">Live</span>
                  <button onClick={() => setViewLec(l)}
                    className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-50">
                    <Eye size={12} /> Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View modal */}
      {viewLec && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewLec(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Lecture Preview</p>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">{viewLec.title}</h3>
              </div>
              <button onClick={() => setViewLec(null)} className="text-gray-300 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <InfoItem label="Lecturer"  val={viewLec.lecturer} />
              <InfoItem label="Published" val={viewLec.publishedAt} />
              <InfoItem label="Subject"   val={viewLec.subject} />
              <InfoItem label="Topic"     val={viewLec.topic || '—'} />
            </div>
            {viewLec.files.length > 0 && (
              <div className="space-y-1.5 mb-4">
                {viewLec.files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                    <FileText size={13} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            )}
            {viewLec.quiz && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Quiz: {viewLec.quiz.title}</p>
                {viewLec.quiz.questions.map((q, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-gray-800 mb-1.5">Q{i + 1}. {q.question}</p>
                    {q.options.map((opt, j) => (
                      <p key={j} className={`pl-3 py-0.5 text-xs rounded font-medium ${q.answer === j ? 'text-green-700 font-bold' : 'text-gray-400'}`}>
                        {String.fromCharCode(65 + j)}. {opt} {q.answer === j ? '✓' : ''}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl text-white
          ${toast.type === 'err' ? 'bg-red-500' : 'bg-gray-900'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

const inputCls = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-gray-400';

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const SelectField = ({ value, onChange, placeholder, children }) => (
  <div className="relative">
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`${inputCls} appearance-none pr-9 cursor-pointer`}>
      <option value="">{placeholder}</option>
      {children}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

const QuestionBlock = ({ q, qi, onUpdateQ, onUpdateOpt, onRemove, canRemove }) => (
  <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-blue-600">Add New Question</span>
      {canRemove && (
        <button onClick={onRemove} className="text-gray-300 hover:text-red-400">
          <Trash2 size={14} />
        </button>
      )}
    </div>
    <Field label="Question">
      <input value={q.question} onChange={e => onUpdateQ('question', e.target.value)}
        placeholder="Enter your question"
        className={inputCls} />
    </Field>
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Options</p>
      {q.options.map((opt, i) => {
        const correct = q.answer === i;
        return (
          <div key={i} className="flex items-center gap-3">
            <button onClick={() => onUpdateQ('answer', i)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                ${correct ? 'bg-gray-900 border-gray-900' : 'border-gray-300 hover:border-gray-500'}`}>
              {correct && <div className="w-2 h-2 rounded-full bg-white" />}
            </button>
            <span className="text-sm text-gray-400 w-5 shrink-0">{String.fromCharCode(65 + i)}.</span>
            <input value={opt} onChange={e => onUpdateOpt(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className={`flex-1 px-3.5 py-2 rounded-lg text-sm outline-none border transition-all placeholder:text-gray-300
                ${correct ? 'border-blue-200 bg-white focus:ring-1 focus:ring-blue-300' : 'border-gray-200 bg-white focus:ring-1 focus:ring-gray-300'}`}
            />
          </div>
        );
      })}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Correct Answer</p>
      <div className="flex gap-4">
        {['A', 'B', 'C', 'D'].map((l, i) => (
          <label key={l} className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name={`answer-${q.id}`} checked={q.answer === i} onChange={() => onUpdateQ('answer', i)}
              className="accent-gray-900" />
            <span className="text-sm text-gray-600">{l}</span>
          </label>
        ))}
      </div>
    </div>
    <button
      className="w-full py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
      <Plus size={14} /> Add This Question
    </button>
  </div>
);

const InfoItem = ({ label, val }) => (
  <div className="bg-gray-50 rounded-xl px-3 py-2.5">
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-0.5">{val}</p>
  </div>
);

export default LecUpload;