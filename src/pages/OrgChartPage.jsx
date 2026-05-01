import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../data/orgData.js';
import CompanyHierarchyChart from '../components/CompanyHierarchyChart.jsx';
import JobDescModal from '../components/JobDescModal.jsx';

const W = 3400;
const ROW_H = 140;
const COL_W = 160;
const COL_GAP = 22;
const UNIT = COL_W + COL_GAP;

const technicalDepts  = DEPARTMENTS.filter(d => d.category === 'technical');
const safetyDepts     = DEPARTMENTS.filter(d => d.category === 'safety-compliance');
const ccoDepts        = DEPARTMENTS.filter(d => d.category === 'commercial');
const financeDept     = DEPARTMENTS.filter(d => d.id === 'finance');
const legalDept       = DEPARTMENTS.filter(d => d.id === 'legal');
const amSupportDepts  = DEPARTMENTS.filter(d =>
  d.category === 'support' && d.id !== 'finance' && d.id !== 'legal'
);

function buildPositions() {
  const pos = {};
  const CEO_X = W / 2;
  pos['board']    = { x: CEO_X, y: 60 };
  pos['chairman'] = { x: CEO_X, y: 60 + ROW_H };
  pos['ceo']      = { x: CEO_X, y: 60 + ROW_H * 2 };
  pos['cfo']   = { x: 280,  y: 60 + ROW_H * 3 };
  pos['am']    = { x: 1480, y: 60 + ROW_H * 3 };
  pos['legal_node'] = { x: 2420, y: 60 + ROW_H * 3 };
  pos['cco']   = { x: 3150, y: 60 + ROW_H * 3 };

  financeDept.forEach((d) => {
    pos[d.id] = { x: 280, y: 60 + ROW_H * 4 };
  });

  const opCount  = technicalDepts.length + safetyDepts.length;
  const opStartX = pos['am'].x - ((opCount - 1) * UNIT) / 2;
  technicalDepts.forEach((d, i) => {
    pos[d.id] = { x: opStartX + i * UNIT, y: 60 + ROW_H * 4 };
  });
  safetyDepts.forEach((d, i) => {
    pos[d.id] = { x: opStartX + (technicalDepts.length + i) * UNIT, y: 60 + ROW_H * 4 };
  });

  const supCount  = amSupportDepts.length;
  const supStartX = pos['am'].x - ((supCount - 1) * UNIT) / 2;
  amSupportDepts.forEach((d, i) => {
    pos[d.id] = { x: supStartX + i * UNIT, y: 60 + ROW_H * 5 };
  });

  const ccoCount  = ccoDepts.length;
  const ccoStartX = pos['cco'].x - ((ccoCount - 1) * UNIT) / 2;
  ccoDepts.forEach((d, i) => {
    pos[d.id] = { x: ccoStartX + i * UNIT, y: 60 + ROW_H * 4 };
  });

  return pos;
}

const POSITIONS = buildPositions();

const LINKS = [
  ['board', 'chairman'],
  ['chairman', 'ceo'],
  ['ceo', 'cfo'],
  ['ceo', 'am'],
  ['ceo', 'legal_node'],
  ['ceo', 'cco'],
  ...financeDept.map(d => ['cfo', d.id]),
  ...technicalDepts.map(d => ['am', d.id]),
  ...safetyDepts.map(d => ['am', d.id]),
  ...amSupportDepts.map(d => ['am', d.id]),
  ...legalDept.map(d => ['legal_node', d.id]),
  ...ccoDepts.map(d => ['cco', d.id]),
];

const EXEC_NODES = [
  { id: 'board',      label: 'Board of Directors',           color: '#0f1829', textColor: 'white' },
  { id: 'chairman',   label: 'Chairman',                     color: '#1a2744', textColor: 'white' },
  { id: 'ceo',        label: 'President & CEO',              color: '#c9a84c', textColor: '#0f1829' },
  { id: 'am',         label: 'Accountable Manager (GM)',     color: '#1a2744', textColor: 'white' },
  { id: 'cfo',        label: 'CFO',                          color: '#1a2744', textColor: 'white' },
  { id: 'legal_node', label: 'Legal Affairs',                color: '#5c4827', textColor: 'white' },
  { id: 'cco',        label: 'CCO',                          color: '#1a2744', textColor: 'white' },
];

