import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/axios';
import type { SiteStatus } from '../../types/client';

interface PublicSite {
  _id: string;
  name: string;
  url: string;
  status: SiteStatus;
  uptime90d: number;
  lastChecked: string;
}

interface PublicData {
  user: { name: string };
  sites: PublicSite[];
}

const statusColor = (s: SiteStatus) => s === 'up' ? '#1d9e75' : s === 'warn' ? '#ba7517' : '#e24b4a';

const PublicStatus = () => {
  const { userId } = useParams<{ userId: string }>();
  const [data, setData] = useState<PublicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PublicData>(`/status/${userId}`)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const allUp = data?.sites.every(s => s.status === 'up');

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: 'DM Mono, monospace', color: 'var(--text3)', fontSize: 14 }}>
      Loading status…
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: 'DM Mono, monospace', color: 'var(--status-down)', fontSize: 14 }}>
      Status page not found
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 24px 48px' }}>
      {/* Header */}
      <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: 60 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 28, color: 'var(--text)', marginBottom: 12 }}>
            {data.user.name} — Status
          </h1>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 99,
            background: allUp ? 'rgba(29,158,117,0.12)' : 'rgba(226,75,74,0.12)',
            border: `1px solid ${allUp ? 'rgba(29,158,117,0.25)' : 'rgba(226,75,74,0.25)'}`,
          }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: allUp ? '#1d9e75' : '#e24b4a', display: 'inline-block' }} />
            <span style={{ fontSize: 14, fontFamily: 'DM Mono, monospace', color: allUp ? '#1d9e75' : '#e24b4a', fontWeight: 500 }}>
              {allUp ? 'All systems operational' : 'Some systems are experiencing issues'}
            </span>
          </div>
        </div>

        {/* Sites */}
        {data.sites.map((site) => {
          const ticks = Array.from({ length: 30 }, (_, i) => i / 30 * 100 < site.uptime90d);
          return (
            <div key={site._id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{site.name}</span>
                  <span style={{ display: 'block', fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', marginTop: 2 }}>{site.url}</span>
                </div>
                <span style={{
                  fontSize: 11, fontFamily: 'DM Mono, monospace', padding: '3px 10px', borderRadius: 99,
                  background: `${statusColor(site.status)}20`, color: statusColor(site.status), fontWeight: 600,
                }}>{site.status.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', gap: 2.5, height: 18 }}>
                {ticks.map((up, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: 2, background: up ? '#1d9e75' : '#e24b4a', opacity: 0.8 }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>30d ago</span>
                <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>{site.uptime90d}% uptime</span>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>
          Powered by <span style={{ color: 'var(--accent)', fontWeight: 600 }}>SiteGuard</span> · Updated every 30s
        </div>
      </div>
    </div>
  );
};

export default PublicStatus;
