import React, { useState, useMemo, useRef, useCallback } from 'react';
import { EXECUTIVE_TEAM, DEPARTMENTS } from '../data/orgData.js';

const REPORT_ALIASES = {
  'accountable manager': 'Accountable Manager (General Manager)',
  'general manager': 'Accountable Manager (General Manager)',
  'accountable manager (nominated post holder)': 'Accountable Manager (General Manager)',
  'accountable manager / general manager': 'Accountable Manager (General Manager)',
  'accountable manager / coo': 'Accountable Manager (General Manager)',
  'chairman / president & ceo': 'Chairman of the Board',
  'board of directors': 'Board of Directors',
};

function normReportsTo(reportsTo) {
  if (!reportsTo) return null;
  const lower = reportsTo.toLowerCase().trim();
  if (REPORT_ALIASES[lower]) return REPORT_ALIASES[lower];
  if (lower.startsWith('accountable manager')) return 'Accountable Manager (General Manager)';
  return reportsTo;
}

function collectAllPositions() {
  const positions = [];
  const seenTitles = new Set();

  positions.push({
    id: '__board__',
    title: 'Board of Directors',
    reportsTo: null,
    deptId: 'board',
    deptTitle: 'Governance',
    deptColor: '#0f1829',
    isVirtual: true,
  });
  seenTitles.add('Board of Directors');

  EXECUTIVE_TEAM.positions.forEach(p => {
    if (!seenTitles.has(p.title)) {
      positions.push({ ...p, deptId: 'executive', deptTitle: 'Executive Office', deptColor: '#1a2744' });
      seenTitles.add(p.title);
    }
  });

  DEPARTMENTS.forEach(dept => {
    dept.positions.forEach(p => {
      if (!seenTitles.has(p.title)) {
        positions.push({ ...p, deptId: dept.id, deptTitle: dept.title, deptColor: dept.color, deptIcon: dept.icon });
        seenTitles.add(p.title);
      }
    });
  });

  return positions;
}

function buildTree(positions) {
  const titleSet = new Set(positions.map(p => p.title));
  const nodeMap = {};
  positions.forEach(p => { nodeMap[p.title] = { ...p, children: [] }; });

  positions.forEach(p => {
    if (p.title === 'Board of Directors') return;

    const resolvedParent = normReportsTo(p.reportsTo);
    let parentTitle = null;

    if (!resolvedParent) {
      parentTitle = 'Board of Directors';
    } else if (titleSet.has(resolvedParent)) {
      parentTitle = resolvedParent;
    } else {
      const lower = resolvedParent.toLowerCase();
      for (const t of titleSet) {
        if (t.toLowerCase() === lower) { parentTitle = t; break; }
      }
      if (!parentTitle) {
        for (const t of titleSet) {
          const tl = t.toLowerCase();
          if (tl.includes(lower) || lower.includes(tl)) { parentTitle = t; break; }
        }
      }
      if (!parentTitle) parentTitle = 'Board of Directors';
    }

    const parent = nodeMap[parentTitle];
    if (parent && parent.title !== p.title) {
      parent.children.push(nodeMap[p.title]);
    } else {
      nodeMap['Board of Directors'].children.push(nodeMap[p.title]);
    }
  });

  return nodeMap['Board of Directors'];
}

function measure(node) {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum, c) => sum + measure(c), 0);
}

function calcLayout(root, xGap = 185, yGap = 115) {
  const positions = {};
  function layout(node, xOffset, depth) {
    const width = measure(node);
    const x = (xOffset + width / 2) * xGap;
    const y = depth * yGap + 40;
    positions[node.title] = { x, y };
    let childX = xOffset;
    (node.children || []).forEach(child => {
      const cw = measure(child);
      layout(child, childX, depth + 1);
      childX += cw;
    });
  }
  layout(root, 0, 0);
  return positions;
}

function getEdges(root, positions) {
  const edges = [];
  function traverse(node) {
    (node.children || []).forEach(child => {
      const from = positions[node.title];
      const to = positions[child.title];
      if (from && to) edges.push({ from, to, color: child.deptColor || '#c9a84c' });
      traverse(child);
    });
  }
  traverse(root);
  return edges;
}

const NODE_W = 158;
const NODE_H = 56;

const DEPT_LEGEND = [
  { label: 'Executive', color: '#1a2744' },
  ...DEPARTMENTS.map(d => ({ label: d.title, color: d.color })),
];

