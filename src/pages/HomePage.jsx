import React from 'react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS, COMPANY_INFO, EXECUTIVE_TEAM } from '../data/orgData.js';
import PDFGenerator from '../components/PDFGenerator.jsx';

export default function HomePage() {
  const technical = DEPARTMENTS.filter(d => d.category === 'technical');
  const nonTechnical = DEPARTMENTS.filter(d => d.category === 'non-technical');

  return (
    <div>
      <HeroSection />
      <StatsBar />
      <div className="container" style={{ padding: '60px 24px' }}>
        <ExecutiveSection />
        <DepartmentsSection title="Technical Departments" departments={technical} />
        <DepartmentsSection title="Non-Technical Departments" departments={nonTechnical} />
        <DownloadSection />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f1829 0%, #1a2744 50%, #2d4a7a 100%)',
      color: 'white', padding: '80px 0', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(45,74,122,0.3) 0%, transparent 50%)',
      }} />
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 3, height: 40, background: '#c9a84c', borderRadius: 2 }} />
          <div>
            <p style={{ color: '#c9a84c', fontWeight: 600, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase' }}>CARC • IATA • ICAO Compliant</p>
          </div>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20, maxWidth: 700 }}>
          Jordan Aviation Airline<br />
          <span style={{ color: '#c9a84c' }}>Organization Structure System</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 600, lineHeight: 1.7, marginBottom: 36 }}>
          A comprehensive organizational framework covering all departments, positions, job descriptions, and standard operating procedures for Jordan Aviation Airline.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/org-chart" className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '12px 24px' }}>
            View Org Chart →
          </Link>
          <Link to="/contents" className="btn btn-navy" style={{ border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.95rem', padding: '12px 24px' }}>
            Table of Contents
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: '16', label: 'Departments' },
    { value: '50+', label: 'Positions' },
    { value: '100+', label: 'Job Descriptions' },
    { value: '20+', label: 'SOPs Included' },
    { value: 'CARC', label: 'Compliant' },
    { value: 'IATA/ICAO', label: 'Standards' },
  ];
  return (
    <div style={{ background: '#c9a84c', padding: '16px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f1829' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#1a2744', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExecutiveSection() {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2 className="section-title">Executive Leadership</h2>
      <div className="gold-line" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {EXECUTIVE_TEAM.positions.slice(0, 5).map(p => (
          <div key={p.id} className="card" style={{ padding: 20, cursor: 'default' }}>
            <div style={{
              width: 48, height: 48, background: 'linear-gradient(135deg, #1a2744, #2d4a7a)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', marginBottom: 12,
            }}>👔</div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a2744', marginBottom: 4 }}>{p.title}</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Reports to: {p.reportsTo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DepartmentsSection({ title, departments }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2 className="section-title">{title}</h2>
      <div className="gold-line" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {departments.map(dept => (
          <Link to={`/department/${dept.id}`} key={dept.id} className="card" style={{ padding: 24, display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 52, height: 52, background: dept.color,
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', flexShrink: 0,
              }}>{dept.icon}</div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2744', marginBottom: 4 }}>{dept.title}</h3>
                <span className={`badge badge-${dept.category === 'technical' ? 'technical' : 'non-technical'}`}>
                  {dept.category}
                </span>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 14 }}>{dept.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{dept.positions.length} positions · {dept.sops.length} SOPs</span>
              <span style={{ color: '#c9a84c', fontWeight: 600, fontSize: '0.85rem' }}>Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DownloadSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a2744, #2d4a7a)',
      borderRadius: 20, padding: '48px 40px', color: 'white', textAlign: 'center', marginBottom: 40,
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>📄</div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 12 }}>Download Complete Booklet</h2>
      <p style={{ color: '#94a3b8', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.7 }}>
        Generate a comprehensive PDF booklet containing all organizational charts, job descriptions, and SOPs for Jordan Aviation Airline.
      </p>
      <PDFGenerator />
    </section>
  );
}
