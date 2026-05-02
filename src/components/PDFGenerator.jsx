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

      const W = 210, H = 297, M = 15, CW = W - M * 2;
      let y = M;

      const NAVY  = [26, 39, 68];
      const NAVY2 = [15, 24, 41];
      const GOLD  = [201, 168, 76];
      const WHITE = [255, 255, 255];
      const LGRAY = [241, 245, 249];
      const GRAY  = [100, 116, 139];
      const DGRAY = [30, 41, 59];
      const GREEN = [20, 83, 45];
      const LGREEN= [220, 252, 231];
      const ORANGE= [154, 52, 18];
      const LORANGE=[255,247,237];

      const pg = () => doc.getCurrentPageInfo().pageNumber;
      const pageMap = {};

      const addPage = (key) => {
        doc.addPage(); y = M;
        if (key) pageMap[key] = pg();
      };

      const checkY = (need = 20) => { if (y + need > H - M - 10) addPage(); };

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
        if (str === null || str === undefined) return;
        doc.text(String(str), x, py, opts);
      };

      const sp = (str, maxW) => doc.splitTextToSize(String(str || ''), maxW);

      const hline = (py, color = [226,232,240], thick = 0.3) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(thick);
        doc.line(M, py, W - M, py);
      };

      const sectionHeader = (title, subtitle, color = NAVY) => {
        fr(0, 0, W, 44, color);
        fr(0, 0, 6, 44, GOLD);
        sf(18, 'bold', WHITE);
        tx(title, M + 8, 20);
        sf(9, 'normal', GOLD);
        tx(subtitle, M + 8, 34);
        y = 54;
      };

      const footer = (pageNum, total) => {
        sf(7, 'normal', [148,163,184]);
        tx('Jordan Aviation Airline | Organization Structure & SOP Booklet 2026', M, H - 6);
        tx(`Page ${pageNum} of ${total}`, W - M, H - 6, { align: 'right' });
        doc.setDrawColor(226,232,240);
        doc.setLineWidth(0.2);
        doc.line(M, H - 9, W - M, H - 9);
      };

      // ── COVER PAGE ──────────────────────────────────
      setProgress('Cover page...');
      fr(0, 0, W, H, NAVY);
      fr(0, 0, 6, H, GOLD);
      fr(0, H * 0.6, W, H * 0.4, NAVY2);

      // Logo box
      fr(W - M - 52, 16, 52, 32, [20,35,60]);
      doc.setDrawColor(...GOLD); doc.setLineWidth(1);
      doc.rect(W - M - 52, 16, 52, 32);
      sf(9, 'bold', GOLD); tx('JAV', W - M - 26, 28, { align: 'center' });
      sf(6, 'normal', [148,163,184]);
      tx('JORDAN AVIATION', W - M - 26, 35, { align: 'center' });
      tx('LOGO PLACEHOLDER', W - M - 26, 41, { align: 'center' });

      sf(34, 'bold', WHITE); tx('JORDAN AVIATION', M + 12, 85);
      sf(34, 'bold', GOLD);  tx('AIRLINE', M + 12, 102);

      fr(M + 12, 110, 130, 0.8, GOLD);

      sf(13, 'normal', [180,195,220]);
      tx('Organization Structure System', M + 12, 122);
      tx('Job Descriptions & Standard Operating Procedures', M + 12, 132);

      fr(M + 12, 142, 42, 15, GOLD);
      sf(12, 'bold', NAVY2); tx('2026', M + 33, 152, { align: 'center' });
      sf(9, 'normal', [148,163,184]); tx('CARC  ·  IATA  ·  ICAO  Compliant', M + 62, 152);

      // Info panel
      fr(M, 168, CW, 62, [20,32,56]);
      fr(M, 168, 4, 62, GOLD);
      sf(8, 'bold', GOLD); tx('AIRLINE DETAILS', M + 10, 179);
      const infoRows = [
        ['Airline Name', COMPANY_INFO.name],
        ['IATA Code', COMPANY_INFO.iataCode + '   ICAO: ' + COMPANY_INFO.icaoCode],
        ['Headquarters', COMPANY_INFO.headquarters],
        ['Document Date', 'January 2026'],
        ['Classification', 'Confidential - Internal Use Only'],
      ];
      infoRows.forEach(([label, val], i) => {
        sf(7.5, 'bold', [148,163,184]); tx(label + ':', M + 10, 188 + i * 8);
        sf(7.5, 'normal', WHITE); tx(val, M + 55, 188 + i * 8);
      });

      // Standards
      fr(M, H - 42, CW, 26, [20,32,56]);
      ['CARC','IATA','ICAO','ISO 9001'].forEach((std, i) => {
        const bx = M + 8 + i * 43;
        fr(bx, H - 38, 36, 16, [30,48,78]);
        sf(7, 'bold', GOLD); tx(std, bx + 18, H - 27, { align: 'center' });
      });
      sf(7, 'italic', [60,80,110]);
      tx('Excellence in the Skies  -  Jordan Aviation Airline', W / 2, H - 8, { align: 'center' });

      // ── TABLE OF CONTENTS ────────────────────────────
      setProgress('Table of contents...');
      addPage('toc');
      fr(0, 0, W, 44, NAVY);
      fr(0, 0, 6, 44, GOLD);
      sf(20, 'bold', WHITE); tx('TABLE OF CONTENTS', M + 8, 22);
      sf(9, 'normal', GOLD); tx('Jordan Aviation Airline - Organization Structure System 2026', M + 8, 35);
      y = 54;

      const tocItems = [
        { num: '1.', title: 'Company Overview & Executive Leadership', key: 'exec', major: true },
        { num: '2.', title: 'Company Organization Chart (Full Hierarchy)', key: 'company-org-chart', major: true },
        { num: '3.', title: 'Technical Departments', key: null, major: true },
        ...DEPARTMENTS.filter(d => d.category === 'technical').map((d, i) => ({
          num: `3.${i+1}`, title: d.title, key: `dept-${d.id}`, major: false,
        })),
        { num: '4.', title: 'Safety & Compliance Departments', key: null, major: true },
        ...DEPARTMENTS.filter(d => d.category === 'safety-compliance').map((d, i) => ({
          num: `4.${i+1}`, title: d.title, key: `dept-${d.id}`, major: false,
        })),
        { num: '5.', title: 'Commercial Departments', key: null, major: true },
        ...DEPARTMENTS.filter(d => d.category === 'commercial').map((d, i) => ({
          num: `5.${i+1}`, title: d.title, key: `dept-${d.id}`, major: false,
        })),
        { num: '6.', title: 'Corporate Support Departments', key: null, major: true },
        ...DEPARTMENTS.filter(d => d.category === 'support').map((d, i) => ({
          num: `6.${i+1}`, title: d.title, key: `dept-${d.id}`, major: false,
        })),
        { num: '7.', title: 'Appendix - Regulatory References', key: 'appendix', major: true },
      ];

      const tocSnapshot = [];
      tocItems.forEach((item) => {
        if (y > H - M - 16) addPage();
        if (item.major) {
          fr(M, y - 5, CW, 11, LGRAY);
          sf(10, 'bold', NAVY);
        } else {
          sf(9, 'normal', GRAY);
        }
        tx(item.num, M + (item.major ? 2 : 10), y);
        tx(item.title, M + (item.major ? 16 : 24), y);
        sf(9, 'normal', [180,195,210]);
        tx('- - -', W - M - 20, y);
        tocSnapshot.push({ item, snapY: y, snapPg: pg() });
        y += item.major ? 13 : 9;
      });

      // ── EXECUTIVE SECTION ────────────────────────────
      setProgress('Executive leadership...');
      addPage('exec');
      sectionHeader('EXECUTIVE LEADERSHIP',
        'Board of Directors  >>  Chairman  >>  CEO  >>  C-Suite');

      // Executive org chart (text-based visual)
      checkY(50);
      fr(M, y, CW, 10, NAVY);
      sf(9, 'bold', WHITE); tx('COMPANY ORGANIZATIONAL HIERARCHY', M + 4, y + 7);
      y += 14;

      const execLevels = [
        { label: 'Board of Directors', color: [201,168,76] },
        { label: 'Chairman of the Board', color: NAVY },
        { label: 'Chief Executive Officer (CEO)', color: NAVY },
        { label: 'COO          CFO          CCO          CIO          CDAO          General Counsel', color: [30,60,100] },
      ];
      execLevels.forEach((level, i) => {
        checkY(12);
        const indent = i * 8;
        fr(M + indent, y, CW - indent * 2, 9, level.color);
        sf(8, 'bold', WHITE);
        tx(level.label, W / 2, y + 6, { align: 'center' });
        y += 12;
        if (i < execLevels.length - 1) {
          doc.setDrawColor(...GOLD); doc.setLineWidth(0.5);
          doc.line(W / 2, y - 3, W / 2, y + 1);
          y += 2;
        }
      });
      y += 8;
      hline(y, GOLD, 0.5); y += 10;

      // Executive positions
      EXECUTIVE_TEAM.positions.forEach((pos) => {
        checkY(70);
        fr(M, y, CW, 10, NAVY);
        fr(M, y, 4, 10, GOLD);
        sf(10, 'bold', WHITE); tx(pos.title, M + 8, y + 7);
        sf(8, 'normal', [180,195,220]);
        tx('Reports to: ' + pos.reportsTo, W - M - 2, y + 7, { align: 'right' });
        y += 13;

        if (pos.purpose) {
          sf(8, 'normal', GRAY);
          sp(pos.purpose, CW - 6).slice(0, 2).forEach(l => { checkY(6); tx(l, M + 4, y); y += 5; });
          y += 3;
        }

        sf(8, 'bold', DGRAY); tx('Key Responsibilities:', M + 4, y); y += 5;
        sf(8, 'normal', GRAY);
        (pos.responsibilities || []).slice(0, 6).forEach((r, ri) => {
          checkY(6);
          sp(`${ri+1}. ${r}`, CW - 12).forEach(l => { tx(l, M + 10, y); y += 4.5; });
        });

        if (pos.qualifications) {
          checkY(10); sf(8, 'bold', DGRAY); tx('Qualifications:', M + 4, y); y += 5;
          sf(8, 'normal', GRAY);
          sp(pos.qualifications, CW - 10).slice(0, 2).forEach(l => { tx(l, M + 10, y); y += 4.5; });
        }

        if (pos.kpis?.length) {
          checkY(10); sf(8, 'bold', DGRAY); tx('KPIs:', M + 4, y); y += 5;
          sf(8, 'normal', GRAY);
          sp(pos.kpis.join('  |  '), CW - 10).slice(0, 2).forEach(l => { tx(l, M + 10, y); y += 4.5; });
        }
        y += 5; hline(y); y += 8;
      });

      // ── COMPANY-WIDE ORG CHART SECTION ──────────────
      setProgress('Company org chart...');
      addPage('company-org-chart');
      sectionHeader('COMPANY ORGANIZATION CHART',
        'Full reporting hierarchy — Board of Directors to all positions');

      // Intro note
      sf(8.5, 'normal', GRAY);
      const orgIntro = 'This chart shows the complete reporting structure of Jordan Aviation Airline across all departments and positions, in accordance with the employee directory (دليل الموظفين) and AOC C002.';
      sp(orgIntro, CW).forEach(l => { checkY(6); tx(l, M, y); y += 5; });
      y += 6;

      // -- Draw hierarchy levels --
      const drawBox = (label, bx, by, bw, bh, bgColor, txtColor, fontSize = 7.5) => {
        fr(bx, by, bw, bh, bgColor);
        doc.setDrawColor(...GOLD); doc.setLineWidth(0.3);
        doc.rect(bx, by, bw, bh);
        sf(fontSize, 'bold', txtColor);
        const lines = sp(label, bw - 4);
        lines.slice(0, 2).forEach((l, li) => {
          tx(l, bx + bw / 2, by + bh / 2 + (li - (Math.min(lines.length,2)-1)/2) * (fontSize * 0.42), { align: 'center' });
        });
      };

      const vline = (x, y1, y2) => {
        doc.setDrawColor(...GOLD); doc.setLineWidth(0.4);
        doc.line(x, y1, x, y2);
      };
      const hconnect = (x1, x2, cy) => {
        doc.setDrawColor(...GOLD); doc.setLineWidth(0.4);
        doc.line(x1, cy, x2, cy);
      };

      const boxH = 9;
      const midX = W / 2;

      // Level 0 — Board
      checkY(180);
      drawBox('Board of Directors', midX - 32, y, 64, boxH, NAVY2, WHITE, 7.5);
      vline(midX, y + boxH, y + boxH + 5);
      y += boxH + 5;

      // Level 1 — Chairman
      drawBox('Chairman of the Board', midX - 32, y, 64, boxH, NAVY, WHITE, 7.5);
      vline(midX, y + boxH, y + boxH + 5);
      y += boxH + 5;

      // Level 2 — CEO
      fr(midX - 36, y, 72, boxH + 2, GOLD);
      doc.setDrawColor(...NAVY); doc.setLineWidth(0.5); doc.rect(midX - 36, y, 72, boxH + 2);
      sf(8.5, 'bold', NAVY2); tx('President & CEO', midX, y + (boxH + 2) / 2 + 3, { align: 'center' });
      const ceoBottom = y + boxH + 2;
      vline(midX, ceoBottom, ceoBottom + 5);
      y = ceoBottom + 5;

      // CEO horizontal bar across all direct reports
      const ceoReports = [
        { label: 'Legal Affairs', x: M, w: 28, color: [92,72,39] },
        { label: 'CFO', x: M + 31, w: 20, color: NAVY },
        { label: 'Accountable\nManager (GM)', x: M + 54, w: 32, color: NAVY },
        { label: 'CCO', x: M + 89, w: 20, color: NAVY },
        { label: 'PR Office', x: M + 112, w: 24, color: [205,133,63] },
        { label: 'HR', x: M + 139, w: 20, color: [139,69,19] },
        { label: 'IT Dept', x: M + 162, w: 22, color: [30,107,158] },
      ];

      const rowY = y;
      const centersX = ceoReports.map(r => r.x + r.w / 2);
      hconnect(centersX[0], centersX[centersX.length - 1], rowY);
      ceoReports.forEach((r, i) => {
        vline(centersX[i], rowY, rowY + 4);
        drawBox(r.label, r.x, rowY + 4, r.w, boxH + 1, r.color, WHITE, 6.5);
      });

      const ceoRow1Bottom = rowY + 4 + boxH + 1;
      y = ceoRow1Bottom + 6;

      // Second row CEO direct (overflow depts)
      const ceoReports2 = [
        { label: 'Admin / GMO', x: M + 112, w: 28, color: [112,128,144] },
        { label: 'Procurement', x: M + 143, w: 28, color: [45,106,79] },
        { label: 'Digital Trans.', x: M + 174, w: 28, color: [91,45,145] },
      ];
      ceoReports2.forEach(r => {
        drawBox(r.label, r.x, y - 4, r.w, boxH, r.color, WHITE, 6.5);
      });
      y += boxH + 2;
      hline(y, GOLD, 0.3); y += 6;

      // Under AM — section
      sf(8.5, 'bold', NAVY); tx('Accountable Manager (GM) — Direct Reports:', M, y); y += 6;
      const amDepts = [
        'Flight Operations (Post Holder)',
        'Crew Training (Post Holder)',
        'Ground Operations (Post Holder)',
        'Engineering & CAMO (Post Holder)',
        'Quality Assurance',
        'Safety Management (SMS)',
        'Aviation Security (AVSEC)',
        'IOSA Compliance',
      ];
      const amCols = 4;
      const amBoxW = (CW - (amCols - 1) * 3) / amCols;
      amDepts.forEach((d, i) => {
        const col = i % amCols;
        const row = Math.floor(i / amCols);
        const bx = M + col * (amBoxW + 3);
        const by = y + row * (boxH + 3);
        drawBox(d, bx, by, amBoxW, boxH, NAVY, WHITE, 6);
      });
      y += Math.ceil(amDepts.length / amCols) * (boxH + 3) + 6;
      hline(y, GOLD, 0.3); y += 6;

      // Under CFO
      sf(8.5, 'bold', NAVY); tx('CFO — Direct Reports:', M, y); y += 6;
      drawBox('Finance Department', M, y, 60, boxH, NAVY, WHITE, 6.5);
      y += boxH + 6;

      // Under CCO
      checkY(30);
      sf(8.5, 'bold', NAVY); tx('CCO (Chief Commercial Officer) — Direct Reports:', M, y); y += 6;
      const ccoDirect = [
        'International Affairs', 'Marketing', 'Sales & Revenue',
        'Reservation & Capacity', 'Charter Operations', 'Customer Service',
      ];
      const ccoBoxW = (CW - 5 * 3) / 6;
      ccoDirect.forEach((d, i) => {
        drawBox(d, M + i * (ccoBoxW + 3), y, ccoBoxW, boxH + 1, [184,134,11], WHITE, 5.8);
      });
      y += boxH + 1 + 8;
      hline(y, GOLD, 0.5); y += 10;

      // Reporting notes
      sf(8, 'bold', NAVY); tx('Reporting Structure Notes (per Employee Directory):', M, y); y += 6;
      const notes = [
        'Quality Assurance, Safety Management (SMS), Aviation Security (AVSEC), and IOSA Compliance report to the Accountable Manager (GM).',
        'Flight Operations, Crew Training, Ground Operations, and Engineering & CAMO are headed by CARC-designated Post Holders reporting to the AM.',
        'CCO direct reports: International Affairs, Marketing, Sales & Revenue, Reservation & Capacity Control, Non-Scheduled & Charter Operations, and Customer Service.',
        'CFO and CCO are delegated Accountable Managers reporting to the General Manager (AM).',
        'Public Relations, HR, IT, Admin/GMO, Procurement & Supply Chain, and Digital Transformation report directly to the President & CEO.',
        'Legal Affairs and Consultants report to the Chairman / President & CEO.',
      ];
      notes.forEach(note => {
        checkY(10);
        doc.setFillColor(...GOLD); doc.circle(M + 3, y - 1.5, 0.9, 'F');
        sf(7.5, 'normal', DGRAY);
        sp(note, CW - 10).forEach((l, li) => { tx(l, M + 8, y + li * 4.5); });
        y += 4.5 * Math.max(1, sp(note, CW - 10).length) + 3;
      });

      // ── DEPARTMENTS ──────────────────────────────────
      const allDepts = DEPARTMENTS;
      allDepts.forEach((dept, di) => {
        setProgress(`Department ${di+1}/${allDepts.length}: ${dept.title}...`);
        addPage(`dept-${dept.id}`);

        const dColor = dept.color ? dept.color.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)) : GOLD;

        // Dept header
        fr(0, 0, W, 46, NAVY);
        fr(0, 0, 6, 46, dColor);
        sf(7, 'bold', GOLD);
        tx((dept.category || '').toUpperCase() + ' DEPARTMENT', M + 8, 12);
        sf(17, 'bold', WHITE); tx(dept.title, M + 8, 26);
        sf(8, 'normal', [160,180,210]);
        tx(`Reports to: ${dept.reportsTo}  |  ${dept.positions?.length || 0} Positions  |  ${dept.sops?.length || 0} SOPs  |  CARC Compliant`, M + 8, 38);
        y = 54;

        // Dept description
        if (dept.description) {
          sf(8.5, 'normal', GRAY);
          sp(dept.description, CW).forEach(l => { checkY(6); tx(l, M, y); y += 5; });
          y += 4;
        }

        // ── ORG CHART (visual boxes) ──
        checkY(40);
        fr(M, y, CW, 9, NAVY);
        sf(9, 'bold', WHITE); tx('DEPARTMENT ORGANIZATIONAL CHART', M + 4, y + 6);
        y += 13;

        const positions = dept.positions || [];
        if (positions.length > 0) {
          // Draw head position
          const head = positions[0];
          const boxW = Math.min(CW * 0.55, 100);
          const boxX = M + (CW - boxW) / 2;
          fr(boxX, y, boxW, 12, dColor);
          sf(8, 'bold', WHITE);
          const headLines = sp(head.title, boxW - 6);
          headLines.slice(0,2).forEach((l, li) => tx(l, boxX + boxW/2, y + 7 + li * 4.5, { align: 'center' }));
          const headBottom = y + 12;
          y += 16;

          // Draw connecting line down
          if (positions.length > 1) {
            doc.setDrawColor(...GOLD); doc.setLineWidth(0.5);
            doc.line(W/2, headBottom, W/2, y);

            // Horizontal line
            const subW = Math.min((CW - 10) / Math.min(positions.length - 1, 4), 48);
            const subCount = Math.min(positions.length - 1, 4);
            const totalSubW = subCount * subW + (subCount - 1) * 4;
            const startX = M + (CW - totalSubW) / 2;

            doc.line(startX + subW/2, y, startX + totalSubW - subW/2, y);

            positions.slice(1, 5).forEach((pos, pi) => {
              checkY(20);
              const bx = startX + pi * (subW + 4);
              doc.line(bx + subW/2, y, bx + subW/2, y + 4);
              fr(bx, y + 4, subW, 11, NAVY);
              doc.setDrawColor(...dColor); doc.setLineWidth(0.5);
              doc.rect(bx, y + 4, subW, 11);
              sf(6.5, 'normal', WHITE);
              sp(pos.title, subW - 4).slice(0,2).forEach((l, li) =>
                tx(l, bx + subW/2, y + 9 + li * 4, { align: 'center' })
              );
            });

            if (positions.length > 5) {
              sf(7, 'italic', GRAY);
              tx(`+ ${positions.length - 5} more positions (see job descriptions below)`, W/2, y + 22, { align: 'center' });
            }
            y += 28;
          }
        }

        y += 6; hline(y, GOLD, 0.4); y += 8;

        // ── REPORTING HIERARCHY TEXT ──
        sf(9, 'bold', NAVY); tx('REPORTING HIERARCHY', M, y); y += 7;
        positions.forEach((p, pi) => {
          checkY(7);
          const prefix = pi === 0 ? '  [HEAD]  ' : '     |___  ';
          sf(8, pi === 0 ? 'bold' : 'normal', pi === 0 ? NAVY : GRAY);
          tx(prefix + p.title, M + 2, y);
          sf(7.5, 'normal', [150,165,185]);
          tx('>> ' + p.reportsTo, W - M, y, { align: 'right' });
          y += 6.5;
        });
        y += 6; hline(y, GOLD, 0.3); y += 10;

        // ── JOB DESCRIPTIONS ──
        checkY(20);
        fr(M, y, CW, 9, NAVY);
        fr(M, y, 4, 9, dColor);
        sf(10, 'bold', WHITE); tx('JOB DESCRIPTIONS', M + 8, y + 6);
        y += 13;

        positions.forEach((pos, pi) => {
          checkY(60);
          fr(M, y, CW, 10, LGRAY);
          fr(M, y, 4, 10, dColor);
          sf(10, 'bold', NAVY); tx(`${pi+1}. ${pos.title}`, M + 8, y + 7);
          sf(8, 'normal', GRAY); tx('Reports to: ' + pos.reportsTo, W - M - 2, y + 7, { align: 'right' });
          y += 13;

          [['Purpose', pos.purpose], ['Qualifications', pos.qualifications], ['Experience', pos.experience]].forEach(([label, content]) => {
            if (!content) return;
            checkY(12); sf(8, 'bold', DGRAY); tx(label + ':', M + 4, y); y += 5;
            sf(8, 'normal', GRAY);
            sp(content, CW - 10).slice(0, 3).forEach(l => { checkY(5); tx(l, M + 10, y); y += 4.5; });
            y += 2;
          });

          if (pos.responsibilities?.length) {
            checkY(12); sf(8, 'bold', DGRAY); tx('Key Responsibilities:', M + 4, y); y += 5;
            sf(8, 'normal', GRAY);
            pos.responsibilities.slice(0, 8).forEach((r, ri) => {
              checkY(7);
              sp(`${ri+1}. ${r}`, CW - 12).forEach(l => { tx(l, M + 10, y); y += 4.5; });
            });
            y += 2;
          }

          if (pos.kpis?.length) {
            checkY(12); sf(8, 'bold', DGRAY); tx('Key Performance Indicators:', M + 4, y); y += 5;
            sf(8, 'normal', GRAY);
            sp(pos.kpis.join('  |  '), CW - 10).slice(0, 3).forEach(l => { checkY(5); tx(l, M + 10, y); y += 4.5; });
          }
          y += 5; hline(y); y += 8;
        });

        // ── SOPs ──
        if (dept.sops?.length > 0) {
          checkY(20);
          fr(M, y, CW, 10, GREEN);
          fr(M, y, 4, 10, GOLD);
          sf(10, 'bold', WHITE); tx('STANDARD OPERATING PROCEDURES (SOPs)', M + 8, y + 7);
          y += 14;

          dept.sops.forEach((sop) => {
            checkY(60);
            fr(M, y, CW, 9, LGREEN);
            sf(8, 'bold', [20,83,45]); tx(sop.id || '', M + 4, y + 6);
            sf(9, 'bold', NAVY); tx((sop.title || '').replace((sop.id || '') + ': ', ''), M + 36, y + 6);
            y += 12;

            [['Purpose', sop.purpose], ['Scope', sop.scope], ['Responsibilities', sop.responsibilities]].forEach(([label, content]) => {
              if (!content) return;
              checkY(12); sf(8, 'bold', DGRAY); tx(label + ':', M + 4, y); y += 5;
              sf(8, 'normal', GRAY);
              sp(content, CW - 10).slice(0, 4).forEach(l => { checkY(5); tx(l, M + 10, y); y += 4.5; });
              y += 2;
            });

            if (sop.procedures?.length) {
              checkY(14); sf(8, 'bold', DGRAY); tx('Step-by-Step Procedures:', M + 4, y); y += 5;
              sf(8, 'normal', GRAY);
              sop.procedures.forEach((step, si) => {
                checkY(8);
                sp(`${si+1}. ${step}`, CW - 12).forEach(l => { tx(l, M + 10, y); y += 4.5; });
              });
              y += 2;
            }

            if (sop.safetyRequirements) {
              checkY(12);
              fr(M, y, CW, 8, LORANGE);
              fr(M, y, 4, 8, ORANGE);
              sf(7.5, 'bold', ORANGE); tx('SAFETY:', M + 8, y + 5.5);
              sf(7.5, 'normal', ORANGE);
              sp(sop.safetyRequirements, CW - 30).slice(0,1).forEach(l => tx(l, M + 30, y + 5.5));
              y += 11;
            }

            if (sop.carcCompliance) {
              checkY(12);
              fr(M, y, CW, 8, [254,252,232]);
              fr(M, y, 4, 8, [146,64,14]);
              sf(7.5, 'bold', [146,64,14]); tx('CARC:', M + 8, y + 5.5);
              sf(7.5, 'normal', [146,64,14]);
              sp(sop.carcCompliance, CW - 28).slice(0,1).forEach(l => tx(l, M + 28, y + 5.5));
              y += 11;
            }

            hline(y, [180,210,190], 0.4); y += 8;
          });
        }
      });

      // ── APPENDIX ────────────────────────────────────
      setProgress('Appendix...');
      addPage('appendix');
      sectionHeader('APPENDIX - REGULATORY REFERENCES',
        'CARC  |  IATA  |  ICAO  |  Applicable Standards 2026');

      const refs = [
        { title: 'CARC - Civil Aviation Regulatory Commission of Jordan', items: [
          'CARC-OPS 1 - Commercial Air Transport Operations (Aeroplanes)',
          'CARC Part 66 - Aircraft Maintenance Engineer Licensing',
          'CARC Part 145 - Approved Maintenance Organizations (AMO)',
          'CARC-OPS 1.480/1.500 - Flight Time Limitations & Rest Requirements',
          'CARC-OPS 1.035 - Quality System Requirements',
          'CARC AC-120-SMS - Safety Management System Advisory Circular',
          'CARC-OPS 1.650 - Cabin Crew Procedures',
        ]},
        { title: 'IATA - International Air Transport Association', items: [
          'IATA ISARP - Safety Audit for Ground Operations Standards',
          'IATA AHM - Airport Handling Manual (Current Edition)',
          'IATA DGR - Dangerous Goods Regulations (Current Edition)',
          'IATA IOSA - Operational Safety Audit Standards',
          'IATA BSP - Billing and Settlement Plan Procedures',
        ]},
        { title: 'ICAO - International Civil Aviation Organization', items: [
          'ICAO Annex 6 Part I - Operation of Aircraft',
          'ICAO Annex 8 - Airworthiness of Aircraft',
          'ICAO Annex 19 - Safety Management (2nd Edition)',
          'ICAO Doc 9859 - Safety Management Manual (SMM) 4th Edition',
          'ICAO Doc 4444 - Procedures for Air Navigation Services - ATM',
        ]},
        { title: 'Abbreviations & Glossary', items: [
          'AOC - Air Operator Certificate',
          'CARC - Civil Aviation Regulatory Commission (Jordan)',
          'CRM - Crew Resource Management',
          'FTL - Flight Time Limitations',
          'IOSA - IATA Operational Safety Audit',
          'LAE - Licensed Aircraft Engineer',
          'MEL - Minimum Equipment List',
          'MRO - Maintenance, Repair & Overhaul',
          'OCC - Operations Control Center',
          'OTP - On-Time Performance',
          'SMS - Safety Management System',
          'SOP - Standard Operating Procedure',
        ]},
      ];

      refs.forEach(sec => {
        checkY(30);
        fr(M, y, CW, 10, NAVY); fr(M, y, 4, 10, GOLD);
        sf(10, 'bold', WHITE); tx(sec.title, M + 8, y + 7);
        y += 14;
        sec.items.forEach(item => {
          checkY(7);
          doc.setFillColor(...GOLD); doc.circle(M + 5, y - 1.5, 0.9, 'F');
          sf(8.5, 'normal', DGRAY); tx(item, M + 11, y);
          y += 6.5;
        });
        y += 6;
      });

      // ── FOOTERS ─────────────────────────────────────
      setProgress('Adding page footers...');
      const totalPages = doc.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        doc.setPage(i); footer(i, totalPages);
      }

      // ── UPDATE TOC ───────────────────────────────────
      doc.setPage(pageMap['toc'] || 2);
      tocSnapshot.forEach(({ item, snapY, snapPg }) => {
        if (!item.key || !pageMap[item.key]) return;
        doc.setPage(snapPg);
        fr(W - M - 22, snapY - 6, 22, 8, item.major ? LGRAY : WHITE);
        sf(item.major ? 10 : 9, item.major ? 'bold' : 'normal', NAVY);
        tx(String(pageMap[item.key]), W - M, snapY, { align: 'right' });
      });

      setProgress('Saving...');
      doc.save('Jordan_Aviation_Organization_Structure_Booklet_2026.pdf');

    } catch (err) {
      console.error('PDF error:', err);
      alert('Error generating PDF: ' + err.message);
    } finally {
      setGenerating(false);
      setProgress('');
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
      <button
        onClick={generatePDF}
        disabled={generating}
        className="btn btn-primary"
        style={{ fontSize:'1rem', padding:'14px 28px', opacity: generating ? 0.85 : 1, ...style }}
      >
        {generating ? `⏳ ${progress || 'Generating...'}` : '⬇ Download Complete PDF Booklet 2026'}
      </button>
      {generating && (
        <p style={{ color:'#94a3b8', fontSize:'0.8rem', textAlign:'center' }}>
          Please wait 20-40 seconds while generating your booklet...
        </p>
      )}
    </div>
  );
}
