import React, { useState, useMemo } from 'react';
import { DEPARTMENTS, EXECUTIVE_TEAM } from '../data/orgData.js';
import JobDescModal from '../components/JobDescModal.jsx';
import { useLang } from '../context/LanguageContext.jsx';

function getSeniorityLevel(title) {
  const t = title.toLowerCase();
  if (t.includes('chief') || t.includes('ceo') || t.includes('coo') || t.includes('cfo') || t.includes('cco') || t.includes('cto') || t.includes('cio') || t.includes('chairman')) return 'cSuite';
  if (t.includes('vp ') || t.startsWith('vp') || t.includes('vice president')) return 'vp';
  if (t.includes('director')) return 'director';
  if (t.includes('manager') || t.includes('supervisor')) return 'manager';
  if (t.includes('officer') || t.includes('specialist') || t.includes('analyst') || t.includes('engineer') || t.includes('coordinator')) return 'officer';
  if (t.includes('captain') || t.includes('pilot') || t.includes('first officer') || t.includes('purser') || t.includes('crew') || t.includes('dispatcher') || t.includes('technician')) return 'pilot';
  return 'staff';
}

const LEVEL_ORDER = { cSuite: 0, vp: 1, director: 2, manager: 3, officer: 4, pilot: 5, staff: 6 };

