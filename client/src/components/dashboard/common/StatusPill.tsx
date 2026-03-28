import { SiteStatus } from '../../../types/client';

interface StatusPillProps {
  status: SiteStatus;
  size?: 'sm' | 'md';
}

const STATUS_LABELS: Record<SiteStatus, string> = { up: 'UP', down: 'DOWN', warn: 'WARN' };

const StatusPill = ({ status, size = 'md' }: StatusPillProps) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: size === 'sm' ? '2px 8px' : '4px 10px',
    borderRadius: 99, fontFamily: 'DM Mono, monospace',
    fontSize: size === 'sm' ? 10 : 12, fontWeight: 500,
    background: status === 'up' ? 'rgba(29,158,117,0.12)' : status === 'warn' ? 'rgba(186,117,23,0.12)' : 'rgba(226,75,74,0.12)',
    color: status === 'up' ? '#1d9e75' : status === 'warn' ? '#ba7517' : '#e24b4a',
  }}>
    <span style={{
      width: 6, height: 6, borderRadius: '50%',
      background: status === 'up' ? '#1d9e75' : status === 'warn' ? '#ba7517' : '#e24b4a',
      animation: status === 'down' ? 'pulse-dot 1.5s ease-in-out infinite' : 'none',
    }} />
    {STATUS_LABELS[status]}
  </span>
);

export default StatusPill;
