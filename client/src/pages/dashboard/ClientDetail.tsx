import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { Client, ClientMetrics, LogEntry, WebVitals, SSLInfo, DomainInfo } from '../../types/client';
import StatCard from '../../components/dashboard/common/StatCard';
import MetricsTab from '../../components/dashboard/tabs/MetricsTab';
import LogsTab from '../../components/dashboard/tabs/LogsTab';
import WebVitalsTab from '../../components/dashboard/tabs/WebVitalsTab';
import SSLDomainTab from '../../components/dashboard/tabs/SSLDomainTab';
import StatusPill from '../../components/dashboard/common/StatusPill';

type Tab = 'metrics' | 'logs' | 'vitals' | 'ssl';

const sslColor = (days: number) => days < 30 ? '#e24b4a' : days < 60 ? '#ba7517' : '#1d9e75';

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [metrics, setMetrics] = useState<ClientMetrics | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [vitals, setVitals] = useState<WebVitals | null>(null);
  const [ssl, setSSL] = useState<{ ssl: SSLInfo; domain: DomainInfo } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('metrics');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    Promise.all([
      api.get<Client>(`/clients/${clientId}`),
      api.get<ClientMetrics>(`/clients/${clientId}/metrics`),
      api.get<LogEntry[]>(`/clients/${clientId}/logs`),
      api.get<WebVitals>(`/clients/${clientId}/vitals`),
      api.get(`/clients/${clientId}/ssl`),
    ]).then(([clientRes, metricsRes, logsRes, vitalsRes, sslRes]) => {
      setClient(clientRes.data);
      setMetrics(metricsRes.data);
      setLogs(logsRes.data);
      setVitals(vitalsRes.data);
      setSSL(sslRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [clientId]);

  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>Loading…</div>;
  if (!client) return <div style={{ textAlign: 'center', padding: 48, color: 'var(--status-down)' }}>Client not found</div>;

  const TABS: Array<{ key: Tab; label: string }> = [
    { key: 'metrics', label: 'Metrics' },
    { key: 'logs', label: 'Request Logs' },
    { key: 'vitals', label: 'Web Vitals' },
    { key: 'ssl', label: 'SSL & Domain' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text3)' }}>
        <Link to="/dashboard/clients" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Clients</Link>
        <span>/</span>
        <span style={{ color: 'var(--text)' }}>{client.name}</span>
        <div style={{ marginLeft: 8 }}><StatusPill status={client.status} size="sm" /></div>
      </div>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontFamily: 'Instrument Serif, serif', color: 'var(--text)', marginBottom: 4 }}>{client.name}</h1>
        <a href={client.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', textDecoration: 'none' }}>{client.url}</a>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="UPTIME 90D" value={`${client.uptime90d.toFixed(2)}%`} accent icon="⬆" />
        <StatCard label="AVG RESPONSE" value={`${client.avgResponseMs}ms`} icon="⚡" />
        <StatCard label="SSL EXPIRES" value={`${client.sslExpiresInDays}d`} sub={sslColor(client.sslExpiresInDays) === '#e24b4a' ? 'Critical' : sslColor(client.sslExpiresInDays) === '#ba7517' ? 'Warning' : 'Healthy'} icon="🔒" />
      </div>

      {/* Tabs */}
      <div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
              color: activeTab === tab.key ? 'var(--accent)' : 'var(--text3)',
              fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400, fontFamily: 'DM Sans, sans-serif',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.16s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'metrics' && metrics && <MetricsTab metrics={metrics} />}
        {activeTab === 'logs' && <LogsTab logs={logs} />}
        {activeTab === 'vitals' && vitals && <WebVitalsTab vitals={vitals} />}
        {activeTab === 'ssl' && ssl && <SSLDomainTab ssl={ssl.ssl} domain={ssl.domain} />}
      </div>
    </div>
  );
};

export default ClientDetail;
