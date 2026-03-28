import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Product: ['Uptime Monitoring', 'SSL Alerts', 'PDF Reports', 'Status Pages', 'Integrations'],
  Resources: ['Documentation', 'API Reference', 'Blog', 'Changelog', 'Status'],
  Company: ['About', 'Pricing', 'Privacy', 'Terms', 'Contact'],
};

const Footer = () => (
  <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: 40, marginBottom: 48 }}>
        {/* Brand */}
        <div>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
              site<span style={{ color: 'var(--accent)' }}>guard</span>
            </span>
            <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', marginLeft: 2 }} />
          </Link>
          <p style={{ color: 'var(--text3)', fontSize: 13, lineHeight: 1.7, maxWidth: 240 }}>
            Website monitoring built for freelancers. Track every client site from one place.
          </p>
        </div>
        {/* Link groups */}
        {Object.entries(FOOTER_LINKS).map(([group, links]) => (
          <div key={group}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 14 }}>{group}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {links.map((link) => (
                <li key={link}>
                  <a href="#" style={{
                    color: 'var(--text3)', fontSize: 13, textDecoration: 'none', transition: 'color 0.16s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>© 2025 SiteGuard. All rights reserved.</span>
        <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>
          UpTime → Peace of mind.
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
