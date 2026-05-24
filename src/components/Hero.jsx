import { useState, useEffect } from 'react';

const TYPING_TEXTS = [
  'kubectl apply -f deployment.yaml',
  'terraform apply --auto-approve',
  'ansible-playbook deploy.yml',
  'git push origin main  # triggers pipeline',
  'argocd app sync production',
];

export default function Hero({ setActiveSection }) {
  const [textIdx, setTextIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = TYPING_TEXTS[textIdx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 45);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 20);
        return () => clearTimeout(t);
      } else {
        setTextIdx((textIdx + 1) % TYPING_TEXTS.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, textIdx]);

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 4rem',
      position: 'relative', overflow: 'hidden', textAlign: 'center',
    }}>
      {/* Grid BG */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(79,142,247,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(79,142,247,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 16px', borderRadius: 100,
        border: '1px solid rgba(79,142,247,0.3)',
        background: 'rgba(79,142,247,0.06)',
        fontSize: 12, color: 'var(--accent)',
        fontFamily: 'Space Mono', marginBottom: '2rem',
        letterSpacing: '0.05em',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent3)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
        DEVOPS AUTOMATION REFERENCE 2025
      </div>

      <h1 style={{
        fontFamily: 'Syne', fontWeight: 800,
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
        lineHeight: 1.05, letterSpacing: '-0.03em',
        marginBottom: '1.5rem', maxWidth: 800,
      }}>
        Deployment<br />
        <span style={{ color: 'var(--accent)' }}>Automation</span>{' '}
        <span style={{
          backgroundImage: 'linear-gradient(90deg, var(--accent2), var(--accent3))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Frameworks</span>
      </h1>

      <p style={{
        fontSize: 18, color: 'var(--text-dim)', maxWidth: 580,
        marginBottom: '3rem', lineHeight: 1.7,
      }}>
        Explore, compare, and master the tools that power modern DevOps pipelines —
        from CI/CD to Infrastructure as Code and GitOps.
      </p>

      {/* Terminal */}
      <div style={{
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: 12, overflow: 'hidden', width: '100%', maxWidth: 560,
        marginBottom: '3rem', textAlign: 'left',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          background: 'var(--bg2)', padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '1px solid var(--border)',
        }}>
          {['#F87171','#FBBF24','#34D399'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
          <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Space Mono' }}>
            deploy-pipeline — bash
          </span>
        </div>
        <div style={{ padding: '18px 20px', fontFamily: 'Space Mono', fontSize: 13 }}>
          <span style={{ color: 'var(--accent3)' }}>~</span>
          <span style={{ color: 'var(--text-dim)' }}> $ </span>
          <span style={{ color: 'var(--text)' }}>{displayed}</span>
          <span style={{
            display: 'inline-block', width: 2, height: 14, background: 'var(--accent)',
            marginLeft: 2, verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => setActiveSection('frameworks')} style={{
          padding: '12px 28px', borderRadius: 8, fontFamily: 'Syne', fontWeight: 700,
          fontSize: 15, background: 'var(--accent)', color: '#fff',
          transition: 'all 0.2s', border: '1px solid var(--accent)',
        }}>
          Explore Frameworks →
        </button>
        <button onClick={() => setActiveSection('pipeline')} style={{
          padding: '12px 28px', borderRadius: 8, fontFamily: 'Syne', fontWeight: 700,
          fontSize: 15, background: 'transparent', color: 'var(--text)',
          border: '1px solid var(--border-bright)', transition: 'all 0.2s',
        }}>
          View Pipeline
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', gap: '3rem', marginTop: '5rem',
        flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {[['9+','Frameworks Covered'],['3','Architecture Types'],['100%','Open Knowledge'],].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>{n}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </section>
  );
}
