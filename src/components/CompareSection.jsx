const compareData = [
  { feature: 'Setup Difficulty',    jenkins: '🔴 Hard', github: '🟢 Easy', terraform: '🟡 Medium', ansible: '🟢 Easy' },
  { feature: 'Cloud Agnostic',      jenkins: '✅', github: '⚠️ Partial', terraform: '✅', ansible: '✅' },
  { feature: 'Kubernetes Native',   jenkins: '⚠️', github: '⚠️', terraform: '✅', ansible: '⚠️' },
  { feature: 'GitOps Support',      jenkins: '❌', github: '✅', terraform: '⚠️', ansible: '❌' },
  { feature: 'Language',            jenkins: 'Groovy', github: 'YAML', terraform: 'HCL', ansible: 'YAML' },
  { feature: 'Self-Hosted Option',  jenkins: '✅', github: '✅', terraform: '✅', ansible: '✅' },
  { feature: 'Enterprise Support',  jenkins: '✅ Paid', github: '✅ Paid', terraform: '✅ Paid', ansible: '✅ Paid' },
  { feature: 'Learning Curve',      jenkins: 'Steep', github: 'Low', terraform: 'Medium', ansible: 'Low' },
];

const tools = [
  { name: 'Jenkins', color: '#D24939' },
  { name: 'GitHub Actions', color: '#2DA44E' },
  { name: 'Terraform', color: '#7B42BC' },
  { name: 'Ansible', color: '#EE0000' },
];

export default function CompareSection() {
  return (
    <section style={{ padding: '6rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 12 }}>
          // COMPARE
        </div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Side-by-Side Comparison
        </h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: 480, margin: '0 auto' }}>
          Top 4 frameworks compared across key DevOps criteria
        </p>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
          <thead>
            <tr style={{ background: 'var(--bg3)' }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}>
                Feature
              </th>
              {tools.map(t => (
                <th key={t.name} style={{
                  padding: '16px 20px', textAlign: 'center',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 13,
                  color: t.color, borderBottom: '1px solid var(--border)',
                  borderLeft: '1px solid var(--border)',
                }}>{t.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareData.map((row, i) => (
              <tr key={row.feature} style={{
                background: i % 2 === 0 ? 'var(--bg2)' : 'transparent',
                transition: 'background 0.15s',
              }}>
                <td style={{
                  padding: '14px 20px', fontFamily: 'DM Sans', fontSize: 13,
                  color: 'var(--text)', borderBottom: '1px solid var(--border)',
                  fontWeight: 500,
                }}>{row.feature}</td>
                {[row.jenkins, row.github, row.terraform, row.ansible].map((v, j) => (
                  <td key={j} style={{
                    padding: '14px 20px', textAlign: 'center',
                    fontFamily: 'Space Mono', fontSize: 12, color: 'var(--text-dim)',
                    borderBottom: '1px solid var(--border)',
                    borderLeft: '1px solid var(--border)',
                  }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
