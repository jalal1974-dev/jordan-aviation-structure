import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DEPARTMENTS } from '../data/orgData.js';
import JobDescModal from '../components/JobDescModal.jsx';
import SOPModal from '../components/SOPModal.jsx';
import DepartmentOrgChart from '../components/DepartmentOrgChart.jsx';

export default function DepartmentPage() {
  const { id } = useParams();
  const dept = DEPARTMENTS.find(d => d.id === id);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [activeTab, setActiveTab] = useState('chart');
  const printRef = useRef();

  if (!dept) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#1a2744', marginBottom: 16 }}>Department not found</h2>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'chart', label: '🗂 Org Chart' },
    { key: 'overview', label: '📋 Overview' },
    { key: 'positions', label: '👥 Positions' },
    { key: 'sops', label: '📄 SOPs' },
  ];

  const handlePrint = () => {
    const printContent = document.getElementById('dept-print-area');
    const originalBody = document.body.innerHTML;
    document.body.innerHTML = `
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; }
        .print-header { background: #1a2744; color: white; padding: 24px; margin-bottom: 24px; border-radius: 8px; }
        .print-header h1 { font-size: 22px; margin: 0 0 6px; }
        .print-header p { color: #94a3b8; margin: 0; font-size: 13px; }
        .print-section { margin-bottom: 32px; }
        .print-section h2 { font-size: 16px; font-weight: 700; color: #1a2744; border-bottom: 2px solid #c9a84c; padding-bottom: 8px; margin-bottom: 16px; }
        .pos-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
        .pos-card h3 { font-size: 14px; font-weight: 700; color: #1a2744; margin: 0 0 4px; }
        .pos-card .reports { font-size: 12px; color: #64748b; margin: 0 0 8px; }
        .pos-card p { font-size: 12px; color: #475569; margin: 0 0 8px; }
        .pos-card ol { font-size: 12px; color: #475569; padding-left: 18px; margin: 0; }
        .pos-card li { margin-bottom: 4px; }
        .kpi-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .kpi { background: #f1f5f9; padding: 3px 10px; border-radius: 12px; font-size: 11px; color: #475569; }
        .sop-card { border: 1px solid #dcfce7; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: #f0fdf4; }
        .sop-card h3 { font-size: 13px; font-weight: 700; color: #15803d; margin: 0 0 8px; }
        .sop-card p { font-size: 12px; color: #475569; margin: 4px 0; }
        .sop-label { font-weight: 700; color: #1a2744; }
        .step { font-size: 12px; color: #475569; margin-bottom: 4px; }
        .carc-note { background: #fefce8; border: 1px solid #fde68a; border-radius: 6px; padding: 10px; margin-top: 8px; font-size: 11px; color: #92400e; }
        @media print { body { padding: 0; } }
      </style>
      ${printContent?.innerHTML || ''}
    `;
    window.print();
    document.body.innerHTML = originalBody;
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{
        background: `linear-gradient(135deg, ${dept.color} 0%, ${dept.accentColor} 100%)`,
        padding: '40px 0', color: 'white',
      }}>
        <div className="container">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            ← Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <div style={{
                width: 72, height: 72, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', flexShrink: 0,
              }}>{dept.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{dept.title}</h1>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {dept.category}
                  </span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600, lineHeight: 1.7, marginBottom: 12 }}>{dept.description}</p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Chip icon="👤" label={`${dept.positions.length} Positions`} />
                  <Chip icon="📋" label={`${dept.sops.length} SOPs`} />
                  <Chip icon="📊" label={`Reports to: ${dept.reportsTo}`} />
                </div>
              </div>
            </div>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.15)', color: 'white',
                border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 10,
                padding: '10px 18px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                backdropFilter: 'blur(8px)', transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              🖨️ Print Department
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 64, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600, color: activeTab === tab.key ? '#1a2744' : '#64748b',
              borderBottom: activeTab === tab.key ? '3px solid #c9a84c' : '3px solid transparent',
              whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {activeTab === 'chart' && <ChartTab dept={dept} onPositionClick={setSelectedPosition} />}
        {activeTab === 'overview' && <OverviewTab dept={dept} onPositionClick={setSelectedPosition} />}
        {activeTab === 'positions' && <PositionsTab dept={dept} onPositionClick={setSelectedPosition} />}
        {activeTab === 'sops' && <SOPsTab dept={dept} onSOPClick={setSelectedSOP} />}
      </div>

      <div id="dept-print-area" style={{ display: 'none' }}>
        <PrintContent dept={dept} />
      </div>

      {selectedPosition && (
        <JobDescModal position={selectedPosition} departmentTitle={dept.title} onClose={() => setSelectedPosition(null)} />
      )}
      {selectedSOP && (
        <SOPModal sop={selectedSOP} onClose={() => setSelectedSOP(null)} />
      )}
    </div>
  );
}

