import { LogEntry } from '../../../types/client';

const codeColor = (code: number) => code < 300 ? '#1d9e75' : code < 400 ? '#ba7517' : '#e24b4a';

interface LogsTabProps { logs: LogEntry[]; }

const LogsTab = ({ logs }: LogsTabProps) => (
  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
        <thead>
          <tr style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
            {['Code', 'Method', 'Path', 'Response', 'Timestamp'].map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={log.id} style={{ borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <td style={{ padding: '9px 14px' }}>
                <span style={{
                  fontSize: 11, fontFamily: 'DM Mono, monospace', padding: '2px 8px', borderRadius: 6,
                  background: `${codeColor(log.statusCode)}20`, color: codeColor(log.statusCode), fontWeight: 600,
                }}>{log.statusCode}</span>
              </td>
              <td style={{ padding: '9px 14px', fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text3)' }}>{log.method}</td>
              <td style={{ padding: '9px 14px', fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text)' }}>{log.path}</td>
              <td style={{ padding: '9px 14px', fontSize: 12, fontFamily: 'DM Mono, monospace', color: log.responseMs > 1000 ? '#e24b4a' : 'var(--text2)' }}>{log.responseMs}ms</td>
              <td style={{ padding: '9px 14px', fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text3)' }}>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LogsTab;
