import { WebVitals } from '../../../types/client';

interface WebVitalsTabProps { vitals: WebVitals; }

const THRESHOLDS: Record<string, { good: number; poor: number; unit: string; higherIsBetter?: boolean }> = {
  LCP: { good: 2.5, poor: 4.0, unit: 's' },
  FID: { good: 100, poor: 300, unit: 'ms' },
  CLS: { good: 0.1, poor: 0.25, unit: '' },
  TTFB: { good: 800, poor: 1800, unit: 'ms' },
  FCP: { good: 1.8, poor: 3.0, unit: 's' },
  INP: { good: 200, poor: 500, unit: 'ms' },
};

const ratingColor = (key: string, val: number) => {
  const t = THRESHOLDS[key];
  if (!t) return '#1d9e75';
  return val <= t.good ? '#1d9e75' : val <= t.poor ? '#ba7517' : '#e24b4a';
};

const ratingLabel = (key: string, val: number) => {
  const t = THRESHOLDS[key];
  if (!t) return 'Good';
  return val <= t.good ? 'Good' : val <= t.poor ? 'Needs Improvement' : 'Poor';
};

const LighthouseRing = ({ score }: { score: number }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 90 ? '#1d9e75' : score >= 50 ? '#ba7517' : '#e24b4a';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'relative', width: 90, height: 90 }}>
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={r} fill="none" stroke="var(--bg3)" strokeWidth="8" />
          <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 45 45)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 18, fontWeight: 700, color }}>{score}</span>
        </div>
      </div>
      <div style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', marginTop: 8 }}>Lighthouse Score</div>
    </div>
  );
};

const WebVitalsTab = ({ vitals }: WebVitalsTabProps) => {
  const keys = Object.keys(THRESHOLDS) as Array<keyof typeof THRESHOLDS>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
        <LighthouseRing score={vitals.lighthouseScore} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {keys.map((key) => {
          const val = vitals[key as keyof WebVitals] as number;
          const t = THRESHOLDS[key];
          const color = ratingColor(key, val);
          return (
            <div key={key} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--text3)', marginBottom: 6 }}>{key}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {val}{t.unit}
              </div>
              <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', padding: '2px 8px', borderRadius: 99, background: `${color}20`, color }}>
                {ratingLabel(key, val)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WebVitalsTab;