export default function CompanyHierarchyChart({ onPositionClick }) {
  const [zoom, setZoom] = useState(0.38);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [hovered, setHovered] = useState(null);

  const { positions, edges, allNodes } = useMemo(() => {
    const allPositions = collectAllPositions();
    const root = buildTree(allPositions);
    const pos = calcLayout(root);
    const edges = getEdges(root, pos);

    const xs = Object.values(pos).map(p => p.x);
    const minX = Math.min(...xs) - NODE_W / 2 - 40;
    const offsetX = -minX;
    const adjusted = {};
    Object.keys(pos).forEach(k => { adjusted[k] = { x: pos[k].x + offsetX, y: pos[k].y }; });

    const allNodes = allPositions
      .map(p => ({ ...p, pos: adjusted[p.title] }))
      .filter(p => p.pos);

    return { positions: adjusted, edges, allNodes };
  }, []);

  const handleMouseDown = useCallback(e => {
    if (e.target.closest('.hnode')) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback(e => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const handleWheel = useCallback(e => {
    e.preventDefault();
    setZoom(z => Math.max(0.15, Math.min(2.5, z - e.deltaY * 0.001)));
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setZoom(z => Math.min(z + 0.1, 2.5))}
          style={{ padding: '6px 14px', background: '#1a2744', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
          + Zoom In
        </button>
        <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.15))}
          style={{ padding: '6px 14px', background: '#1a2744', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
          − Zoom Out
        </button>
        <button onClick={() => { setZoom(0.38); setPan({ x: 20, y: 20 }); }}
          style={{ padding: '6px 14px', background: '#64748b', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>
          ↺ Reset
        </button>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 4 }}>
          Drag to pan · Scroll to zoom · Click any box to view job description
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {DEPT_LEGEND.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.67rem', color: '#64748b', whiteSpace: 'nowrap' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          width: '100%', height: 640, overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
          borderRadius: 16, border: '1px solid #e2e8f0',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg width="100%" height="100%" style={{ userSelect: 'none' }}>
          <defs>
            <marker id="ch-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#c9a84c" opacity="0.65" />
            </marker>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {edges.map((e, i) => {
              const midY = (e.from.y + e.to.y) / 2;
              return (
                <path key={i}
                  d={`M ${e.from.x} ${e.from.y + NODE_H / 2} C ${e.from.x} ${midY}, ${e.to.x} ${midY}, ${e.to.x} ${e.to.y - NODE_H / 2}`}
                  fill="none" stroke={e.color} strokeWidth="1.5" strokeOpacity="0.45"
                  markerEnd="url(#ch-arrow)"
                />
              );
            })}

            {allNodes.map(node => {
              const { pos } = node;
              const isHov = hovered === node.title;
              const isBoard = node.isVirtual;
              const x = pos.x - NODE_W / 2;
              const y = pos.y - NODE_H / 2;
              const fillColor = isHov ? node.deptColor : (isBoard ? '#0f1829' : 'white');
              const textColor = (isHov || isBoard) ? 'white' : '#1a2744';
              const subColor = (isHov || isBoard) ? 'rgba(255,255,255,0.65)' : '#94a3b8';
              const titleLines = splitTitle(node.title);

              return (
                <g key={node.id || node.title}
                  className="hnode"
                  transform={`translate(${x}, ${y})`}
                  style={{ cursor: node.isVirtual ? 'default' : 'pointer' }}
                  onClick={() => !node.isVirtual && onPositionClick && onPositionClick(node)}
                  onMouseEnter={() => setHovered(node.title)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <rect width={NODE_W} height={NODE_H} rx={10}
                    fill={fillColor}
                    stroke={node.deptColor || '#1a2744'}
                    strokeWidth={1.5}
                    filter={isHov ? 'drop-shadow(0 4px 14px rgba(0,0,0,0.22))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))'}
                  />
                  {!isBoard && !isHov && (
                    <rect x={0} y={2} width={4} height={NODE_H - 4} rx={2}
                      fill={node.deptColor} opacity="0.85"
                    />
                  )}
                  {titleLines.length === 1 ? (
                    <text x={NODE_W / 2} y={isBoard ? NODE_H / 2 + 5 : NODE_H / 2 - 4}
                      textAnchor="middle" fill={textColor}
                      fontSize={10} fontWeight="700" fontFamily="Inter, sans-serif"
                      style={{ pointerEvents: 'none' }}>
                      {titleLines[0]}
                    </text>
                  ) : (
                    <>
                      <text x={NODE_W / 2} y={NODE_H / 2 - 9}
                        textAnchor="middle" fill={textColor}
                        fontSize={9.5} fontWeight="700" fontFamily="Inter, sans-serif"
                        style={{ pointerEvents: 'none' }}>
                        {titleLines[0]}
                      </text>
                      <text x={NODE_W / 2} y={NODE_H / 2 + 3}
                        textAnchor="middle" fill={textColor}
                        fontSize={9.5} fontWeight="700" fontFamily="Inter, sans-serif"
                        style={{ pointerEvents: 'none' }}>
                        {titleLines[1]}
                      </text>
                    </>
                  )}
                  {!isBoard && (
                    <text x={NODE_W / 2} y={NODE_H / 2 + 16}
                      textAnchor="middle" fill={subColor}
                      fontSize={7.5} fontFamily="Inter, sans-serif"
                      style={{ pointerEvents: 'none' }}>
                      {node.deptTitle && node.deptTitle.length > 26 ? node.deptTitle.substring(0, 24) + '…' : node.deptTitle}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
        {allNodes.filter(n => !n.isVirtual).length} positions across {DEPARTMENTS.length + 1} departments · Click any position for full job description
      </p>
    </div>
  );
}

function splitTitle(title) {
  if (title.length <= 22) return [title];
  const mid = Math.ceil(title.length / 2);
  let split = title.lastIndexOf(' ', mid);
  if (split < 10) split = title.indexOf(' ', mid);
  if (split === -1) return [title.substring(0, 20), title.substring(20, 38) + (title.length > 38 ? '…' : '')];
  const line1 = title.substring(0, split);
  const line2 = title.substring(split + 1);
  if (line2.length > 22) return [line1.substring(0, 21), line2.substring(0, 21) + '…'];
  return [line1, line2];
}
