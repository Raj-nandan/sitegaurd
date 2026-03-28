import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = heroRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 0.1}s`;
      el.classList.add('animate-fade-up');
    });
  }, []);

  return (
    <section ref={heroRef} style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Dot grid + glow */}
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--border2) 1px, transparent 1px)', backgroundSize: '28px 28px',
        opacity: 0.6,
      }} />
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(29,158,117,0.18) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 800 }}>
        {/* Badge */}
        <div className="fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
          padding: '6px 14px', background: 'var(--accent-light)', borderRadius: 99,
          border: '1px solid rgba(29,158,117,0.25)',
        }}>
          <span className="animate-pulse-dot" style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>
            Now in beta — 2,400+ freelancers
          </span>
        </div>

        {/* Headline */}
        <h1 className="fade-up" style={{
          fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(48px, 8vw, 80px)',
          lineHeight: 1.1, letterSpacing: -2, color: 'var(--text)', marginBottom: 24,
        }}>
          Monitor every client site,{' '}
          <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>from one place.</span>
        </h1>

        {/* Subheadline */}
        <p className="fade-up" style={{
          fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 36px',
        }}>
          Uptime monitoring, performance metrics, SSL tracking, and automated client reports — everything you need to deliver peace of mind.
        </p>

        {/* CTAs */}
        <div className="fade-up" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <Link to="/signup" className="btn-primary" style={{ fontSize: 15, padding: '12px 24px' }}>
            Start monitoring free
          </Link>
          <Link to="/dashboard" className="btn-ghost" style={{ fontSize: 15, padding: '12px 24px' }}>
            See live demo →
          </Link>
        </div>

        {/* Note */}
        <p className="fade-up" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--text3)' }}>
          No credit card required · 5 sites free forever
        </p>

        {/* Stats bar */}
        <div className="fade-up" style={{
          display: 'flex', gap: 0, marginTop: 56, border: '1px solid var(--border)',
          borderRadius: 16, background: 'var(--card)', overflow: 'hidden', boxShadow: 'var(--shadow)',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Freelancers', value: '2,400+' },
            { label: 'Sites monitored', value: '48K' },
            { label: 'Platform uptime', value: '99.98%' },
            { label: 'Alert speed', value: '<30s' },
          ].map((stat, i, arr) => (
            <div key={stat.label} style={{
              flex: '1 1 120px', padding: '20px 28px', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'var(--text)', marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--text3)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Mockup */}
        <div className="fade-up" style={{ marginTop: 64, position: 'relative' }}>
          {/* Teal glow below */}
          <div style={{
            position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
            width: 500, height: 200,
            background: 'radial-gradient(ellipse, rgba(29,158,117,0.2) 0%, transparent 70%)',
            filter: 'blur(30px)', zIndex: 0,
          }} />

          {/* Browser chrome */}
          <div style={{
            borderRadius: 16, border: '1px solid var(--border2)', overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 1,
            background: 'var(--card)',
          }}>
            {/* Browser bar */}
            <div style={{
              background: 'var(--bg2)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#f66', '#fa4', '#4c4'].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: 'var(--bg)', borderRadius: 6, padding: '4px 12px',
                fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text3)',
              }}>
                app.siteguard.io/dashboard
              </div>
            </div>

            {/* Inner UI */}
            <div style={{ display: 'flex', height: 280 }}>
              {/* Mini sidebar */}
              <div style={{
                width: 52, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 14,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>S</div>
                {['◉', '⊡', '◎', '▣'].map((icon, i) => (
                  <div key={i} style={{ fontSize: 14, color: i === 0 ? 'var(--accent)' : 'var(--text3)', cursor: 'pointer' }}>{icon}</div>
                ))}
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
                  {[
                    { label: 'Total Sites', value: '24', accent: false },
                    { label: 'Avg Uptime', value: '99.7%', accent: true },
                    { label: 'Incidents', value: '2', accent: false },
                    { label: 'SSL Expiring', value: '3', accent: false },
                  ].map((card) => (
                    <div key={card.label} style={{
                      background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px',
                    }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--text3)', marginBottom: 3 }}>{card.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: card.accent ? 'var(--accent)' : 'var(--text)' }}>{card.value}</div>
                    </div>
                  ))}
                </div>

                {/* Mini chart bars */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 8, fontFamily: 'DM Mono, monospace' }}>Response Time (14d)</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
                    {[60, 80, 55, 95, 70, 85, 75, 90, 65, 80, 72, 88, 78, 85].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--accent)', borderRadius: 2, opacity: 0.7 }} />
                    ))}
                  </div>
                </div>

                {/* Client table rows */}
                {[
                  { name: 'Acme Corp', status: 'up', uptime: '99.9%' },
                  { name: 'Studio Flow', status: 'warn', uptime: '98.2%' },
                  { name: 'Dev Hub', status: 'up', uptime: '100%' },
                ].map((row) => (
                  <div key={row.name} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 10px', borderRadius: 6, background: 'var(--bg)',
                    border: '1px solid var(--border)', marginBottom: 5,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)' }}>{row.name}</span>
                    <span style={{
                      fontSize: 9, fontFamily: 'DM Mono, monospace', padding: '2px 7px', borderRadius: 99,
                      background: row.status === 'up' ? 'rgba(29,158,117,0.15)' : 'rgba(186,117,23,0.15)',
                      color: row.status === 'up' ? '#1d9e75' : '#ba7517',
                    }}>
                      {row.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'DM Mono, monospace' }}>{row.uptime}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
