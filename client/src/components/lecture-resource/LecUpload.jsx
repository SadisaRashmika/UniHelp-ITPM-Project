import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Upload, ChevronDown, Eye, BookOpen, X, FileText, CheckCircle2, Pencil } from 'lucide-react';
import axios from 'axios';
import { SUBJECTS, YEARS, SEMESTERS } from './SharedData';

const EMPTY_Q = () => ({ id: Date.now() + Math.random(), question: '', options: ['', '', '', ''], answer: 0 });
const API_BASE = 'http://localhost:5000';

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toISOString().split('T')[0];
};

const getYoutubeThumbnail = (url) => {
  if (!url) return null;
  const idMatch = String(url).match(/(?:v=|be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  const videoId = idMatch?.[1];
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const normalizeLecture = (raw, lecturerName) => ({
  id: raw.id,
  title: raw.title,
  lecturer: raw.lecturer || lecturerName || 'Lecturer',
  subject: raw.subject,
  topic: raw.topic,
  year: raw.year,
  semester: raw.semester,
  youtubeUrl: raw.youtubeUrl || raw.youtube_url || '',
  publishedAt: raw.publishedAt || formatDate(raw.published_at),
  files: (raw.files || []).map((f) => (typeof f === 'string' ? f : f.filename)).filter(Boolean),
  quiz: raw.quiz || null,
});

const LecUpload = ({ lecturer, onPublish }) => {
  const [lectures, setLectures] = useState([]);
  //const [lectures,  setLectures]  = useState(LECTURES.filter(l => l.lecturer === LECTURER.name));
  const [viewLec,   setViewLec]   = useState(null);
  const [toast,     setToast]     = useState(null);

  const [title,     setTitle]     = useState('');
  const [subject,   setSubject]   = useState('');
  const [topic,     setTopic]     = useState('');
  const [year,      setYear]      = useState('');
  const [semester,  setSemester]  = useState('');
  const [files,     setFiles]     = useState([]);
  const [ytLink,    setYtLink]    = useState(''); // State for YouTube link
  const [addQuiz,   setAddQuiz]   = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQs]        = useState([EMPTY_Q()]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingLectureId, setEditingLectureId] = useState(null);
  const [errors, setErrors] = useState({});

  const lecturerEmployeeId = lecturer?.employee_id || 'LEC001';
  const lecturerDbId = lecturer?.id;
  const isEditMode = editingLectureId !== null;

  const loadLectures = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/lecturer/resources?lecturerId=${lecturerEmployeeId}`);
      const normalized = (response.data || []).map((item) => normalizeLecture(item, lecturer?.name));
      setLectures(normalized);
    } catch (error) {
      console.error('Error fetching lectures:', error);
      showToast('Failed to fetch lectures', 'err');
    }
  };

  useEffect(() => {
    loadLectures();
  }, [lecturerEmployeeId]);


  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
// Simple validation for YouTube URLs (accepts youtube.com and youtu.be links)
  const isValidYoutubeUrl = (url) => {
    if (!url) return true;
    const value = url.trim();
    if (!value) return true;
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(value);
  };

  const handleFilePick = (e) => {
    const picked = Array.from(e.target.files || []);
    setFiles(prev => [
      ...prev,
      ...picked.map((f) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(0) + ' KB',
        file: f,
      })),
    ]);
    e.target.value = '';
  };

  const addQ      = ()         => setQs(prev => [...prev, EMPTY_Q()]);
  const removeQ   = (id)       => { if (questions.length > 1) setQs(prev => prev.filter(q => q.id !== id)); };
  const updateQ   = (id, f, v) => setQs(prev => prev.map(q => q.id === id ? { ...q, [f]: v } : q));
  const updateOpt = (id, i, v) => setQs(prev => prev.map(q => q.id === id ? { ...q, options: q.options.map((o, j) => j === i ? v : o) } : q));

  const resetForm = () => {
    setTitle(''); setSubject(''); setTopic(''); setYear(''); setSemester('');
    setFiles([]); setYtLink(''); setAddQuiz(false); setQuizTitle(''); setQs([EMPTY_Q()]);
    setEditingLectureId(null);
    setErrors({});
  };

  const startEditLecture = (lecture) => {
    setEditingLectureId(lecture.id);
    setTitle(lecture.title || '');
    setSubject(lecture.subject || '');
    setTopic(lecture.topic || '');
    setYear(lecture.year || '');
    setSemester(lecture.semester || '');
    setYtLink(lecture.youtubeUrl || '');
    setFiles([]);

    if (lecture.quiz) {
      setAddQuiz(true);
      setQuizTitle(lecture.quiz.title || '');
      const mapped = (lecture.quiz.questions || []).map((q) => ({
        id: Date.now() + Math.random(),
        question: q.question || '',
        options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
        answer: Number.isInteger(q.answer) ? q.answer : 0,
      }));
      setQs(mapped.length > 0 ? mapped : [EMPTY_Q()]);
    } else {
      setAddQuiz(false);
      setQuizTitle('');
      setQs([EMPTY_Q()]);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Editing lecture. Update details and save changes.');
  };

  const handlePublish = async () => {
    const nextErrors = {};

    if (!lecturerDbId) {
      showToast('Lecturer profile is not loaded yet.', 'err');
      return;
    }
    if (!title.trim()) nextErrors.title = 'Lecture title is required.';
    else if (title.trim().length < 3) nextErrors.title = 'Lecture title must be at least 3 characters.';

    if (!subject) nextErrors.subject = 'Please select a subject.';
    if (!year) nextErrors.year = 'Please select a year.';
    if (!semester) nextErrors.semester = 'Please select a semester.';

    if (!isValidYoutubeUrl(ytLink)) {
      nextErrors.youtubeUrl = 'Enter a valid YouTube URL (youtube.com or youtu.be).';
    }

    if (!isEditMode && files.length === 0 && !ytLink.trim()) {
      nextErrors.files = 'Add at least one file or a YouTube link.';
    }

    if (addQuiz) {
      if (!quizTitle.trim()) nextErrors.quizTitle = 'Quiz title is required.';
      const badIdx = questions.findIndex((q) => !q.question.trim() || q.options.some((o) => !o.trim()));
      if (badIdx !== -1) {
        nextErrors.quiz = `Question ${badIdx + 1} has empty fields.`;
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      showToast('Please fix form errors before submitting.', 'err');
      return;
    }

    try {
      setIsPublishing(true);

      const formData = new FormData();
      formData.append('lecturerId', isEditMode ? String(lecturerEmployeeId) : String(lecturerDbId));
      formData.append('title', title.trim());
      formData.append('subject', subject);
      formData.append('topic', topic.trim());
      formData.append('year', year);
      formData.append('semester', semester);
      formData.append('youtubeUrl', ytLink.trim());
      formData.append('addQuiz', String(addQuiz));
      files.forEach((f) => {
        if (f.file) formData.append('files', f.file);
      });

      if (addQuiz) {
        formData.append('quizTitle', quizTitle.trim());
        formData.append('questions', JSON.stringify(
          questions.map((q, idx) => ({
            questionText: q.question,
            options: q.options,
            answerIndex: q.answer,
            orderNum: idx + 1,
          }))
        ));
      }

      if (isEditMode) {
        await axios.patch(`${API_BASE}/api/lecturer/resources/${editingLectureId}`, formData);
        await loadLectures();
        if (viewLec?.id === editingLectureId) {
          setViewLec(null);
        }
        resetForm();
        showToast('Lecture updated successfully!');
        return;
      }

      const resourceRes = await axios.post(`${API_BASE}/api/lecturer/upload-resource`, formData);
      const lectureId = resourceRes.data?.lectureId;

      if (addQuiz && lectureId) {
        await axios.post(`${API_BASE}/api/lecturer/create-quiz`, {
          lectureId,
          title: quizTitle.trim(),
          questions: questions.map((q, idx) => ({
            questionText: q.question,
            options: q.options,
            answerIndex: q.answer,
            orderNum: idx + 1,
          })),
        });
      }

      await loadLectures();
      onPublish?.({ lectureId });
      resetForm();
      showToast('Resource saved to database successfully!');
    } catch (error) {
      console.error('Error publishing resource:', error);
      showToast('Failed to publish resource. Please try again.', 'err');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    const confirmed = window.confirm('Are you sure you want to delete this lecture? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/api/lecturer/resources/${lectureId}?lecturerId=${lecturerEmployeeId}`);
      setLectures((prev) => prev.filter((l) => l.id !== lectureId));
      if (viewLec?.id === lectureId) {
        setViewLec(null);
      }
      showToast('Lecture deleted successfully.');
    } catch (error) {
      console.error('Error deleting lecture:', error);
      showToast('Failed to delete lecture.', 'err');
    }
  };

  const previewLecture = {
    title: title.trim() || 'Lecture Title Preview',
    lecturer: lecturer?.name || 'Lecturer Name',
    lecturerEmail: lecturer?.email || 'lecturer@university.edu',
    tags: [subject || 'Subject', topic || 'Topic', year || 'Year', semester || 'Semester'],
    files: files.map((f) => f.name),
    quizTitle: addQuiz ? (quizTitle.trim() || 'Quiz Preview') : 'No quiz yet',
    hasQuiz: addQuiz && questions.length > 0,
    youtubeThumb: getYoutubeThumbnail(ytLink),
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Resources and Quiz</h1>
        <p className="text-gray-400 text-sm mt-1">Create comprehensive learning materials for students</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="px-7 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Basic Information</h2>
          </div>
          <div className="p-7 space-y-5">
          {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Field label="Lecture Title">
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Machine Learning"
                className={inputCls} />
              {errors.title && <p className="text-xs text-red-500 font-medium mt-1">{errors.title}</p>}
            </Field>
            <Field label="Lecturer Name">
              <div>
                <input value={lecturer?.name || ''} readOnly className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                <p className="text-xs text-gray-400 mt-1">{lecturer?.email || 'No lecturer email available'}</p>
              </div>
            </Field>
            </div>

          {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Field label="Subject">
              <SelectField value={subject} onChange={setSubject} placeholder="Select subject">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </SelectField>
              {errors.subject && <p className="text-xs text-red-500 font-medium mt-1">{errors.subject}</p>}
            </Field>
            <Field label="Topic">
              <input value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="e.g., ML Basics"
                className={inputCls} />
            </Field>
            </div>

          {/* Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Field label="Year">
              <SelectField value={year} onChange={setYear} placeholder="Select year">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </SelectField>
              {errors.year && <p className="text-xs text-red-500 font-medium mt-1">{errors.year}</p>}
            </Field>
            <Field label="Semester">
              <SelectField value={semester} onChange={setSemester} placeholder="Select semester">
                {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
              </SelectField>
              {errors.semester && <p className="text-xs text-red-500 font-medium mt-1">{errors.semester}</p>}
            </Field>
            </div>

          {/* YouTube Link */}
            <Field label="YouTube Link (Optional)">
              <input value={ytLink} onChange={e => setYtLink(e.target.value)}
                placeholder="Enter YouTube link"
                className={inputCls} />
              {errors.youtubeUrl && <p className="text-xs text-red-500 font-medium mt-1">{errors.youtubeUrl}</p>}
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
              {errors.files && <p className="text-xs text-red-500 font-medium mt-1.5">{errors.files}</p>}
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
                {errors.quizTitle && <p className="text-xs text-red-500 font-medium mt-1">{errors.quizTitle}</p>}
              </Field>

              {errors.quiz && <p className="text-xs text-red-500 font-medium">{errors.quiz}</p>}

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
                disabled={isPublishing}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all flex items-center gap-2">
                <Upload size={15} /> {isPublishing ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Lecture & Quiz' : 'Publish Resource & Quiz')}
              </button>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="xl:sticky xl:top-24 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Live Preview</p>
            <p className="text-xs text-gray-400 mt-0.5">Preview only. This card is not interactive.</p>
          </div>
          <div className="p-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {previewLecture.youtubeThumb ? (
                  <img src={previewLecture.youtubeThumb} alt={previewLecture.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen size={34} className="text-white/30" />
                )}
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{previewLecture.title}</h3>

                <div className="flex flex-wrap gap-1.5">
                  {previewLecture.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                  <p className="text-sm font-medium text-gray-700 truncate">{previewLecture.lecturer}</p>
                  <p className="text-xs text-blue-400 truncate mt-0.5">{previewLecture.lecturerEmail}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Lecture Files:</p>
                  {previewLecture.files.length > 0 ? (
                    <div className="space-y-1">
                      {previewLecture.files.slice(0, 2).map((name) => (
                        <div key={name} className="flex items-center gap-2 text-sm text-blue-600">
                          <FileText size={13} className="shrink-0" />
                          <span className="truncate">{name}</span>
                        </div>
                      ))}
                      {previewLecture.files.length > 2 && (
                        <p className="text-xs text-gray-400">+{previewLecture.files.length - 2} more file(s)</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No files selected yet.</p>
                  )}
                </div>

                <button
                  disabled
                  className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 bg-gray-50"
                >
                  Upload Note for this Lecture
                </button>
                <button
                  disabled
                  className="w-full py-2.5 bg-gray-300 text-white rounded-xl text-sm font-semibold"
                >
                  {previewLecture.hasQuiz ? `Take Quiz - ${previewLecture.quizTitle}` : 'Take Quiz - No quiz yet'}
                </button>
              </div>
            </div>
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
                  <button
                    onClick={() => startEditLecture(l)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg"
                    title="Edit lecture"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLecture(l.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg"
                    title="Delete lecture"
                  >
                    <Trash2 size={12} /> Delete
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
      <option value="" disabled hidden>{placeholder}</option>
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