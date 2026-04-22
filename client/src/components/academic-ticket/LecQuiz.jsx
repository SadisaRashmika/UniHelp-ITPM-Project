import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FACULTIES, YEARS, SEMESTERS } from '../lecture-resource/SharedData';
import { Plus, Trash2, BookOpen, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

const EMPTY_Q = () => ({ id: Date.now() + Math.random(), question: '', options: ['', '', '', ''], answer: 0 });
const API_BASE = 'http://localhost:5000';

const LecQuiz = ({ lecturer }) => {
  const [faculty, setFaculty] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [modules, setModules] = useState([]);
  const [moduleCount, setModuleCount] = useState(0);
  const [selectedModule, setSelectedModule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQs] = useState([EMPTY_Q()]);
  const [toast, setToast] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (faculty && year && semester) {
      fetchModules();
    } else {
      setModules([]);
      setModuleCount(0);
      setSelectedModule(null);
    }
  }, [faculty, year, semester]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/lecturer/modules-count`, {
        params: { faculty, year, semester }
      });
      setModuleCount(res.data.count);

      const resResources = await axios.get(`${API_BASE}/api/lecturer/resources`, {
        params: { lecturerId: lecturer.employee_id }
      });
      // Filter modules by selection
      const filtered = resResources.data.filter(l => 
        l.faculty === faculty && l.year === year && l.semester === semester
      );
      setModules(filtered);
    } catch (err) {
      console.error('Error fetching modules:', err);
      showToast('Failed to fetch modules', 'err');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModule = (mod) => {
    setSelectedModule(mod);
    setQuizTitle(mod.quiz?.title || '');
    if (mod.quiz?.questions) {
      setQs(mod.quiz.questions.map(q => ({
        id: Math.random(),
        question: q.question,
        options: q.options,
        answer: q.answer
      })));
    } else {
      setQs([EMPTY_Q()]);
    }
  };

  const handleSaveQuiz = async () => {
    if (!selectedModule) return;
    if (!quizTitle.trim()) {
      showToast('Quiz title is required', 'err');
      return;
    }

    try {
      setIsPublishing(true);
      await axios.post(`${API_BASE}/api/lecturer/create-quiz`, {
        lectureId: selectedModule.id,
        title: quizTitle.trim(),
        questions: questions.map((q, idx) => ({
          questionText: q.question,
          options: q.options,
          answerIndex: q.answer,
          orderNum: idx + 1,
        })),
      });
      showToast('Quiz saved successfully!');
      fetchModules(); // Refresh
    } catch (err) {
      console.error('Error saving quiz:', err);
      showToast('Failed to save quiz', 'err');
    } finally {
      setIsPublishing(false);
    }
  };

  const addQ = () => setQs(prev => [...prev, EMPTY_Q()]);
  const removeQ = (id) => { if (questions.length > 1) setQs(prev => prev.filter(q => q.id !== id)); };
  const updateQ = (id, f, v) => setQs(prev => prev.map(q => q.id === id ? { ...q, [f]: v } : q));
  const updateOpt = (id, i, v) => setQs(prev => prev.map(q => q.id === id ? { ...q, options: q.options.map((o, j) => j === i ? v : o) } : q));

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
        <p className="text-gray-400 text-sm mt-1">Manage quizzes for your modules</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-7">
        <h2 className="text-base font-semibold text-gray-800 mb-5">Select Target Group</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Faculty">
            <SelectField value={faculty} onChange={setFaculty} placeholder="Select Faculty">
              {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
            </SelectField>
          </Field>
          <Field label="Intake (Year)">
            <SelectField value={year} onChange={setYear} placeholder="Select Year">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </SelectField>
          </Field>
          <Field label="Semester">
            <SelectField value={semester} onChange={setSemester} placeholder="Select Semester">
              {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </SelectField>
          </Field>
        </div>

        {faculty && year && semester && (
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
            {moduleCount >= 3 ? (
              <>
                <CheckCircle2 className="text-green-500" size={20} />
                <p className="text-sm font-medium text-gray-700">
                  There are <span className="font-bold text-blue-600">{moduleCount}</span> modules available for this group. You can now manage quizzes.
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="text-amber-500" size={20} />
                <p className="text-sm font-medium text-gray-700">
                  Currently only <span className="font-bold text-amber-600">{moduleCount}</span> modules exist. 
                  <span className="text-red-500 ml-1">At least 3 modules are required to enable quiz creation.</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {moduleCount >= 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
          {/* Module List */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">Your Modules</h3>
            </div>
            <div className="p-2 space-y-1">
              {modules.length > 0 ? (
                modules.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModule(m)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedModule?.id === m.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    <p className="text-sm truncate">{m.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{m.subject}</p>
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-400 p-4 text-center">No modules found for this selection.</p>
              )}
            </div>
          </div>

          {/* Quiz Editor */}
          {selectedModule ? (
            <div className="bg-white rounded-2xl border border-gray-200">
              <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Manage Quiz for: {selectedModule.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedModule.subject}</p>
                </div>
              </div>
              <div className="p-7 space-y-6">
                <Field label="Quiz Title">
                  <input value={quizTitle} onChange={e => setQuizTitle(e.target.value)}
                    placeholder="e.g., Weekly Quiz 1"
                    className={inputCls} />
                </Field>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Questions</h3>
                    <button onClick={addQ} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
                      <Plus size={14} /> Add Question
                    </button>
                  </div>

                  {questions.map((q, qi) => (
                    <QuestionBlock
                      key={q.id} q={q} qi={qi}
                      onUpdateQ={(f, v) => updateQ(q.id, f, v)}
                      onUpdateOpt={(i, v) => updateOpt(q.id, i, v)}
                      onRemove={() => removeQ(q.id)}
                      canRemove={questions.length > 1}
                    />
                  ))}
                </div>

                <div className="flex justify-end pt-5 border-t border-gray-100">
                  <button
                    onClick={handleSaveQuiz}
                    disabled={isPublishing}
                    className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all disabled:opacity-50"
                  >
                    {isPublishing ? 'Saving...' : 'Save Quiz'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-20 flex flex-col items-center justify-center text-center">
              <BookOpen size={48} className="text-gray-100 mb-4" />
              <p className="text-gray-400 font-medium">Select a module from the left to manage its quiz</p>
            </div>
          )}
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
      <option value="" disabled hidden>{placeholder}</option>
      {children}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

const QuestionBlock = ({ q, qi, onUpdateQ, onUpdateOpt, onRemove, canRemove }) => (
  <div className="bg-gray-50/50 rounded-xl border border-gray-200 p-5 space-y-4">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Question {qi + 1}</span>
      {canRemove && (
        <button onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      )}
    </div>
    <Field label="Question Text">
      <input value={q.question} onChange={e => onUpdateQ('question', e.target.value)}
        placeholder="Enter your question"
        className={inputCls} />
    </Field>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {q.options.map((opt, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-500">Option {String.fromCharCode(65 + i)}</label>
            <button 
              onClick={() => onUpdateQ('answer', i)}
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${q.answer === i ? 'bg-green-100 text-green-700' : 'text-gray-300 hover:text-gray-500'}`}
            >
              {q.answer === i ? 'Correct ✓' : 'Mark Correct'}
            </button>
          </div>
          <input value={opt} onChange={e => onUpdateOpt(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            className={`${inputCls} ${q.answer === i ? 'ring-1 ring-green-100 border-green-200 bg-green-50/30' : ''}`}
          />
        </div>
      ))}
    </div>
  </div>
);

export default LecQuiz;
