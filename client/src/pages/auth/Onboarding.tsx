import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

type Step = 1 | 2 | 3;

const ROLES = ['Freelancer', 'Agency', 'Other'] as const;

const Onboarding = () => {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientUrl, setClientUrl] = useState('');
  const [alertChannel, setAlertChannel] = useState<'email' | 'slack' | 'both'>('email');
  const [slackUrl, setSlackUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const progressWidth = ((step - 1) / 2) * 100 + 33.33;

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Complete onboarding
      const { data: user } = await api.patch('/auth/onboarding', {
        role,
        alertChannels: [alertChannel],
        slackWebhookUrl: slackUrl || undefined,
      });
      setUser(user);

      // Add first client if provided
      if (clientName && clientUrl) {
        await api.post('/clients', { name: clientName, url: clientUrl });
      }
      navigate('/dashboard');
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const cardStyle = (selected: boolean) => ({
    padding: '16px 20px', borderRadius: 12, cursor: 'pointer',
    border: `2px solid ${selected ? 'var(--accent)' : 'var(--border2)'}`,
    background: selected ? 'var(--accent-light)' : 'var(--bg)',
    transition: 'all 0.18s',
  });

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg)', border: '1px solid var(--border2)',
    borderRadius: 10, color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
    outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480, background: 'var(--card)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', padding: '36px 32px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 22, color: 'var(--text)' }}>
            site<span style={{ color: 'var(--accent)' }}>guard</span>
          </span>
          <span style={{ display: 'inline-block', width: 7, height: 7, background: 'var(--accent)', borderRadius: '50%', marginLeft: 4, verticalAlign: 'middle' }} />
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            {[1, 2, 3].map((s) => (
              <span key={s} style={{
                fontSize: 12, fontFamily: 'DM Mono, monospace',
                color: s <= step ? 'var(--accent)' : 'var(--text3)'
              }}>
                Step {s}
              </span>
            ))}
          </div>
          <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 99 }}>
            <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 99, width: `${progressWidth}%`, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Step 1: Role */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, marginBottom: 6, color: 'var(--text)' }}>
              What do you mainly do?
            </h2>
            <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 20 }}>This helps us personalize your experience.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ROLES.map((r) => (
                <div key={r} style={cardStyle(role === r)} onClick={() => setRole(r)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: `2px solid ${role === r ? 'var(--accent)' : 'var(--border2)'}`,
                      background: role === r ? 'var(--accent)' : 'transparent',
                    }} />
                    <span style={{ fontWeight: 500, color: 'var(--text)' }}>{r}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: First client */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, marginBottom: 6, color: 'var(--text)' }}>
              Add your first client site
            </h2>
            <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 20 }}>You can add more sites from your dashboard.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Client Name</label>
                <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Acme Corp" style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'} onBlur={(e) => e.target.style.borderColor = 'var(--border2)'} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Website URL</label>
                <input value={clientUrl} onChange={(e) => setClientUrl(e.target.value)} placeholder="https://example.com" style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'} onBlur={(e) => e.target.style.borderColor = 'var(--border2)'} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Alert prefs */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, marginBottom: 6, color: 'var(--text)' }}>
              Set alert preferences
            </h2>
            <p style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 20 }}>How should we notify you when something goes wrong?</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {(['email', 'slack', 'both'] as const).map((ch) => (
                <button key={ch} onClick={() => setAlertChannel(ch)} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                  border: `2px solid ${alertChannel === ch ? 'var(--accent)' : 'var(--border2)'}`,
                  background: alertChannel === ch ? 'var(--accent-light)' : 'var(--bg)',
                  color: alertChannel === ch ? 'var(--accent)' : 'var(--text2)',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 13,
                }}>
                  {ch.charAt(0).toUpperCase() + ch.slice(1)}
                </button>
              ))}
            </div>
            {(alertChannel === 'slack' || alertChannel === 'both') && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Slack Webhook URL</label>
                <input value={slackUrl} onChange={(e) => setSlackUrl(e.target.value)} placeholder="https://hooks.slack.com/services/..." style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'} onBlur={(e) => e.target.style.borderColor = 'var(--border2)'} />
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          {step > 1 && (
            <button onClick={() => setStep((s) => (s - 1) as Step)} style={{
              flex: 1, padding: '11px', background: 'var(--bg2)', border: '1px solid var(--border2)',
              borderRadius: 10, color: 'var(--text2)', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500, fontSize: 14, cursor: 'pointer',
            }}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button onClick={() => setStep((s) => (s + 1) as Step)} style={{
              flex: 2, padding: '11px', background: 'var(--accent)', border: 'none',
              borderRadius: 10, color: '#fff', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>
              Next →
            </button>
          ) : (
            <button onClick={handleFinish} disabled={loading} style={{
              flex: 2, padding: '11px', background: 'var(--accent)', border: 'none',
              borderRadius: 10, color: '#fff', fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
            }}>
              {loading ? 'Setting up…' : 'Get started →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
