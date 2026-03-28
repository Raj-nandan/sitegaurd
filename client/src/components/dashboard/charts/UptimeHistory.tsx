interface UptimeHistoryProps {
  history: boolean[];
}

const UptimeHistory = ({ history }: UptimeHistoryProps) => {
  const upCount = history.filter(Boolean).length;
  const uptime = history.length ? (upCount / history.length) * 100 : 100;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Uptime History (90 days)</span>
        <span style={{ fontSize: 13, fontFamily: 'DM Mono, monospace', color: uptime > 99 ? '#1d9e75' : uptime > 95 ? '#ba7517' : '#e24b4a', fontWeight: 600 }}>
          {uptime.toFixed(2)}%
        </span>
      </div>
      <div style={{ display: 'flex', gap: 2.5, alignItems: 'flex-end', height: 28 }}>
        {history.map((up, i) => (
          <div key={i} style={{ flex: 1, minWidth: 4, height: '100%', borderRadius: 2, background: up ? '#1d9e75' : '#e24b4a', opacity: 0.85 }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>90 days ago</span>
        <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>today</span>
      </div>
    </div>
  );
};

export default UptimeHistory;
