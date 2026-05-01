# Jordan Aviation Airline — Organization Structure System

A comprehensive full-stack web application for Jordan Aviation Airline's organizational structure, job descriptions, SOPs, and interactive org charts — based on the actual GOM Rev 03 (General Operating Manual, Issue 04, Nov 2024).

## Architecture

- **Frontend**: React 19 + Vite 8 (port 5000)
- **Backend**: Express.js API (port 3001)
- **Run command**: `npm run dev` (uses concurrently to start both)

## Project Structure

```
server.js              - Express API server (port 3001)
vite.config.js         - Vite dev server config (port 5000, proxies /api & /files to 3001)
index.html             - React app entry point
src/
  App.jsx              - React router app
  index.css            - Global CSS (navy/gold design system)
  main.jsx             - React entry point
  context/
    LanguageContext.jsx - EN/AR language toggle with RTL support
  data/
    orgData.js         - ALL org data sourced from actual GOM Rev 03 (departments, positions, JDs, SOPs)
  components/
    Navbar.jsx         - Top navigation with department dropdown
    Footer.jsx         - Footer with links
    DepartmentOrgChart.jsx - SVG tree chart per department
    JobDescModal.jsx   - Full job description modal overlay
    SOPModal.jsx       - SOP detail modal overlay
    PDFGenerator.jsx   - jsPDF-based downloadable booklet generator
  pages/
    HomePage.jsx       - Hero, stats, executive section, department cards by category
    OrgChartPage.jsx   - Interactive SVG company-wide org chart (pan/zoom/click)
    DepartmentPage.jsx - Department detail with tabs (Org Chart/Overview/Positions/SOPs) + Print button
    SearchPage.jsx     - Full-text search across departments, positions, SOPs
    TableOfContents.jsx - Structured TOC with page references
    EmployeeDirectoryPage.jsx - Searchable/filterable directory of all positions
```

## Data Source

All organizational data is sourced from the **actual Jordan Aviation General Operating Manual (GOM Rev 03, Issue 04, Nov 2024)**, specifically:
- **Section 1.8.1** — Company Organization charts
- **Section 1.8.2** — Job Descriptions (1.8.2.1 through 1.8.2.21)
- Verified post holder names from GOM distribution list

## Organizational Structure (from GOM)

### Top Level
- Chairman / Board of Directors
- President & CEO (reports to Chairman)
- General Manager / Accountable Manager — Capt. Ali Alfaour (reports to President & CEO)

### Post Holders (report to Accountable Manager)
- Head of Flight Operations — Capt. Adnan Takrouri
- Head of Training (Crew) — Capt. Ahmad AbuDiab
- Head of Ground Operations — Mr. Munieer Abdelsamad
- Head of Engineering / CAMO Manager — Eng. Abdelkarim Kheshman
- Quality Manager (Nominated)
- SMS Manager / Head of Safety (Nominated)
- AVSEC Manager / Head of Security (Nominated)

### Also reporting to Accountable Manager
- IOSA Compliance Manager

### Reporting to President & CEO / General Manager
- CFO (Chief Financial Officer)
- CCO (Chief Commercial Officer)
- Legal Affairs
- Consultants
- Advisor UN Affairs
- Office Manager / Secretary
- Public Relations

## Departments (11 total)

**Technical Operations (4):** Flight Operations, Crew Training, Ground Operations, Engineering & CAMO

**Safety & Compliance (4):** Quality Assurance, Safety Management (SMS), Aviation Security (AVSEC), IOSA Compliance

**Commercial (1):** Commercial (CCO-led)

**Corporate Support (3):** Finance, Legal Affairs, Public Relations, General Management Office

## Design
- Colors: Navy (#1a2744), Gold (#c9a84c), White
- Responsive for mobile and desktop
- Arabic/RTL language toggle
- Interactive SVG org charts with click-to-view job descriptions

## Key Features
- Interactive org chart per department (SVG tree)
- Company-wide org chart (pan/zoom)
- Employee Directory with search/filter/sort
- Job description modals
- SOP detail modals
- Print Department (formatted page)
- Print Full Booklet (HTML print layout)
- PDF Generator (jsPDF with 2026 cover)
- Arabic RTL language toggle
- Full-text search across all content

## Fleet (per GOM)
- Boeing B737-300: JY-JAD, JY-JAX
- Boeing B767-200: JY-JAL
- Airbus A320-211: JY-JAC, JY-JAT
- Airbus A330-200: JY-JVA, JY-JVB

## Regulatory
- CARC AOC: C 002 (valid to 23-02-2027)
- ICAO prefix: JAV
- IATA prefix: R5
- Callsign: JORDANAVIATION
