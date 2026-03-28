import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricPoint } from '../../../types/client';

interface ResponseTimeChartProps {
  data: MetricPoint[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
      padding: '8px 14px', boxShadow: 'var(--shadow)',
    }}>
      <p style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{payload[0].value}ms</p>
    </div>
  );
};

const ResponseTimeChart = ({ data }: ResponseTimeChartProps) => {
  const formatted = data.map((d) => ({
    date: new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: d.value,
  }));

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', boxShadow: 'var(--shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Avg Response Time</h3>
          <p style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>Last 14 days</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1d9e75" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1d9e75" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fontFamily: 'DM Mono, monospace', fill: 'var(--text3)' }} axisLine={false} tickLine={false} unit="ms" />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke="#1d9e75" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart;
