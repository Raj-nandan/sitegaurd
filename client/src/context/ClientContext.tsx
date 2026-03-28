import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Client, AddClientPayload } from '../types/client';
import api from '../lib/axios';

interface ClientContextType {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (payload: AddClientPayload) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

const ClientContext = createContext<ClientContextType | null>(null);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Client[]>('/clients');
      setClients(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, []);

  const addClient = useCallback(async (payload: AddClientPayload) => {
    const { data } = await api.post<Client>('/clients', payload);
    setClients((prev) => [data, ...prev]);
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    await api.delete(`/clients/${id}`);
    setClients((prev) => prev.filter((c) => c._id !== id));
  }, []);

  return (
    <ClientContext.Provider value={{ clients, loading, error, fetchClients, addClient, deleteClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error('useClients must be used inside ClientProvider');
  return ctx;
};

export default ClientContext;
