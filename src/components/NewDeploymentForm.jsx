import { useState } from "react";
import { createDeployment } from "../services/api";

export default function NewDeploymentForm({ onClose, onCreated, addToast }) {
  const [form, setForm] = useState({
    app: "", branch: "main", environment: "staging", framework: "github-actions",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.app.trim()) { addToast && addToast("App name required", "error"); return; }
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await createDeployment(token, form);
    setLoading(false);
    if (res._id) {
      addToast && addToast(`${form.app} deployment created!`, "success");
      onCreated && onCreated();
      onClose && onClose();
    } else {
      addToast && addToast("Failed to create deployment", "error");
    }
  };

  const field = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px", padding: "0.6rem 0.9rem", color: "#e2e8f0",
    fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.8rem", outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#0f1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
        padding: "2rem", width: "100%", maxWidth: "460px", fontFamily: "'IBM Plex Mono', monospace",
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "#3b82f6", marginBottom: "0.3rem" }}>NEW DEPLOYMENT</div>
            <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#e2e8f0", fontWeight: 700 }}>Create Deployment</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: "1.2rem", cursor: "pointer" }}>?</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem" }}>APP NAME</label>
            <input style={field} placeholder="e.g. frontend/web-app" value={form.app}
              onChange={e => setForm({ ...form, app: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem" }}>BRANCH</label>
            <input style={field} placeholder="e.g. main" value={form.branch}
              onChange={e => setForm({ ...form, branch: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem" }}>ENVIRONMENT</label>
            <select style={field} value={form.environment} onChange={e => setForm({ ...form, environment: e.target.value })}>
              <option value="development">development</option>
              <option value="staging">staging</option>
              <option value="production">production</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem" }}>FRAMEWORK</label>
            <select style={field} value={form.framework} onChange={e => setForm({ ...form, framework: e.target.value })}>
              <option value="github-actions">GitHub Actions</option>
              <option value="jenkins">Jenkins</option>
              <option value="terraform">Terraform</option>
              <option value="ansible">Ansible</option>
              <option value="argocd">ArgoCD</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "0.65rem", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px",
            color: "#94a3b8", cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem",
          }}>CANCEL</button>
          <button onClick={handleSubmit} disabled={loading} style={{
            flex: 2, padding: "0.65rem", background: loading ? "#1d4ed8" : "#3b82f6",
            border: "none", borderRadius: "6px", color: "#fff",
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
          }}>{loading ? "CREATING..." : "CREATE DEPLOYMENT"}</button>
        </div>
      </div>
    </div>
  );
}
