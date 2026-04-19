import React from 'react';

export default function JobDescModal({ position, departmentTitle, onClose }) {
  if (!position) return null;
  return (
    <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: '#f8fafc' }}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{
              background: 'linear-gradient(135deg, #1a2744, #2d4a7a)',
              color: 'white', padding: '10px', borderRadius: 12, fontSize: '1.5rem',
            }}>👤</span>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2744' }}>{position.title}</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{departmentTitle}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
              Reports to: {position.reportsTo}
            </span>
          </div>
        </div>

        <div className="modal-body">
          <Section title="Purpose of Role" icon="🎯">
            <p style={{ color: '#475569', lineHeight: 1.7 }}>{position.purpose}</p>
          </Section>

          <Section title="Key Responsibilities" icon="📋">
            <ol style={{ paddingLeft: 20 }}>
              {position.responsibilities.map((r, i) => (
                <li key={i} style={{ color: '#475569', marginBottom: 8, lineHeight: 1.6 }}>{r}</li>
              ))}
            </ol>
          </Section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Section title="Qualifications" icon="🎓">
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.9rem' }}>{position.qualifications}</p>
            </Section>
            <Section title="Experience Required" icon="⏱️">
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.9rem' }}>{position.experience}</p>
            </Section>
          </div>

          <Section title="Key Performance Indicators (KPIs)" icon="📊">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {position.kpis?.map((kpi, i) => (
                <span key={i} style={{
                  background: 'linear-gradient(135deg, #1a2744, #2d4a7a)',
                  color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500,
                }}>{kpi}</span>
              ))}
            </div>
          </Section>

          <div style={{ marginTop: 24, padding: 16, background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10 }}>
            <p style={{ fontSize: '0.8rem', color: '#92400e' }}>
              <strong>CARC Compliance Note:</strong> This role operates under the Civil Aviation Regulatory Commission of Jordan (CARC) framework and must adhere to all applicable CARC regulations, IATA standards, and ICAO Annexes relevant to this position.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a2744', fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}
