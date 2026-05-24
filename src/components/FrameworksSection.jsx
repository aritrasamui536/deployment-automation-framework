import { useState } from 'react';
import { frameworks, categories } from '../data/frameworks';
import FrameworkCard from './FrameworkCard';

export default function FrameworksSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = frameworks.filter(f => {
    const matchCat = activeCategory === 'All' || f.category === activeCategory;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 12 }}>
          // EXPLORE
        </div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          All Frameworks
        </h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: 480, margin: '0 auto' }}>
          Browse top deployment automation tools by category
        </p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search frameworks..."
          style={{
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '10px 16px', color: 'var(--text)',
            fontSize: 14, fontFamily: 'DM Sans', minWidth: 260, outline: 'none',
          }}
        />
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} style={{
            padding: '10px 18px', borderRadius: 8, fontSize: 13,
            fontFamily: 'Syne', fontWeight: 600,
            background: activeCategory === c ? 'var(--accent)' : 'var(--bg3)',
            color: activeCategory === c ? '#fff' : 'var(--text-dim)',
            border: activeCategory === c ? '1px solid var(--accent)' : '1px solid var(--border)',
            transition: 'all 0.2s',
          }}>{c}</button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.25rem',
      }}>
        {filtered.map(fw => <FrameworkCard key={fw.id} fw={fw} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
          No frameworks matched your search.
        </div>
      )}
    </section>
  );
}
