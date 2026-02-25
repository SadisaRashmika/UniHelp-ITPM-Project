import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

const StuQuizModal = ({ lecture, onClose }) => {
  const quiz = lecture?.quiz;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) return null;

  const total = quiz.questions.length;
  const answered = Object.keys(answers).length;
  const score = quiz.questions.filter((q, i) => answers[i] === q.answer).length;
  const pct = Math.round((score / total) * 100);

  const handleSelect = (idx) => {
    if (!submitted) setAnswers(prev => ({ ...prev, [current]: idx }));
  };

  const baseFont = { fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,10,30,0.6)',
        backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...baseFont,
          background: '#fff', borderRadius: '32px',
          width: '100%', maxWidth: '560px', maxHeight: '90vh',
          overflowY: 'auto', position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          padding: '36px',
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .quiz-opt-btn {
            display: flex; align-items: center; gap: 14px;
            width: 100%; padding: 15px 18px;
            border: 2px solid #f0f0f5; border-radius: 16px;
            background: #fff; text-align: left; cursor: pointer;
            font-size: 0.9rem; font-weight: 600; color: #2a2a4a;
            font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
            transition: all 0.15s;
          }
          .quiz-opt-btn:hover { border-color: #a5b4fc; background: #f8f7ff; }
          .quiz-opt-btn.selected { border-color: #6366f1; background: #ede9fe; color: #4338ca; }
          .quiz-opt-btn.correct-ans { border-color: #10b981; background: #d1fae5; color: #065f46; }
          .quiz-opt-btn.wrong-ans { border-color: #ef4444; background: #fee2e2; color: #991b1b; }
        `}</style>

        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '20px',
            background: '#f5f5fb', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a7a9a',
          }}
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0d0d1a', margin: '0 0 20px' }}>
              {quiz.title}
            </h3>

            {/* Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#9090aa', marginBottom: '10px' }}>
              <span>Question {current + 1} of {total}</span>
              <span style={{ background: '#f3f3f9', padding: '2px 10px', borderRadius: '20px' }}>{answered} / {total} answered</span>
            </div>
            <div style={{ height: '6px', background: '#f0f0f5', borderRadius: '20px', marginBottom: '28px' }}>
              <div style={{
                height: '100%', borderRadius: '20px',
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                width: `${((current + 1) / total) * 100}%`,
                transition: 'width 0.3s ease',
              }} />
            </div>

            <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0d0d1a', marginBottom: '20px', lineHeight: 1.4 }}>
              {quiz.questions[current].q}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {quiz.questions[current].options.map((opt, i) => (
                <button
                  key={i}
                  className={`quiz-opt-btn${answers[current] === i ? ' selected' : ''}`}
                  onClick={() => handleSelect(i)}
                >
                  <span style={{
                    minWidth: '28px', height: '28px', borderRadius: '8px',
                    background: answers[current] === i ? '#6366f1' : '#f0f0f5',
                    color: answers[current] === i ? '#fff' : '#9090aa',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                    transition: 'all 0.15s',
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                disabled={current === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 20px', border: 'none', borderRadius: '12px',
                  background: '#f3f3f9', color: current === 0 ? '#c8c8d8' : '#5a5a8a',
                  fontWeight: 700, fontSize: '0.88rem', cursor: current === 0 ? 'default' : 'pointer',
                  fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
                }}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              {current < total - 1 ? (
                <button
                  onClick={() => setCurrent(c => c + 1)}
                  disabled={answers[current] === undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '10px 24px', border: 'none', borderRadius: '12px',
                    background: answers[current] !== undefined ? '#0d0d1a' : '#e8e8f0',
                    color: answers[current] !== undefined ? '#fff' : '#a0a0b0',
                    fontWeight: 800, fontSize: '0.88rem',
                    cursor: answers[current] !== undefined ? 'pointer' : 'default',
                    fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
                  }}
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={answered < total}
                  style={{
                    padding: '10px 24px', border: 'none', borderRadius: '12px',
                    background: answered >= total ? '#6366f1' : '#e8e8f0',
                    color: answered >= total ? '#fff' : '#a0a0b0',
                    fontWeight: 800, fontSize: '0.88rem',
                    cursor: answered >= total ? 'pointer' : 'default',
                    fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
                  }}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0d0d1a', margin: '0 0 24px', textAlign: 'center' }}>
              Quiz Results
            </h3>

            {/* Score Circle */}
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 12px',
              background: pct === 100 ? 'linear-gradient(135deg, #10b981, #059669)' : pct >= 60 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{pct}%</span>
            </div>
            <p style={{ textAlign: 'center', fontWeight: 700, color: '#9090aa', marginBottom: '28px', fontSize: '0.9rem' }}>
              Score: {score} / {total}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '320px', overflowY: 'auto' }}>
              {quiz.questions.map((q, i) => {
                const isCorrect = answers[i] === q.answer;
                return (
                  <div key={i} style={{
                    background: '#fafafa', borderRadius: '18px', padding: '18px',
                    border: `1.5px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                      {isCorrect
                        ? <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} />
                        : <XCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />}
                      <p style={{ fontWeight: 700, color: '#0d0d1a', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>{q.q}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingLeft: '30px' }}>
                      {q.options.map((opt, j) => (
                        <div key={j} style={{
                          fontSize: '0.84rem', padding: '6px 12px', borderRadius: '9px',
                          fontWeight: j === q.answer ? 700 : 500,
                          background: j === q.answer ? '#d1fae5' : j === answers[i] && !isCorrect ? '#fee2e2' : 'transparent',
                          color: j === q.answer ? '#065f46' : j === answers[i] && !isCorrect ? '#991b1b' : '#6a6a8a',
                        }}>
                          {String.fromCharCode(65 + j)}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%', marginTop: '24px', padding: '14px', border: 'none',
                borderRadius: '16px', background: '#0d0d1a', color: '#fff',
                fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e1e3a'}
              onMouseLeave={e => e.currentTarget.style.background = '#0d0d1a'}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StuQuizModal;