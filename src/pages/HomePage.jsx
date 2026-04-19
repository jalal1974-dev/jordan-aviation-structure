import React from 'react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS, COMPANY_INFO, EXECUTIVE_TEAM } from '../data/orgData.js';
import PDFGenerator from '../components/PDFGenerator.jsx';
import { useLang } from '../context/LanguageContext.jsx';

export default function HomePage() {
  const { t } = useLang();
  const technical = DEPARTMENTS.filter(d => d.category === 'technical');
  const nonTechnical = DEPARTMENTS.filter(d => d.category === 'non-technical');

  return (
    <div>
      <HeroSection />
      <StatsBar />
      <div className="container" style={{ padding: '60px 24px' }}>
        <ExecutiveSection />
        <DepartmentsSection title={t.sections.technical} departments={technical} />
        <DepartmentsSection title={t.sections.nonTechnical} departments={nonTechnical} />
        <DownloadSection />
      </div>
    </div>
  );
}

function HeroSection() {
  const { t } = useLang();
  return (
    <section style={{
      background: 'linear-gradient(135deg, #0f1829 0%, #1a2744 50%, #2d4a7a 100%)',
      color: 'white', padding: '80px 0', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(45,74,122,0.3) 0%, transparent 50%)',
      }} />
      <div className="container" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 3, height: 40, background: '#c9a84c', borderRadius: 2 }} />
          <p style={{ color: '#c9a84c', fontWeight: 600, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase' }}>
            {t.hero.badge}
          </p>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20, maxWidth: 700 }}>
          {t.hero.title1}<br />
          <span style={{ color: '#c9a84c' }}>{t.hero.title2}</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: 600, lineHeight: 1.7, marginBottom: 36 }}>
          {t.hero.subtitle}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/org-chart" className="btn btn-primary" style={{ fontSize: '0.95rem', padding: '12px 24px' }}>
            {t.hero.viewChart}
          </Link>
          <Link to="/directory" className="btn btn-navy" style={{ border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.95rem', padding: '12px 24px' }}>
            👥 {t.nav.directory}
          </Link>
          <Link to="/contents" className="btn btn-navy" style={{ border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.95rem', padding: '12px 24px' }}>
            📋 {t.nav.contents}
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const { t } = useLang();
  const stats = [
    { value: '16', label: t.stats.departments },
    { value: '60+', label: t.stats.positions },
    { value: '100+', label: 'Job Descriptions' },
    { value: '20+', label: `SOPs` },
    { value: 'CARC', label: t.stats.compliant },
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
  const { t } = useLang();
  return (
    <section style={{ marginBottom: 64 }}>
      <h2 className="section-title">{t.sections.executive}</h2>
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
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.common.reportsTo}: {p.reportsTo}</p>
          </div>
        ))}
        <Link to="/directory" style={{
          padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a2744, #2d4a7a)',
          borderRadius: 16, border: '1px solid #e2e8f0', textDecoration: 'none',
          color: 'white', gap: 8, transition: 'transform 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
        >
          <div style={{ fontSize: '1.8rem' }}>👥</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c9a84c' }}>{t.nav.directory}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>View all {DEPARTMENTS.reduce((s, d) => s + d.positions.length, 0) + EXECUTIVE_TEAM.positions.length} positions</div>
        </Link>
      </div>
    </section>
  );
}

function DepartmentsSection({ title, departments }) {
  const { t } = useLang();
  return (
    <section style={{ marginBottom: 64 }}>
      <h2 className="section-title">{title}</h2>
      <div className="gold-line" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {departments.map(dept => (
          <Link to={`/department/${dept.id}`} key={dept.id} className="card" style={{ padding: 24, display: 'block', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 52, height: 52, background: dept.color,
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', flexShrink: 0,
              }}>{dept.icon}</div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2744', marginBottom: 4 }}>{dept.title}</h3>
                <span className={`badge badge-${dept.category === 'technical' ? 'technical' : 'non-technical'}`}>
                  {dept.category === 'technical' ? t.common.technical : t.common.nonTechnical}
                </span>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 14 }}>{dept.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{dept.positions.length} {t.stats.positions} · {dept.sops.length} SOPs</span>
              <span style={{ color: '#c9a84c', fontWeight: 600, fontSize: '0.85rem' }}>Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function handlePrintBooklet() {
  window.print();
}

function DownloadSection() {
  const { t } = useLang();

  const printFullBooklet = () => {
    const allDepts = [...DEPARTMENTS];
    let html = `
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; }
        .cover { background: #1a2744; color: white; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 60px; page-break-after: always; }
        .cover h1 { font-size: 36px; margin: 0 0 8px; }
        .cover h2 { font-size: 24px; color: #c9a84c; margin: 0 0 24px; }
        .cover p { color: #94a3b8; margin: 6px 0; font-size: 14px; }
        .cover .year { font-size: 48px; font-weight: 900; color: #c9a84c; margin-bottom: 8px; }
        .toc { padding: 40px 60px; page-break-after: always; }
        .toc h2 { color: #1a2744; border-bottom: 3px solid #c9a84c; padding-bottom: 8px; }
        .toc-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #e2e8f0; font-size: 13px; }
        .dept-section { padding: 40px 60px; page-break-before: always; }
        .dept-header { background: #1a2744; color: white; padding: 20px 24px; border-radius: 8px; margin-bottom: 24px; }
        .dept-header h2 { margin: 0 0 4px; font-size: 20px; }
        .dept-header p { margin: 0; color: #94a3b8; font-size: 13px; }
        .pos-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
        .pos-card h3 { color: #1a2744; margin: 0 0 4px; font-size: 15px; }
        .pos-card .sub { color: #64748b; font-size: 12px; margin: 0 0 8px; }
        .pos-card p { font-size: 12px; color: #475569; margin: 4px 0; }
        .pos-card ol { font-size: 12px; color: #475569; padding-left: 18px; }
        .pos-card li { margin-bottom: 3px; }
        .sop-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
        .sop-card h3 { color: #15803d; margin: 0 0 8px; font-size: 14px; }
        .sop-card p { font-size: 12px; color: #475569; margin: 3px 0; }
        .label { font-weight: 700; color: #1a2744; }
        .carc { background: #fefce8; border: 1px solid #fde68a; border-radius: 4px; padding: 6px 10px; font-size: 11px; color: #92400e; margin-top: 6px; }
        @media print { @page { margin: 15mm; } }
      </style>
      <div class="cover">
        <div style="border-left: 6px solid #c9a84c; padding-left: 24px; margin-bottom: 40px;">
          <div class="year">2026</div>
          <h1>JORDAN AVIATION AIRLINE</h1>
          <h2>Organization Structure System</h2>
          <p>Standard Operating Procedures Booklet</p>
          <p style="margin-top:16px; color: #c9a84c; font-weight:700;">CARC · IATA · ICAO Compliant</p>
        </div>
        <div style="color: #64748b; font-size: 13px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">
          <p>IATA: R5 · ICAO: JAV · Queen Alia International Airport, Amman, Jordan</p>
          <p>Confidential — For Internal Use Only</p>
        </div>
      </div>

      <div class="toc">
        <h2>TABLE OF CONTENTS</h2>
        <div class="toc-item"><span>1. Executive Leadership</span><span>—</span></div>
        <div class="toc-item"><span>2. Technical Departments</span><span>—</span></div>
        ${DEPARTMENTS.filter(d => d.category === 'technical').map((d, i) => `<div class="toc-item" style="padding-left:20px;"><span>2.${i + 1} ${d.title}</span><span>—</span></div>`).join('')}
        <div class="toc-item"><span>3. Non-Technical Departments</span><span>—</span></div>
        ${DEPARTMENTS.filter(d => d.category === 'non-technical').map((d, i) => `<div class="toc-item" style="padding-left:20px;"><span>3.${i + 1} ${d.title}</span><span>—</span></div>`).join('')}
        <div class="toc-item"><span>4. Appendices & Regulatory References</span><span>—</span></div>
      </div>

      ${allDepts.map(dept => `
        <div class="dept-section">
          <div class="dept-header">
            <h2>${dept.icon} ${dept.title}</h2>
            <p>${dept.description}</p>
            <p style="margin-top:8px;">Reports to: ${dept.reportsTo} · ${dept.positions.length} Positions · ${dept.sops.length} SOPs</p>
          </div>

          <h3 style="color:#1a2744;border-bottom:2px solid #c9a84c;padding-bottom:6px;">Job Descriptions</h3>
          ${dept.positions.map((pos, pi) => `
            <div class="pos-card">
              <h3>${pi + 1}. ${pos.title}</h3>
              <p class="sub">Reports to: ${pos.reportsTo}</p>
              <p><span class="label">Purpose:</span> ${pos.purpose}</p>
              <p><span class="label">Qualifications:</span> ${pos.qualifications}</p>
              <p><span class="label">Experience:</span> ${pos.experience}</p>
              <p style="font-weight:700;margin-top:8px;">Key Responsibilities:</p>
              <ol>${(pos.responsibilities || []).map(r => `<li>${r}</li>`).join('')}</ol>
              ${pos.kpis?.length ? `<p style="margin-top:8px;"><span class="label">KPIs:</span> ${pos.kpis.join(' · ')}</p>` : ''}
            </div>
          `).join('')}

          ${dept.sops.length ? `
            <h3 style="color:#15803d;border-bottom:2px solid #86efac;padding-bottom:6px;margin-top:24px;">Standard Operating Procedures</h3>
            ${dept.sops.map(sop => `
              <div class="sop-card">
                <h3>${sop.title}</h3>
                <p><span class="label">Purpose:</span> ${sop.purpose}</p>
                <p><span class="label">Scope:</span> ${sop.scope}</p>
                <p><span class="label">Responsibilities:</span> ${sop.responsibilities}</p>
                ${sop.procedures?.length ? `<p style="font-weight:700;margin-top:6px;">Steps:</p>${sop.procedures.map((s, i) => `<p>${i + 1}. ${s}</p>`).join('')}` : ''}
                ${sop.safetyRequirements ? `<p><span class="label">Safety:</span> ${sop.safetyRequirements}</p>` : ''}
                ${sop.carcCompliance ? `<div class="carc">CARC Compliance: ${sop.carcCompliance}</div>` : ''}
              </div>
            `).join('')}
          ` : ''}
        </div>
      `).join('')}
    `;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 800);
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a2744, #2d4a7a)',
      borderRadius: 20, padding: '48px 40px', color: 'white', textAlign: 'center', marginBottom: 40,
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>📄</div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 12 }}>{t.sections.download}</h2>
      <p style={{ color: '#94a3b8', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7 }}>
        Generate a comprehensive PDF booklet or print-ready version containing all organizational charts, job descriptions, and SOPs — 2026 edition.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <PDFGenerator />
        <button
          onClick={printFullBooklet}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', color: 'white',
            border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 10,
            padding: '14px 24px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          🖨️ {t.hero.printBooklet}
        </button>
      </div>
    </section>
  );
}
