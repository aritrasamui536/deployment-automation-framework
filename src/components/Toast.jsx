import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toasts, addToast };
}

function toastColor(type) {
  if (type === "success") return "#22c55e";
  if (type === "error") return "#ef4444";
  if (type === "warning") return "#f59e0b";
  return "#3b82f6";
}

function toastIcon(type) {
  if (type === "success") return "OK";
  if (type === "error") return "ERR";
  if (type === "warning") return "!!!";
  return "INF";
}

export default function Toast({ toasts }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      zIndex: 9999,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: "#0f1117",
          border: `1px solid ${toastColor(t.type)}44`,
          borderLeft: `3px solid ${toastColor(t.type)}`,
          borderRadius: "8px",
          padding: "0.85rem 1.25rem",
          color: "#e2e8f0",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.78rem",
          minWidth: "260px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          animation: "slideIn 0.25s ease",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}>
          <span style={{
            color: toastColor(t.type),
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}>
            {toastIcon(t.type)}
          </span>
          {t.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}