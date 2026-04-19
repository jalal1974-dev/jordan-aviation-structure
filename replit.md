# Jordan Aviation Airline — Organization Structure System

A comprehensive full-stack web application for Jordan Aviation Airline's organizational structure, job descriptions, SOPs, and interactive org charts.

## Architecture

- **Frontend**: React 19 + Vite 8 (port 5000)
- **Backend**: Express.js API (port 3001)
- **Run command**: `npm run dev` (uses concurrently to start both)

## Project Structure

```
server.js              - Express API server (port 3001) — serves document files & /api/documents
vite.config.js         - Vite dev server config (port 5000, proxies /api & /files to 3001)
index.html             - React app entry point
src/
  App.jsx              - React router app
  index.css            - Global CSS (navy/gold design system)
  main.jsx             - React entry point
  data/
    orgData.js         - ALL org data (departments, positions, job descriptions, SOPs)
  components/
    Navbar.jsx         - Top navigation with department dropdown
    Footer.jsx         - Footer with links
    JobDescModal.jsx   - Full job description modal overlay
    SOPModal.jsx       - SOP detail modal overlay
    PDFGenerator.jsx   - jsPDF-based downloadable booklet generator
  pages/
    HomePage.jsx       - Hero, stats, executive section, department cards
    OrgChartPage.jsx   - Interactive SVG company-wide org chart (pan/zoom/click)
    DepartmentPage.jsx - Department detail with tabs (overview/positions/SOPs)
    SearchPage.jsx     - Full-text search across departments, positions, SOPs
    TableOfContents.jsx - Structured TOC with page references
```

## Content Coverage

### 16 Departments
**Technical:** Flight Operations, Maintenance & Engineering, Safety SMS, Quality Assurance, Ground Operations, Cabin Crew & Inflight  
**Non-Technical:** HR, IT, Finance & Accounting, Commercial & Sales, Marketing, Legal & Compliance, Customer Service, Procurement, AI & Digital Transformation, Corporate Communications

### For Each Department
- Department description and org structure
- All positions with full job descriptions (title, reports to, purpose, 8+ responsibilities, qualifications, experience, KPIs)
- Standard Operating Procedures (SOPs) with: purpose, scope, responsibilities, step-by-step procedures, safety requirements, CARC compliance notes

## Design
- Colors: Navy (#1a2744), Gold (#c9a84c), White
- Responsive for mobile and desktop
- Professional airline industry look

## Features
- Interactive company-wide org chart (pan, zoom, click to navigate)
- Department drill-down pages with tab navigation
- Click any position to view full job description modal
- Click any SOP to view complete procedure modal
- Search across all content (departments, positions, SOPs)
- One-click PDF booklet download with complete org structure and SOPs
- Table of Contents page

## Running

```bash
npm run dev
```

Starts both Express API (port 3001) and Vite dev server (port 5000).

## Document Files

The original Jordan Aviation documents are also served from the API:
- Root: General org charts
- `jav schadule and hr/`: HR and digital plans
- `structure 1/`: Airline & MRO SOPs
- `structure 2/`: Operations and compliance docs
