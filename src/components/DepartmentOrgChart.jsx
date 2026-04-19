import React, { useState, useMemo } from 'react';

function buildTree(positions) {
  const byTitle = {};
  positions.forEach(p => { byTitle[p.title] = { ...p, children: [] }; });

  const roots = [];
  positions.forEach(p => {
    const node = byTitle[p.title];
    const parent = positions.find(q => q.title === p.reportsTo);
    if (parent && byTitle[parent.title]) {
      byTitle[parent.title].children.push(node);
    } else {
      roots.push(node);
    }
  });

  if (roots.length > 1) {
    const headNode = roots.find(r => positions.indexOf(positions.find(p => p.title === r.title)) === 0) || roots[0];
    const others = roots.filter(r => r !== headNode);
    if (others.length > 0 && headNode) {
      headNode.children = [...headNode.children, ...others];
      return [headNode];
    }
  }
  return roots;
}

function calcLayout(nodes, startX = 0, startY = 0, xGap = 170, yGap = 110) {
  const positions = {};
  function measure(node) {
    if (!node.children || node.children.length === 0) return 1;
    return Math.max(1, node.children.reduce((sum, c) => sum + measure(c), 0));
  }

  function layout(node, xOffset, depth) {
    const width = measure(node);
    const x = startX + (xOffset + width / 2) * xGap;
    const y = startY + depth * yGap;
    positions[node.title] = { x, y };

    let childX = xOffset;
    (node.children || []).forEach(child => {
      const childWidth = measure(child);
      layout(child, childX, depth + 1);
      childX += childWidth;
    });
  }

  let xOffset = 0;
  nodes.forEach(root => {
    const width = measure(root);
    layout(root, xOffset, 0);
    xOffset += width;
  });

  return positions;
}

function getEdges(nodes, positions) {
  const edges = [];
  function traverse(node) {
    (node.children || []).forEach(child => {
      const from = positions[node.title];
      const to = positions[child.title];
      if (from && to) edges.push({ from, to });
      traverse(child);
    });
  }
  nodes.forEach(traverse);
  return edges;
}

const NODE_W = 148;
const NODE_H = 52;

export default function DepartmentOrgChart({ dept, onPositionClick }) {
  const [hoveredTitle, setHoveredTitle] = useState(null);

  const { roots, positions, edges, svgWidth, svgHeight } = useMemo(() => {
    const roots = buildTree(dept.positions);
    const pos = calcLayout(roots);
    const edges = getEdges(roots, pos);

    const xs = Object.values(pos).map(p => p.x);
    const ys = Object.values(pos).map(p => p.y);
    const minX = Math.min(...xs) - NODE_W / 2 - 20;
    const maxX = Math.max(...xs) + NODE_W / 2 + 20;
    const minY = Math.min(...ys) - NODE_H / 2 - 20;
    const maxY = Math.max(...ys) + NODE_H / 2 + 40;

    const offsetX = -minX;
    const offsetY = -minY;
    Object.keys(pos).forEach(k => {
      pos[k] = { x: pos[k].x + offsetX, y: pos[k].y + offsetY };
    });

    return {
      roots,
      positions: pos,
      edges,
      svgWidth: maxX - minX,
      svgHeight: maxY - minY,
    };
  }, [dept]);

  const allNodes = dept.positions.map(p => ({ ...p, pos: positions[p.title] })).filter(p => p.pos);

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
        borderRadius: 16, border: '1px solid #e2e8f0',
        overflow: 'auto', padding: '16px 0',
        maxHeight: 520,
      }}>
        <div style={{ minWidth: svgWidth + 40, padding: '0 20px' }}>
          <svg
            width={svgWidth}
            height={svgHeight}
            style={{ display: 'block', overflow: 'visible' }}
          >
            <defs>
              <marker id={`arrow-${dept.id}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill={dept.color} opacity="0.7" />
              </marker>
            </defs>

            {edges.map((e, i) => {
              const midY = (e.from.y + e.to.y) / 2;
              return (
                <path key={i}
                  d={`M ${e.from.x} ${e.from.y + NODE_H / 2} C ${e.from.x} ${midY}, ${e.to.x} ${midY}, ${e.to.x} ${e.to.y - NODE_H / 2}`}
                  fill="none"
                  stroke={dept.color}
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  markerEnd={`url(#arrow-${dept.id})`}
                />
              );
            })}

            {allNodes.map(node => {
              const { pos } = node;
              const isHovered = hoveredTitle === node.title;
              const isHead = node.id === dept.headId;
              const x = pos.x - NODE_W / 2;
              const y = pos.y - NODE_H / 2;

              return (
                <g key={node.id}
                  transform={`translate(${x}, ${y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onPositionClick(node)}
                  onMouseEnter={() => setHoveredTitle(node.title)}
                  onMouseLeave={() => setHoveredTitle(null)}
                >
                  <rect
                    width={NODE_W} height={NODE_H} rx={10}
                    fill={isHovered || isHead ? dept.color : 'white'}
                    stroke={dept.color}
                    strokeWidth={isHead ? 0 : 1.5}
                    filter={isHovered ? `drop-shadow(0 4px 12px rgba(0,0,0,0.2))` : isHead ? `drop-shadow(0 2px 8px rgba(0,0,0,0.15))` : 'none'}
                  />
                  {isHead && (
                    <rect
                      x={-2} y={-2} width={NODE_W + 4} height={NODE_H + 4} rx={12}
                      fill="none" stroke="#c9a84c" strokeWidth="2"
                    />
                  )}
                  <text
                    x={NODE_W / 2} y={NODE_H / 2 - 5}
                    textAnchor="middle"
                    fill={isHovered || isHead ? 'white' : '#1a2744'}
                    fontSize={10}
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.title.length > 20 ? (
                      <>
                        <tspan x={NODE_W / 2} dy="0">{node.title.substring(0, 20)}</tspan>
                        <tspan x={NODE_W / 2} dy="13">{node.title.substring(20, 38)}{node.title.length > 38 ? '…' : ''}</tspan>
                      </>
                    ) : node.title}
                  </text>
                  <text
                    x={NODE_W / 2} y={NODE_H / 2 + 14}
                    textAnchor="middle"
                    fill={isHovered || isHead ? 'rgba(255,255,255,0.75)' : '#94a3b8'}
                    fontSize={8}
                    fontFamily="Inter, sans-serif"
                    style={{ pointerEvents: 'none' }}
                  >
                    {isHead ? '★ Department Head' : `→ ${node.reportsTo.length > 22 ? node.reportsTo.substring(0, 22) + '…' : node.reportsTo}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 10, textAlign: 'center' }}>
        ★ = Department Head · Click any position to view full job description
      </p>
    </div>
  );
}
