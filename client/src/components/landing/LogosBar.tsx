const LOGOS = ['Shopify', 'WordPress', 'Webflow', 'Framer', 'Squarespace', 'Vercel', 'Netlify'];

const LogosBar = () => (
  <section style={{
    background: 'var(--bg2)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    padding: '24px',
  }}>
    <div style={{ maxWidth: 1120, margin: '0 auto', textAlign: 'center' }}>
      <p style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginBottom: 16, letterSpacing: 0.5 }}>
        TRUSTED BY FREELANCERS WORKING WITH
      </p>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {LOGOS.map((logo) => (
          <span key={logo} style={{
            fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 500,
            color: 'var(--text3)', letterSpacing: 0.5, opacity: 0.6,
            transition: 'opacity 0.18s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}>
            {logo}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default LogosBar;
