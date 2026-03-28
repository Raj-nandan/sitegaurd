import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      // Check onboarding after login
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg)', border: '1px solid var(--border2)',
    borderRadius: 10, color: 'var(--text)',
    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
    outline: 'none', transition: 'border-color 0.18s',
    boxSizing: 'border-box' as const,
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, color: 'var(--text)', marginBottom: 6, textAlign: 'center' }}>
        Welcome back
      </h1>
      <p style={{ color: 'var(--text3)', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
        Sign in to your SiteGuard account
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email" value={email} required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password" value={password} required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
          />
        </div>

        {error && (
          <p style={{ color: 'var(--status-down)', fontSize: 13, background: 'rgba(226,75,74,0.1)', padding: '8px 12px', borderRadius: 8 }}>
            {error}
          </p>
        )}

        <div style={{ textAlign: 'right' }}>
          <a href="#" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>
            Forgot password?
          </a>
        </div>

        <button
          type="submit" disabled={loading}
          style={{
            width: '100%', padding: '12px', background: 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1,
            transition: 'background 0.18s',
          }}
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
