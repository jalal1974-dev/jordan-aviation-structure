import React from 'react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS, EXECUTIVE_TEAM, COMPANY_INFO } from '../data/orgData.js';

export default function TableOfContents() {
  let pageNum = 1;
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#1a2744', padding: '40px 0', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>📑 Table of Contents</h1>
          <p style={{ color: '#94a3b8' }}>Complete index of Jordan Aviation's Organization Structure System</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px', maxWidth: 900 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 20px rgba(0,0,0,0.08)', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: '2px solid #c9a84c' }}>
            <div style={{ fontSize: '3rem' }}>✈</div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a2744' }}>{COMPANY_INFO.name}</h2>
              <p style={{ color: '#64748b' }}>Organization Structure & SOP Manual</p>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Compliant with CARC · IATA · ICAO</p>
            </div>
          </div>

          <TOCSection title="1. Company Overview" page={1}>
            <TOCEntry label="Company Information & History" page={2} />
            <TOCEntry label="Vision, Mission & Values" page={3} />
            <TOCEntry label="IATA & ICAO Regulatory Framework" page={4} />
            <TOCEntry label="Company-Wide Organization Chart" page={5} linkTo="/org-chart" />
          </TOCSection>

          <TOCSection title="2. Executive Leadership" page={7}>
            {EXECUTIVE_TEAM.positions.map((p, i) => (
              <TOCEntry key={p.id} label={p.title} sublabel={`Reports to: ${p.reportsTo}`} page={8 + i} />
            ))}
          </TOCSection>

          <TOCSection title="3. Technical Departments" page={15}>
            {DEPARTMENTS.filter(d => d.category === 'technical').map((dept, di) => (
              <div key={dept.id} style={{ marginBottom: 16 }}>
                <TOCEntry label={`${di + 3}.1 ${dept.icon} ${dept.title}`} page={16 + di * 8} linkTo={`/department/${dept.id}`} isSection />
                <div style={{ paddingLeft: 20 }}>
                  <TOCEntry label="Department Organization Chart" page={17 + di * 8} sublabel="Org chart" />
                  <TOCEntry label="Positions & Job Descriptions" page={18 + di * 8} />
                  {dept.positions.map((p, pi) => (
                    <TOCEntry key={p.id} label={p.title} page={19 + di * 8 + pi} indent sublabel={`Reports to: ${p.reportsTo}`} />
                  ))}
                  <TOCEntry label="Standard Operating Procedures" page={20 + di * 8 + dept.positions.length} />
                  {dept.sops.map((s, si) => (
                    <TOCEntry key={s.id} label={s.title} page={21 + di * 8 + dept.positions.length + si} indent sublabel={s.id} />
                  ))}
                </div>
              </div>
            ))}
          </TOCSection>

          <TOCSection title="4. Safety & Compliance Departments" page={80}>
            {DEPARTMENTS.filter(d => d.category === 'safety-compliance').map((dept, di) => (
              <div key={dept.id} style={{ marginBottom: 16 }}>
                <TOCEntry label={`4.${di + 1} ${dept.icon} ${dept.title}`} page={81 + di * 6} linkTo={`/department/${dept.id}`} isSection />
                <div style={{ paddingLeft: 20 }}>
                  <TOCEntry label="Positions & Job Descriptions" page={82 + di * 6} />
                  {dept.positions.map((p, pi) => (
                    <TOCEntry key={p.id} label={p.title} page={83 + di * 6 + pi} indent sublabel={`Reports to: ${p.reportsTo}`} />
                  ))}
                  {dept.sops.length > 0 && <TOCEntry label="Standard Operating Procedures" page={84 + di * 6 + dept.positions.length} />}
                </div>
              </div>
            ))}
          </TOCSection>

          <TOCSection title="5. Commercial Departments" page={105}>
            {DEPARTMENTS.filter(d => d.category === 'commercial').map((dept, di) => (
              <div key={dept.id} style={{ marginBottom: 16 }}>
                <TOCEntry label={`5.${di + 1} ${dept.icon} ${dept.title}`} page={106 + di * 5} linkTo={`/department/${dept.id}`} isSection />
                <div style={{ paddingLeft: 20 }}>
                  {dept.positions.map((p, pi) => (
                    <TOCEntry key={p.id} label={p.title} page={107 + di * 5 + pi} indent sublabel={`Reports to: ${p.reportsTo}`} />
                  ))}
                </div>
              </div>
            ))}
          </TOCSection>

          <TOCSection title="6. Corporate Support Departments" page={115}>
            {DEPARTMENTS.filter(d => d.category === 'support').map((dept, di) => (
              <div key={dept.id} style={{ marginBottom: 16 }}>
                <TOCEntry label={`6.${di + 1} ${dept.icon} ${dept.title}`} page={116 + di * 4} linkTo={`/department/${dept.id}`} isSection />
                <div style={{ paddingLeft: 20 }}>
                  {dept.positions.map((p, pi) => (
                    <TOCEntry key={p.id} label={p.title} page={117 + di * 4 + pi} indent sublabel={`Reports to: ${p.reportsTo}`} />
                  ))}
                </div>
              </div>
            ))}
          </TOCSection>

          <TOCSection title="7. Appendices" page={130}>
            <TOCEntry label="A — CARC Regulatory References" page={131} />
            <TOCEntry label="B — IATA Applicable Standards" page={133} />
            <TOCEntry label="C — ICAO Annex References" page={135} />
            <TOCEntry label="D — Abbreviations & Glossary" page={137} />
            <TOCEntry label="E — Document Control & Amendment Record" page={140} />
          </TOCSection>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/org-chart" className="btn btn-primary">View Interactive Org Chart</Link>
          <Link to="/search" className="btn btn-navy">Search All Content</Link>
        </div>
      </div>
    </div>
  );
}

function TOCSection({ title, page, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#1a2744', color: 'white', padding: '10px 16px', borderRadius: 8, marginBottom: 8,
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{title}</span>
        <span style={{ color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600 }}>Page {page}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function TOCEntry({ label, sublabel, page, linkTo, isSection, indent }) {
  const style = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: `8px ${indent ? 32 : 16}px`, borderBottom: '1px dotted #e2e8f0',
    gap: 8,
  };
  const content = (
    <div style={{ flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: indent ? '0.8rem' : isSection ? '0.9rem' : '0.85rem', fontWeight: isSection ? 700 : 500, color: isSection ? '#1a2744' : '#475569' }}>{label}</span>
      {sublabel && <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 8 }}>— {sublabel}</span>}
    </div>
  );
  return linkTo ? (
    <Link to={linkTo} style={{ ...style, textDecoration: 'none', transition: 'background 0.15s', borderRadius: 4 }}
      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {content}
      <span style={{ color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600, flexShrink: 0 }}>{page} →</span>
    </Link>
  ) : (
    <div style={style}>
      {content}
      <span style={{ color: '#94a3b8', fontSize: '0.8rem', flexShrink: 0 }}>{page}</span>
    </div>
  );
}
