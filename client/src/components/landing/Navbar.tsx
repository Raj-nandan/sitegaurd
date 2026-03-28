import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: theme === 'dark' ? 'rgba(15,15,13,0.85)' : 'rgba(250,250,248,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '0 24px',
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--text)', letterSpacing: -0.5 }}>
            site<span style={{ color: 'var(--accent)' }}>guard</span>
          </span>
          <span style={{ width: 7, height: 7, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', marginLeft: 2, marginTop: 2 }} />
        </Link>

        {/* Center links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="nav-links">
          {['Features', 'Pricing', 'Customers', 'Docs'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: 'var(--text2)', fontSize: 14, fontWeight: 500, textDecoration: 'none',
              transition: 'color 0.16s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text2)')}>
              {item}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '6px 10px', cursor: 'pointer', color: 'var(--text2)', fontSize: 15, lineHeight: 1,
          }} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Link to="/login" style={{
            color: 'var(--text2)', fontSize: 14, fontWeight: 500, textDecoration: 'none',
            padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)',
            transition: 'color 0.16s, border-color 0.16s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
            Login
          </Link>
          <Link to="/signup" className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
            Get started free
          </Link>
          {/* Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{
            display: 'none', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 20,
          }} className="hamburger">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: 60, left: 0, right: 0,
          background: 'var(--card)', borderBottom: '1px solid var(--border)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {['Features', 'Pricing', 'Customers', 'Docs'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} style={{
              color: 'var(--text2)', fontSize: 15, textDecoration: 'none', fontWeight: 500,
            }}>{item}</a>
          ))}
          <Link to="/login" onClick={() => setMobileOpen(false)} style={{ color: 'var(--text2)', fontSize: 15, textDecoration: 'none', fontWeight: 500 }}>Login</Link>
          <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ textAlign: 'center' }}>Get started free</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
