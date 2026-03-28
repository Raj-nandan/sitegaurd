import { useEffect, useState } from 'react';
import api from '../../lib/axios';

interface AlertItem {
  _id: string;
  type: 'down' | 'slow' | 'ssl' | 'domain';
  message: string;
  resolved: boolean;
  createdAt: string;
}

const TYPE_COLORS = { down: '#e24b4a', slow: '#ba7517', ssl: '#ba7517', domain: '#1d9e75' };
const TYPE_ICONS = { down: '🔴', slow: '🟡', ssl: '🔐', domain: '🌐' };

const AlertRow = ({ alert }: { alert: AlertItem }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
    borderRadius: 12, border: `1px solid ${alert.resolved ? 'var(--border)' : `${TYPE_COLORS[alert.type]}30`}`,
    background: alert.resolved ? 'var(--bg)' : `${TYPE_COLORS[alert.type]}08`,
    marginBottom: 10,
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      background: `${TYPE_COLORS[alert.type]}20`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
    }}>
      {TYPE_ICONS[alert.type]}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{
          fontSize: 10, fontFamily: 'DM Mono, monospace', padding: '2px 8px', borderRadius: 99,
          background: `${TYPE_COLORS[alert.type]}20`, color: TYPE_COLORS[alert.type], fontWeight: 600, textTransform: 'uppercase',
        }}>{alert.type}</span>
        {alert.resolved && <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#1d9e75', background: 'rgba(29,158,117,0.1)', padding: '2px 8px', borderRadius: 99 }}>Resolved</span>}
      </div>
      <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>{alert.message}</p>
      <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text3)' }}>
        {new Date(alert.createdAt).toLocaleString()}
      </span>
    </div>
  </div>
);

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock alerts for demo when API has no data
    setAlerts([
      { _id: '1', type: 'down', message: '🔴 acme-corp.com is DOWN — 503 error', resolved: false, createdAt: new Date(Date.now() - 120000).toISOString() },
      { _id: '2', type: 'ssl', message: '🔐 SSL certificate for studio.io expires in 22 days', resolved: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { _id: '3', type: 'slow', message: '⚠️ devhub.com response time: 3,420ms', resolved: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { _id: '4', type: 'down', message: '🔴 blog.example.com was DOWN — now recovered', resolved: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
    ]);
    setLoading(false);
  }, []);

  const active = alerts.filter((a) => !a.resolved);
  const resolved = alerts.filter((a) => a.resolved);

  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>Loading…</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
      {/* Left col */}
      <div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 20px', marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
            Active Alerts <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: '#e24b4a', background: 'rgba(226,75,74,0.12)', padding: '2px 8px', borderRadius: 99, marginLeft: 6 }}>{active.length}</span>
          </h3>
          {active.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>✅ All systems operational</div>
          ) : active.map((a) => <AlertRow key={a._id} alert={a} />)}
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Resolved (Last 7d)</h3>
          {resolved.map((a) => <AlertRow key={a._id} alert={a} />)}
        </div>
      </div>

      {/* Right col */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Alert channels */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Alert Channels</h3>
          {[
            { name: 'Email', active: true, icon: '📧' },
            { name: 'Slack', active: false, icon: '💬' },
            { name: 'Webhook', active: false, icon: '🔗' },
          ].map((ch) => (
            <div key={ch.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{ch.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>{ch.name}</span>
              </div>
              <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', padding: '2px 8px', borderRadius: 99, background: ch.active ? 'rgba(29,158,117,0.12)' : 'var(--bg2)', color: ch.active ? '#1d9e75' : 'var(--text3)' }}>
                {ch.active ? 'Active' : 'Off'}
              </span>
            </div>
          ))}
        </div>

        {/* Alert rules */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Alert Rules</h3>
          {[
            { label: 'Downtime threshold', value: '1 check' },
            { label: 'Slow response', value: '3,000ms' },
            { label: 'SSL expiry warn', value: '30 days' },
            { label: 'Domain expiry warn', value: '30 days' },
          ].map((rule) => (
            <div key={rule.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>{rule.label}</span>
              <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text)', background: 'var(--bg2)', padding: '3px 8px', borderRadius: 6 }}>{rule.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
