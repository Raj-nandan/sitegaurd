import { Link } from 'react-router-dom';

const PLANS = [
  {
    name: 'Free', price: '$0', period: '/mo',
    desc: 'Perfect for getting started',
    features: ['5 sites', '1 min check interval', 'Email alerts', '7-day history'],
    cta: 'Get started free', featured: false,
  },
  {
    name: 'Pro', price: '$19', period: '/mo',
    desc: 'For serious freelancers',
    features: ['50 sites', '30s check interval', 'Slack + email alerts', '90-day history', 'PDF reports', 'SSL alerts'],
    cta: 'Start Pro trial', featured: true,
  },
  {
    name: 'Agency', price: '$49', period: '/mo',
    desc: 'For teams and agencies',
    features: ['Unlimited sites', '15s check interval', 'White-label pages', '1-year history', 'Prometheus export', 'Priority support'],
    cta: 'Contact sales', featured: false,
  },
];

const Pricing = () => (
  <section id="pricing" style={{ padding: '96px 24px', maxWidth: 1120, margin: '0 auto' }}>
    {/* Header */}
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      <span style={{
        fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--accent)',
        background: 'var(--accent-light)', padding: '4px 12px', borderRadius: 99,
        border: '1px solid rgba(29,158,117,0.25)', display: 'inline-block', marginBottom: 18,
      }}>pricing</span>
      <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(30px, 4vw, 48px)', color: 'var(--text)', lineHeight: 1.2 }}>
        Simple, <em style={{ color: 'var(--accent)' }}>freelancer-friendly</em> pricing.
      </h2>
    </div>

    {/* Cards */}
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 20, maxWidth: 860, margin: '0 auto',
    }}>
      {PLANS.map((plan) => (
        <div key={plan.name} style={{
          background: 'var(--card)', borderRadius: 18, padding: '28px 24px',
          border: `2px solid ${plan.featured ? 'var(--accent)' : 'var(--border)'}`,
          boxShadow: plan.featured ? '0 8px 40px rgba(29,158,117,0.18)' : 'var(--shadow)',
          position: 'relative', transition: 'transform 0.18s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
          {plan.featured && (
            <span style={{
              position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--accent)', color: '#fff', fontSize: 11,
              fontFamily: 'DM Mono, monospace', padding: '3px 12px', borderRadius: 99,
              whiteSpace: 'nowrap',
            }}>most popular</span>
          )}
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 8 }}>{plan.name}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
            <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 42, color: 'var(--text)', lineHeight: 1 }}>{plan.price}</span>
            <span style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 6 }}>{plan.period}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>{plan.desc}</p>
          <ul style={{ listStyle: 'none', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {plan.features.map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text)' }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link to="/signup" style={{
            display: 'block', textAlign: 'center', padding: '11px', borderRadius: 10,
            background: plan.featured ? 'var(--accent)' : 'transparent',
            border: plan.featured ? 'none' : '1px solid var(--border2)',
            color: plan.featured ? '#fff' : 'var(--text)',
            textDecoration: 'none', fontWeight: 600, fontSize: 14,
            fontFamily: 'DM Sans, sans-serif', transition: 'all 0.18s',
          }}>
            {plan.cta}
          </Link>
        </div>
      ))}
    </div>
  </section>
);

export default Pricing;
