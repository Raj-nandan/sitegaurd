import { useNavigate } from 'react-router-dom';
import { Client } from '../../../types/client';
import StatusPill from '../common/StatusPill';

interface ClientTableProps {
  clients: Client[];
}

const sslColor = (days: number) => days < 30 ? '#e24b4a' : days < 60 ? '#ba7517' : '#1d9e75';

const UptimeBar = ({ uptime }: { uptime: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ width: 80, height: 6, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${uptime}%`, background: uptime > 99 ? '#1d9e75' : uptime > 95 ? '#ba7517' : '#e24b4a', borderRadius: 99 }} />
    </div>
    <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text2)' }}>{uptime.toFixed(1)}%</span>
  </div>
);

const ClientTable = ({ clients }: ClientTableProps) => {
  const navigate = useNavigate();

  if (clients.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', fontSize: 14 }}>
        No clients yet. Add your first client to start monitoring.
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
            {['Client', 'URL', 'Status', 'Uptime', 'Response', 'SSL', 'Last checked'].map((h) => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clients.map((client, i) => (
            <tr
              key={client._id}
              onClick={() => navigate(`/dashboard/clients/${client._id}`)}
              style={{
                cursor: 'pointer', borderBottom: i < clients.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.14s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg2)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = 'transparent')}
            >
              <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{client.name}</td>
              <td style={{ padding: '14px 16px', fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {client.url}
              </td>
              <td style={{ padding: '14px 16px' }}><StatusPill status={client.status} size="sm" /></td>
              <td style={{ padding: '14px 16px' }}><UptimeBar uptime={client.uptime90d} /></td>
              <td style={{ padding: '14px 16px', fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text2)' }}>{client.avgResponseMs}ms</td>
              <td style={{ padding: '14px 16px', fontSize: 12, fontFamily: 'DM Mono, monospace', color: sslColor(client.sslExpiresInDays), fontWeight: 500 }}>
                {client.sslExpiresInDays}d
              </td>
              <td style={{ padding: '14px 16px', fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
                {new Date(client.lastChecked).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
