import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

// CHANGES FROM ORIGINAL (design untouched):
// 1. Receives `lecture` object, reads lecture.quiz for all data
// 2. Real question/answer state — tracks selections, previous/next, shows correct answers
// 3. Results screen shows actual score and per-question breakdown
const StuQuizModal = ({ lecture, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers]           = useState({}); // { questionIndex: chosenOptionIndex }
  const [submitted, setSubmitted]       = useState(false);

  if (!lecture || !lecture.quiz) return null;

  const { quiz }    = lecture;
  const questions   = quiz.questions;
  const total       = questions.length;
  const answered    = Object.keys(answers).length;
  const currentQ    = questions[currentIndex];
  const score       = questions.filter((q, i) => answers[i] === q.answer).length;
  const percentage  = total > 0 ? Math.round((score / total) * 100) : 0;
  const progressPct = ((currentIndex + 1) / total) * 100;

  const handleSelect = (optionIndex) => {
    if (!submitted) setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl relative">
        <div className="p-10 max-h-[90vh] overflow-y-auto">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>

          {!submitted ? (
            <div className="space-y-8">
              <header>
                <h3 className="text-2xl font-black text-slate-900">{quiz.title}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-bold text-slate-400">Question {currentIndex + 1} of {total}</span>
                  <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{answered} / {total} answered</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full mt-4">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </header>

              <h4 className="text-xl font-bold text-slate-800">{currentQ.question}</h4>

              <div className="space-y-4">
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentIndex] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left p-6 border-2 rounded-[20px] font-bold flex gap-4 transition-all
                        ${isSelected
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-100 text-slate-700 hover:border-slate-300'
                        }`}
                    >
                      <span className={`font-black ${isSelected ? 'text-white/60' : 'text-slate-300'}`}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setCurrentIndex(i => i - 1)}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 text-slate-400 font-bold px-6 py-3 disabled:opacity-30 disabled:cursor-not-allowed hover:text-slate-600 transition-colors"
                >
                  <ArrowLeft size={18} /> Previous
                </button>

                {currentIndex < total - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(i => i + 1)}
                    disabled={answers[currentIndex] === undefined}
                    className="bg-slate-900 text-white px-10 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black transition-all"
                  >
                    Next <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setSubmitted(true)}
                    disabled={answered < total}
                    className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black shadow-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>

          ) : (
            <div className="text-center space-y-8 py-6">
              <h3 className="text-xl font-bold text-slate-900">Quiz Results</h3>
              <div className="space-y-1">
                <p className="text-7xl font-black text-slate-900">{percentage}%</p>
                <p className="text-slate-400 font-bold uppercase tracking-widest">Score: {score} / {total}</p>
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-4 p-4 text-left">
                {questions.map((q, i) => {
                  const isCorrect = answers[i] === q.answer;
                  return (
                    <ResultCard
                      key={i}
                      question={q.question}
                      options={q.options}
                      correctIndex={q.answer}
                      chosenIndex={answers[i]}
                      isCorrect={isCorrect}
                    />
                  );
                })}
              </div>

              <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ question, options, correctIndex, chosenIndex, isCorrect }) => (
  <div className="p-6 border-2 border-slate-50 rounded-[24px] space-y-3">
    <div className="flex items-start gap-3">
      {isCorrect
        ? <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
        : <XCircle      className="text-red-400 shrink-0 mt-0.5"   size={20} />
      }
      <p className="font-bold text-slate-800 leading-tight">{question}</p>
    </div>
    <div className="flex flex-col gap-1.5 pl-8">
      {options.map((opt, j) => (
        <span
          key={j}
          className={`text-sm px-3 py-1.5 rounded-xl font-semibold
            ${j === correctIndex                       ? 'bg-green-50 text-green-700 font-black' : ''}
            ${j === chosenIndex && !isCorrect          ? 'bg-red-50 text-red-500 font-black'     : ''}
            ${j !== correctIndex && j !== chosenIndex  ? 'text-slate-400'                        : ''}
          `}
        >
          {String.fromCharCode(65 + j)}. {opt}
        </span>
      ))}
    </div>
  </div>
);

export default StuQuizModal;