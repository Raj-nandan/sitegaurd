import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
    }}>
      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: 'var(--text2)',
          fontSize: 16, lineHeight: 1,
        }}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--card)', borderRadius: 20,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
        padding: '36px 32px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 22,
              color: 'var(--text)', letterSpacing: -0.5,
            }}>
              site<span style={{ color: 'var(--accent)' }}>guard</span>
            </span>
            <span style={{
              display: 'inline-block', width: 7, height: 7,
              background: 'var(--accent)', borderRadius: '50%',
              marginLeft: 4, verticalAlign: 'middle',
            }} />
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
