import { useEffect, useState } from 'react';
import { useClients } from '../../context/ClientContext';
import StatCard from '../../components/dashboard/common/StatCard';
import ResponseTimeChart from '../../components/dashboard/charts/ResponseTimeChart';
import ClientTable from '../../components/dashboard/clients/ClientTable';
import api from '../../lib/axios';
import { MetricPoint } from '../../types/client';

interface OverviewData {
  totalSites: number;
  avgUptime: number;
  incidents: number;
  sslExpiringSoon: number;
  responseTimeSeries: MetricPoint[];
}

const Overview = () => {
  const { clients, loading, fetchClients } = useClients();
  const [overview, setOverview] = useState<OverviewData | null>(null);

  useEffect(() => {
    fetchClients();
    api.get<OverviewData>('/metrics/overview').then((r) => setOverview(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <StatCard label="TOTAL SITES" value={overview?.totalSites ?? clients.length} icon="⊡" />
        <StatCard label="AVG UPTIME 30D" value={overview ? `${overview.avgUptime.toFixed(1)}%` : '—'} icon="⬆" accent />
        <StatCard label="INCIDENTS TODAY" value={overview?.incidents ?? 0} icon="◎" />
        <StatCard label="SSL EXPIRING <30D" value={overview?.sslExpiringSoon ?? 0} icon="🔒" />
      </div>

      {/* Response time chart */}
      {overview?.responseTimeSeries && (
        <ResponseTimeChart data={overview.responseTimeSeries} />
      )}

      {/* Client table */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>All Sites</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>Loading…</div>
        ) : (
          <ClientTable clients={clients} />
        )}
      </div>
    </div>
  );
};

export default Overview;