function Chip({ icon, label }) {
  return (
    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 12px', borderRadius: 20, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
      {icon} {label}
    </span>
  );
}

function ChartTab({ dept, onPositionClick }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2744', marginBottom: 4 }}>
            {dept.icon} {dept.title} — Org Chart
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Reporting hierarchy for all {dept.positions.length} positions. Click any node to view the full job description.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 16, height: 16, background: dept.color, borderRadius: 4 }} />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Department Head</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 16, height: 16, background: 'white', border: `2px solid ${dept.color}`, borderRadius: 4 }} />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Staff Positions</span>
          </div>
        </div>
      </div>
      <DepartmentOrgChart dept={dept} onPositionClick={onPositionClick} />
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2744', marginBottom: 14 }}>Position Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {dept.positions.map(p => (
            <button key={p.id} onClick={() => onPositionClick(p)} style={{
              padding: '12px 14px', background: 'white', border: `1.5px solid ${dept.color}30`,
              borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = dept.color; Array.from(e.currentTarget.children).forEach(c => c.style.color = 'white'); }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; Array.from(e.currentTarget.children).forEach(c => c.style.color = ''); }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a2744', lineHeight: 1.3, marginBottom: 3 }}>{p.title}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>→ {p.reportsTo}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ dept, onPositionClick }) {
  const headPosition = dept.positions.find(p => p.id === dept.headId) || dept.positions[0];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2744', marginBottom: 16 }}>Department Head</h3>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 52, height: 52, background: `${dept.color}20`, borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
          }}>👔</div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a2744', marginBottom: 4 }}>{headPosition?.title}</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 8 }}>Reports to: {headPosition?.reportsTo}</p>
            <button onClick={() => onPositionClick(headPosition)} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              View Job Description
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2744', marginBottom: 16 }}>Quick Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Total Positions', value: dept.positions.length, icon: '👥' },
            { label: 'SOPs Available', value: dept.sops.length, icon: '📋' },
            { label: 'Reports To', value: dept.reportsTo, icon: '📊' },
            { label: 'Category', value: dept.category, icon: '🏷️' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a2744' }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 24, gridColumn: '1/-1' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2744', marginBottom: 16 }}>All Positions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {dept.positions.map(p => (
            <button key={p.id} onClick={() => onPositionClick(p)} style={{
              padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = dept.color; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = ''; }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>→ {p.reportsTo}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PositionsTab({ dept, onPositionClick }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2744', marginBottom: 8 }}>All Positions — {dept.title}</h2>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>Click any position to view the full job description.</p>
      <div style={{ display: 'grid', gap: 16 }}>
        {dept.positions.map(pos => (
          <div key={pos.id} className="card" style={{ padding: 24, cursor: 'pointer' }} onClick={() => onPositionClick(pos)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 40, height: 40, background: `${dept.color}15`, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem',
                  }}>👤</div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2744' }}>{pos.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Reports to: {pos.reportsTo}</p>
                  </div>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 600 }}>{pos.purpose}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); onPositionClick(pos); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', flexShrink: 0 }}>
                View Job Description
              </button>
            </div>
            {pos.kpis && pos.kpis.length > 0 && (
              <div style={{ marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>KPIs</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {pos.kpis.slice(0, 4).map((kpi, i) => (
                    <span key={i} style={{ background: `${dept.color}15`, color: dept.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 500 }}>
                      {kpi}
                    </span>
                  ))}
                  {pos.kpis.length > 4 && <span style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '3px 8px' }}>+{pos.kpis.length - 4} more</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SOPsTab({ dept, onSOPClick }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2744', marginBottom: 8 }}>Standard Operating Procedures — {dept.title}</h2>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>All SOPs comply with CARC regulations and international aviation standards (IATA/ICAO).</p>
      {dept.sops.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Procedure Manuals Referenced</p>
          <p style={{ fontSize: '0.875rem' }}>SOPs for this department are maintained in departmental procedure manuals per CARC requirements.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {dept.sops.map(sop => (
            <div key={sop.id} className="card" style={{ padding: 24, cursor: 'pointer' }} onClick={() => onSOPClick(sop)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700 }}>{sop.id}</div>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2744', marginBottom: 8 }}>{sop.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>{sop.purpose}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); onSOPClick(sop); }} className="btn btn-navy" style={{ padding: '8px 16px', fontSize: '0.8rem', flexShrink: 0 }}>
                  View SOP
                </button>
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['🔭', 'Scope defined'], ['👤', 'Responsibilities mapped'], ['📋', `${sop.procedures?.length || 0} steps`], ['🛡️', 'Safety included'], ['⚖️', 'CARC compliant']].map(([icon, label], i) => (
                  <span key={i} style={{ background: '#f1f5f9', color: '#64748b', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PrintContent({ dept }) {
  return (
    <div>
      <div className="print-header">
        <h1>✈ Jordan Aviation Airline — {dept.title}</h1>
        <p>Organization Structure, Job Descriptions & Standard Operating Procedures | CARC · IATA · ICAO Compliant | 2026</p>
      </div>

      <div className="print-section">
        <h2>Department Overview</h2>
        <p><strong>Description:</strong> {dept.description}</p>
        <p><strong>Reports to:</strong> {dept.reportsTo} &nbsp;|&nbsp; <strong>Category:</strong> {dept.category} &nbsp;|&nbsp; <strong>Positions:</strong> {dept.positions.length} &nbsp;|&nbsp; <strong>SOPs:</strong> {dept.sops.length}</p>
      </div>

      <div className="print-section">
        <h2>Reporting Hierarchy</h2>
        {dept.positions.map((p, i) => (
          <p key={i} style={{ fontSize: '12px', marginBottom: '4px' }}>
            {i + 1}. <strong>{p.title}</strong> → Reports to: {p.reportsTo}
          </p>
        ))}
      </div>

      <div className="print-section">
        <h2>Job Descriptions</h2>
        {dept.positions.map((pos, i) => (
          <div key={pos.id} className="pos-card">
            <h3>{i + 1}. {pos.title}</h3>
            <p className="reports">Reports to: {pos.reportsTo}</p>
            <p><span style={{ fontWeight: 700 }}>Purpose:</span> {pos.purpose}</p>
            <p style={{ fontWeight: 700, marginBottom: '6px' }}>Key Responsibilities:</p>
            <ol>
              {(pos.responsibilities || []).map((r, ri) => <li key={ri}>{r}</li>)}
            </ol>
            <p style={{ marginTop: '8px' }}><span style={{ fontWeight: 700 }}>Qualifications:</span> {pos.qualifications}</p>
            <p><span style={{ fontWeight: 700 }}>Experience:</span> {pos.experience}</p>
            {pos.kpis?.length > 0 && (
              <div>
                <p style={{ fontWeight: 700, marginBottom: '4px' }}>KPIs:</p>
                <div className="kpi-list">
                  {pos.kpis.map((k, ki) => <span key={ki} className="kpi">{k}</span>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {dept.sops.length > 0 && (
        <div className="print-section">
          <h2>Standard Operating Procedures</h2>
          {dept.sops.map(sop => (
            <div key={sop.id} className="sop-card">
              <h3>{sop.title}</h3>
              <p><span className="sop-label">Purpose:</span> {sop.purpose}</p>
              <p><span className="sop-label">Scope:</span> {sop.scope}</p>
              <p><span className="sop-label">Responsibilities:</span> {sop.responsibilities}</p>
              {sop.procedures?.length > 0 && (
                <div>
                  <p style={{ fontWeight: 700, margin: '8px 0 4px' }}>Step-by-Step Procedures:</p>
                  {sop.procedures.map((step, si) => (
                    <p key={si} className="step">{si + 1}. {step}</p>
                  ))}
                </div>
              )}
              <p style={{ marginTop: '6px' }}><span className="sop-label">Safety:</span> {sop.safetyRequirements}</p>
              <div className="carc-note">CARC Compliance: {sop.carcCompliance}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
