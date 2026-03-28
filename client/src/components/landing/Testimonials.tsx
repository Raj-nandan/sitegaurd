const TESTIMONIALS = [
  {
    name: 'Marcus R.', role: 'Freelance Dev', location: 'Berlin',
    text: 'One of my client\'s sites went down at 2am. SiteGuard texted me before they could even open their email. Absolutely worth it.',
    initials: 'MR',
  },
  {
    name: 'Sara K.', role: 'Web Designer', location: 'London',
    text: 'The PDF reports save me an hour every single month. My clients love seeing the monthly maintenance summary — it really justifies my retainer.',
    initials: 'SK',
  },
  {
    name: 'James P.', role: 'Agency Owner', location: 'Toronto',
    text: 'We monitor 40+ client sites. There\'s nothing else that gives this level of visibility at this price point. SiteGuard is a no-brainer.',
    initials: 'JP',
  },
];

const Stars = () => (
  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
    {Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: '#F59E0B', fontSize: 15 }}>★</span>
    ))}
  </div>
);

const Testimonials = () => (
  <section id="customers" style={{ background: 'var(--bg2)', padding: '96px 24px', borderTop: '1px solid var(--border)' }}>
    <div style={{ maxWidth: 1120, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <span style={{
          fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--accent)',
          background: 'var(--accent-light)', padding: '4px 12px', borderRadius: 99,
          border: '1px solid rgba(29,158,117,0.25)', display: 'inline-block', marginBottom: 18,
        }}>customers</span>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(30px, 4vw, 48px)', color: 'var(--text)', lineHeight: 1.2 }}>
          Loved by freelancers <em style={{ color: 'var(--accent)' }}>everywhere.</em>
        </h2>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {TESTIMONIALS.map((t) => (
          <div key={t.name} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
            padding: '28px', boxShadow: 'var(--shadow)',
            transition: 'transform 0.18s, box-shadow 0.18s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
            <Stars />
            <p style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
              "{t.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%', background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace',
                flexShrink: 0,
              }}>
                {t.initials}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>{t.role} · {t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
