import { useState, useEffect, useCallback } from "react";
import { getDeployments, getStats } from "../services/api";

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

export default function Dashboard({ addToast, onNewDeployment, onViewDeployment, onViewLogs }) {
  const [activeRow, setActiveRow] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [deployments, setDeployments] = useState([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, running: 0, successRate: "0%" });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEnv, setFilterEnv] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true });
    update();
    return () => observer.disconnect();
  }, []);

  const fetchData = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    Promise.all([getDeployments(token), getStats(token)]).then(([deps, st]) => {
      if (Array.isArray(deps)) setDeployments(deps);
      if (st && st.total !== undefined) setStats(st);
      setLoading(false);
      setLastRefresh(new Date());
    });
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filtered = deployments.filter(d => {
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    const matchEnv = filterEnv === "all" || d.environment === filterEnv;
    const matchSearch = search === "" || d.app.toLowerCase().includes(search.toLowerCase()) || d.branch.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchEnv && matchSearch;
  });

  const metrics = [
    { label: "Total Deployments", value: stats.total, suffix: "", delta: "+12%", up: true, color: "#3b82f6" },
    { label: "Success Rate", value: parseFloat(stats.successRate) || 0, suffix: "%", delta: "+0.6%", up: true, color: "#22c55e" },
    { label: "Failed", value: stats.failed, suffix: "", delta: "", up: false, color: "#ef4444" },
    { label: "Active Pipelines", value: stats.running, suffix: "", delta: "", up: true, color: "#f59e0b" },
  ];

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
    inputBg: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
    inputBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
  };

  const selectStyle = {
    background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: "6px",
    padding: "0.4rem 0.7rem", color: t.text, fontFamily: "inherit",
    fontSize: "0.65rem", letterSpacing: "0.06em", cursor: "pointer", outline: "none",
  };

  return (
    <div style={{
      minHeight: "100vh", background: t.bg, color: t.text,
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      padding: "2.5rem 2rem", boxSizing: "border-box",
    }}>
      <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#3b82f6", marginBottom: "0.4rem" }}>
            DEVOPS AUTOMATION REFERENCE 2025
          </div>
          <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 700, margin: 0, color: t.text }}>
            Deployment Dashboard
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "0.65rem", color: t.subtext }}>
            LAST UPDATED — {lastRefresh.toLocaleTimeString()} <span style={{ color: "#22c55e" }}>? AUTO</span>
          </div>
          <button onClick={onNewDeployment} style={{
            background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px",
            padding: "0.5rem 1.1rem", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
          }}>+ NEW DEPLOYMENT</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {metrics.map((m) => (
          <div key={m.label} style={{
            background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderTop: `2px solid ${m.color}`,
            borderRadius: "8px", padding: "1.25rem 1.5rem", cursor: "pointer", transition: "transform 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}
          >
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: t.subtext, marginBottom: "0.75rem" }}>{m.label.toUpperCase()}</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: t.text, lineHeight: 1 }}>
              <AnimatedNumber target={m.value} suffix={m.suffix} />
            </div>
            {m.delta && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: m.up ? "#22c55e" : "#ef4444" }}>
                {m.up ? "?" : "?"} {m.delta} this week
              </div>
            )}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: t.subtext, padding: "3rem" }}>Loading...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px", gap: "1rem", alignItems: "start" }}>
          <div style={{ background: t.tableBg, border: `1px solid ${t.cardBorder}`, borderRadius: "8px", overflow: "hidden" }}>

            <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${t.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: t.tableHeader }}>RECENT DEPLOYMENTS</span>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  placeholder="Search app / branch..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ ...selectStyle, padding: "0.4rem 0.8rem", width: "160px" }}
                />
                <select style={selectStyle} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="running">Running</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
                <select style={selectStyle} value={filterEnv} onChange={e => setFilterEnv(e.target.value)}>
                  <option value="all">All Envs</option>
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
                {(filterStatus !== "all" || filterEnv !== "all" || search) && (
                  <button onClick={() => { setFilterStatus("all"); setFilterEnv("all"); setSearch(""); }}
                    style={{ ...selectStyle, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", cursor: "pointer" }}>
                    ? CLEAR
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 90px 80px", padding: "0.6rem 1.5rem", fontSize: "0.6rem", letterSpacing: "0.1em", color: t.tableHeader, borderBottom: `1px solid ${t.cardBorder}` }}>
              <span>APP</span><span>BRANCH</span><span>ENV</span><span>STATUS</span><span>LOGS</span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: t.subtext, fontSize: "0.8rem" }}>
                {deployments.length === 0 ? "No deployments yet" : "No results found"}
              </div>
            ) : filtered.map((d, i) => (
              <div key={d._id}
                onMouseEnter={() => setActiveRow(i)}
                onMouseLeave={() => setActiveRow(null)}
                style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 90px 80px", padding: "0.9rem 1.5rem", fontSize: "0.72rem", borderBottom: `1px solid ${t.tableRow}`, background: activeRow === i ? t.tableHover : "transparent", cursor: "pointer", alignItems: "center" }}
                onClick={() => onViewDeployment && onViewDeployment(d)}
              >
                <div>
                  <div style={{ color: t.text }}>{d.app}</div>
                  <div style={{ fontSize: "0.6rem", color: t.subtext }}>{new Date(d.createdAt).toLocaleTimeString()}</div>
                </div>
                <span style={{ color: t.subtext, fontSize: "0.65rem" }}>{d.branch}</span>
                <span style={{ fontSize: "0.6rem", padding: "0.2rem 0.5rem", borderRadius: "4px", background: d.environment === "production" ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)", color: d.environment === "production" ? "#fca5a5" : "#93c5fd", width: "fit-content" }}>{d.environment}</span>
                <span style={{ fontSize: "0.6rem", padding: "0.2rem 0.55rem", borderRadius: "4px", background: statusBg(d.status), color: statusColor(d.status), width: "fit-content" }}>
                  {d.status}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); onViewLogs && onViewLogs(d); }}
                  style={{
                    background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
                    borderRadius: "4px", color: "#3b82f6", fontSize: "0.58rem", padding: "0.2rem 0.45rem",
                    cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em", width: "fit-content",
                  }}
                >
                  LOGS
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: t.tableBg, border: `1px solid ${t.cardBorder}`, borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: `1px solid ${t.cardBorder}` }}>
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: t.tableHeader }}>PIPELINE HEALTH</span>
            </div>
            <div style={{ padding: "1.2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              {pipelines.map((p) => (
                <div key={p.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.72rem" }}>
                    <span style={{ color: t.text }}>{p.name}</span>
                    <span style={{ color: p.health >= 98 ? "#22c55e" : "#f59e0b", fontWeight: 700 }}>{p.health}%</span>
                  </div>
                  <div style={{ height: 5, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.health}%`, background: p.health >= 98 ? "#22c55e" : "#f59e0b", borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: "0.6rem", color: t.subtext, marginTop: "0.35rem" }}>{p.runs} runs this month</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
