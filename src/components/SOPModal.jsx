import React from 'react';

export default function SOPModal({ sop, onClose }) {
  if (!sop) return null;
  return (
    <div className="modal-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: '#f0fdf4' }}>
          <button className="modal-close" onClick={onClose}>✕</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{
              background: 'linear-gradient(135deg, #15803d, #16a34a)',
              color: 'white', padding: '10px', borderRadius: 12, fontSize: '1.5rem',
            }}>📄</span>
            <div>
              <div style={{ color: '#15803d', fontWeight: 700, fontSize: '0.8rem', letterSpacing: 1 }}>STANDARD OPERATING PROCEDURE</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a2744' }}>{sop.title}</h2>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <SOPSection title="Purpose" icon="🎯" bg="#eff6ff">
            <p>{sop.purpose}</p>
          </SOPSection>

          <SOPSection title="Scope" icon="🔭" bg="#f0fdf4">
            <p>{sop.scope}</p>
          </SOPSection>

          <SOPSection title="Responsibilities" icon="👤" bg="#faf5ff">
            <p>{sop.responsibilities}</p>
          </SOPSection>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a2744', fontWeight: 700, marginBottom: 12, fontSize: '1rem' }}>
              <span>📋</span> Step-by-Step Procedures
            </h3>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 16, border: '1px solid #e2e8f0' }}>
              {sop.procedures?.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < sop.procedures.length - 1 ? 12 : 0, alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: 28, height: 28, background: '#1a2744', color: '#c9a84c',
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</div>
                  <p style={{ color: '#475569', lineHeight: 1.6, paddingTop: 2, fontSize: '0.9rem' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <SOPSection title="Safety Requirements" icon="🛡️" bg="#fff7ed">
            <p style={{ color: '#9a3412' }}>{sop.safetyRequirements}</p>
          </SOPSection>

          <SOPSection title="CARC Compliance Reference" icon="⚖️" bg="#fefce8">
            <p style={{ color: '#92400e', fontSize: '0.9rem' }}>{sop.carcCompliance}</p>
          </SOPSection>
        </div>
      </div>
    </div>
  );
}

function SOPSection({ title, icon, bg, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a2744', fontWeight: 700, marginBottom: 10, fontSize: '0.95rem' }}>
        <span>{icon}</span> {title}
      </h3>
      <div style={{ background: bg, borderRadius: 8, padding: 14, fontSize: '0.9rem', color: '#475569', lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}
