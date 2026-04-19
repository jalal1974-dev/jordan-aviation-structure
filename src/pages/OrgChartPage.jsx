import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS, EXECUTIVE_TEAM } from '../data/orgData.js';

const NODES = [
  { id: 'board', label: 'Board of Directors', level: 0, x: 0, y: 0, type: 'board' },
  { id: 'chairman', label: 'Chairman', level: 1, x: 0, y: 1, type: 'exec' },
  { id: 'ceo', label: 'CEO', level: 2, x: 0, y: 2, type: 'exec' },
  { id: 'coo', label: 'COO', level: 3, x: -3, y: 3, type: 'exec' },
  { id: 'cfo', label: 'CFO', level: 3, x: -1, y: 3, type: 'exec' },
  { id: 'cco', label: 'CCO', level: 3, x: 1, y: 3, type: 'exec' },
  ...DEPARTMENTS.map((d, i) => ({
    id: d.id, label: d.title, level: 4, dept: d, type: 'dept', icon: d.icon,
    parentId: d.reportsTo === 'COO' ? 'coo' : d.reportsTo === 'CFO' ? 'cfo' : d.reportsTo === 'CCO' ? 'cco' : 'ceo',
  })),
];

const LINKS = [
  ['board', 'chairman'], ['chairman', 'ceo'],
  ['ceo', 'coo'], ['ceo', 'cfo'], ['ceo', 'cco'],
  ...DEPARTMENTS.map(d => [
    d.reportsTo === 'COO' ? 'coo' : d.reportsTo === 'CFO' ? 'cfo' : d.reportsTo === 'CCO' ? 'cco' : 'ceo',
    d.id,
  ]),
];

