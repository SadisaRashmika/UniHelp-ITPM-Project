import React from 'react';
import { Heart, Trophy, FileText, GraduationCap, Calendar } from 'lucide-react';

const StuSidebar = ({ points, quizzes, notes, level }) => {
  return (
    <aside style={{
      width: '280px', minWidth: '280px',
      height: '100vh', background: '#fff',
      borderRight: '1px solid #f0f0f5',
      display: 'flex', flexDirection: 'column',
      padding: '36px 24px 28px',
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      overflowY: 'auto',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '84px', height: '84px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #818cf8 0%, #a855f7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.7rem', fontWeight: 900, color: '#fff',
          margin: '0 auto 14px',
          boxShadow: '0 6px 20px rgba(129,140,248,0.4)',
        }}>
          AJ
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0d0d1a', margin: '0 0 3px' }}>Alex Johnson</h2>
        <p style={{ fontSize: '0.82rem', color: '#9090aa', fontWeight: 600, margin: '0 0 12px' }}>2024001</p>
        <span style={{
          display: 'inline-block',
          background: '#f3f3f9', color: '#5a5a8a',
          fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em',
          padding: '5px 14px', borderRadius: '20px',
        }}>
          Computer Science
        </span>
      </div>

      {/* Meta */}
      <div style={{
        borderTop: '1px solid #f0f0f5', borderBottom: '1px solid #f0f0f5',
        padding: '18px 0', marginBottom: '24px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        <MetaRow icon={<GraduationCap size={16} />} label="2nd Year" />
        <MetaRow icon={<Calendar size={16} />} label="Spring 2026" />
      </div>

      {/* Stats */}
      <div style={{ marginBottom: 'auto' }}>
        <p style={{
          fontSize: '0.7rem', fontWeight: 900, color: '#c0c0d0',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px',
        }}>Statistics</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <StatCard
            icon={<Heart size={17} fill="#ef4444" color="#ef4444" />}
            label="Total Likes"
            value={points}
            bg="#fff5f5"
            valColor="#ef4444"
          />
          <StatCard
            icon={<Trophy size={17} color="#6366f1" />}
            label="Quizzes"
            value={quizzes}
            bg="#f0f4ff"
            valColor="#6366f1"
          />
          <StatCard
            icon={<FileText size={17} color="#10b981" />}
            label="My Notes"
            value={notes}
            bg="#f0fdf4"
            valColor="#10b981"
          />
        </div>
      </div>

      {/* Level */}
      <div style={{
        marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f0f0f5',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#7a7a9a' }}>Level</span>
        <span style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#fff', fontSize: '0.75rem', fontWeight: 900,
          padding: '5px 16px', borderRadius: '20px',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          boxShadow: '0 3px 10px rgba(245,158,11,0.35)',
        }}>
          {level}
        </span>
      </div>
    </aside>
  );
};

const MetaRow = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7a7a9a', fontSize: '0.88rem', fontWeight: 600 }}>
    <span style={{ color: '#b0b0c8' }}>{icon}</span>
    {label}
  </div>
);

const StatCard = ({ icon, label, value, bg, valColor }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 16px', borderRadius: '16px', background: bg,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', fontWeight: 700, color: '#3a3a5a' }}>
      {icon} {label}
    </div>
    <span style={{ fontWeight: 900, fontSize: '1rem', color: valColor }}>{value}</span>
  </div>
);

export default StuSidebar;