interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: string;
  accent?: boolean;
}

const StatCard = ({ label, value, sub, icon, accent }: StatCardProps) => (
  <div style={{
    background: 'var(--card)', border: `1px solid ${accent ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 16, padding: '20px 24px', boxShadow: 'var(--shadow)',
    transition: 'transform 0.16s, box-shadow 0.16s',
  }}
  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text3)' }}>{label}</span>
      {icon && (
        <span style={{
          width: 32, height: 32, borderRadius: 8, background: accent ? 'var(--accent-light)' : 'var(--bg2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
        }}>{icon}</span>
      )}
    </div>
    <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color: accent ? 'var(--accent)' : 'var(--text)', lineHeight: 1.1, marginBottom: 4 }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>{sub}</div>}
  </div>
);

export default StatCard;
