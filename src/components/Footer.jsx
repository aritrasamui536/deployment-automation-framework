export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '2rem',
      textAlign: 'center',
      color: 'var(--text-dim)',
      fontSize: 12,
      fontFamily: 'Space Mono',
    }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ color: 'var(--accent)', fontFamily: 'Syne', fontWeight: 700 }}>DeployForge</span>
        {' '} — Deployment Automation Reference
      </div>
      <div>Built with React + Vite • 2025</div>
    </footer>
  );
}
