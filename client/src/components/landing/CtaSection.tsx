import { Link } from 'react-router-dom';

const CtaSection = () => (
  <section style={{ padding: '0 24px 96px', maxWidth: 1120, margin: '0 auto' }}>
    <div style={{
      background: 'var(--text)', borderRadius: 24, padding: '72px 48px',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Teal glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 500, height: 300,
        background: 'radial-gradient(ellipse, rgba(29,158,117,0.3) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(28px, 4vw, 48px)',
          color: 'var(--bg)', lineHeight: 1.2, marginBottom: 16,
        }}>
          Start monitoring your clients' sites today.
        </h2>
        <p style={{ color: 'var(--text3)', fontSize: 16, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
          Set up in 3 minutes. No credit card required. Your clients will thank you.
        </p>
        <Link to="/signup" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '13px 28px', background: 'var(--bg)', color: 'var(--text)',
          textDecoration: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15,
          fontFamily: 'DM Sans, sans-serif', transition: 'transform 0.16s, box-shadow 0.16s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
          Get started for free →
        </Link>
        <p style={{ marginTop: 16, fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--text3)' }}>
          5 sites free forever · No credit card required
        </p>
      </div>
    </div>
  </section>
);

export default CtaSection;
