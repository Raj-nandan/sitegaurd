import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const inputStyle = {
    width: '100%', padding: '10px 14px', boxSizing: 'border-box' as const,
    background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 10,
    color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 560 }}>
      <Section title="Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'} onBlur={(e) => e.target.style.borderColor = 'var(--border2)'} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'} onBlur={(e) => e.target.style.borderColor = 'var(--border2)'} />
          </div>
          <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save changes</button>
        </div>
      </Section>

      <Section title="Change Password">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {['Current password', 'New password', 'Confirm new password'].map((label) => (
            <div key={label}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{label}</label>
              <input type="password" style={inputStyle} placeholder="••••••••"
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'} onBlur={(e) => e.target.style.borderColor = 'var(--border2)'} />
            </div>
          ))}
          <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Update password</button>
        </div>
      </Section>

      <Section title="Plan & Billing">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4, textTransform: 'capitalize' }}>
              {user?.plan || 'Free'} Plan
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>
              {user?.plan === 'free' ? '5 sites, 1min interval, 7d history' : user?.plan === 'pro' ? '50 sites, 30s interval, PDF reports' : 'Unlimited sites, white-label'}
            </div>
          </div>
          <button className="btn-ghost" style={{ fontSize: 13 }}>Upgrade</button>
        </div>
      </Section>

      <Section title="Danger Zone">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>Delete account</div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>This action is irreversible. All data will be deleted.</div>
          </div>
          <button style={{
            padding: '9px 16px', background: 'rgba(226,75,74,0.1)', border: '1px solid rgba(226,75,74,0.3)',
            borderRadius: 10, color: '#e24b4a', fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500, fontSize: 13, cursor: 'pointer',
          }}>
            Delete account
          </button>
        </div>
      </Section>
    </div>
  );
};

export default Settings;