const LEVEL_COLORS = {
  cSuite: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  vp: { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
  director: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  manager: { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
  officer: { bg: '#f0f9ff', text: '#0369a1', border: '#7dd3fc' },
  pilot: { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
  staff: { bg: '#f8fafc', text: '#475569', border: '#cbd5e1' },
};

export default function EmployeeDirectoryPage() {
  const { t } = useLang();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [sortBy, setSortBy] = useState('dept');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedDeptTitle, setSelectedDeptTitle] = useState('');

  const allPositions = useMemo(() => {
    const rows = [];
    EXECUTIVE_TEAM.positions.forEach(p => {
      rows.push({
        ...p,
        deptId: 'executive',
        deptTitle: 'Executive Office',
        deptIcon: '👑',
        deptColor: '#1a2744',
        category: 'executive',
        level: getSeniorityLevel(p.title),
      });
    });
    DEPARTMENTS.forEach(dept => {
      dept.positions.forEach(p => {
        rows.push({
          ...p,
          deptId: dept.id,
          deptTitle: dept.title,
          deptIcon: dept.icon,
          deptColor: dept.color,
          category: dept.category,
          level: getSeniorityLevel(p.title),
        });
      });
    });
    return rows;
  }, []);

  const filtered = useMemo(() => {
    let rows = allPositions;

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.deptTitle.toLowerCase().includes(q) ||
        r.reportsTo?.toLowerCase().includes(q) ||
        r.purpose?.toLowerCase().includes(q)
      );
    }
    if (filterDept) rows = rows.filter(r => r.deptId === filterDept);
    if (filterCat) rows = rows.filter(r => r.category === filterCat);
    if (filterLevel) rows = rows.filter(r => r.level === filterLevel);

    rows = [...rows].sort((a, b) => {
      if (sortBy === 'dept') return a.deptTitle.localeCompare(b.deptTitle) || LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'level') return LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || a.deptTitle.localeCompare(b.deptTitle);
      return 0;
    });

    return rows;
  }, [allPositions, search, filterDept, filterCat, filterLevel, sortBy]);

  const deptOptions = [
    { value: 'executive', label: `👑 Executive Office` },
    ...DEPARTMENTS.map(d => ({ value: d.id, label: `${d.icon} ${d.title}` })),
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a2744 0%, #2d4a7a 100%)',
        padding: '48px 0 40px', color: 'white',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{
              width: 56, height: 56, background: 'rgba(201,168,76,0.2)',
              borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
            }}>👥</div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>{t.directory.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', maxWidth: 600 }}>{t.directory.subtitle}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            <StatBadge label={t.directory.totalPositions} value={allPositions.length} />
            <StatBadge label={t.stats?.departments || 'Departments'} value={16} />
            {Object.keys(LEVEL_ORDER).map(lvl => {
              const count = allPositions.filter(p => p.level === lvl).length;
              if (!count) return null;
              return <StatBadge key={lvl} label={t.levels[lvl]} value={count} small />;
            })}
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 0', position: 'sticky', top: 64, zIndex: 99 }}>
        <div className="container" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.directory.searchPlaceholder}
            style={{
              padding: '9px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0',
              fontSize: '0.875rem', flex: '1 1 200px', minWidth: 160, outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#1a2744'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />

          <Select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            options={deptOptions}
            placeholder={t.directory.filterDept}
          />
          <Select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            options={[
              { value: 'executive', label: 'Executive' },
              { value: 'technical', label: t.common.technical },
              { value: 'non-technical', label: t.common.nonTechnical },
            ]}
            placeholder={t.directory.filterCat}
          />
          <Select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            options={Object.keys(LEVEL_ORDER).map(lvl => ({ value: lvl, label: t.levels[lvl] }))}
            placeholder={t.directory.filterLevel}
          />
          <Select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            options={[
              { value: 'dept', label: `${t.directory.sortBy}: ${t.directory.sortDept}` },
              { value: 'title', label: `${t.directory.sortBy}: ${t.directory.sortTitle}` },
              { value: 'level', label: `${t.directory.sortBy}: ${t.directory.sortLevel}` },
            ]}
            placeholder=""
          />

          {(search || filterDept || filterCat || filterLevel) && (
            <button
              onClick={() => { setSearch(''); setFilterDept(''); setFilterCat(''); setFilterLevel(''); }}
              style={{
                padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0',
                background: '#f8fafc', cursor: 'pointer', fontSize: '0.8rem', color: '#64748b',
                fontWeight: 600,
              }}
            >
              ✕ Clear
            </button>
          )}

          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto' }}>
            {filtered.length} {t.directory.totalPositions.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: '24px' }}>
        <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 16 }}>
          💡 {t.directory.clickToView}
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>{t.directory.noResults}</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1.8fr 1fr 1fr 1.5fr 80px',
              background: '#1a2744', color: 'white', padding: '12px 16px',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
            }}>
              <span>{t.directory.tableTitle}</span>
              <span>{t.directory.tableDept}</span>
              <span>{t.directory.tableCategory}</span>
              <span>{t.directory.tableLevel}</span>
              <span>{t.directory.tableReports}</span>
              <span style={{ textAlign: 'center' }}>{t.directory.tableAction}</span>
            </div>

            {filtered.map((pos, i) => {
              const lc = LEVEL_COLORS[pos.level];
              const isAlt = i % 2 === 1;
              return (
                <div
                  key={`${pos.deptId}-${pos.id}`}
                  onClick={() => { setSelectedPosition(pos); setSelectedDeptTitle(pos.deptTitle); }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5fr 1.8fr 1fr 1fr 1.5fr 80px',
                    padding: '12px 16px', alignItems: 'center',
                    background: isAlt ? '#f8fafc' : 'white',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer', transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                  onMouseLeave={e => e.currentTarget.style.background = isAlt ? '#f8fafc' : 'white'}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#1a2744', fontSize: '0.875rem', lineHeight: 1.3 }}>{pos.title}</div>
                    {pos.purpose && (
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2, lineHeight: 1.4, maxWidth: 340,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pos.purpose}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '1rem' }}>{pos.deptIcon}</span>
                    <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>{pos.deptTitle}</span>
                  </div>
                  <div>
                    <span style={{
                      background: pos.category === 'technical' ? '#dbeafe' : pos.category === 'executive' ? '#fef3c7' : '#f0fdf4',
                      color: pos.category === 'technical' ? '#1e40af' : pos.category === 'executive' ? '#92400e' : '#15803d',
                      padding: '3px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
                    }}>
                      {pos.category === 'executive' ? 'Executive' : pos.category === 'technical' ? t.common.technical : t.common.nonTechnical}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      background: lc.bg, color: lc.text,
                      border: `1px solid ${lc.border}`,
                      padding: '3px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
                    }}>
                      {t.levels[pos.level]}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {pos.reportsTo || '—'}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedPosition(pos); setSelectedDeptTitle(pos.deptTitle); }}
                      style={{
                        background: '#1a2744', color: '#c9a84c',
                        border: 'none', borderRadius: 6, padding: '5px 10px',
                        fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.12s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#c9a84c'; e.currentTarget.style.color = '#1a2744'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#1a2744'; e.currentTarget.style.color = '#c9a84c'; }}
                    >
                      {t.directory.tableAction}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 24, background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '16px 20px' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a2744', marginBottom: 10 }}>Seniority Level Legend</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.keys(LEVEL_ORDER).map(lvl => {
              const lc = LEVEL_COLORS[lvl];
              const count = allPositions.filter(p => p.level === lvl).length;
              return (
                <button key={lvl}
                  onClick={() => setFilterLevel(filterLevel === lvl ? '' : lvl)}
                  style={{
                    background: filterLevel === lvl ? lc.text : lc.bg,
                    color: filterLevel === lvl ? 'white' : lc.text,
                    border: `1.5px solid ${lc.border}`,
                    padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
                  }}
                >
                  {t.levels[lvl]} <span style={{ opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedPosition && (
        <JobDescModal
          position={selectedPosition}
          departmentTitle={selectedDeptTitle}
          onClose={() => setSelectedPosition(null)}
        />
      )}
    </div>
  );
}

function StatBadge({ label, value, small }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: small ? '6px 12px' : '8px 16px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: small ? '1rem' : '1.3rem', fontWeight: 800, color: '#c9a84c' }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>{label}</div>
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0',
        fontSize: '0.85rem', background: 'white', color: '#334155',
        cursor: 'pointer', outline: 'none', flex: '0 0 auto',
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
