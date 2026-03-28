import { SSLInfo, DomainInfo } from '../../../types/client';

interface SSLDomainTabProps {
  ssl: SSLInfo;
  domain: DomainInfo;
}

const expiryColor = (days: number) => days < 30 ? '#e24b4a' : days < 60 ? '#ba7517' : '#1d9e75';

const InfoCard = ({ title, items }: { title: string; items: Array<{ label: string; value: string | number | boolean | string[] }> }) => (
  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, flex: 1 }}>
    <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>{title}</h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>{label}</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', fontFamily: 'DM Mono, monospace', textAlign: 'right', maxWidth: '60%' }}>
            {Array.isArray(value) ? value.join(', ') : String(value)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SSLDomainTab = ({ ssl, domain }: SSLDomainTabProps) => (
  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
    <InfoCard title="🔒 SSL Certificate" items={[
      { label: 'Issuer', value: ssl.issuer },
      { label: 'Expires in', value: `${ssl.expiresInDays} days` },
      { label: 'Protocol', value: ssl.protocol },
      { label: 'Grade', value: ssl.grade },
    ]} />
    <div style={{ flex: 1 }}>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginBottom: 8 }}>SSL Expiry</div>
        <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 99 }}>
          <div style={{ height: '100%', borderRadius: 99, width: `${Math.min((ssl.expiresInDays / 365) * 100, 100)}%`, background: expiryColor(ssl.expiresInDays), transition: 'width 0.5s' }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700, fontFamily: 'DM Mono, monospace', color: expiryColor(ssl.expiresInDays) }}>
          {ssl.expiresInDays} days
        </div>
      </div>
    </div>
    <InfoCard title="🌐 Domain" items={[
      { label: 'Registrar', value: domain.registrar },
      { label: 'Expires in', value: `${domain.expiresInDays} days` },
      { label: 'Nameservers', value: domain.nameservers },
      { label: 'DNSSEC', value: domain.dnssec ? '✓ Enabled' : '✗ Disabled' },
    ]} />
  </div>
);

export default SSLDomainTab;
