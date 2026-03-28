import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '◉', section: 'monitoring' },
  { label: 'Clients', path: '/dashboard/clients', icon: '⊡', section: 'monitoring' },
  { label: 'Alerts', path: '/dashboard/alerts', icon: '◎', section: 'monitoring', badge: 2 },
  { label: 'Status Page', path: '/dashboard/status', icon: '🌐', section: 'monitoring' },
  { label: 'Reports', path: '/dashboard/reports', icon: '📄', section: 'monitoring' },
  { label: 'Settings', path: '/dashboard/settings', icon: '⚙', section: 'account' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

  return (
    <aside style={{
      width: collapsed ? 52 : 220, minHeight: '100vh',
      background: 'var(--bg2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease', overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Logo + toggle */}
      <div style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
        {!collapsed && (
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 17, color: 'var(--text)', whiteSpace: 'nowrap' }}>
            site<span style={{ color: 'var(--accent)' }}>guard</span>
            <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', marginLeft: 3, verticalAlign: 'middle' }} />
          </span>
        )}
        <button onClick={onToggle} style={{
          background: 'none', border: 'none', color: 'var(--text3)',
          cursor: 'pointer', fontSize: 16, padding: 4, borderRadius: 6, lineHeight: 1,
          transition: 'color 0.16s',
        }}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingTop: 12, overflow: 'hidden' }}>
        {['monitoring', 'account'].map((section) => (
          <div key={section}>
            {!collapsed && (
              <div style={{ padding: '8px 16px 4px', fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase' }}>
                {section}
              </div>
            )}
            {NAV_ITEMS.filter((n) => n.section === section).map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/dashboard'}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '10px 14px' : '9px 14px 9px 16px',
                  margin: '2px 8px', borderRadius: 10, textDecoration: 'none',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text2)',
                  fontSize: 14, fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.16s', position: 'relative',
                })}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                {item.badge && !collapsed && (
                  <span style={{
                    marginLeft: 'auto', background: '#e24b4a', color: '#fff',
                    fontSize: 10, fontFamily: 'DM Mono, monospace', padding: '1px 6px', borderRadius: 99,
                  }}>{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User avatar */}
      <div style={{
        padding: '12px', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
      }} onClick={handleLogout} title="Logout">
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono, monospace', flexShrink: 0,
        }}>
          {initials}
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
