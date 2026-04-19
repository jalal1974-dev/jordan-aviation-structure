import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../data/orgData.js';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDeptOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ('');
    }
  };

  const technical = DEPARTMENTS.filter(d => d.category === 'technical');
  const nonTechnical = DEPARTMENTS.filter(d => d.category === 'non-technical');

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 900,
      background: scrolled ? 'rgba(26,39,68,0.97)' : '#1a2744',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 8 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 16 }}>
          <div style={{
            width: 40, height: 40, background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', flexShrink: 0,
          }}>✈</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>Jordan Aviation</div>
            <div style={{ color: '#c9a84c', fontSize: '0.65rem', letterSpacing: 1 }}>ORG STRUCTURE</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }} className="desktop-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/org-chart">Org Chart</NavLink>
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setDeptOpen(true)}
            onMouseLeave={() => setDeptOpen(false)}
          >
            <button style={{
              color: '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 500, padding: '8px 12px', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 4,
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
              onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
            >
              Departments <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>
            {deptOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: -20,
                background: 'white', borderRadius: 12, padding: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                width: 520, display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 8, border: '1px solid #e2e8f0',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, padding: '4px 8px', marginBottom: 4 }}>Technical</div>
                  {technical.map(d => (
                    <Link key={d.id} to={`/department/${d.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px',
                      borderRadius: 8, color: '#334155', fontSize: '0.85rem', fontWeight: 500,
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>{d.icon}</span> {d.title}
                    </Link>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, padding: '4px 8px', marginBottom: 4 }}>Non-Technical</div>
                  {nonTechnical.map(d => (
                    <Link key={d.id} to={`/department/${d.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px',
                      borderRadius: 8, color: '#334155', fontSize: '0.85rem', fontWeight: 500,
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>{d.icon}</span> {d.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <NavLink to="/contents">Contents</NavLink>
          <NavLink to="/search">Search</NavLink>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Find position or dept..."
            style={{
              padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem',
              width: 200, outline: 'none', transition: 'all 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#c9a84c'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
          />
        </form>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', color: 'white', background: 'none', border: 'none',
            fontSize: '1.4rem', cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >☰</button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} style={{
      color: active ? '#c9a84c' : '#cbd5e1',
      fontSize: '0.875rem', fontWeight: active ? 600 : 500,
      padding: '8px 12px', borderRadius: 8,
      transition: 'color 0.15s',
      borderBottom: active ? '2px solid #c9a84c' : '2px solid transparent',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#e2e8f0'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#cbd5e1'; }}
    >
      {children}
    </Link>
  );
}
