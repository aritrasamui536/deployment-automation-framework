import { useState } from 'react';

export default function Navbar({ activeSection, setActiveSection, darkMode, setDarkMode, showToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const links = ['Frameworks', 'Pipeline', 'Compare', 'Docs', 'Dashboard'];

  const searchItems = [
    { label: 'Jenkins', section: 'frameworks' },
    { label: 'GitHub Actions', section: 'frameworks' },
    { label: 'Terraform', section: 'frameworks' },
    { label: 'Ansible', section: 'frameworks' },
    { label: 'ArgoCD', section: 'frameworks' },
    { label: 'Pipeline Simulator', section: 'pipeline' },
    { label: 'Compare Frameworks', section: 'compare' },
    { label: 'Code Snippets', section: 'docs' },
    { label: 'Dashboard', section: 'dashboard' },
  ];

  const filtered = searchQuery
    ? searchItems.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleNav = (section) => {
    setActiveSection(section);
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px', transition: 'background 0.3s',
      }}>

        {/* Logo */}
        <div onClick={() => handleNav('hero')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, fontFamily: 'Space Mono', color: '#fff',
          }}>DA</div>
          <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            Deploy<span style={{ color: 'var(--accent)' }}>Forge</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', gap: '4px' }} className="desktop-nav">
          {links.map(l => (
            <button key={l}
              onClick={() => handleNav(l.toLowerCase())}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 13,
                fontFamily: 'DM Sans', fontWeight: 500,
                background: activeSection === l.toLowerCase() ? 'rgba(79,142,247,0.15)' : 'transparent',
                color: activeSection === l.toLowerCase() ? 'var(--accent)' : 'var(--text-dim)',
                border: activeSection === l.toLowerCase() ? '1px solid rgba(79,142,247,0.3)' : '1px solid transparent',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
            >{l}</button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: searchOpen ? 'rgba(79,142,247,0.15)' : 'var(--bg3)',
              border: '1px solid var(--border)',
              color: searchOpen ? 'var(--accent)' : 'var(--text-dim)',
              cursor: 'pointer', fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >🔍</button>

          {/* Dark/Light Toggle */}
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              showToast(`Switched to ${!darkMode ? 'Dark' : 'Light'} mode`, 'info');
            }}
            style={{
              width: 64, height: 32, borderRadius: 100,
              background: darkMode ? '#1E293B' : '#E2E8F0',
              border: '1px solid var(--border)',
              cursor: 'pointer', position: 'relative',
              transition: 'all 0.3s', flexShrink: 0,
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

          {/* Get Started */}
          <button
            onClick={() => { handleNav('frameworks'); showToast('Welcome to Frameworks!', 'success'); }}
            style={{
              padding: '6px 14px', borderRadius: 6,
              background: 'var(--accent)', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Syne',
              border: 'none', color: '#fff', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >⚡ Get Started</button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none', width: 32, height: 32, borderRadius: 6,
              background: 'var(--bg3)', border: '1px solid var(--border)',
              color: 'var(--text)', cursor: 'pointer', fontSize: 16,
              alignItems: 'center', justifyContent: 'center',
            }}
            className="mobile-menu-btn"
          >{mobileOpen ? '✕' : '☰'}</button>
        </div>
      </nav>

      {/* Search Dropdown */}
      {searchOpen && (
        <div style={{
          position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, zIndex: 99,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
          animation: 'fadeDown 0.2s ease',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--text-dim)', fontSize: 16 }}>🔍</span>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search frameworks, tools..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: 'var(--text)', fontSize: 14, fontFamily: 'DM Sans',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
            )}
          </div>
          {filtered.length > 0 ? (
            filtered.map(item => (
              <div key={item.label}
                onClick={() => handleNav(item.section)}
                style={{
                  padding: '11px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s',
                  color: 'var(--text)', fontSize: 14,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 16 }}>🔧</span>
                {item.label}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Space Mono' }}>{item.section}</span>
              </div>
            ))
          ) : searchQuery ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
              No results for "{searchQuery}"
            </div>
          ) : (
            <div style={{ padding: '1rem 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Space Mono', marginBottom: 8, letterSpacing: '0.05em' }}>QUICK LINKS</div>
              {searchItems.slice(0, 5).map(item => (
                <div key={item.label}
                  onClick={() => handleNav(item.section)}
                  style={{
                    padding: '8px 0', cursor: 'pointer',
                    color: 'var(--text-dim)', fontSize: 13,
                    display: 'flex', gap: 8, alignItems: 'center',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                >
                  → {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99,
          background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
          padding: '1rem',
          animation: 'fadeDown 0.2s ease',
        }}>
          {links.map(l => (
            <button key={l}
              onClick={() => handleNav(l.toLowerCase())}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '12px 16px', borderRadius: 8, marginBottom: 4,
                fontFamily: 'DM Sans', fontWeight: 500, fontSize: 15,
                background: activeSection === l.toLowerCase() ? 'rgba(79,142,247,0.1)' : 'transparent',
                color: activeSection === l.toLowerCase() ? 'var(--accent)' : 'var(--text)',
                border: 'none', cursor: 'pointer',
              }}
            >{l}</button>
          ))}
        </div>
      )}

      {/* Click outside to close search */}
      {searchOpen && (
        <div onClick={() => setSearchOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
      )}

      <style>{`
        @keyframes fadeDown {
          from { opacity:0; transform: translateY(-8px) translateX(-50%); }
          to { opacity:1; transform: translateY(0) translateX(-50%); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}