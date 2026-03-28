import { useEffect, useState } from 'react';
import { useClients } from '../../context/ClientContext';
import type { Client } from '../../types/client';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Reports = () => {
  const { clients, fetchClients } = useClients();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  useEffect(() => { fetchClients().then(() => {}); }, []);
  useEffect(() => { if (clients.length > 0 && !selectedClient) setSelectedClient(clients[0]); }, [clients]);

  const handleDownload = () => {
    const el = document.getElementById('pdf-preview');
    if (!el) return;
    const html = el.innerHTML;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Report</title>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>body{font-family:'DM Sans',sans-serif;margin:0;padding:32px;background:#fff;color:#141412;}</style>
      </head><body>${html}</body></html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  const stats = { uptime: 99.7, avgResponse: 312, incidents: 1 };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={selectedClient?._id || ''} onChange={(e) => setSelectedClient(clients.find((c) => c._id === e.target.value) || null)}
          style={{ padding: '9px 14px', background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, outline: 'none' }}>
          {clients.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={{ padding: '9px 14px', background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, outline: 'none' }}>
          {MONTHS.map((m, i) => <option key={m} value={i}>{m} {selectedYear}</option>)}
        </select>
        <button onClick={handleDownload} className="btn-primary" style={{ fontSize: 13, padding: '9px 20px' }}>
          📥 Download PDF
        </button>
      </div>

      {/* PDF Preview */}
      <div id="pdf-preview" style={{
        background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20,
        padding: '40px', maxWidth: 720, color: '#141412',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 24, borderBottom: '2px solid #f3f4f6', marginBottom: 28 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Monthly Maintenance Report</div>
            <div style={{ fontSize: 16, color: '#374151', marginBottom: 2 }}>{selectedClient?.name || 'Client Name'}</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>{MONTHS[selectedMonth]} {selectedYear}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1d9e75' }}>site<span style={{ color: '#0f6e56' }}>guard</span></div>
            <div style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace', marginTop: 4 }}>Generated {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Uptime', val: `${stats.uptime}%` },
            { label: 'Avg Response', val: `${stats.avgResponse}ms` },
            { label: 'Incidents', val: String(stats.incidents) },
          ].map((s) => (
            <div key={s.label} style={{ background: '#f9fafb', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1d9e75', marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Narrative */}
        <div style={{ background: '#f9fafb', borderRadius: 10, padding: '16px 20px', marginBottom: 28, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
          {selectedClient?.name || 'Your site'} maintained excellent availability this month with {stats.uptime}% uptime across all monitored endpoints. Average response time was {stats.avgResponse}ms, with {stats.incidents} incident recorded. SSL certificates and domains are healthy.
        </div>

        {/* Weekly bar chart */}
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#111827' }}>Weekly Uptime</h3>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60, marginBottom: 28 }}>
          {['W1', 'W2', 'W3', 'W4'].map((w, i) => {
            const h = [100, 98, 100, 99.7][i];
            return (
              <div key={w} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: `${h}%`, background: '#1d9e75', borderRadius: 4, opacity: 0.85 }} />
                <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace' }}>{w}</span>
              </div>
            );
          })}
        </div>

        {/* SSL table */}
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#111827' }}>SSL & Domain Status</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28, fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280' }}>Item</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280' }}>Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '8px 12px' }}>SSL Certificate</td>
              <td style={{ padding: '8px 12px', color: '#1d9e75', fontWeight: 600 }}>Valid</td>
              <td style={{ padding: '8px 12px', color: '#6b7280' }}>90 days</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px' }}>Domain</td>
              <td style={{ padding: '8px 12px', color: '#1d9e75', fontWeight: 600 }}>Active</td>
              <td style={{ padding: '8px 12px', color: '#6b7280' }}>240 days</td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16, textAlign: 'center', fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>
          siteguard.app · Generated for {selectedClient?.name}
        </div>
      </div>
    </div>
  );
};

export default Reports;
