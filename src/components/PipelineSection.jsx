import { useState, useEffect } from 'react';
import { pipelineStages } from '../data/frameworks';

export default function PipelineSection() {
  const [activeStage, setActiveStage] = useState(null);
  const [running, setRunning] = useState(false);
  const [completedStages, setCompletedStages] = useState([]);
  const [currentRunning, setCurrentRunning] = useState(null);

  const runPipeline = () => {
    setRunning(true);
    setCompletedStages([]);
    setCurrentRunning(null);

    pipelineStages.forEach((stage, i) => {
      setTimeout(() => {
        setCurrentRunning(stage.id);
        if (i === pipelineStages.length - 1) {
          setTimeout(() => {
            setCompletedStages(pipelineStages.map(s => s.id));
            setCurrentRunning(null);
            setRunning(false);
          }, 1200);
        }
      }, i * 1200);

      setTimeout(() => {
        setCompletedStages(prev => [...prev, stage.id]);
      }, i * 1200 + 1000);
    });
  };

  const resetPipeline = () => {
    setCompletedStages([]);
    setCurrentRunning(null);
    setRunning(false);
    setActiveStage(null);
  };

  const getStatus = (id) => {
    if (completedStages.includes(id)) return 'done';
    if (currentRunning === id) return 'running';
    return 'idle';
  };

  return (
    <section style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 12 }}>
          // VISUALIZE
        </div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          CI/CD Pipeline Flow
        </h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: 480, margin: '0 auto 2rem' }}>
          Interactive simulation of a modern deployment pipeline
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={runPipeline} disabled={running} style={{
            padding: '10px 24px', borderRadius: 8, fontFamily: 'Syne', fontWeight: 700,
            fontSize: 14, background: running ? 'var(--bg3)' : 'var(--accent)',
            color: running ? 'var(--text-dim)' : '#fff',
            border: running ? '1px solid var(--border)' : '1px solid var(--accent)',
            transition: 'all 0.2s',
          }}>
            {running ? '⏳ Running...' : '▶ Run Pipeline'}
          </button>
          <button onClick={resetPipeline} style={{
            padding: '10px 24px', borderRadius: 8, fontFamily: 'Syne', fontWeight: 700,
            fontSize: 14, background: 'transparent', color: 'var(--text-dim)',
            border: '1px solid var(--border)', transition: 'all 0.2s',
          }}>
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Pipeline stages */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 0,
        overflowX: 'auto', paddingBottom: '1rem',
      }}>
        {pipelineStages.map((stage, i) => {
          const status = getStatus(stage.id);
          const isActive = activeStage === stage.id;
          return (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div
                onClick={() => setActiveStage(isActive ? null : stage.id)}
                style={{
                  flex: 1, textAlign: 'center', cursor: 'pointer',
                  padding: '1.5rem 1rem',
                }}
              >
                {/* Circle */}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 12px',
                  border: `2px solid ${status === 'idle' ? 'var(--border)' : stage.color}`,
                  background: status === 'done' ? stage.color + '33'
                    : status === 'running' ? stage.color + '15' : 'var(--bg2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, transition: 'all 0.4s',
                  boxShadow: status === 'running' ? `0 0 24px ${stage.color}66` : 'none',
                  animation: status === 'running' ? 'pulsering 1.2s ease-in-out infinite' : 'none',
                }}>
                  {status === 'done' ? '✓' : stage.icon}
                </div>
                <div style={{
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 13, marginBottom: 4,
                  color: status === 'idle' ? 'var(--text-dim)' : 'var(--text)',
                }}>{stage.name}</div>
                <div style={{
                  fontSize: 10, color: 'var(--text-dim)', fontFamily: 'Space Mono',
                  marginBottom: 4,
                }}>{stage.duration}</div>
                <div style={{
                  display: 'inline-block', fontSize: 10, padding: '2px 8px',
                  borderRadius: 100, fontFamily: 'Space Mono',
                  background: status === 'done' ? 'rgba(52,211,153,0.12)' :
                    status === 'running' ? `${stage.color}22` : 'transparent',
                  color: status === 'done' ? 'var(--accent3)' :
                    status === 'running' ? stage.color : 'transparent',
                  border: `1px solid ${status === 'done' ? 'rgba(52,211,153,0.3)' :
                    status === 'running' ? stage.color + '44' : 'transparent'}`,
                }}>
                  {status === 'done' ? 'PASSED' : status === 'running' ? 'RUNNING' : '—'}
                </div>

                {/* Detail popup */}
                {isActive && (
                  <div style={{
                    marginTop: 12, background: 'var(--bg3)', border: `1px solid ${stage.color}55`,
                    borderRadius: 10, padding: '12px 14px', textAlign: 'left', fontSize: 12,
                    color: 'var(--text-dim)', lineHeight: 1.6,
                  }}>
                    {stage.desc}
                  </div>
                )}
              </div>

              {/* Connector */}
              {i < pipelineStages.length - 1 && (
                <div style={{
                  width: 40, height: 2, flexShrink: 0,
                  background: completedStages.includes(stage.id)
                    ? 'linear-gradient(90deg, ' + stage.color + ', ' + pipelineStages[i+1].color + ')'
                    : 'var(--border)',
                  transition: 'background 0.4s',
                  position: 'relative',
                }}>
                  <span style={{
                    position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
                    color: completedStages.includes(stage.id) ? pipelineStages[i+1].color : 'var(--border)',
                    fontSize: 12, transition: 'color 0.4s',
                  }}>▶</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', marginTop: '1rem', fontFamily: 'Space Mono' }}>
        Click any stage to see details • Press "Run Pipeline" to animate
      </p>

      <style>{`@keyframes pulsering { 0%,100% { box-shadow: 0 0 12px currentColor; } 50% { box-shadow: 0 0 28px currentColor; } }`}</style>
    </section>
  );
}
