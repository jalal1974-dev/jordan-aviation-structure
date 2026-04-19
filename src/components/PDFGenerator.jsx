import React, { useState } from 'react';
import { DEPARTMENTS, EXECUTIVE_TEAM, COMPANY_INFO } from '../data/orgData.js';

export default function PDFGenerator({ style }) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');

  const generatePDF = async () => {
    setGenerating(true);
    setProgress('Initializing...');
    try {
      const jspdfModule = await import('jspdf');
      const jsPDF = jspdfModule.jsPDF || jspdfModule.default;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const W = 210;
      const H = 297;
      const M = 18;
      const CW = W - M * 2;
      let y = M;
      const pageMap = {};

      const NAVY = [26, 39, 68];
      const NAVY2 = [15, 24, 41];
      const GOLD = [201, 168, 76];
      const GOLD2 = [232, 201, 106];
      const WHITE = [255, 255, 255];
      const LIGHT = [248, 250, 252];
      const LGRAY = [241, 245, 249];
      const GRAY = [100, 116, 139];
      const DGRAY = [30, 41, 59];
      const GREEN = [20, 83, 45];
      const LGREEN = [220, 252, 231];
      const LGREEN2 = [21, 128, 61];

      const pg = () => doc.getCurrentPageInfo().pageNumber;

      const addPage = (trackKey) => {
        doc.addPage();
        y = M;
        if (trackKey) pageMap[trackKey] = pg();
      };

      const checkY = (needed = 20) => { if (y + needed > H - M - 10) addPage(); };

      const sf = (size, wt = 'normal', color = DGRAY) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', wt);
        doc.setTextColor(...color);
      };

      const fr = (x, py, w, h, color) => {
        doc.setFillColor(...color);
        doc.rect(x, py, w, h, 'F');
      };

      const tx = (str, x, py, opts = {}) => {
        if (!str && str !== 0) return;
        doc.text(String(str), x, py, opts);
      };

      const sp = (str, maxW) => doc.splitTextToSize(String(str || ''), maxW);

      const hline = (py, color = [226, 232, 240], thick = 0.3) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(thick);
        doc.line(M, py, W - M, py);
      };

      const pageFooter = (pageNum, total) => {
        sf(7, 'normal', [148, 163, 184]);
        tx('Jordan Aviation Airline — Organization Structure & SOP Booklet | 2026', M, H - 6);
        tx(`Page ${pageNum} of ${total}`, W - M, H - 6, { align: 'right' });
        hline(H - 9, [226, 232, 240], 0.2);
      };

      // ═══════════════════════════════════════
      // COVER PAGE
      // ═══════════════════════════════════════
      setProgress('Generating cover page...');
      fr(0, 0, W, H, NAVY);
      fr(0, H * 0.55, W, H * 0.45, NAVY2);

      // Decorative gold stripe
      fr(0, 0, 6, H, GOLD);

      // Logo placeholder box (top right)
      fr(W - M - 50, 18, 50, 30, [20, 35, 60]);
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(1);
      doc.rect(W - M - 50, 18, 50, 30);
      sf(7, 'bold', GOLD);
      tx('JAV', W - M - 25, 29, { align: 'center' });
      sf(5.5, 'normal', [148, 163, 184]);
      tx('LOGO PLACEHOLDER', W - M - 25, 37, { align: 'center' });
      tx('Replace with official logo', W - M - 25, 43, { align: 'center' });

      // Gold accent bar
      fr(M + 2, 55, 5, 90, GOLD);

      // Company name
      sf(32, 'bold', WHITE);
      tx('JORDAN AVIATION', M + 14, 88);
      sf(32, 'bold', GOLD);
      tx('AIRLINE', M + 14, 102);

      // Divider line
      fr(M + 14, 110, 120, 0.5, GOLD);

      sf(13, 'normal', [180, 195, 220]);
      tx('Organization Structure System', M + 14, 120);
      tx('& Standard Operating Procedures Booklet', M + 14, 129);

      // Year badge
      fr(M + 14, 140, 40, 14, GOLD);
      sf(11, 'bold', NAVY2);
      tx('2026', M + 34, 149, { align: 'center' });

      sf(9, 'normal', [148, 163, 184]);
      tx('CARC  ·  IATA  ·  ICAO  Compliant', M + 60, 149);

      // Info box
      fr(M, 165, CW, 60, [20, 32, 56]);
      fr(M, 165, 3, 60, GOLD);
      sf(8, 'bold', GOLD);
      tx('AIRLINE DETAILS', M + 8, 176);
      sf(8, 'normal', [180, 195, 220]);
      const infoRows = [
        ['Airline Name', COMPANY_INFO.name],
        ['IATA Code', COMPANY_INFO.iataCode + '  |  ICAO: ' + COMPANY_INFO.icaoCode],
        ['Headquarters', COMPANY_INFO.headquarters],
        ['Document Date', 'January 2026'],
        ['Classification', 'Confidential — Internal Use Only'],
      ];
      infoRows.forEach(([label, val], i) => {
        sf(7.5, 'bold', [148, 163, 184]);
        tx(label + ':', M + 8, 184 + i * 8);
        sf(7.5, 'normal', WHITE);
        tx(val, M + 50, 184 + i * 8);
      });

      // Standards logos area
      fr(M, H - 45, CW, 28, [20, 32, 56]);
      ['CARC', 'IATA', 'ICAO', 'ISO'].forEach((std, i) => {
        const bx = M + 10 + i * 42;
        fr(bx, H - 41, 34, 18, [30, 48, 78]);
        sf(7, 'bold', GOLD);
        tx(std, bx + 17, H - 28, { align: 'center' });
      });
      sf(7, 'normal', [80, 100, 140]);
      tx('Compliant with international aviation standards', W / 2, H - 19, { align: 'center' });

      sf(7, 'italic', [60, 80, 110]);
      tx('✈ Excellence in the Skies', W / 2, H - 10, { align: 'center' });

      // ═══════════════════════════════════════
      // TABLE OF CONTENTS (placeholder first, fill in later)
      // ═══════════════════════════════════════
      setProgress('Building table of contents...');
      addPage('toc');
      fr(0, 0, W, 42, NAVY);
      sf(20, 'bold', WHITE);
      tx('TABLE OF CONTENTS', M, 22);
      sf(9, 'normal', GOLD);
      tx('Jordan Aviation Airline — Organization Structure System 2026', M, 34);
      y = 54;

      const tocPlaceholders = [];
      const buildTOC = () => {
        const sections = [
          { num: '1.', title: 'Company Overview', key: 'exec', major: true },
          { num: '1.1', title: 'Executive Leadership', key: 'exec', major: false },
          { num: '2.', title: 'Technical Departments', key: null, major: true },
          ...DEPARTMENTS.filter(d => d.category === 'technical').map((d, i) => ({
            num: `2.${i + 1}`, title: `${d.icon} ${d.title}`, key: `dept-${d.id}`, major: false, sub: true,
          })),
          { num: '3.', title: 'Non-Technical Departments', key: null, major: true },
          ...DEPARTMENTS.filter(d => d.category === 'non-technical').map((d, i) => ({
            num: `3.${i + 1}`, title: `${d.icon} ${d.title}`, key: `dept-${d.id}`, major: false, sub: true,
          })),
          { num: '4.', title: 'Appendices & Regulatory References', key: 'appendix', major: true },
        ];
        return sections;
      };

      const tocSections = buildTOC();
      const tocPage = pg();
      tocSections.forEach((sec, i) => {
        if (y > H - M - 16) addPage();
        if (sec.major) {
          fr(M, y - 4, CW, 10, LGRAY);
          sf(10, 'bold', NAVY);
        } else {
          sf(9, 'normal', sec.sub ? GRAY : DGRAY);
        }
        tx(sec.num, M + (sec.sub ? 8 : 2), y);
        tx(sec.title, M + (sec.sub ? 22 : 14), y);
        if (sec.key && pageMap[sec.key]) {
          const dotCount = Math.max(2, 55 - sec.title.length - (sec.sub ? 2 : 0));
          sf(9, 'normal', [180, 195, 210]);
          tx('.'.repeat(dotCount), M + (sec.sub ? 22 : 14) + doc.getTextWidth(sec.title) + 2, y);
          sf(sec.major ? 10 : 9, sec.major ? 'bold' : 'normal', NAVY);
          tx(String(pageMap[sec.key]), W - M, y, { align: 'right' });
        } else {
          sf(9, 'normal', [180, 195, 210]);
          tx('—', W - M, y, { align: 'right' });
        }
        tocPlaceholders.push({ sec, iy: y, ipg: pg() });
        y += sec.major ? 12 : 9;
      });

      // ═══════════════════════════════════════
      // EXECUTIVE SECTION
      // ═══════════════════════════════════════
      setProgress('Writing executive leadership...');
      addPage('exec');
      fr(0, 0, W, 42, NAVY);
      sf(18, 'bold', WHITE);
      tx('EXECUTIVE LEADERSHIP', M, 22);
      sf(9, 'normal', GOLD);
      tx('Jordan Aviation Airline | Board of Directors → Chairman → CEO → C-Suite', M, 34);
      y = 52;

      EXECUTIVE_TEAM.positions.forEach((pos, pi) => {
        checkY(65);
        fr(M, y, CW, 9, NAVY);
        fr(M, y, 3, 9, GOLD);
        sf(10, 'bold', WHITE);
        tx(`${pos.title}`, M + 6, y + 6);
        sf(8, 'normal', [180, 195, 220]);
        tx(`Reports to: ${pos.reportsTo}`, W - M - 2, y + 6, { align: 'right' });
        y += 12;

        sf(8, 'normal', GRAY);
        const pl = sp(pos.purpose, CW - 4);
        pl.slice(0, 3).forEach(l => { checkY(6); tx(l, M + 3, y); y += 5; });
        y += 4;

        sf(7.5, 'bold', DGRAY);
        tx('Key Responsibilities:', M + 3, y);
        y += 5;
        sf(7.5, 'normal', GRAY);
        (pos.responsibilities || []).slice(0, 5).forEach((r, ri) => {
          checkY(6);
          const rl = sp(`${ri + 1}. ${r}`, CW - 10);
          rl.forEach(l => { tx(l, M + 9, y); y += 4.5; });
        });

        if (pos.kpis?.length) {
          checkY(10);
          sf(7.5, 'bold', DGRAY);
          tx('KPIs:', M + 3, y);
          y += 5;
          sf(7.5, 'normal', GRAY);
          const kpiText = pos.kpis.join('  ·  ');
          sp(kpiText, CW - 8).slice(0, 2).forEach(l => { tx(l, M + 9, y); y += 4.5; });
        }
        y += 4;
        hline(y, [226, 232, 240]);
        y += 8;
      });

      // ═══════════════════════════════════════
      // DEPARTMENTS
      // ═══════════════════════════════════════
      const allDepts = DEPARTMENTS;
      allDepts.forEach((dept, di) => {
        setProgress(`Writing department ${di + 1}/${allDepts.length}: ${dept.title}...`);
        addPage(`dept-${dept.id}`);

        fr(0, 0, W, 46, NAVY);
        fr(0, 0, 6, 46, dept.color || GOLD);
        sf(7, 'bold', GOLD);
        tx(dept.category.toUpperCase() + ' DEPARTMENT', M, 12);
        sf(17, 'bold', WHITE);
        tx(`${dept.icon}  ${dept.title}`, M, 26);
        sf(8, 'normal', [160, 180, 210]);
        tx(`Reports to: ${dept.reportsTo}  |  ${dept.positions.length} Positions  |  ${dept.sops.length} SOPs  |  CARC Compliant`, M, 38);
        y = 54;

        sf(8.5, 'normal', GRAY);
        sp(dept.description, CW).forEach(l => { checkY(); tx(l, M, y); y += 5; });
        y += 6;

        hline(y, GOLD, 0.5);
        y += 8;

        // Org hierarchy summary
        sf(9, 'bold', NAVY);
        tx('REPORTING HIERARCHY', M, y);
        y += 6;
        dept.positions.forEach((p, pi) => {
          checkY(6);
          sf(8, 'normal', GRAY);
          const indent = '  '.repeat(pi === 0 ? 0 : 1);
          tx(`${pi === 0 ? '★' : '└─'} ${p.title}`, M + (pi === 0 ? 0 : 6), y);
          sf(7.5, 'normal', [150, 165, 185]);
          tx(`→ ${p.reportsTo}`, W - M, y, { align: 'right' });
          y += 6;
        });
        y += 6;
        hline(y, GOLD, 0.3);
        y += 10;

        // Job Descriptions
        sf(11, 'bold', NAVY);
        tx('JOB DESCRIPTIONS', M, y);
        y += 8;

        dept.positions.forEach((pos, pi) => {
          checkY(80);
          fr(M, y, CW, 9, LGRAY);
          fr(M, y, 3, 9, dept.color || GOLD);
          sf(10, 'bold', NAVY);
          tx(`${pi + 1}. ${pos.title}`, M + 6, y + 6);
          sf(8, 'normal', GRAY);
          tx(`Reports to: ${pos.reportsTo}`, W - M - 2, y + 6, { align: 'right' });
          y += 12;

          const sections = [
            ['Purpose', pos.purpose],
            ['Qualifications', pos.qualifications],
            ['Experience', pos.experience],
          ];
          sections.forEach(([label, content]) => {
            if (!content) return;
            checkY(12);
            sf(8, 'bold', DGRAY);
            tx(label + ':', M + 3, y);
            y += 5;
            sf(8, 'normal', GRAY);
            sp(content, CW - 8).slice(0, 3).forEach(l => { checkY(5); tx(l, M + 9, y); y += 4.5; });
            y += 2;
          });

          checkY(12);
          sf(8, 'bold', DGRAY);
          tx('Key Responsibilities:', M + 3, y);
          y += 5;
          sf(8, 'normal', GRAY);
          (pos.responsibilities || []).slice(0, 8).forEach((r, ri) => {
            checkY(7);
            const rl = sp(`${ri + 1}. ${r}`, CW - 10);
            rl.forEach(l => { tx(l, M + 9, y); y += 4.5; });
          });
          y += 2;

          if (pos.kpis?.length) {
            checkY(12);
            sf(8, 'bold', DGRAY);
            tx('Key Performance Indicators:', M + 3, y);
            y += 5;
            sf(8, 'normal', GRAY);
            const kpiLine = pos.kpis.join('  ·  ');
            sp(kpiLine, CW - 8).slice(0, 3).forEach(l => { checkY(5); tx(l, M + 9, y); y += 4.5; });
          }

          y += 4;
          hline(y, [226, 232, 240]);
          y += 8;
        });

        // SOPs
        if (dept.sops.length > 0) {
          checkY(20);
          fr(M, y, CW, 10, GREEN);
          fr(M, y, 3, 10, GOLD);
          sf(10, 'bold', WHITE);
          tx('STANDARD OPERATING PROCEDURES', M + 6, y + 7);
          y += 14;

          dept.sops.forEach((sop) => {
            checkY(80);
            fr(M, y, CW, 8, LGREEN);
            sf(8, 'bold', LGREEN2);
            tx(sop.id, M + 4, y + 5.5);
            sf(9, 'bold', NAVY);
            tx(sop.title.replace(sop.id + ': ', ''), M + 32, y + 5.5);
            y += 12;

            const sopSecs = [
              ['Purpose', sop.purpose],
              ['Scope', sop.scope],
              ['Responsibilities', sop.responsibilities],
            ];
            sopSecs.forEach(([label, content]) => {
              if (!content) return;
              checkY(12);
              sf(8, 'bold', DGRAY);
              tx(label + ':', M + 3, y);
              y += 5;
              sf(8, 'normal', GRAY);
              sp(content, CW - 8).slice(0, 4).forEach(l => { checkY(5); tx(l, M + 9, y); y += 4.5; });
              y += 2;
            });

            if (sop.procedures?.length) {
              checkY(14);
              sf(8, 'bold', DGRAY);
              tx('Step-by-Step Procedures:', M + 3, y);
              y += 5;
              sf(8, 'normal', GRAY);
              sop.procedures.forEach((step, si) => {
                checkY(9);
                const sl = sp(`${si + 1}. ${step}`, CW - 10);
                sl.forEach(l => { tx(l, M + 9, y); y += 4.5; });
              });
              y += 2;
            }

            if (sop.safetyRequirements) {
              checkY(14);
              fr(M, y, CW, 7, [255, 247, 237]);
              sf(7.5, 'bold', [154, 52, 18]);
              tx('⚠ Safety: ', M + 4, y + 5);
              sf(7.5, 'normal', [154, 52, 18]);
              const sl = sp(sop.safetyRequirements, CW - 28);
              tx(sl[0] || '', M + 26, y + 5);
              y += 10;
            }

            if (sop.carcCompliance) {
              checkY(12);
              fr(M, y, CW, 7, [254, 252, 232]);
              sf(7.5, 'bold', [146, 64, 14]);
              tx('⚖ CARC: ', M + 4, y + 5);
              sf(7.5, 'normal', [146, 64, 14]);
              const cl = sp(sop.carcCompliance, CW - 28);
              tx(cl[0] || '', M + 28, y + 5);
              y += 10;
            }

            hline(y, [180, 210, 190], 0.4);
            y += 8;
          });
        }
      });

      // ═══════════════════════════════════════
      // APPENDIX
      // ═══════════════════════════════════════
      setProgress('Writing appendices...');
      addPage('appendix');
      fr(0, 0, W, 42, NAVY);
      sf(18, 'bold', WHITE);
      tx('APPENDIX — REGULATORY REFERENCES', M, 22);
      sf(9, 'normal', GOLD);
      tx('CARC  ·  IATA  ·  ICAO  ·  Applicable Standards 2026', M, 34);
      y = 52;

      const refSections = [
        {
          title: 'CARC — Civil Aviation Regulatory Commission of Jordan',
          items: [
            'CARC-OPS 1 — Commercial Air Transport Operations (Aeroplanes)',
            'CARC Part 66 — Aircraft Maintenance Engineer Licensing',
            'CARC Part 145 — Approved Maintenance Organizations (AMO)',
            'CARC-OPS 1.480/1.500 — Flight Time Limitations & Rest Requirements',
            'CARC-OPS 1.035 — Quality System Requirements',
            'CARC-OPS 1.035 (c) — Safety Management System (SMS)',
            'CARC AC-120-SMS — Safety Management System Advisory Circular',
            'CARC-OPS 1.650 — Cabin Crew Procedures',
          ],
        },
        {
          title: 'IATA — International Air Transport Association',
          items: [
            'IATA ISARP — IATA Safety Audit for Ground Operations Standards',
            'IATA AHM — Airport Handling Manual (Current Edition)',
            'IATA DGR — Dangerous Goods Regulations (Current Edition)',
            'IATA STEADES — Safety Trend Evaluation Analysis and Data Exchange',
            'IATA IOSA — IATA Operational Safety Audit Standards',
            'IATA BSP — Billing and Settlement Plan Procedures',
          ],
        },
        {
          title: 'ICAO — International Civil Aviation Organization',
          items: [
            'ICAO Annex 6 Part I — Operation of Aircraft (International Commercial Air Transport)',
            'ICAO Annex 8 — Airworthiness of Aircraft',
            'ICAO Annex 19 — Safety Management (2nd Edition)',
            'ICAO Doc 9760 — Airworthiness Manual',
            'ICAO Doc 9859 — Safety Management Manual (SMM) 4th Edition',
            'ICAO Doc 9868 — Procedures for Air Navigation Services — Training (PANS-TRG)',
            'ICAO Doc 4444 — Procedures for Air Navigation Services — ATM',
          ],
        },
        {
          title: 'Abbreviations & Glossary',
          items: [
            'AOC — Air Operator Certificate',
            'ATM — Air Traffic Management',
            'CAR — Corrective Action Request',
            'CARC — Civil Aviation Regulatory Commission (Jordan)',
            'CRM — Crew Resource Management',
            'FDM/QAR — Flight Data Monitoring / Quick Access Recorder',
            'FTL — Flight Time Limitations',
            'GDS — Global Distribution System',
            'HFACS — Human Factors Analysis and Classification System',
            'IOSA — IATA Operational Safety Audit',
            'LAE — Licensed Aircraft Engineer',
            'MEL — Minimum Equipment List',
            'MRO — Maintenance, Repair & Overhaul',
            'OCC — Operations Control Center',
            'OTP — On-Time Performance',
            'SMS — Safety Management System',
            'SOP — Standard Operating Procedure',
          ],
        },
      ];

      refSections.forEach(sec => {
        checkY(30);
        fr(M, y, CW, 9, NAVY);
        fr(M, y, 3, 9, GOLD);
        sf(10, 'bold', WHITE);
        tx(sec.title, M + 6, y + 6);
        y += 13;
        sec.items.forEach(item => {
          checkY(7);
          doc.setFillColor(...GOLD);
          doc.circle(M + 5, y - 1, 0.8, 'F');
          sf(8.5, 'normal', DGRAY);
          tx(item, M + 11, y);
          y += 6.5;
        });
        y += 6;
      });

      // ═══════════════════════════════════════
      // PAGE FOOTERS
      // ═══════════════════════════════════════
      setProgress('Finalizing document...');
      const totalPages = doc.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        if (i === 1) continue;
        pageFooter(i, totalPages);
      }

      // ═══════════════════════════════════════
      // UPDATE TOC WITH REAL PAGE NUMBERS
      // ═══════════════════════════════════════
      doc.setPage(tocPage);
      y = 54;
      const tocSectionsUpdated = buildTOC();

      const eraseAndDraw = (sec, py, ipg) => {
        doc.setPage(ipg);
        fr(W - M - 20, py - 6, 20, 9, 'white');
        if (sec.key && pageMap[sec.key]) {
          sf(sec.major ? 10 : 9, sec.major ? 'bold' : 'normal', NAVY);
          tx(String(pageMap[sec.key]), W - M, py, { align: 'right' });
        }
      };

      tocPlaceholders.forEach(({ sec, iy, ipg }) => eraseAndDraw(sec, iy, ipg));

      setProgress('Saving PDF...');
      doc.save('Jordan_Aviation_Organization_Structure_Booklet_2026.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
      alert(`Error generating PDF: ${err.message}. Please try again.`);
    } finally {
      setGenerating(false);
      setProgress('');
    }
  };

  function buildTOC() {
    return [
      { num: '1.', title: 'Company Overview', key: null, major: true },
      { num: '1.1', title: 'Executive Leadership', key: 'exec', major: false },
      { num: '2.', title: 'Technical Departments', key: null, major: true },
      ...DEPARTMENTS.filter(d => d.category === 'technical').map((d, i) => ({
        num: `2.${i + 1}`, title: `${d.icon} ${d.title}`, key: `dept-${d.id}`, major: false, sub: true,
      })),
      { num: '3.', title: 'Non-Technical Departments', key: null, major: true },
      ...DEPARTMENTS.filter(d => d.category === 'non-technical').map((d, i) => ({
        num: `3.${i + 1}`, title: `${d.icon} ${d.title}`, key: `dept-${d.id}`, major: false, sub: true,
      })),
      { num: '4.', title: 'Appendices & Regulatory References', key: 'appendix', major: true },
    ];
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <button
        onClick={generatePDF}
        disabled={generating}
        className="btn btn-primary"
        style={{ fontSize: '1rem', padding: '14px 28px', opacity: generating ? 0.85 : 1, ...style }}
      >
        {generating ? `⏳ ${progress || 'Generating...'}` : '⬇ Download Complete PDF Booklet — 2026'}
      </button>
      {generating && (
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' }}>
          This may take 15–30 seconds. Please wait…
        </p>
      )}
    </div>
  );
}
