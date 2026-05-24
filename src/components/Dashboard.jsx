import { useState, useEffect } from "react";

const metrics = [
  { label: "Total Deployments", value: 1284, suffix: "", delta: "+12%", up: true, color: "#3b82f6" },
  { label: "Success Rate", value: 98.4, suffix: "%", delta: "+0.6%", up: true, color: "#22c55e" },
  { label: "Avg Deploy Time", value: 43, suffix: "s", delta: "-8s", up: true, color: "#a78bfa" },
  { label: "Active Pipelines", value: 7, suffix: "", delta: "+2", up: true, color: "#f59e0b" },
];

const deployments = [
  { id: "d-0091", repo: "frontend/web-app", branch: "main", status: "success", time: "2m ago", env: "production" },
  { id: "d-0090", repo: "api/gateway", branch: "release/v3.2", status: "running", time: "5m ago", env: "staging" },
  { id: "d-0089", repo: "services/auth", branch: "hotfix/token", status: "failed", time: "18m ago", env: "production" },
  { id: "d-0088", repo: "infra/k8s-config", branch: "main", status: "success", time: "34m ago", env: "production" },
  { id: "d-0087", repo: "frontend/admin", branch: "develop", status: "success", time: "1h ago", env: "staging" },
  { id: "d-0086", repo: "api/payments", branch: "main", status: "success", time: "2h ago", env: "production" },
];

const pipelines = [
  { name: "CI/CD Main", runs: 340, health: 99 },
  { name: "Nightly Tests", runs: 120, health: 94 },
  { name: "Security Scan", runs: 88, health: 100 },
  { name: "Infra Drift", runs: 56, health: 87 },
];

function statusColor(s) {
  if (s === "success") return "#22c55e";
  if (s === "running") return "#3b82f6";
  if (s === "failed") return "#ef4444";
  return "#6b7280";
}
function statusBg(s) {
  if (s === "success") return "rgba(34,197,94,0.1)";
  if (s === "running") return "rgba(59,130,246,0.12)";
  if (s === "failed") return "rgba(239,68,68,0.1)";
  return "rgba(107,114,128,0.1)";
}

function AnimatedNumber({ target, suffix }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(parseFloat(start.toFixed(1)));
    }, 18);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{val}{suffix}</span>;
}

