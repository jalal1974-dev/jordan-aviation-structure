import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import OrgChartPage from './pages/OrgChartPage.jsx';
import DepartmentPage from './pages/DepartmentPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import TableOfContents from './pages/TableOfContents.jsx';
import EmployeeDirectoryPage from './pages/EmployeeDirectoryPage.jsx';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/org-chart" element={<OrgChartPage />} />
          <Route path="/department/:id" element={<DepartmentPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/contents" element={<TableOfContents />} />
          <Route path="/directory" element={<EmployeeDirectoryPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </LanguageProvider>
  );
}
