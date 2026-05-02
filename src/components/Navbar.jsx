import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../data/orgData.js';
import { useLang } from '../context/LanguageContext.jsx';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang, toggle } = useLang();

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

  const technical = DEPARTMENTS.filter(d => d.category === 'technical' || d.category === 'safety-compliance');
  const nonTechnical = DEPARTMENTS.filter(d => d.category !== 'technical' && d.category !== 'safety-compliance');

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 900,
      background: scrolled ? 'rgba(26,39,68,0.97)' : '#1a2744',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: 8 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginInlineEnd: 16, textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40, background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', flexShrink: 0,
          }}>✈</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>{t.appName}</div>
            <div style={{ color: '#c9a84c', fontSize: '0.65rem', letterSpacing: 1 }}>{t.appSubtitle}</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }} className="desktop-nav">
          <NavLink to="/">{t.nav.home}</NavLink>
          <NavLink to="/org-chart">{t.nav.orgChart}</NavLink>

          <div style={{ position: 'relative' }}
            onMouseEnter={() => setDeptOpen(true)}
            onMouseLeave={() => setDeptOpen(false)}
          >
            <button style={{
              color: '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 500, padding: '8px 12px', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
              onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
            >
              {t.nav.departments} <span style={{ fontSize: '0.7rem' }}>▼</span>
            </button>
            {deptOpen && (
              <div style={{
                position: 'absolute', top: '100%', insetInlineStart: -20,
                background: 'white', borderRadius: 12, padding: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                width: 620, display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 12, border: '1px solid #e2e8f0',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a2744', textTransform: 'uppercase', letterSpacing: 1, padding: '4px 8px', marginBottom: 4, borderBottom: '2px solid #1a2744' }}>{t.nav.technical}</div>
                  {technical.map(d => (
                    <Link key={d.id} to={`/department/${d.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px',
                      borderRadius: 8, color: '#334155', fontSize: '0.85rem', fontWeight: 500,
                      transition: 'background 0.15s', textDecoration: 'none',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span>{d.icon}</span> {d.title}
                    </Link>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: 1, padding: '4px 8px', marginBottom: 4, borderBottom: '2px solid #c9a84c' }}>{t.nav.nonTechnical}</div>
                  <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                    {nonTechnical.map(d => (
                      <Link key={d.id} to={`/department/${d.id}`} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px',
                        borderRadius: 8, color: '#334155', fontSize: '0.85rem', fontWeight: 500,
                        transition: 'background 0.15s', textDecoration: 'none',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>{d.icon}</span> {d.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/directory">{t.nav.directory}</NavLink>
          <NavLink to="/contents">{t.nav.contents}</NavLink>
          <NavLink to="/search">{t.nav.search}</NavLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6 }}>
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              style={{
                padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem',
                width: 190, outline: 'none', transition: 'all 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#c9a84c'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
            />
          </form>

          <button
            onClick={toggle}
            title={lang === 'en' ? 'Switch to Arabic' : 'التحويل إلى الإنجليزية'}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(201,168,76,0.15)', color: '#c9a84c',
              border: '1.5px solid rgba(201,168,76,0.4)', borderRadius: 8,
              padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
              transition: 'all 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; }}
          >
            {lang === 'en' ? '🇯🇴 عربي' : '🇬🇧 EN'}
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', color: 'white', background: 'none', border: 'none',
            fontSize: '1.4rem', cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >☰</button>
      </div>

      {menuOpen && (
        <div style={{ background: '#1a2744', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px' }} className="mobile-menu">
          {[
            { to: '/', label: t.nav.home },
            { to: '/org-chart', label: t.nav.orgChart },
            { to: '/directory', label: t.nav.directory },
            { to: '/contents', label: t.nav.contents },
            { to: '/search', label: t.nav.search },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{
              display: 'block', color: '#cbd5e1', padding: '10px 0',
              fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
              textDecoration: 'none',
            }}>
              {item.label}
            </Link>
          ))}
          {DEPARTMENTS.map(d => (
            <Link key={d.id} to={`/department/${d.id}`} style={{
              display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', padding: '8px 0',
              fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
              textDecoration: 'none',
            }}>
              <span>{d.icon}</span> {d.title}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
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
      padding: '8px 12px', borderRadius: 8, transition: 'color 0.15s',
      borderBottom: active ? '2px solid #c9a84c' : '2px solid transparent',
      textDecoration: 'none',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#e2e8f0'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = active ? '#c9a84c' : '#cbd5e1'; }}
    >
      {children}
    </Link>
  );
}
