import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setAuthToken, clearAuthToken, getAuthToken } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  alertChannels?: string[];
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await getAuthToken();
        if (stored) {
          setToken(stored);
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        }
      } catch {
        await clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: t, user: u } = res.data;
    await setAuthToken(t);
    setToken(t);
    setUser(u);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: t, user: u } = res.data;
    await setAuthToken(t);
    setToken(t);
    setUser(u);
  };

  const logout = async () => {
    await clearAuthToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
