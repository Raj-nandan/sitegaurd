import { useLocation } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/clients': 'Clients',
  '/dashboard/alerts': 'Alerts',
  '/dashboard/status': 'Status Page',
  '/dashboard/reports': 'Reports',
  '/dashboard/settings': 'Settings',
};

interface TopbarProps {
  onMenuClick: () => void;
  onAddClient: () => void;
}

const Topbar = ({ onMenuClick, onAddClient }: TopbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  const title = PAGE_TITLES[pathname] || (pathname.includes('clients/') ? 'Client Detail' : 'Dashboard');

  return (
    <header style={{
      height: 52, background: 'var(--card)', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', gap: 16,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onMenuClick} style={{
          background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer',
          fontSize: 18, padding: 4, display: 'none', lineHeight: 1,
        }} className="menu-btn">☰</button>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{title}</h1>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Dark mode toggle */}
        <button onClick={toggleTheme} style={{
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
          padding: '6px 10px', cursor: 'pointer', color: 'var(--text2)', fontSize: 14, lineHeight: 1,
        }} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <button style={{
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
          padding: '6px 10px', cursor: 'pointer', color: 'var(--text2)', fontSize: 14, lineHeight: 1,
          position: 'relative',
        }}>
          🔔
          <span style={{
            position: 'absolute', top: 4, right: 4, width: 7, height: 7,
            background: '#e24b4a', borderRadius: '50%',
          }} />
        </button>

        {/* Add client */}
        <button onClick={onAddClient} className="btn-primary" style={{ fontSize: 13, padding: '7px 14px' }}>
          + Add client
        </button>
      </div>
    </header>
  );
};

export default Topbar;
