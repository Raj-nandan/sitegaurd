import { useNavigate } from 'react-router-dom';
import { Client } from '../../../types/client';
import StatusPill from '../common/StatusPill';

interface ClientCardProps {
  client: Client;
}

const SSLColor = (days: number) => days < 30 ? '#e24b4a' : days < 60 ? '#ba7517' : '#1d9e75';

const ClientCard = ({ client }: ClientCardProps) => {
  const navigate = useNavigate();
  const uptimeTicks = Array.from({ length: 28 }, (_, i) => {
    const p = (i / 27) * 100;
    return p < client.uptime90d ? 'up' : 'down';
  });

  return (
    <div
      onClick={() => navigate(`/dashboard/clients/${client._id}`)}
      style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
        padding: '20px', cursor: 'pointer',
        transition: 'transform 0.16s, box-shadow 0.16s, border-color 0.16s',
        boxShadow: 'var(--shadow)', position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'var(--border2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Status pill top-right */}
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <StatusPill status={client.status} size="sm" />
      </div>

      {/* Name + URL */}
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4, paddingRight: 60 }}>{client.name}</h3>
      <p style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', marginBottom: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {client.url}
      </p>

      {/* Mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginBottom: 3 }}>UPTIME 90D</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{client.uptime90d.toFixed(1)}%</div>
        </div>
        <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginBottom: 3 }}>SSL EXPIRES</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: SSLColor(client.sslExpiresInDays) }}>{client.sslExpiresInDays}d</div>
        </div>
      </div>

      {/* Uptime ticks */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        {uptimeTicks.map((tick, i) => (
          <div key={i} style={{ flex: 1, height: 20, borderRadius: 2, background: tick === 'up' ? '#1d9e75' : '#e24b4a', opacity: 0.8 }} />
        ))}
      </div>
    </div>
  );
};

export default ClientCard;
