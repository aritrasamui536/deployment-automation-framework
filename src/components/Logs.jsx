import { useState, useEffect, useCallback } from "react";
import { getLogs } from "../services/api";

const levelColor = { info: "#3b82f6", success: "#22c55e", error: "#ef4444", warn: "#f59e0b" };
const levelBg = { info: "rgba(59,130,246,0.08)", success: "rgba(34,197,94,0.08)", error: "rgba(239,68,68,0.08)", warn: "rgba(245,158,11,0.08)" };

export default function Logs({ deploymentId = null, deploymentName = null }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [filterLevel, setFilterLevel] = useState("all");
  const [search, setSearch] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true });
    update();
    return () => observer.disconnect();
  }, []);

  const fetchLogs = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getLogs(token, deploymentId).then(data => {
      if (Array.isArray(data)) setLogs(data);
      setLoading(false);
      setLastRefresh(new Date());
    });
  }, [deploymentId]);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const filtered = logs.filter(l => {
    const matchLevel = filterLevel === "all" || l.level === filterLevel;
    const matchSearch = search === "" || l.message.toLowerCase().includes(search.toLowerCase()) || l.app.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  const t = {
    bg: isDark ? "#0a0c10" : "#f1f5f9",
    text: isDark ? "#e2e8f0" : "#1e293b",
    subtext: isDark ? "#64748b" : "#64748b",
    cardBg: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
    cardBorder: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    inputBg: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
    inputBorder: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
    gridLine: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.04)",
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
      backgroundImage: isDark ? `linear-gradient(${t.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px)` : "none",
      backgroundSize: "48px 48px",
    }}>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#3b82f6", marginBottom: "0.4rem" }}>
            DEVOPS AUTOMATION — LOGS
          </div>
          <h1 style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)", fontWeight: 700, margin: 0, color: t.text }}>
            {deploymentName ? `Logs — ${deploymentName}` : "All Deployment Logs"}
          </h1>
        </div>
        <div style={{ fontSize: "0.65rem", color: t.subtext }}>
          LAST UPDATED — {lastRefresh.toLocaleTimeString()} <span style={{ color: "#22c55e" }}>? AUTO</span>
        </div>
      </div>

      <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${t.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.12em", color: t.subtext }}>
            {filtered.length} LOG ENTRIES
          </span>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <input
              placeholder="Search message / app..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...selectStyle, width: "180px" }}
            />
            <select style={selectStyle} value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="warn">Warn</option>
            </select>
            {(filterLevel !== "all" || search) && (
              <button onClick={() => { setFilterLevel("all"); setSearch(""); }}
                style={{ ...selectStyle, color: "#ef4444", borderColor: "rgba(239,68,68,0.3)" }}>
                ? CLEAR
              </button>
            )}
            <button onClick={fetchLogs} style={{ ...selectStyle, color: "#3b82f6", borderColor: "rgba(59,130,246,0.3)" }}>
              ? REFRESH
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: t.subtext }}>Loading logs...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: t.subtext, fontSize: "0.8rem" }}>
            {logs.length === 0 ? "No logs yet — create a deployment to generate logs." : "No results found."}
          </div>
        ) : (
          <div style={{ fontFamily: "monospace" }}>
            {filtered.map((log, i) => (
              <div key={log._id || i} style={{
                display: "grid", gridTemplateColumns: "160px 60px 100px 1fr",
                padding: "0.7rem 1.5rem", fontSize: "0.7rem",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`,
                alignItems: "center", gap: "0.5rem",
                background: i % 2 === 0 ? "transparent" : (isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)"),
              }}>
                <span style={{ color: t.subtext, fontSize: "0.62rem" }}>
                  {new Date(log.createdAt).toLocaleString()}
                </span>
                <span style={{
                  fontSize: "0.58rem", padding: "0.15rem 0.4rem", borderRadius: "3px",
                  background: levelBg[log.level] || levelBg.info,
                  color: levelColor[log.level] || levelColor.info,
                  fontWeight: 700, letterSpacing: "0.06em", width: "fit-content",
                }}>
                  {log.level?.toUpperCase()}
                </span>
                <span style={{ color: "#3b82f6", fontSize: "0.65rem" }}>{log.app}</span>
                <span style={{ color: t.text }}>{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}
