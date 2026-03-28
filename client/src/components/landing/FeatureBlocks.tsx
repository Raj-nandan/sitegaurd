const AlertLog = () => (
  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
    <div style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', marginBottom: 14 }}>ALERT LOG</div>
    {[
      { code: 'DOWN', color: '#e24b4a', msg: 'acme-corp.com — 503 error', time: '2m ago' },
      { code: 'SLOW', color: '#ba7517', msg: 'studio.io — 2,847ms', time: '14m ago' },
      { code: 'UP', color: '#1d9e75', msg: 'devhub.com — recovered', time: '1h ago' },
      { code: 'SSL', color: '#ba7517', msg: 'client4.net — 22 days left', time: '3h ago' },
    ].map((row, i) => (
      <div key={i} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
        borderRadius: 8, background: 'var(--card)', border: '1px solid var(--border)',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: 10, fontWeight: 500,
          padding: '2px 8px', borderRadius: 99,
          background: `${row.color}20`, color: row.color, minWidth: 36, textAlign: 'center',
        }}>{row.code}</span>
        <span style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>{row.msg}</span>
        <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>{row.time}</span>
      </div>
    ))}
  </div>
);

const PerfBars = () => {
  const endpoints = [
    { path: '/', ms: 142 }, { path: '/api/users', ms: 380 },
    { path: '/api/data', ms: 520 }, { path: '/checkout', ms: 710 }, { path: '/blog', ms: 198 },
  ];
  const max = Math.max(...endpoints.map((e) => e.ms));
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
      <div style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', marginBottom: 14 }}>ENDPOINT RESPONSE TIMES</div>
      {endpoints.map((ep) => (
        <div key={ep.path} style={{ marginBottom: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text2)' }}>{ep.path}</span>
            <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: ep.ms < 300 ? '#1d9e75' : ep.ms < 600 ? '#ba7517' : '#e24b4a' }}>{ep.ms}ms</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 99 }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${(ep.ms / max) * 100}%`, background: ep.ms < 300 ? '#1d9e75' : ep.ms < 600 ? '#ba7517' : '#e24b4a', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        {[{ label: 'Lighthouse', val: '84' }, { label: 'LCP', val: '2.4s' }, { label: 'CLS', val: '0.08' }].map((m) => (
          <div key={m.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>{m.val}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReportCard = () => (
  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 24, color: '#141412' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, borderBottom: '1px solid #f3f4f6', paddingBottom: 14 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>Monthly Maintenance Report</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Acme Corp — February 2025</div>
      </div>
      <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#9ca3af' }}>Generated Mar 1, 2025</div>
    </div>
    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
      {[{ label: 'Uptime', val: '99.8%' }, { label: 'Avg Response', val: '312ms' }, { label: 'Incidents', val: '1' }].map((s) => (
        <div key={s.label} style={{ flex: 1, background: '#f9fafb', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 18, fontWeight: 600 }}>{s.val}</div>
          <div style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'DM Mono, monospace' }}>{s.label}</div>
        </div>
      ))}
    </div>
    {/* Mini bar chart */}
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40, marginBottom: 12 }}>
      {[80, 90, 75, 100, 85, 95, 70].map((h, i) => (
        <div key={i} style={{ flex: 1, height: `${h}%`, background: '#1d9e75', borderRadius: 2, opacity: 0.8 }} />
      ))}
    </div>
    <p style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'DM Mono, monospace', textAlign: 'center', marginTop: 10 }}>
      siteguard.app · Powered by SiteGuard
    </p>
  </div>
);

const BLOCKS = [
  {
    tag: 'uptime & alerts', title: 'Know before your client does.',
    desc: 'We check your clients\' sites every 30 seconds and alert you the moment anything goes wrong — before your client even notices.',
    checks: ['Instant email & Slack alerts', 'Custom threshold rules', 'Smart alert grouping'],
    visual: <AlertLog />, reversed: false,
  },
  {
    tag: 'performance', title: 'Metrics your clients actually understand.',
    desc: 'Track response times, Lighthouse scores, and Core Web Vitals. Turn complex data into simple proof of your work.',
    checks: ['Endpoint response time tracking', 'Lighthouse & Web Vitals', 'Trend comparison week-over-week'],
    visual: <PerfBars />, reversed: true,
  },
  {
    tag: 'client reports', title: 'Justify your retainer every month, automatically.',
    desc: 'Professional PDF reports, branded and ready to send. Your clients will love the transparency — and so will your cash flow.',
    checks: ['Auto-generated monthly PDFs', 'White-label with your branding', 'Incident & uptime summaries'],
    visual: <ReportCard />, reversed: false,
  },
];

const FeatureBlocks = () => (
  <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
    {BLOCKS.map((block) => (
      <div key={block.tag} style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
        alignItems: 'center', padding: '80px 0',
        borderTop: '1px solid var(--border)',
      }}>
        {/* Text */}
        <div style={{ order: block.reversed ? 2 : 1 }}>
          <span style={{
            fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--accent)',
            background: 'var(--accent-light)', padding: '3px 10px', borderRadius: 99,
            border: '1px solid rgba(29,158,117,0.2)', display: 'inline-block', marginBottom: 18,
          }}>{block.tag}</span>
          <h2 style={{
            fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(26px, 3.5vw, 40px)',
            color: 'var(--text)', lineHeight: 1.2, marginBottom: 16,
          }}>
            {block.title}
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>{block.desc}</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {block.checks.map((c) => (
              <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text)' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
        {/* Visual */}
        <div style={{ order: block.reversed ? 1 : 2 }}>
          {block.visual}
        </div>
      </div>
    ))}
  </div>
);

export default FeatureBlocks;
