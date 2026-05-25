import { useState } from "react";
import { deleteDeployment } from "../services/api";

export default function DeploymentDetail({ deployment, onClose, onDeleted, addToast }) {
  if (!deployment) return null;
  const [deleting, setDeleting] = useState(false);

  const statusColor = (s) => {
    if (s === "success") return "#22c55e";
    if (s === "running") return "#3b82f6";
    if (s === "failed") return "#ef4444";
    return "#6b7280";
  };

  const t = {
    bg: "#0f1117", border: "rgba(255,255,255,0.08)",
    text: "#e2e8f0", subtext: "#64748b", cardBg: "rgba(255,255,255,0.03)",
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${deployment.app}"?`)) return;
    setDeleting(true);
    const token = localStorage.getItem("token");
    const res = await deleteDeployment(token, deployment._id);
    setDeleting(false);
    if (res.ok) {
      addToast && addToast(`${deployment.app} deleted`, "success");
      onDeleted && onDeleted();
      onClose && onClose();
    } else {
      addToast && addToast("Delete failed", "error");
    }
  };

  const row = (label, value, color) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: `1px solid ${t.border}` }}>
      <span style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: t.subtext }}>{label}</span>
      <span style={{ fontSize: "0.75rem", color: color || t.text, fontWeight: 600 }}>{value}</span>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "1.5rem", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", fontFamily: "'IBM Plex Mono', monospace", color: t.text }} onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "#3b82f6", marginBottom: "0.3rem" }}>DEPLOYMENT DETAILS</div>
            <h2 style={{ margin: 0, fontSize: "1.1rem", color: t.text, fontWeight: 700 }}>{deployment.app}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: t.subtext, fontSize: "1.2rem", cursor: "pointer" }}>?</button>
        </div>

        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "8px", padding: "0 1rem", marginBottom: "1rem" }}>
          {row("STATUS", deployment.status.toUpperCase(), statusColor(deployment.status))}
          {row("BRANCH", deployment.branch)}
          {row("ENVIRONMENT", deployment.environment)}
          {row("FRAMEWORK", deployment.framework)}
          {row("DURATION", deployment.duration ? `${deployment.duration}s` : "—")}
          {row("DEPLOYED BY", deployment.deployedBy?.name || deployment.deployedBy?.email || "—")}
          {row("CREATED AT", new Date(deployment.createdAt).toLocaleString())}
        </div>

        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", color: t.subtext, marginBottom: "0.5rem" }}>LOGS</div>
          <pre style={{ margin: 0, fontSize: "0.72rem", color: "#94a3b8", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: "100px", overflowY: "auto", lineHeight: 1.6 }}>
            {deployment.logs || "No logs available."}
          </pre>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "0.65rem", background: "rgba(255,255,255,0.05)", border: `1px solid ${t.border}`, borderRadius: "6px", color: t.subtext, cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem" }}>CLOSE</button>
          <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: "0.65rem", background: deleting ? "#7f1d1d" : "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "6px", color: "#ef4444", cursor: deleting ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: "0.75rem", fontWeight: 700 }}>
            {deleting ? "DELETING..." : "DELETE"}
          </button>
        </div>
      </div>
    </div>
  );
}
