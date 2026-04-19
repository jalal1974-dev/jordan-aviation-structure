import React, { useState } from 'react';
import { DEPARTMENTS, EXECUTIVE_TEAM, COMPANY_INFO } from '../data/orgData.js';

export default function PDFGenerator({ style }) {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210;
      const H = 297;
      const margin = 20;
      const contentW = W - margin * 2;
      let y = 0;

      const NAVY = [26, 39, 68];
      const GOLD = [201, 168, 76];
      const WHITE = [255, 255, 255];
      const LIGHT = [248, 250, 252];
      const GRAY = [100, 116, 139];

      const addPage = () => { doc.addPage(); y = margin; };

      const checkY = (needed = 20) => { if (y + needed > H - margin) addPage(); };

      const setFont = (size, style = 'normal', color = [30, 41, 59]) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
      };

      const fillRect = (x, py, w, h, color) => {
        doc.setFillColor(...color);
        doc.rect(x, py, w, h, 'F');
      };

      const text = (str, x, py, opts = {}) => {
        if (!str) return;
        doc.text(String(str), x, py, opts);
      };

      const splitText = (str, maxW) => doc.splitTextToSize(String(str || ''), maxW);

      // ─── COVER PAGE ───
      fillRect(0, 0, W, H, NAVY);
      fillRect(0, H * 0.6, W, H * 0.4, [15, 24, 41]);

      fillRect(margin, 60, 8, 80, GOLD);

      setFont(28, 'bold', WHITE);
      text('JORDAN AVIATION', margin + 16, 90);
      setFont(28, 'bold', GOLD);
      text('AIRLINE', margin + 16, 102);

      setFont(14, 'normal', [148, 163, 184]);
      text('Organization Structure System', margin + 16, 116);
      text('& Standard Operating Procedures', margin + 16, 124);

      setFont(10, 'normal', [148, 163, 184]);
      text('Compliant with CARC | IATA | ICAO', margin + 16, 145);

      fillRect(margin, 160, contentW, 0.5, GOLD);

      setFont(9, 'normal', [148, 163, 184]);
      const infoItems = [
        `IATA Code: ${COMPANY_INFO.iataCode}`,
        `ICAO Code: ${COMPANY_INFO.icaoCode}`,
        `Headquarters: ${COMPANY_INFO.headquarters}`,
        `Document Date: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}`,
      ];
      infoItems.forEach((item, i) => text(item, margin + 16, 170 + i * 10));

      setFont(8, 'italic', [71, 85, 105]);
      text('CONFIDENTIAL — For Internal Use Only', W / 2, H - 15, { align: 'center' });

      // ─── TABLE OF CONTENTS ───
      addPage();
      fillRect(0, 0, W, 40, NAVY);
      setFont(18, 'bold', WHITE);
      text('TABLE OF CONTENTS', margin, 26);
      y = 55;

      const tocItems = [
        ['1.', 'Company Overview & Executive Leadership', 3],
        ['2.', 'Company-Wide Organization Chart', 4],
        ['3.', 'Technical Departments', 5],
        ...DEPARTMENTS.filter(d => d.category === 'technical').map((d, i) => [`3.${i + 1}`, `${d.title}`, 6 + i * 2]),
        ['4.', 'Non-Technical Departments', 18],
        ...DEPARTMENTS.filter(d => d.category === 'non-technical').map((d, i) => [`4.${i + 1}`, `${d.title}`, 19 + i * 2]),
        ['5.', 'Appendices & CARC References', 32],
      ];

      tocItems.forEach((item, i) => {
        checkY(10);
        const isMajor = item[0].length === 2;
        if (isMajor) {
          fillRect(margin, y - 4, contentW, 9, LIGHT);
          setFont(10, 'bold', NAVY);
        } else {
          setFont(9, 'normal', GRAY);
        }
        text(item[0], margin + 2, y);
        text(item[1], margin + 14, y);
        const dots = '.' .repeat(Math.max(0, 60 - item[1].length));
        text(dots, margin + 14 + doc.getTextWidth(item[1]), y);
        text(String(item[2]), W - margin, y, { align: 'right' });
        y += 10;
      });

      // ─── EXECUTIVE SECTION ───
      addPage();
      fillRect(0, 0, W, 40, NAVY);
      setFont(16, 'bold', WHITE);
      text('EXECUTIVE LEADERSHIP', margin, 22);
      setFont(9, 'normal', GOLD);
      text('Jordan Aviation Airline', margin, 33);
      y = 50;

      EXECUTIVE_TEAM.positions.forEach(pos => {
        checkY(60);
        fillRect(margin, y, contentW, 8, NAVY);
        setFont(10, 'bold', WHITE);
        text(pos.title, margin + 3, y + 5.5);
        setFont(8, 'normal', [71, 85, 105]);
        text(`Reports to: ${pos.reportsTo}`, W - margin - 3, y + 5.5, { align: 'right' });
        y += 10;

        setFont(8, 'normal', [30, 41, 59]);
        const purposeLines = splitText(pos.purpose, contentW - 4);
        purposeLines.slice(0, 3).forEach(line => { text(line, margin + 2, y); y += 5; });
        y += 6;
      });

      // ─── DEPARTMENTS ───
      const allDepts = DEPARTMENTS;
      allDepts.forEach(dept => {
        addPage();

        fillRect(0, 0, W, 44, NAVY);
        setFont(8, 'bold', GOLD);
        text(dept.category.toUpperCase(), margin, 14);
        setFont(16, 'bold', WHITE);
        text(dept.icon + ' ' + dept.title, margin, 27);
        setFont(8, 'normal', [148, 163, 184]);
        text(`Reports to: ${dept.reportsTo} | ${dept.positions.length} Positions | ${dept.sops.length} SOPs`, margin, 38);
        y = 54;

        const descLines = splitText(dept.description, contentW);
        setFont(9, 'normal', GRAY);
        descLines.forEach(line => { checkY(); text(line, margin, y); y += 5; });
        y += 8;

        fillRect(margin, y, contentW, 0.5, GOLD);
        y += 8;

        dept.positions.forEach((pos, pi) => {
          checkY(80);
          fillRect(margin, y, contentW, 7, [241, 245, 249]);
          setFont(10, 'bold', NAVY);
          text(`${pi + 1}. ${pos.title}`, margin + 3, y + 5);
          setFont(8, 'normal', GRAY);
          text(`Reports to: ${pos.reportsTo}`, W - margin - 3, y + 5, { align: 'right' });
          y += 9;

          setFont(8, 'bold', [30, 41, 59]);
          text('Purpose:', margin + 2, y);
          y += 5;
          setFont(8, 'normal', GRAY);
          const pl = splitText(pos.purpose, contentW - 6);
          pl.slice(0, 3).forEach(l => { checkY(); text(l, margin + 6, y); y += 4.5; });
          y += 3;

          setFont(8, 'bold', [30, 41, 59]);
          text('Key Responsibilities:', margin + 2, y);
          y += 5;
          setFont(8, 'normal', GRAY);
          (pos.responsibilities || []).slice(0, 6).forEach((r, ri) => {
            checkY(8);
            const rl = splitText(`${ri + 1}. ${r}`, contentW - 10);
            rl.forEach(l => { text(l, margin + 8, y); y += 4.5; });
          });
          y += 3;

          setFont(8, 'bold', [30, 41, 59]);
          text('Qualifications:', margin + 2, y);
          y += 5;
          setFont(8, 'normal', GRAY);
          const ql = splitText(pos.qualifications, contentW - 6);
          ql.slice(0, 2).forEach(l => { checkY(); text(l, margin + 6, y); y += 4.5; });
          y += 3;

          if (pos.kpis?.length) {
            checkY(12);
            setFont(8, 'bold', [30, 41, 59]);
            text('KPIs:', margin + 2, y);
            y += 5;
            setFont(8, 'normal', GRAY);
            text(pos.kpis.join(' | '), margin + 6, y, { maxWidth: contentW - 10 });
            y += 6;
          }

          fillRect(margin, y, contentW, 0.3, [226, 232, 240]);
          y += 8;
        });

        if (dept.sops.length > 0) {
          checkY(20);
          fillRect(margin, y, contentW, 8, [20, 83, 45]);
          setFont(10, 'bold', WHITE);
          text('STANDARD OPERATING PROCEDURES', margin + 3, y + 5.5);
          y += 12;

          dept.sops.forEach((sop, si) => {
            checkY(70);
            setFont(9, 'bold', [21, 128, 61]);
            text(sop.id, margin + 2, y);
            setFont(10, 'bold', NAVY);
            text(sop.title.replace(sop.id + ': ', ''), margin + 2, y + 6);
            y += 12;

            const sopSections = [
              ['Purpose', sop.purpose],
              ['Scope', sop.scope],
              ['Responsibilities', sop.responsibilities],
              ['Safety Requirements', sop.safetyRequirements],
              ['CARC Compliance', sop.carcCompliance],
            ];

            sopSections.forEach(([label, content]) => {
              if (!content) return;
              checkY(16);
              setFont(8, 'bold', [30, 41, 59]);
              text(label + ':', margin + 2, y);
              y += 5;
              setFont(8, 'normal', GRAY);
              const cl = splitText(content, contentW - 6);
              cl.slice(0, 4).forEach(l => { checkY(); text(l, margin + 6, y); y += 4.5; });
              y += 3;
            });

            if (sop.procedures?.length) {
              checkY(20);
              setFont(8, 'bold', [30, 41, 59]);
              text('Step-by-Step Procedures:', margin + 2, y);
              y += 5;
              setFont(8, 'normal', GRAY);
              sop.procedures.slice(0, 6).forEach((step, si) => {
                checkY(10);
                const sl = splitText(`${si + 1}. ${step}`, contentW - 10);
                sl.forEach(l => { text(l, margin + 8, y); y += 4.5; });
              });
              y += 4;
            }

            fillRect(margin, y, contentW, 0.5, [148, 163, 184]);
            y += 8;
          });
        }
      });

      // ─── APPENDIX ───
      addPage();
      fillRect(0, 0, W, 40, NAVY);
      setFont(16, 'bold', WHITE);
      text('APPENDIX — REGULATORY REFERENCES', margin, 26);
      y = 52;

      const refs = [
        ['CARC References', [
          'CARC-OPS 1 — Commercial Air Transport Operations (Aeroplanes)',
          'CARC Part 66 — Aircraft Maintenance Licensing',
          'CARC Part 145 — Approved Maintenance Organizations',
          'CARC-OPS 1.480/1.500 — Flight Time Limitations & Rest Requirements',
          'CARC AC-120-SMS — Safety Management System Advisory Circular',
        ]],
        ['IATA Standards', [
          'IATA ISARP — IATA Safety Audit for Ground Operations Standards',
          'IATA AHM — Airport Handling Manual',
          'IATA DGR — Dangerous Goods Regulations',
          'IATA STEADES — Safety Trend Evaluation Analysis and Data Exchange System',
        ]],
        ['ICAO Annexes', [
          'ICAO Annex 6 Part I — Operation of Aircraft (Commercial Air Transport)',
          'ICAO Annex 8 — Airworthiness of Aircraft',
          'ICAO Annex 19 — Safety Management',
          'ICAO Doc 9760 — Airworthiness Manual',
          'ICAO Doc 9859 — Safety Management Manual (SMM)',
        ]],
      ];

      refs.forEach(([section, items]) => {
        checkY(30);
        fillRect(margin, y, contentW, 8, NAVY);
        setFont(10, 'bold', WHITE);
        text(section, margin + 3, y + 5.5);
        y += 12;
        items.forEach(item => {
          checkY(8);
          setFont(9, 'normal', [30, 41, 59]);
          doc.setDrawColor(201, 168, 76);
          doc.circle(margin + 4, y - 1, 1, 'F');
          text(item, margin + 10, y);
          y += 7;
        });
        y += 6;
      });

      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        setFont(7, 'normal', [148, 163, 184]);
        text(`Jordan Aviation Airline — Organization Structure System`, margin, H - 8);
        text(`Page ${i} of ${totalPages}`, W - margin, H - 8, { align: 'right' });
        fillRect(margin, H - 12, contentW, 0.3, [226, 232, 240]);
      }

      doc.save('Jordan_Aviation_Organization_Structure_Booklet.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={generating}
      className="btn btn-primary"
      style={{ fontSize: '1rem', padding: '14px 28px', opacity: generating ? 0.7 : 1, ...style }}
    >
      {generating ? '⏳ Generating PDF...' : '⬇ Download Complete PDF Booklet'}
    </button>
  );
}
