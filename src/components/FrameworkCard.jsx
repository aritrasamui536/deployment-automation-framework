import { useState } from 'react';

export default function FrameworkCard({ fw }) {
  const [hovered, setHovered] = useState(false);
  const diff = { Beginner: 'var(--accent3)', Intermediate: '#FBBF24', Advanced: '#F87171' };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg3)' : 'var(--bg2)',
        border: `1px solid ${hovered ? fw.color + '55' : 'var(--border)'}`,
        borderRadius: 16, padding: '1.5rem',
        transition: 'all 0.25s',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: hovered ? `0 8px 40px ${fw.color}22` : 'none',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${fw.color}, transparent)`,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.25s',
      }} />

      {fw.popular && (
        <span style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(79,142,247,0.12)', color: 'var(--accent)',
          border: '1px solid rgba(79,142,247,0.25)',
          fontSize: 10, padding: '2px 8px', borderRadius: 100,
          fontFamily: 'Space Mono', letterSpacing: '0.05em',
        }}>POPULAR</span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, fontSize: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: fw.color + '22', border: `1px solid ${fw.color}44`,
        }}>{fw.logo}</div>
        <div>
          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17 }}>{fw.name}</div>
          <div style={{
            fontSize: 11, color: fw.color, fontFamily: 'Space Mono',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>{fw.category}</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '1rem' }}>
        {fw.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1rem' }}>
        {fw.features.map(f => (
          <span key={f} style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            color: 'var(--text-dim)',
          }}>{f}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-dim)' }}>
        <span>⭐ {fw.stars}</span>
        <span style={{ color: 'var(--border-bright)' }}>|</span>
        <span>{fw.language}</span>
        <span style={{ color: 'var(--border-bright)' }}>|</span>
        <span style={{ color: diff[fw.difficulty] }}>● {fw.difficulty}</span>
      </div>
    </div>
  );
}
