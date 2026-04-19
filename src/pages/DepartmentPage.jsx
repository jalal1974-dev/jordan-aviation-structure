import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DEPARTMENTS } from '../data/orgData.js';
import JobDescModal from '../components/JobDescModal.jsx';
import SOPModal from '../components/SOPModal.jsx';

export default function DepartmentPage() {
  const { id } = useParams();
  const dept = DEPARTMENTS.find(d => d.id === id);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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

  const tabs = ['overview', 'positions', 'sops'];

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
        </div>
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ display: 'flex', gap: 0 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '16px 24px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: 600, color: activeTab === tab ? '#1a2744' : '#64748b',
              borderBottom: activeTab === tab ? '3px solid #c9a84c' : '3px solid transparent',
              textTransform: 'capitalize', transition: 'all 0.15s',
            }}>
              {tab === 'overview' ? '📋 Overview' : tab === 'positions' ? '👥 Positions' : '📄 SOPs'}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {activeTab === 'overview' && <OverviewTab dept={dept} onPositionClick={setSelectedPosition} />}
        {activeTab === 'positions' && <PositionsTab dept={dept} onPositionClick={setSelectedPosition} />}
        {activeTab === 'sops' && <SOPsTab dept={dept} onSOPClick={setSelectedSOP} />}
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
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
          <p>SOPs for this department are maintained in departmental procedure manuals.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {dept.sops.map(sop => (
            <div key={sop.id} className="card" style={{ padding: 24, cursor: 'pointer' }} onClick={() => onSOPClick(sop)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{
                      background: '#dcfce7', color: '#16a34a', padding: '6px 12px',
                      borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
                    }}>{sop.id}</div>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2744', marginBottom: 8 }}>{sop.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>{sop.purpose}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); onSOPClick(sop); }} className="btn btn-navy" style={{ padding: '8px 16px', fontSize: '0.8rem', flexShrink: 0 }}>
                  View SOP
                </button>
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['🔭', 'Scope defined'], ['👤', 'Responsibilities mapped'], ['📋', `${sop.procedures?.length || 0} procedure steps`], ['🛡️', 'Safety requirements included'], ['⚖️', 'CARC compliant']].map(([icon, label], i) => (
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
