import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ClientMetrics } from '../../../types/client';
import UptimeHistory from '../charts/UptimeHistory';
import EndpointGauges from '../charts/EndpointGauges';

interface MetricsTabProps { metrics: ClientMetrics; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', boxShadow: 'var(--shadow)' }}>
      <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{payload[0].value}ms</p>
    </div>
  );
};

const MetricsTab = ({ metrics }: MetricsTabProps) => {
  const chartData = metrics.responseTimeSeries.map((d) => ({
    date: new Date(d.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    value: d.value,
  })).slice(-7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Bar chart */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
        <h4 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 16 }}>Response Time — Last 7 Days</h4>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fill: 'var(--text3)' }} axisLine={false} tickLine={false} unit="ms" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#1d9e75" radius={[4, 4, 0, 0]} maxBarSize={40} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Uptime history */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
        <UptimeHistory history={metrics.uptimeHistory} />
      </div>
      {/* Endpoint gauges */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
        <EndpointGauges stats={metrics.endpointStats} />
      </div>
    </div>
  );
};

export default MetricsTab;