export default function OrgChartPage() {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(0.75);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [hovered, setHovered] = useState(null);
  const svgRef = useRef();

  const W = 1600;
  const H = 900;
  const COL_W = 180;
  const ROW_H = 140;

  const execNodes = ['board', 'chairman', 'ceo', 'coo', 'cfo', 'cco'];
  const cooChildren = DEPARTMENTS.filter(d => d.reportsTo === 'COO');
  const cfoChildren = DEPARTMENTS.filter(d => d.reportsTo === 'CFO');
  const ccoChildren = DEPARTMENTS.filter(d => d.reportsTo === 'CCO');
  const ceoDirectChildren = DEPARTMENTS.filter(d => !['COO', 'CFO', 'CCO'].includes(d.reportsTo));

  const positions = {};
  positions['board'] = { x: W / 2, y: 60 };
  positions['chairman'] = { x: W / 2, y: 60 + ROW_H };
  positions['ceo'] = { x: W / 2, y: 60 + ROW_H * 2 };

  const level3y = 60 + ROW_H * 3;
  positions['coo'] = { x: W * 0.2, y: level3y };
  positions['cfo'] = { x: W * 0.5, y: level3y };
  positions['cco'] = { x: W * 0.75, y: level3y };

  const level4y = 60 + ROW_H * 4;
  const placeChildren = (children, parentX, count, startIdx = 0) => {
    const totalW = count * (COL_W + 20);
    const startX = parentX - totalW / 2 + (COL_W + 20) / 2;
    children.forEach((d, i) => {
      positions[d.id] = { x: startX + i * (COL_W + 20), y: level4y + (i % 2) * 30 };
    });
  };

  placeChildren(cooChildren, W * 0.2, cooChildren.length);
  placeChildren(cfoChildren, W * 0.5, cfoChildren.length);
  placeChildren(ccoChildren, W * 0.75, ccoChildren.length);
  placeChildren(ceoDirectChildren, W * 0.5, ceoDirectChildren.length);
  ceoDirectChildren.forEach((d, i) => {
    positions[d.id].y += ROW_H * 0.4;
  });

  const handleMouseDown = (e) => {
    if (e.target.closest('.node')) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  const allDeptNodes = DEPARTMENTS.map(d => ({ ...d, pos: positions[d.id] })).filter(d => d.pos);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#1a2744', padding: '24px', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>
            ✈ Company-Wide Organization Chart
          </h1>
          <p style={{ color: '#94a3b8' }}>Click any department box to explore positions, job descriptions and SOPs</p>
        </div>
      </div>

      <div style={{ background: '#1a2744', padding: '8px 24px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setZoom(z => Math.min(z + 0.1, 2))}>+ Zoom In</button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))}>− Zoom Out</button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => { setZoom(0.75); setPan({ x: 0, y: 0 }); }}>↺ Reset</button>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Drag to pan • Scroll to zoom • Click departments to explore</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 'calc(100vh - 200px)', overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab', background: '#f1f5f9', position: 'relative' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={e => setZoom(z => Math.max(0.3, Math.min(2, z - e.deltaY * 0.001)))}
      >
        <svg ref={svgRef} width="100%" height="100%" style={{ userSelect: 'none' }}>
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: 'center' }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#c9a84c" opacity="0.6" />
              </marker>
            </defs>

            {LINKS.map(([from, to], i) => {
              const f = positions[from];
              const t = positions[to];
              if (!f || !t) return null;
              const mid = (f.y + t.y) / 2;
              return (
                <path key={i}
                  d={`M ${f.x} ${f.y + 30} C ${f.x} ${mid}, ${t.x} ${mid}, ${t.x} ${t.y - 30}`}
                  fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeOpacity="0.5"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

            {execNodes.map(id => {
              const pos = positions[id];
              if (!pos) return null;
              const label = id === 'board' ? 'Board of Directors' : id === 'chairman' ? 'Chairman' : id.toUpperCase();
              const isMain = id === 'ceo';
              return (
                <g key={id} transform={`translate(${pos.x - 70}, ${pos.y - 28})`} className="node">
                  <rect width={140} height={56} rx={12}
                    fill={isMain ? '#c9a84c' : '#1a2744'}
                    stroke={isMain ? '#e8c96a' : '#c9a84c'}
                    strokeWidth={isMain ? 3 : 1.5}
                  />
                  <text x={70} y={35} textAnchor="middle" fill={isMain ? '#0f1829' : 'white'}
                    fontSize={13} fontWeight="700" fontFamily="Inter, sans-serif"
                  >{label}</text>
                </g>
              );
            })}

            {allDeptNodes.map(dept => {
              const pos = dept.pos;
              const isHovered = hovered === dept.id;
              return (
                <g key={dept.id} transform={`translate(${pos.x - COL_W / 2}, ${pos.y - 35})`}
                  className="node"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/department/${dept.id}`)}
                  onMouseEnter={() => setHovered(dept.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <rect width={COL_W} height={70} rx={12}
                    fill={isHovered ? dept.color : 'white'}
                    stroke={dept.color}
                    strokeWidth={isHovered ? 0 : 2}
                    filter={isHovered ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' : ''}
                  />
                  <text x={COL_W / 2} y={24} textAnchor="middle" fontSize={18}>{dept.icon}</text>
                  <text x={COL_W / 2} y={42} textAnchor="middle"
                    fill={isHovered ? 'white' : '#1a2744'}
                    fontSize={10} fontWeight="600" fontFamily="Inter, sans-serif"
                  >
                    {dept.title.length > 20 ? dept.title.substring(0, 20) + '…' : dept.title}
                  </text>
                  <text x={COL_W / 2} y={58} textAnchor="middle"
                    fill={isHovered ? 'rgba(255,255,255,0.8)' : '#94a3b8'}
                    fontSize={9} fontFamily="Inter, sans-serif"
                  >{dept.positions.length} positions</text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2744', marginBottom: 20 }}>Quick Department Access</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {DEPARTMENTS.map(d => (
            <button key={d.id} onClick={() => navigate(`/department/${d.id}`)}
              style={{
                padding: '12px 16px', background: 'white', border: `2px solid ${d.color}`,
                borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = d.color; e.currentTarget.querySelector('span').style.color = 'white'; e.currentTarget.querySelector('p').style.color = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.querySelector('span').style.color = '#1a2744'; e.currentTarget.querySelector('p').style.color = '#64748b'; }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{d.icon}</div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a2744', display: 'block', lineHeight: 1.3 }}>{d.title}</span>
              <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>{d.positions.length} roles</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
