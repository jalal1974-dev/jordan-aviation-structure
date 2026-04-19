import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO, DEPARTMENTS } from '../data/orgData.js';

export default function Footer() {
  return (
    <footer style={{ background: '#0f1829', color: '#94a3b8', marginTop: 60 }}>
      <div className="container" style={{ padding: '48px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
                borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              }}>✈</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700 }}>Jordan Aviation</div>
                <div style={{ color: '#c9a84c', fontSize: '0.7rem', letterSpacing: 1 }}>AIRLINE</div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>{COMPANY_INFO.tagline}</p>
            <p style={{ fontSize: '0.8rem', marginTop: 8 }}>IATA: {COMPANY_INFO.iataCode} | ICAO: {COMPANY_INFO.icaoCode}</p>
          </div>

          <div>
            <h4 style={{ color: '#c9a84c', fontWeight: 600, marginBottom: 12, fontSize: '0.9rem' }}>Technical Departments</h4>
            {DEPARTMENTS.filter(d => d.category === 'technical').map(d => (
              <Link key={d.id} to={`/department/${d.id}`} style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: 6, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >{d.icon} {d.title}</Link>
            ))}
          </div>

          <div>
            <h4 style={{ color: '#c9a84c', fontWeight: 600, marginBottom: 12, fontSize: '0.9rem' }}>Non-Technical Departments</h4>
            {DEPARTMENTS.filter(d => d.category === 'non-technical').map(d => (
              <Link key={d.id} to={`/department/${d.id}`} style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: 6, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >{d.icon} {d.title}</Link>
            ))}
          </div>

          <div>
            <h4 style={{ color: '#c9a84c', fontWeight: 600, marginBottom: 12, fontSize: '0.9rem' }}>Quick Links</h4>
            {[['/', 'Home'], ['/org-chart', 'Org Chart'], ['/contents', 'Table of Contents'], ['/search', 'Search']].map(([path, label]) => (
              <Link key={path} to={path} style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: 6, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >{label}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.8rem' }}>© 2024 Jordan Aviation Airline. All rights reserved.</p>
          <p style={{ fontSize: '0.8rem' }}>Compliant with CARC | IATA | ICAO Standards</p>
        </div>
      </div>
    </footer>
  );
}