const TABS = [
  { key: 'dept', label: '🏢 Department Overview' },
  { key: 'full', label: '🌳 Full Position Hierarchy' },
];

export default function OrgChartPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dept');
  const [zoom, setZoom]       = useState(0.55);
  const [pan, setPan]         = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedDeptTitle, setSelectedDeptTitle] = useState('');

  const handleMouseDown = e => {
    if (e.target.closest('.node')) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = e => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setDragging(false);

  const SVG_H = 60 + ROW_H * 5 + COL_W + 60;

  const handlePositionClick = (pos) => {
    setSelectedPosition(pos);
    setSelectedDeptTitle(pos.deptTitle || pos.department || '');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#1a2744', padding: '24px', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>
            ✈ Company Organization Chart
          </h1>
          <p style={{ color: '#94a3b8' }}>
            Explore the full company structure — departments overview or every position in the reporting hierarchy
          </p>
        </div>
      </div>

      <div style={{ background: '#1a2744', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ display: 'flex', gap: 0 }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '14px 22px', border: 'none', cursor: 'pointer',
                background: 'none', fontSize: '0.875rem', fontWeight: 700,
                color: activeTab === tab.key ? '#c9a84c' : 'rgba(255,255,255,0.6)',
                borderBottom: activeTab === tab.key ? '3px solid #c9a84c' : '3px solid transparent',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'dept' && (
        <>
          <div style={{ background: '#1a2744', padding: '8px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => setZoom(z => Math.min(z + 0.1, 2))}>+ Zoom In</button>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))}>− Zoom Out</button>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => { setZoom(0.55); setPan({ x: 0, y: 0 }); }}>↺ Reset</button>
              <div style={{ display: 'flex', gap: 12, marginLeft: 'auto', flexWrap: 'wrap' }}>
                {[
                  { label: 'Technical Ops', color: '#1a2744' },
                  { label: 'Safety & Compliance', color: '#2e8b57' },
                  { label: 'Commercial', color: '#b8860b' },
                  { label: 'Support', color: '#708090' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
                    <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>{item.label}</span>
                  </div>
                ))}
              </div>
              <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Drag · Scroll to zoom · Click dept to explore</span>
            </div>
          </div>

          <div
            style={{
              width: '100%', height: 'calc(100vh - 260px)', overflow: 'hidden',
              cursor: dragging ? 'grabbing' : 'grab',
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e8eef4 100%)',
              position: 'relative',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={e => setZoom(z => Math.max(0.2, Math.min(2, z - e.deltaY * 0.001)))}
          >
            <svg width="100%" height="100%" style={{ userSelect: 'none' }}>
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#c9a84c" opacity="0.7" />
                </marker>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {LINKS.map(([fromId, toId], i) => {
                  const f = POSITIONS[fromId];
                  const t = POSITIONS[toId];
                  if (!f || !t) return null;
                  const NODE_H_HALF = fromId === 'board' || EXEC_NODES.find(e => e.id === fromId) ? 30 : 35;
                  const midY = (f.y + t.y) / 2;
                  return (
                    <path key={i}
                      d={`M ${f.x} ${f.y + NODE_H_HALF} C ${f.x} ${midY}, ${t.x} ${midY}, ${t.x} ${t.y - 35}`}
                      fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeOpacity="0.45"
                      markerEnd="url(#arrow)"
                    />
                  );
                })}

                {EXEC_NODES.map(({ id, label, color, textColor }) => {
                  const pos = POSITIONS[id];
                  if (!pos) return null;
                  const W_NODE = id === 'ceo' || id === 'am' ? 200 : 160;
                  const H_NODE = 56;
                  const isHighlight = id === 'ceo' || id === 'am';
                  return (
                    <g key={id} className="node" transform={`translate(${pos.x - W_NODE / 2}, ${pos.y - H_NODE / 2})`}>
                      <rect width={W_NODE} height={H_NODE} rx={12}
                        fill={color}
                        stroke={isHighlight ? '#e8c96a' : '#c9a84c'}
                        strokeWidth={isHighlight ? 2.5 : 1.5}
                        filter={isHighlight ? 'drop-shadow(0 4px 16px rgba(201,168,76,0.4))' : 'none'}
                      />
                      <text x={W_NODE / 2} y={H_NODE / 2 + 5}
                        textAnchor="middle" fill={textColor}
                        fontSize={id === 'am' ? 11 : 13} fontWeight="700" fontFamily="Inter, sans-serif"
                      >{label}</text>
                    </g>
                  );
                })}

                {DEPARTMENTS.map(dept => {
                  const pos = POSITIONS[dept.id];
                  if (!pos) return null;
                  const isHov = hovered === dept.id;
                  return (
                    <g key={dept.id}
                      className="node"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/department/${dept.id}`)}
                      onMouseEnter={() => setHovered(dept.id)}
                      onMouseLeave={() => setHovered(null)}
                      transform={`translate(${pos.x - COL_W / 2}, ${pos.y - 38})`}
                    >
                      <rect width={COL_W} height={76} rx={12}
                        fill={isHov ? dept.color : 'white'}
                        stroke={dept.color} strokeWidth={isHov ? 0 : 2}
                        filter={isHov ? 'drop-shadow(0 6px 16px rgba(0,0,0,0.25))' : 'drop-shadow(0 1px 4px rgba(0,0,0,0.08))'}
                      />
                      <text x={COL_W / 2} y={22} textAnchor="middle" fontSize={20}>{dept.icon}</text>
                      <text x={COL_W / 2} y={42} textAnchor="middle"
                        fill={isHov ? 'white' : '#1a2744'} fontSize={9.5} fontWeight="700" fontFamily="Inter, sans-serif"
                      >
                        {dept.title.length > 22
                          ? <><tspan x={COL_W / 2} dy="0">{dept.title.substring(0, 20)}</tspan><tspan x={COL_W / 2} dy="11">{dept.title.substring(20, 40)}{dept.title.length > 40 ? '…' : ''}</tspan></>
                          : dept.title}
                      </text>
                      <text x={COL_W / 2} y={66} textAnchor="middle"
                        fill={isHov ? 'rgba(255,255,255,0.75)' : '#94a3b8'} fontSize={8.5} fontFamily="Inter, sans-serif"
                      >{dept.positions.length} positions</text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <div className="container" style={{ padding: '32px 24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2744', marginBottom: 20 }}>Quick Department Access</h2>
            {[
              { label: 'Technical Operations', depts: technicalDepts },
              { label: 'Safety & Compliance', depts: safetyDepts },
              { label: 'Commercial', depts: ccoDepts },
              { label: 'Corporate Support', depts: [...financeDept, ...legalDept, ...amSupportDepts] },
            ].map(group => (
              <div key={group.label} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{group.label}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                  {group.depts.map(d => (
                    <button key={d.id} onClick={() => navigate(`/department/${d.id}`)}
                      style={{ padding: '10px 14px', background: 'white', border: `2px solid ${d.color}`, borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = d.color; e.currentTarget.querySelector('span').style.color = 'white'; e.currentTarget.querySelector('p').style.color = 'rgba(255,255,255,0.75)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.querySelector('span').style.color = '#1a2744'; e.currentTarget.querySelector('p').style.color = '#64748b'; }}
                    >
                      <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{d.icon}</div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1a2744', display: 'block', lineHeight: 1.3 }}>{d.title}</span>
                      <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>{d.positions.length} roles</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'full' && (
        <div className="container" style={{ padding: '32px 24px' }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2744', marginBottom: 6 }}>
              Full Company Position Hierarchy
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Every position across all departments, shown below the person they report to — from Board of Directors down to individual contributors. Click any box to view the full job description.
            </p>
          </div>
          <CompanyHierarchyChart onPositionClick={handlePositionClick} />
        </div>
      )}

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
