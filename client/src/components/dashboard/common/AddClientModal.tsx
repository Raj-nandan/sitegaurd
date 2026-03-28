import { useState } from 'react';
import { useClients } from '../../../context/ClientContext';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddClientModal = ({ isOpen, onClose }: AddClientModalProps) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addClient } = useClients();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await addClient({ name, url, contactEmail: email });
      setName(''); setUrl(''); setEmail('');
      onClose();
    } catch {
      setError('Failed to add client. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', boxSizing: 'border-box' as const,
    background: 'var(--bg)', border: '1px solid var(--border2)', borderRadius: 10,
    color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)', padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--card)', borderRadius: 20, padding: '32px',
        width: '100%', maxWidth: 440, border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'var(--text)' }}>Add client site</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Client Name', value: name, setter: setName, placeholder: 'Acme Corp', required: true },
            { label: 'Website URL', value: url, setter: setUrl, placeholder: 'https://example.com', required: true },
            { label: 'Contact Email (optional)', value: email, setter: setEmail, placeholder: 'client@example.com', required: false },
          ].map((field) => (
            <div key={field.label}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{field.label}</label>
              <input
                value={field.value} required={field.required} placeholder={field.placeholder} style={inputStyle}
                onChange={(e) => field.setter(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>
          ))}
          {error && <p style={{ color: 'var(--status-down)', fontSize: 13, background: 'rgba(226,75,74,0.1)', padding: '8px 12px', borderRadius: 8 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text2)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: '10px', background: 'var(--accent)', border: 'none', borderRadius: 10, color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1 }}>
              {loading ? 'Adding…' : 'Add client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
