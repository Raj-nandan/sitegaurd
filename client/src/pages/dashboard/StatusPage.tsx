import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClients } from '../../context/ClientContext';
import StatusPill from '../../components/dashboard/common/StatusPill';

const StatusPage = () => {
  const { user } = useAuth();
  const { clients, fetchClients } = useClients();
  const publicUrl = `${window.location.origin}/status/${user?._id || ''}`;

  useEffect(() => { fetchClients(); }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>White-label status page</h3>
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>Share this page with your clients for live status updates</p>
        </div>
        <a href={publicUrl} target="_blank" rel="noreferrer" style={{
          fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--accent)',
          background: 'var(--accent-light)', padding: '6px 14px', borderRadius: 99,
          textDecoration: 'none', border: '1px solid rgba(29,158,117,0.25)',
        }}>
          {publicUrl}
        </a>
      </div>

      {/* Preview card */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px', maxWidth: 640 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 4 }}>{user?.name || 'Agency'} Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, background: '#1d9e75', borderRadius: '50%', display: 'inline-block' }} />
              <span style={{ fontSize: 14, color: '#1d9e75', fontFamily: 'DM Mono, monospace' }}>All systems operational</span>
            </div>
          </div>
          <div style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text3)' }}>Updated every 30s</div>
        </div>

        {/* Site rows */}
        {clients.slice(0, 5).map((client) => {
          const ticks = Array.from({ length: 30 }, (_, i) => i < client.uptime90d / 3.33 ? true : false);
          return (
            <div key={client._id} style={{ marginBottom: 14, padding: '12px 14px', background: 'var(--bg)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{client.name}</span>
                  <span style={{ display: 'block', fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text3)' }}>{client.url}</span>
                </div>
                <StatusPill status={client.status} size="sm" />
              </div>
              <div style={{ display: 'flex', gap: 2, height: 16 }}>
                {ticks.map((up, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: 2, background: up ? '#1d9e75' : '#e24b4a', opacity: 0.8 }} />
                ))}
              </div>
            </div>
          );
        })}

        {clients.length === 0 && (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--text3)', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>Add clients to show them on your status page</div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text3)' }}>
            Powered by SiteGuard · Updated every 30s
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
