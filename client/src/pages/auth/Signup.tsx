import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/onboarding');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg)', border: '1px solid var(--border2)',
    borderRadius: 10, color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
    outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, color: 'var(--text)', marginBottom: 6, textAlign: 'center' }}>
        Create your account
      </h1>
      <p style={{ color: 'var(--text3)', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
        Start monitoring for free — no credit card required
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {(['name', 'email', 'password', 'confirm'] as const).map((field) => (
          <div key={field}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
              {field === 'confirm' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === 'password' || field === 'confirm' ? 'password' : field === 'email' ? 'email' : 'text'}
              value={form[field]} required
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              placeholder={field === 'name' ? 'John Smith' : field === 'email' ? 'you@example.com' : '••••••••'}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
            />
          </div>
        ))}

        {error && (
          <p style={{ color: 'var(--status-down)', fontSize: 13, background: 'rgba(226,75,74,0.1)', padding: '8px 12px', borderRadius: 8 }}>
            {error}
          </p>
        )}

        <button
          type="submit" disabled={loading}
          style={{
            width: '100%', padding: '12px', background: 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, marginTop: 4,
          }}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
