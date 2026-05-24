import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "2rem",
        width: "42px",
        height: "42px",
        borderRadius: "8px",
        background: "rgba(59,130,246,0.15)",
        border: "1px solid rgba(59,130,246,0.3)",
        color: "#3b82f6",
        fontSize: "1.1rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        transition: "background 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.25)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; e.currentTarget.style.transform = "none"; }}
    >
      ↑
    </button>
  );
}