import { useEffect } from 'react';
import { useClients } from '../../context/ClientContext';
import ClientCard from '../../components/dashboard/clients/ClientCard';

const Clients = () => {
  const { clients, loading, fetchClients } = useClients();

  useEffect(() => { fetchClients(); }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Clients</h2>
        <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--text3)' }}>
          {clients.length} site{clients.length !== 1 ? 's' : ''} monitored
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text3)', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>Loading…</div>
      ) : clients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64, color: 'var(--text3)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⊡</div>
          <p style={{ fontSize: 15, marginBottom: 8 }}>No clients yet</p>
          <p style={{ fontSize: 13, fontFamily: 'DM Mono, monospace' }}>Click "+ Add client" to start monitoring</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 18,
        }}>
          {clients.map((client) => (
            <ClientCard key={client._id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;