export default function Dashboard({ addToast }) {
  const [activeRow, setActiveRow] = useState(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light');
    };
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true });
    update();
    return () => observer.disconnect();
  }, []);

  const handleRowClick = (d) => {
    if (!addToast) return;
    if (d.status === "success") addToast(`${d.repo} — deployment successful`, "success");
    else if (d.status === "failed") addToast(`${d.repo} — deployment failed`, "error");
    else if (d.status === "running") addToast(`${d.repo} — deployment in progress`, "info");
  };

  const t = {
    bg: isDark ? "#0a0c10" : "#f1f5f9",
    text: isDark ? "#e2e8f0" : "#1e293b",
    subtext: isDark ? "#64748b" : "#64748b",
    cardBg: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
    cardBorder: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    tableBg: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
    tableHover: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    tableHeader: isDark ? "#475569" : "#94a3b8",
    tableRow: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
    gridLine: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.04)",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: t.bg,
      color: t.text,
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      padding: "2.5rem 2rem",
      boxSizing: "border-box",
      transition: "background 0.3s, color 0.3s",
      backgroundImage: isDark ? `
        radial-gradient(ellipse 80% 40% at 50% -10%, rgba(59,130,246,0.08) 0%, transparent 70%),
        linear-gradient(${t.gridLine} 1px, transparent 1px),
        linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)
      ` : `
        linear-gradient(${t.gridLine} 1px, transparent 1px),
        linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)
      `,
      backgroundSize: isDark ? "100% 100%, 48px 48px, 48px 48px" : "48px 48px, 48px 48px",
    }}>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#3b82f6", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            DEVOPS AUTOMATION REFERENCE 2025
          </div>
          <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 700, margin: 0, letterSpacing: "-0.02em", color: t.text }}>
            Deployment Dashboard
          </h1>
        </div>
        <div style={{ fontSize: "0.7rem", color: t.subtext, letterSpacing: "0.08em" }}>
          LAST UPDATED — {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {metrics.map((m) => (
          <div key={m.label} style={{
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            borderTop: `2px solid ${m.color}`,
            borderRadius: "8px",
            padding: "1.25rem 1.5rem",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.2s, box-shadow 0.2s, background 0.3s",
            boxSizing: "border-box",
            cursor: "pointer",
            boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${m.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)"; }}
            onClick={() => addToast && addToast(`${m.label}: ${m.value}${m.suffix}`, "info")}
          >
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: t.subtext, marginBottom: "0.75rem" }}>{m.label.toUpperCase()}</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: t.text, lineHeight: 1 }}>
              <AnimatedNumber target={m.value} suffix={m.suffix} />
            </div>
            <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: m.up ? "#22c55e" : "#ef4444" }}>
              {m.up ? "▲" : "▼"} {m.delta} this week
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px", gap: "1rem", alignItems: "start" }}>

        {/* Recent Deployments Table */}
        <div style={{ background: t.tableBg, border: `1px solid ${t.cardBorder}`, borderRadius: "8px", overflow: "hidden", minWidth: 0, boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)", transition: "background 0.3s" }}>
          <div style={{ padding: "1.2rem 1.5rem", borderBottom: `1px solid ${t.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: t.tableHeader }}>RECENT DEPLOYMENTS</span>
            <span style={{ fontSize: "0.65rem", color: "#3b82f6", cursor: "pointer", whiteSpace: "nowrap" }}>VIEW ALL →</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 130px 100px 90px", padding: "0.6rem 1.5rem", fontSize: "0.6rem", letterSpacing: "0.1em", color: t.tableHeader, borderBottom: `1px solid ${t.cardBorder}` }}>
            <span>ID</span>
            <span>REPOSITORY</span>
            <span>BRANCH</span>
            <span>ENV</span>
            <span>STATUS</span>
          </div>

          {deployments.map((d, i) => (
            <div key={d.id}
              onMouseEnter={() => setActiveRow(i)}
              onMouseLeave={() => setActiveRow(null)}
              onClick={() => handleRowClick(d)}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1fr 130px 100px 90px",
                padding: "0.9rem 1.5rem",
                fontSize: "0.72rem",
                borderBottom: `1px solid ${t.tableRow}`,
                background: activeRow === i ? t.tableHover : "transparent",
                transition: "background 0.15s",
                alignItems: "center",
                minWidth: 0,
                cursor: "pointer",
              }}>
              <span style={{ color: t.subtext }}>{d.id}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.repo}</div>
                <div style={{ fontSize: "0.6rem", color: t.subtext, marginTop: "0.15rem" }}>{d.time}</div>
              </div>
              <span style={{ color: t.subtext, fontSize: "0.65rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.branch}</span>
              <span style={{
                fontSize: "0.6rem", padding: "0.2rem 0.5rem", borderRadius: "4px",
                background: d.env === "production" ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)",
                color: d.env === "production" ? "#fca5a5" : "#93c5fd",
                display: "inline-block", letterSpacing: "0.05em", width: "fit-content",
              }}>{d.env}</span>
              <span style={{
                fontSize: "0.6rem", padding: "0.2rem 0.55rem", borderRadius: "4px",
                background: statusBg(d.status), color: statusColor(d.status),
                display: "inline-flex", alignItems: "center", gap: "0.3rem", width: "fit-content",
              }}>
                {d.status === "running" && (
                  <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", animation: "pulse 1.2s infinite" }} />
                )}
                {d.status}
              </span>
            </div>
          ))}
        </div>

        {/* Pipeline Health */}
        <div style={{ background: t.tableBg, border: `1px solid ${t.cardBorder}`, borderRadius: "8px", overflow: "hidden", boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)", transition: "background 0.3s" }}>
          <div style={{ padding: "1.2rem 1.5rem", borderBottom: `1px solid ${t.cardBorder}` }}>
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: t.tableHeader }}>PIPELINE HEALTH</span>
          </div>
          <div style={{ padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
            {pipelines.map((p) => (
              <div key={p.name}
                style={{ cursor: "pointer" }}
                onClick={() => addToast && addToast(`${p.name} — ${p.health}% health`, p.health >= 98 ? "success" : p.health >= 90 ? "warning" : "error")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.72rem" }}>
                  <span style={{ color: t.text }}>{p.name}</span>
                  <span style={{ color: p.health >= 98 ? "#22c55e" : p.health >= 90 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{p.health}%</span>
                </div>
                <div style={{ height: 5, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${p.health}%`,
                    background: p.health >= 98 ? "#22c55e" : p.health >= 90 ? "#f59e0b" : "#ef4444",
                    borderRadius: 3, transition: "width 1s ease",
                    boxShadow: `0 0 8px ${p.health >= 98 ? "#22c55e" : p.health >= 90 ? "#f59e0b" : "#ef4444"}88`,
                  }} />
                </div>
                <div style={{ fontSize: "0.6rem", color: t.subtext, marginTop: "0.35rem" }}>{p.runs} runs this month</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}