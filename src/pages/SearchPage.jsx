import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DEPARTMENTS, EXECUTIVE_TEAM } from '../data/orgData.js';
import JobDescModal from '../components/JobDescModal.jsx';
import SOPModal from '../components/SOPModal.jsx';

const ALL_POSITIONS = [
  ...EXECUTIVE_TEAM.positions.map(p => ({ ...p, deptId: 'executive', deptTitle: 'Executive Office', deptIcon: '👑', deptColor: '#1a2744' })),
  ...DEPARTMENTS.flatMap(d => d.positions.map(p => ({ ...p, deptId: d.id, deptTitle: d.title, deptIcon: d.icon, deptColor: d.color }))),
];
const ALL_SOPS = DEPARTMENTS.flatMap(d => d.sops.map(s => ({ ...s, deptId: d.id, deptTitle: d.title, deptIcon: d.icon })));

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filter, setFilter] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [positionDept, setPositionDept] = useState('');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { departments: [], positions: [], sops: [] };
    return {
      departments: DEPARTMENTS.filter(d =>
        d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
      ),
      positions: ALL_POSITIONS.filter(p =>
        p.title.toLowerCase().includes(q) || p.purpose?.toLowerCase().includes(q) ||
        p.reportsTo?.toLowerCase().includes(q) || p.responsibilities?.some(r => r.toLowerCase().includes(q))
      ),
      sops: ALL_SOPS.filter(s =>
        s.title.toLowerCase().includes(q) || s.purpose?.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      ),
    };
  }, [query]);

  const totalResults = results.departments.length + results.positions.length + results.sops.length;

  const openPosition = (pos) => {
    setSelectedPosition(pos);
    setPositionDept(pos.deptTitle);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#1a2744', padding: '40px 0', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>🔍 Search</h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setSearchParams({ q: e.target.value }); }}
              placeholder="Search positions, departments, SOPs..."
              style={{
                flex: 1, padding: '14px 20px', borderRadius: 12, border: 'none',
                fontSize: '1rem', background: 'white', color: '#1e293b', outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
              autoFocus
            />
          </div>
          {query && <p style={{ color: '#94a3b8', marginTop: 12, fontSize: '0.9rem' }}>{totalResults} results for "{query}"</p>}
        </div>
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ display: 'flex', gap: 0 }}>
          {[
            ['all', `All (${totalResults})`],
            ['departments', `Departments (${results.departments.length})`],
            ['positions', `Positions (${results.positions.length})`],
            ['sops', `SOPs (${results.sops.length})`],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, color: filter === key ? '#1a2744' : '#64748b',
              borderBottom: filter === key ? '3px solid #c9a84c' : '3px solid transparent',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {!query ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontSize: '1.5rem', color: '#64748b', marginBottom: 8 }}>Search the Organization</h2>
            <p>Find any position, department, or SOP across Jordan Aviation's structure</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 24 }}>
              {['Captain', 'CEO', 'Flight Operations', 'Safety', 'IT', 'SOP', 'HR Manager'].map(s => (
                <button key={s} onClick={() => setQuery(s)} style={{
                  background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 20,
                  padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', color: '#475569',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a2744' && (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                >{s}</button>
              ))}
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>😕</div>
            <p>No results found for "{query}"</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 32 }}>
            {(filter === 'all' || filter === 'departments') && results.departments.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a2744', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  🏢 Departments ({results.departments.length})
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {results.departments.map(d => (
                    <Link key={d.id} to={`/department/${d.id}`} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 48, height: 48, background: d.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{d.icon}</div>
                      <div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a2744' }}>{d.title}</h3>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{d.positions.length} positions</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'positions') && results.positions.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a2744', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  👤 Positions ({results.positions.length})
                </h2>
                <div style={{ display: 'grid', gap: 12 }}>
                  {results.positions.map(pos => (
                    <div key={`${pos.deptId}-${pos.id}`} className="card" style={{ padding: 20, cursor: 'pointer' }} onClick={() => openPosition(pos)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                          <div style={{ width: 40, height: 40, background: `${pos.deptColor}20`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {pos.deptIcon}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a2744', marginBottom: 2 }}>{pos.title}</h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4 }}>{pos.deptTitle} · Reports to: {pos.reportsTo}</p>
                            {pos.purpose && <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>{pos.purpose.substring(0, 120)}...</p>}
                          </div>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', flexShrink: 0 }}>View JD</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'sops') && results.sops.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a2744', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  📋 SOPs ({results.sops.length})
                </h2>
                <div style={{ display: 'grid', gap: 12 }}>
                  {results.sops.map(sop => (
                    <div key={sop.id} className="card" style={{ padding: 20, cursor: 'pointer' }} onClick={() => setSelectedSOP(sop)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                            <span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{sop.id}</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{sop.deptIcon} {sop.deptTitle}</span>
                          </div>
                          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a2744', marginBottom: 4 }}>{sop.title}</h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>{sop.purpose?.substring(0, 120)}...</p>
                        </div>
                        <button className="btn btn-navy" style={{ padding: '6px 12px', fontSize: '0.75rem', flexShrink: 0 }}>View SOP</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedPosition && (
        <JobDescModal position={selectedPosition} departmentTitle={positionDept} onClose={() => setSelectedPosition(null)} />
      )}
      {selectedSOP && (
        <SOPModal sop={selectedSOP} onClose={() => setSelectedSOP(null)} />
      )}
    </div>
  );
}
