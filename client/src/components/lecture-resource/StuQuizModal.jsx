import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

const StuQuizModal = ({ lecture, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers,      setAnswers]      = useState({});
  const [submitted,    setSubmitted]    = useState(false);

  if (!lecture || !lecture.quiz) return null;

  const { quiz }   = lecture;
  const questions  = quiz.questions;
  const total      = questions.length;
  const answered   = Object.keys(answers).length;
  const currentQ   = questions[currentIndex];
  const score      = questions.filter((q, i) => answers[i] === q.answer).length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const handleSelect = (i) => { if (!submitted) setAnswers(prev => ({ ...prev, [currentIndex]: i })); };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-7">

          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Quiz</p>
              <h3 className="text-xl font-bold text-gray-900 mt-0.5">{quiz.title}</h3>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          {!submitted ? (
            <div className="space-y-6">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                  <span>Question {currentIndex + 1} of {total}</span>
                  <span>{answered} / {total} answered</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                  />
                </div>
              </div>

              <h4 className="text-base font-semibold text-gray-800">{currentQ.question}</h4>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentIndex] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left px-5 py-3.5 border-2 rounded-xl font-medium text-sm flex gap-3 transition-all
                        ${isSelected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <span className={`font-bold shrink-0 ${isSelected ? 'text-white/50' : 'text-gray-300'}`}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setCurrentIndex(i => i - 1)}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 text-sm font-medium text-gray-400 px-4 py-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft size={15} /> Previous
                </button>

                {currentIndex < total - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(i => i + 1)}
                    disabled={answers[currentIndex] === undefined}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black transition-all"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    onClick={() => setSubmitted(true)}
                    disabled={answered < total}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>

          ) : (
            <div className="text-center space-y-6">
              <div>
                <p className="text-6xl font-bold text-gray-900">{percentage}%</p>
                <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">Score: {score} / {total}</p>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-3 text-left">
                {questions.map((q, i) => {
                  const isCorrect = answers[i] === q.answer;
                  return (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl space-y-2.5 bg-gray-50">
                      <div className="flex items-start gap-2.5">
                        {isCorrect
                          ? <CheckCircle2 size={17} className="text-green-500 shrink-0 mt-0.5" />
                          : <XCircle      size={17} className="text-red-400 shrink-0 mt-0.5"   />
                        }
                        <p className="text-sm font-semibold text-gray-800">{q.question}</p>
                      </div>
                      <div className="flex flex-col gap-1 pl-6">
                        {q.options.map((opt, j) => (
                          <span key={j} className={`text-xs px-3 py-1 rounded-lg font-medium
                            ${j === q.answer                      ? 'bg-green-100 text-green-700 font-semibold' : ''}
                            ${j === answers[i] && !isCorrect       ? 'bg-red-100 text-red-600 font-semibold'    : ''}
                            ${j !== q.answer && j !== answers[i]   ? 'text-gray-400'                            : ''}
                          `}>
                            {String.fromCharCode(65 + j)}. {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={onClose}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StuQuizModal;