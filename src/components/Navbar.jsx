import { useState } from "react";

export default function Navbar({ activeSection, setActiveSection, darkMode, setDarkMode, user, handleLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const links = ["Frameworks", "Pipeline", "Compare", "Docs", "Dashboard", "Logs"];

  const searchItems = [
    { label: "Jenkins", section: "frameworks" },
    { label: "GitHub Actions", section: "frameworks" },
    { label: "Terraform", section: "frameworks" },
    { label: "Ansible", section: "frameworks" },
    { label: "ArgoCD", section: "frameworks" },
    { label: "Pipeline Simulator", section: "pipeline" },
    { label: "Compare Frameworks", section: "compare" },
    { label: "Code Snippets", section: "docs" },
    { label: "Dashboard", section: "dashboard" },
  ];

  const filtered = searchQuery
    ? searchItems.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleNav = (section) => {
    setActiveSection(section);
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "var(--nav-bg)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "60px", transition: "background 0.3s",
      }}>

        {/* Logo */}
        <div onClick={() => handleNav("hero")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, fontFamily: "Space Mono", color: "#fff",
          }}>DA</div>
          <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em", color: "var(--text)" }}>
            Deploy<span style={{ color: "var(--accent)" }}>Forge</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", gap: "4px" }} className="desktop-nav">
          {links.map(l => (
            <button key={l}
              onClick={() => handleNav(l.toLowerCase())}
              style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 13,
                fontFamily: "DM Sans", fontWeight: 500,
                background: activeSection === l.toLowerCase() ? "rgba(79,142,247,0.15)" : "transparent",
                color: activeSection === l.toLowerCase() ? "var(--accent)" : "var(--text-dim)",
                border: activeSection === l.toLowerCase() ? "1px solid rgba(79,142,247,0.3)" : "1px solid transparent",
                transition: "all 0.2s", cursor: "pointer",
              }}
            >{l}</button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

          {/* Dark/Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: 64, height: 32, borderRadius: 100,
              background: darkMode ? "#1E293B" : "#E2E8F0",
              border: "1px solid var(--border)",
              cursor: "pointer", position: "relative",
              transition: "all 0.3s", flexShrink: 0,
            }}
          >
           <div style={{
              position: 'absolute', top: 3,
              left: darkMode ? 3 : 33,
              width: 24, height: 24, borderRadius: '50%',
              background: darkMode ? '#4F8EF7' : '#FBBF24',
              transition: 'left 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13,
            }}>
             {darkMode ? '◐' : '◑'}
            </div>
          </button>

          <span style={{ fontSize: 11, fontFamily: 'Space Mono', color: 'var(--text-dim)' }}>
            {darkMode ? 'D' : 'L'}
          </span>

          {/* Login / User Info */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--text-dim)", fontSize: 13, fontFamily: "DM Sans" }}>
                ?? {user.name}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 13,
                  fontFamily: "DM Sans", fontWeight: 500,
                  background: "rgba(255,80,80,0.15)",
                  color: "#ff5050",
                  border: "1px solid rgba(255,80,80,0.3)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >Logout</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => handleNav("login")}
                style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 13,
                  fontFamily: "DM Sans", fontWeight: 500,
                  background: "transparent",
                  color: "var(--text-dim)",
                  border: "1px solid var(--border)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >Login</button>
              <button
                onClick={() => handleNav("register")}
                style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 13,
                  fontFamily: "DM Sans", fontWeight: 500,
                  background: "var(--accent)",
                  color: "#fff",
                  border: "1px solid transparent",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >Register</button>
            </div>
          )}

        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, zIndex: 99,
          background: "var(--bg2)", borderBottom: "1px solid var(--border)",
          padding: "1rem",
        }}>
          {links.map(l => (
            <button key={l}
              onClick={() => handleNav(l.toLowerCase())}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "12px 16px", borderRadius: 8, marginBottom: 4,
                fontFamily: "DM Sans", fontWeight: 500, fontSize: 15,
                background: activeSection === l.toLowerCase() ? "rgba(79,142,247,0.1)" : "transparent",
                color: activeSection === l.toLowerCase() ? "var(--accent)" : "var(--text)",
                border: "none", cursor: "pointer",
              }}
            >{l}</button>
          ))}
          {!user ? (
            <>
              <button onClick={() => handleNav("login")} style={{ display: "block", width: "100%", padding: "12px 16px", borderRadius: 8, marginBottom: 4, fontFamily: "DM Sans", fontSize: 15, background: "transparent", color: "var(--text)", border: "none", cursor: "pointer", textAlign: "left" }}>Login</button>
              <button onClick={() => handleNav("register")} style={{ display: "block", width: "100%", padding: "12px 16px", borderRadius: 8, fontFamily: "DM Sans", fontSize: 15, background: "var(--accent)", color: "#fff", border: "none", cursor: "pointer", textAlign: "left" }}>Register</button>
            </>
          ) : (
            <button onClick={handleLogout} style={{ display: "block", width: "100%", padding: "12px 16px", borderRadius: 8, fontFamily: "DM Sans", fontSize: 15, background: "rgba(255,80,80,0.15)", color: "#ff5050", border: "none", cursor: "pointer", textAlign: "left" }}>Logout</button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}

