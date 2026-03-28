interface EndpointStat { endpoint: string; avgMs: number; }
interface EndpointGaugesProps { stats: EndpointStat[]; }

const EndpointGauges = ({ stats }: EndpointGaugesProps) => {
  const max = Math.max(...stats.map((s) => s.avgMs), 1);
  const color = (ms: number) => ms < 300 ? '#1d9e75' : ms < 700 ? '#ba7517' : '#e24b4a';

  return (
    <div>
      <h4 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 14 }}>Endpoint Response Times</h4>
      {stats.map((s) => (
        <div key={s.endpoint} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text2)' }}>{s.endpoint}</span>
            <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: color(s.avgMs), fontWeight: 500 }}>{s.avgMs}ms</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 99 }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${(s.avgMs / max) * 100}%`, background: color(s.avgMs), transition: 'width 0.6s ease' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EndpointGauges;
