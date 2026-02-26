import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, ClipboardList, Users, BookOpen, X } from 'lucide-react';
import { INITIAL_QUIZZES, SUBJECTS } from './lecData';

const EMPTY_QUESTION = () => ({
  id: Date.now() + Math.random(),
  question: '',
  options: ['', '', '', ''],
  answer: 0,
});

const LecQuiz = () => {
  const [quizzes,  setQuizzes]  = useState(INITIAL_QUIZZES);
  const [creating, setCreating] = useState(false);
  const [viewQuiz, setViewQuiz] = useState(null);
  const [toast,    setToast]    = useState(null);

  // Form state
  const [title,     setTitle]    = useState('');
  const [subject,   setSubject]  = useState('');
  const [questions, setQuestions] = useState([EMPTY_QUESTION()]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const addQuestion = () => setQuestions(prev => [...prev, EMPTY_QUESTION()]);

  const removeQuestion = (id) => {
    if (questions.length === 1) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQ = (id, field, val) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: val } : q));

  const updateOption = (qId, idx, val) =>
    setQuestions(prev => prev.map(q =>
      q.id === qId ? { ...q, options: q.options.map((o, i) => i === idx ? val : o) } : q
    ));

  const handlePublish = () => {
    if (!title.trim()) { showToast('Please enter a quiz title.'); return; }
    if (!subject)      { showToast('Please select a subject.');   return; }
    const bad = questions.find(q => !q.question.trim() || q.options.some(o => !o.trim()));
    if (bad)           { showToast('Please fill in all questions and options.'); return; }

    const newQuiz = {
      id: Date.now(),
      title: title.trim(),
      subject,
      questionCount: questions.length,
      attempts: 0,
      createdAt: new Date().toISOString().split('T')[0],
      questions: questions.map((q, i) => ({ ...q, id: i + 1 })),
    };

    setQuizzes(prev => [newQuiz, ...prev]);
    setTitle(''); setSubject(''); setQuestions([EMPTY_QUESTION()]); setCreating(false);
    showToast('✅ Quiz published successfully!');
  };

  const handleDiscard = () => {
    setTitle(''); setSubject(''); setQuestions([EMPTY_QUESTION()]); setCreating(false);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <header>
          <h2 className="text-3xl font-black text-slate-900">Quizzes</h2>
          <p className="text-slate-500 font-medium mt-1">Create and manage quizzes for your students</p>
        </header>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="shrink-0 mt-1 flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-slate-200"
          >
            <Plus size={17} /> Create Quiz
          </button>
        )}
      </div>

      {/* ── Create quiz form — matches StuNoteUploadModal style ── */}
      {creating && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">New Quiz</h3>
            <button onClick={handleDiscard} className="text-slate-300 hover:text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Title & Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Quiz Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Data Structures Quiz"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
              <div className="relative">
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-100 px-4 py-4 pr-10 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all cursor-pointer"
                >
                  <option value="">Select subject...</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions ({questions.length})</p>
            </div>

            {questions.map((q, qi) => (
              <QuestionBlock
                key={q.id}
                question={q}
                index={qi}
                onUpdateQ={(field, val) => updateQ(q.id, field, val)}
                onUpdateOption={(idx, val) => updateOption(q.id, idx, val)}
                onRemove={() => removeQuestion(q.id)}
                canRemove={questions.length > 1}
              />
            ))}

            {/* Add question button — matches StuNoteUploadModal drag-drop style */}
            <button
              onClick={addQuestion}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl font-black text-slate-400 text-sm hover:border-violet-300 hover:text-violet-500 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Another Question
            </button>
          </div>

          {/* Publish / Discard */}
          <div className="flex gap-4 pt-2">
            <button onClick={handleDiscard}
              className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
              Discard
            </button>
            <button onClick={handlePublish}
              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Publish Quiz
            </button>
          </div>
        </div>
      )}

      {/* ── Published quizzes list ── */}
      {quizzes.length === 0 && !creating ? (
        <div className="p-16 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-[32px]">
          No quizzes yet — create your first one!
        </div>
      ) : (
        <div className="space-y-4 pb-10">
          {quizzes.map(quiz => (
            <QuizCard key={quiz.id} quiz={quiz} onView={() => setViewQuiz(quiz)} />
          ))}
        </div>
      )}

      {/* ── View quiz questions modal ── */}
      {viewQuiz && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewQuiz(null)}>
          <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-10" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Quiz Preview</p>
                <h3 className="text-2xl font-black text-slate-900">{viewQuiz.title}</h3>
                <p className="text-slate-400 font-semibold text-sm mt-1">{viewQuiz.subject}</p>
              </div>
              <button onClick={() => setViewQuiz(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={22} />
              </button>
            </div>

            <div className="space-y-6">
              {viewQuiz.questions.map((q, i) => (
                <div key={q.id} className="bg-slate-50 rounded-[20px] p-6 space-y-4">
                  <p className="font-black text-slate-900">Q{i + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, j) => (
                      <div key={j} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold
                        ${q.answer === j ? 'bg-green-100 text-green-800 font-black' : 'text-slate-500'}`}>
                        <span className={`font-black text-xs ${q.answer === j ? 'text-green-600' : 'text-slate-300'}`}>
                          {String.fromCharCode(65 + j)}.
                        </span>
                        {opt}
                        {q.answer === j && <span className="ml-auto text-[10px] font-black text-green-600 uppercase">✓ Correct</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setViewQuiz(null)} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black shadow-xl text-sm">
          {toast}
        </div>
      )}
    </div>
  );
};

// ── Question block inside the create form ─────────────────────────────────────
const QuestionBlock = ({ question, index, onUpdateQ, onUpdateOption, onRemove, canRemove }) => (
  <div className="bg-slate-50 rounded-[20px] p-6 space-y-5 border border-slate-100">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {index + 1}</span>
      {canRemove && (
        <button onClick={onRemove} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-400 transition-all">
          <Trash2 size={14} />
        </button>
      )}
    </div>

    <input
      value={question.question}
      onChange={e => onUpdateQ('question', e.target.value)}
      placeholder="Type your question here..."
      className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-300 font-medium text-slate-800"
    />

    <div className="space-y-3">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Options — <span className="text-green-600">click the circle</span> to set the correct answer
      </p>
      {question.options.map((opt, i) => (
        <div key={i} className="flex items-center gap-3">
          {/* Correct answer toggle — green filled = correct */}
          <button
            onClick={() => onUpdateQ('answer', i)}
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
              ${question.answer === i
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-slate-200 hover:border-green-300'
              }`}
          >
            {question.answer === i && <CheckCircle2 size={14} />}
          </button>

          <span className="text-xs font-black text-slate-300 w-4 shrink-0">{String.fromCharCode(65 + i)}.</span>

          <input
            value={opt}
            onChange={e => onUpdateOption(i, e.target.value)}
            placeholder={`Option ${String.fromCharCode(65 + i)}`}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium outline-none border transition-all placeholder:text-slate-300
              ${question.answer === i
                ? 'bg-green-50 border-green-200 focus:ring-2 focus:ring-green-300'
                : 'bg-white border-slate-100 focus:ring-2 focus:ring-violet-300'
              }`}
          />
        </div>
      ))}
    </div>
  </div>
);

// ── Published quiz card ───────────────────────────────────────────────────────
const QuizCard = ({ quiz, onView }) => (
  <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 flex items-center justify-between gap-4 hover:shadow-md transition-all group">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-violet-50 rounded-2xl group-hover:bg-violet-100 transition-colors">
        <ClipboardList size={20} className="text-violet-500" />
      </div>
      <div>
        <p className="font-black text-slate-900">{quiz.title}</p>
        <p className="text-sm text-slate-400 font-semibold mt-0.5">{quiz.subject}</p>
      </div>
    </div>

    <div className="flex items-center gap-5 shrink-0">
      <Stat label="Questions" val={quiz.questionCount} icon={<BookOpen size={11} />} />
      <Stat label="Attempts"  val={quiz.attempts}      icon={<Users size={11} />}    />
      <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1.5 rounded-full uppercase">Live</span>
      <button onClick={onView}
        className="text-sm font-black text-violet-500 hover:text-violet-700 transition-colors px-3 py-2 rounded-xl hover:bg-violet-50">
        Preview →
      </button>
    </div>
  </div>
);

const Stat = ({ label, val, icon }) => (
  <div className="text-center">
    <p className="font-black text-slate-900 text-sm">{val}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-0.5 justify-center mt-0.5">{icon} {label}</p>
  </div>
);

export default LecQuiz;