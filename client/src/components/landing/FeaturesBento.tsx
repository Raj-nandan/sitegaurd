import { useEffect, useRef } from 'react';

const FEATURES = [
  {
    id: 'uptime', wide: true,
    icon: '⬆', title: 'Uptime monitoring',
    desc: 'Check every site every 30 seconds. Get instant alerts when anything goes wrong.',
  },
  {
    id: 'perf', wide: false,
    icon: '⚡', title: 'Performance metrics',
    desc: 'Track response times, Lighthouse scores, and Core Web Vitals over time.',
  },
  {
    id: 'reports', wide: false,
    icon: '📄', title: 'Automated client reports',
    desc: 'Branded PDF reports sent monthly. Justify your retainer without lifting a finger.',
  },
  {
    id: 'ssl', wide: false,
    icon: '🔒', title: 'SSL & domain watch',
    desc: 'Know before your SSL or domain expires. Color-coded alerts at 60, 30, and 7 days.',
  },
  {
    id: 'status', wide: false,
    icon: '🌐', title: 'White-label status pages',
    desc: 'A public-facing status page with your client\'s branding, zero effort.',
  },
  {
    id: 'multi', wide: false,
    icon: '🗂', title: 'Multi-client management',
    desc: 'Manage dozens of clients from a single, clean dashboard. Stay focused.',
  },
];

const UptimeGrid = () => {
  const rows = 7, cols = 13;
  const getColor = () => {
    const r = Math.random();
    if (r > 0.07) return '#1d9e75';
    if (r > 0.03) return '#ba7517';
    return '#e24b4a';
  };
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 3,
      }}>
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div key={i} style={{ aspectRatio: '1', background: getColor(), borderRadius: 3, opacity: 0.85 }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>13 weeks ago</span>
        <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>today</span>
      </div>
    </div>
  );
};

const FeaturesBento = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} style={{ padding: '96px 24px', maxWidth: 1120, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <span style={{
          fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--accent)',
          background: 'var(--accent-light)', padding: '4px 12px', borderRadius: 99,
          border: '1px solid rgba(29,158,117,0.25)', display: 'inline-block', marginBottom: 20,
        }}>features</span>
        <h2 style={{
          fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(32px, 5vw, 52px)',
          color: 'var(--text)', lineHeight: 1.15, marginBottom: 16,
        }}>
          Everything you need to deliver<br />
          <em style={{ color: 'var(--accent)' }}>peace of mind.</em>
        </h2>
        <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
          One dashboard. All your clients' sites. Total visibility.
        </p>
      </div>

      {/* Bento grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        border: '1px solid var(--border)',
        borderRadius: 20,
        overflow: 'hidden',
        background: 'var(--border)',
      }}>
        {FEATURES.map((f) => (
          <div key={f.id} className="reveal" style={{
            background: 'var(--card)', padding: '28px',
            gridColumn: f.wide ? 'span 2' : 'span 1',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'var(--accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, marginBottom: 14,
            }}>
              {f.icon}
            </div>
            <h3 style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 8 }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
            {f.id === 'uptime' && <UptimeGrid />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesBento;
